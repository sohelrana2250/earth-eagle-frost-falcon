import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  MENTOR_PAGE_SIZE,
  SUBMISSION_RATE_LIMIT,
  SUBMISSION_WINDOW_MS,
  canonicalGithubUrl,
  canonicalHttpUrl,
  submissionSchema,
} from "@/lib/folio/rules";
import type {
  MentorPage,
  MentorStats,
  Profile,
  ReviewResult,
  Role,
  Submission,
  SubmissionStatus,
  SubmitResult,
} from "@/lib/folio/types";

type ProfileRow = {
  user_id: string;
  role: string;
  display_name: string;
  email: string;
};

type SubmissionRow = {
  id: number | string;
  student_id: string;
  student_name: string;
  student_email: string;
  project_name: string;
  github_url: string;
  github_key: string;
  demo_url: string;
  description: string;
  status: string;
  created_at: unknown;
  reviewed_at: unknown;
};

type UserRow = { id: string; name: string; email: string };
type CountRow = { status: string; count: number | string };

const claimInput = z.object({
  role: z.enum(["STUDENT", "MENTOR"]),
});

const listInput = z.object({
  status: z.enum(["ALL", "PENDING", "APPROVED", "REJECTED"]),
  page: z.number().int().min(1).max(1000),
});

const reviewInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

function asIso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString();
}

function isRole(value: string): value is Role {
  return value === "STUDENT" || value === "MENTOR";
}

function isStatus(value: string): value is SubmissionStatus {
  return value === "PENDING" || value === "APPROVED" || value === "REJECTED";
}

function mapProfile(row: ProfileRow): Profile | null {
  if (!isRole(row.role)) return null;
  return {
    userId: row.user_id,
    role: row.role,
    displayName: row.display_name,
    email: row.email,
  };
}

function mapSubmission(row: SubmissionRow): Submission | null {
  if (!isStatus(row.status)) return null;
  const createdAt = asIso(row.created_at);
  if (!createdAt) return null;
  return {
    id: Number(row.id),
    studentId: row.student_id,
    studentName: row.student_name,
    studentEmail: row.student_email,
    projectName: row.project_name,
    githubUrl: row.github_url,
    githubKey: row.github_key,
    demoUrl: row.demo_url,
    description: row.description,
    status: row.status,
    createdAt,
    reviewedAt: asIso(row.reviewed_at),
  };
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && String(error.code) === "23505") return true;
  const message = error instanceof Error ? error.message : "";
  return /duplicate key|unique constraint/i.test(message);
}

async function readProfile(userId: string): Promise<Profile | null> {
  const sql = await getSql();
  const rows = await sql<ProfileRow>`
    select user_id, role, display_name, email
    from profiles
    where user_id = ${userId}
    limit 1
  `;
  const row = rows[0];
  return row ? mapProfile(row) : null;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Profile | null> => {
    return readProfile(context.userId);
  });

/** First claim wins. A later call cannot switch Student ↔ Mentor. */
export const claimProfile = createServerFn({ method: "POST" })
  .validator((input: unknown) => claimInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<Profile> => {
    const existing = await readProfile(context.userId);
    if (existing) return existing;

    const sql = await getSql();
    const users = await sql<UserRow>`
      select "id", "name", "email" from "user" where "id" = ${context.userId} limit 1
    `;
    const account = users[0];
    if (!account) throw new Error("Signed-in account could not be found.");

    const displayName = account.name?.trim() || account.email;
    const email = account.email.trim().toLowerCase();
    const inserted = await sql<ProfileRow>`
      insert into profiles (user_id, role, display_name, email)
      values (${context.userId}, ${data.role}, ${displayName}, ${email})
      on conflict (user_id) do nothing
      returning user_id, role, display_name, email
    `;
    const created = inserted[0] ? mapProfile(inserted[0]) : null;
    if (created) return created;
    const raced = await readProfile(context.userId);
    if (!raced) throw new Error("Could not save your account type.");
    return raced;
  });

export const listMySubmissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Submission[]> => {
    const profile = await readProfile(context.userId);
    if (!profile || profile.role !== "STUDENT") return [];
    const sql = await getSql();
    const rows = await sql<SubmissionRow>`
      select id, student_id, student_name, student_email, project_name,
             github_url, github_key, demo_url, description, status, created_at, reviewed_at
      from submissions
      where student_id = ${context.userId}
      order by created_at desc
      limit 100
    `;
    return rows.flatMap((row) => {
      const mapped = mapSubmission(row);
      return mapped ? [mapped] : [];
    });
  });

