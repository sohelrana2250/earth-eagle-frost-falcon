import { z } from "zod";

/** Students may file this many projects inside the rolling window. */
export const SUBMISSION_RATE_LIMIT = 3;
export const SUBMISSION_WINDOW_MS = 15 * 60 * 1000;
export const MENTOR_PAGE_SIZE = 8;

const OWNER_REPO = /^[\w.-]+$/;

export function canonicalGithubUrl(raw: string): { url: string; key: string } | null {
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "github.com") return null;
    const parts = parsed.pathname.replace(/\.git$/i, "").split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const [owner, repo] = parts;
    if (!owner || !repo || !OWNER_REPO.test(owner) || !OWNER_REPO.test(repo)) return null;
    return {
      url: `https://github.com/${owner}/${repo}`,
      key: `github.com/${owner.toLowerCase()}/${repo.toLowerCase()}`,
    };
  } catch {
    return null;
  }
}

export function canonicalHttpUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (!parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export const submissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(2, "Name the project")
    .max(80, "Keep the name under 80 characters"),
  githubUrl: z
    .string()
    .trim()
    .refine(
      (value) => canonicalGithubUrl(value) !== null,
      "Use a GitHub repository URL, like https://github.com/org/repo",
    ),
  demoUrl: z
    .string()
    .trim()
    .refine((value) => canonicalHttpUrl(value) !== null, "Enter a valid live demo URL"),
  description: z
    .string()
    .trim()
    .min(10, "Add a short description (at least 10 characters)")
    .max(2000, "Keep the description under 2000 characters"),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const credentialsSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").max(128, "That password is too long"),
});

export const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(2, "Enter your name").max(80, "Keep your name under 80 characters"),
  role: z.string().refine((value): value is "STUDENT" | "MENTOR" => {
    return value === "STUDENT" || value === "MENTOR";
  }, "Choose Student or Mentor"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function safeHref(url: string): string | null {
  return canonicalHttpUrl(url);
}

export function submissionsLeftInWindow(createdAt: string[], now = Date.now()): number {
  const recent = createdAt.filter((iso) => {
    const time = new Date(iso).getTime();
    return Number.isFinite(time) && now - time < SUBMISSION_WINDOW_MS;
  }).length;
  return Math.max(0, SUBMISSION_RATE_LIMIT - recent);
}
