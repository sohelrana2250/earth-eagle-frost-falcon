export const ROLES = ["STUDENT", "MENTOR"] as const;
export type Role = (typeof ROLES)[number];

export const SUBMISSION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type Profile = {
  userId: string;
  role: Role;
  displayName: string;
  email: string;
};

export type Submission = {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  projectName: string;
  githubUrl: string;
  githubKey: string;
  demoUrl: string;
  description: string;
  status: SubmissionStatus;
  createdAt: string;
  reviewedAt: string | null;
};

export type SubmitResult =
  | { ok: true; submission: Submission }
  | {
      ok: false;
      code: "DUPLICATE" | "RATE_LIMIT" | "VALIDATION" | "FORBIDDEN";
      message: string;
    };

export type ReviewResult =
  | { ok: true; submission: Submission }
  | { ok: false; code: "NOT_FOUND" | "FORBIDDEN" | "VALIDATION"; message: string };

export type MentorPage = {
  rows: Submission[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export type MentorStats = {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
};