export const submitProject = createServerFn({ method: "POST" })
  .validator((input: unknown) => submissionSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<SubmitResult> => {
    const profile = await readProfile(context.userId);
    if (!profile || profile.role !== "STUDENT") {
      return {
        ok: false,
        code: "FORBIDDEN",
        message: "Only student accounts can submit a project.",
      };
    }

    const github = canonicalGithubUrl(data.githubUrl);
    const demoUrl = canonicalHttpUrl(data.demoUrl);
    if (!github || !demoUrl) {
      return {
        ok: false,
        code: "VALIDATION",
        message: "Check the repository and demo URLs and try again.",
      };
    }

    const sql = await getSql();
    const duplicate = await sql<{ id: number }>`
      select id from submissions
      where student_id = ${context.userId} and github_key = ${github.key}
      limit 1
    `;
    if (duplicate.length > 0) {
      return {
        ok: false,
        code: "DUPLICATE",
        message: "You already submitted this repository.",
      };
    }

    const windowStart = new Date(Date.now() - SUBMISSION_WINDOW_MS).toISOString();
    const recent = await sql<{ created_at: unknown }>`
      select created_at from submissions
      where student_id = ${context.userId}
        and created_at >= ${windowStart}::timestamptz
      order by created_at asc
    `;
    if (recent.length >= SUBMISSION_RATE_LIMIT) {
      const oldest = asIso(recent[0]?.created_at);
      const retryAt = oldest ? new Date(oldest).getTime() + SUBMISSION_WINDOW_MS : Date.now();
      const minutes = Math.max(1, Math.ceil((retryAt - Date.now()) / 60000));
      return {
        ok: false,
        code: "RATE_LIMIT",
        message: `Rate limit reached. You can submit ${SUBMISSION_RATE_LIMIT} projects every 15 minutes. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      };
    }

    try {
      const inserted = await sql<SubmissionRow>`
        insert into submissions (
          student_id, student_name, student_email, project_name,
          github_url, github_key, demo_url, description
        ) values (
          ${context.userId}, ${profile.displayName}, ${profile.email}, ${data.projectName},
          ${github.url}, ${github.key}, ${demoUrl}, ${data.description}
        )
        returning id, student_id, student_name, student_email, project_name,
                  github_url, github_key, demo_url, description, status, created_at, reviewed_at
      `;
      const submission = inserted[0] ? mapSubmission(inserted[0]) : null;
      if (!submission) throw new Error("Submission was saved but could not be read back.");
      return { ok: true, submission };
    } catch (error) {
      if (isUniqueViolation(error)) {
        return {
          ok: false,
          code: "DUPLICATE",
          message: "You already submitted this repository.",
        };
      }
      throw error;
    }
  });

export const mentorStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MentorStats> => {
    const profile = await readProfile(context.userId);
    if (!profile || profile.role !== "MENTOR") {
      throw new Error("Only mentors can view review stats.");
    }
    const sql = await getSql();
    const rows = await sql<CountRow>`
      select status, count(*) as count from submissions group by status
    `;
    const stats: MentorStats = { pending: 0, approved: 0, rejected: 0, total: 0 };
    for (const row of rows) {
      const count = Number(row.count) || 0;
      stats.total += count;
      if (row.status === "PENDING") stats.pending = count;
      if (row.status === "APPROVED") stats.approved = count;
      if (row.status === "REJECTED") stats.rejected = count;
    }
    return stats;
  });

export const listSubmissionsForMentor = createServerFn({ method: "POST" })
  .validator((input: unknown) => listInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<MentorPage> => {
    const profile = await readProfile(context.userId);
    if (!profile || profile.role !== "MENTOR") {
      throw new Error("Only mentors can review submissions.");
    }
    const sql = await getSql();
    const includeAll = data.status === "ALL";
    const status = data.status === "ALL" ? "PENDING" : data.status;
    const counts = await sql<{ count: number | string }>`
      select count(*) as count from submissions
      where (${includeAll} or status = ${status})
    `;
    const total = Number(counts[0]?.count) || 0;
    const pageCount = Math.max(1, Math.ceil(total / MENTOR_PAGE_SIZE));
    const page = Math.min(data.page, pageCount);
    const offset = (page - 1) * MENTOR_PAGE_SIZE;
    const rows = await sql<SubmissionRow>`
      select id, student_id, student_name, student_email, project_name,
             github_url, github_key, demo_url, description, status, created_at, reviewed_at
      from submissions
      where (${includeAll} or status = ${status})
      order by created_at desc
      limit ${MENTOR_PAGE_SIZE} offset ${offset}
    `;
    return {
      rows: rows.flatMap((row) => {
        const mapped = mapSubmission(row);
        return mapped ? [mapped] : [];
      }),
      page,
      pageSize: MENTOR_PAGE_SIZE,
      total,
      pageCount,
    };
  });

export const reviewSubmission = createServerFn({ method: "POST" })
  .validator((input: unknown) => reviewInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<ReviewResult> => {
    const profile = await readProfile(context.userId);
    if (!profile || profile.role !== "MENTOR") {
      return { ok: false, code: "FORBIDDEN", message: "Only mentors can review submissions." };
    }
    const sql = await getSql();
    const rows = await sql<SubmissionRow>`
      update submissions
      set status = ${data.status},
          reviewed_at = now(),
          reviewer_id = ${context.userId}
      where id = ${data.id}
      returning id, student_id, student_name, student_email, project_name,
                github_url, github_key, demo_url, description, status, created_at, reviewed_at
    `;
    const submission = rows[0] ? mapSubmission(rows[0]) : null;
    if (!submission) {
      return { ok: false, code: "NOT_FOUND", message: "That submission is no longer available." };
    }
    return { ok: true, submission };
  });
