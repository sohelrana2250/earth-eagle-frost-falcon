import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { cn as _enum, gn as object, hn as number } from "../_libs/@better-auth/core+[...].mjs";
import { f as submissionSchema, i as canonicalHttpUrl, l as getSql, n as authMiddleware, r as canonicalGithubUrl, t as SUBMISSION_WINDOW_MS } from "./rules-yT9t9RWo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-C2_ZC24q.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var claimInput = object({ role: _enum(["STUDENT", "MENTOR"]) });
var listInput = object({
	status: _enum([
		"ALL",
		"PENDING",
		"APPROVED",
		"REJECTED"
	]),
	page: number().int().min(1).max(1e3)
});
var reviewInput = object({
	id: number().int().positive(),
	status: _enum(["APPROVED", "REJECTED"])
});
function asIso(value) {
	if (value == null) return null;
	if (value instanceof Date) return value.toISOString();
	const date = new Date(String(value));
	if (Number.isNaN(date.getTime())) return String(value);
	return date.toISOString();
}
function isRole(value) {
	return value === "STUDENT" || value === "MENTOR";
}
function isStatus(value) {
	return value === "PENDING" || value === "APPROVED" || value === "REJECTED";
}
function mapProfile(row) {
	if (!isRole(row.role)) return null;
	return {
		userId: row.user_id,
		role: row.role,
		displayName: row.display_name,
		email: row.email
	};
}
function mapSubmission(row) {
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
		reviewedAt: asIso(row.reviewed_at)
	};
}
function isUniqueViolation(error) {
	if (!error || typeof error !== "object") return false;
	if ("code" in error && String(error.code) === "23505") return true;
	const message = error instanceof Error ? error.message : "";
	return /duplicate key|unique constraint/i.test(message);
}
async function readProfile(userId) {
	const row = (await (await getSql())`
    select user_id, role, display_name, email
    from profiles
    where user_id = ${userId}
    limit 1
  `)[0];
	return row ? mapProfile(row) : null;
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "0edc0b3468aa31784ee7422f8fe1b12cc2dfd84d0dd0aade5c86f8c727fb563c",
	name: "getMyProfile",
	filename: "src/lib/folio/api.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return readProfile(context.userId);
});
var claimProfile_createServerFn_handler = createServerRpc({
	id: "ec2e5d1edbe35ac3d11c902a05085bc69f0354690dfe9c17b9ff10a7f65ef943",
	name: "claimProfile",
	filename: "src/lib/folio/api.ts"
}, (opts) => claimProfile.__executeServer(opts));
var claimProfile = createServerFn({ method: "POST" }).validator((input) => claimInput.parse(input)).middleware([authMiddleware]).handler(claimProfile_createServerFn_handler, async ({ context, data }) => {
	const existing = await readProfile(context.userId);
	if (existing) return existing;
	const sql = await getSql();
	const account = (await sql`
      select "id", "name", "email" from "user" where "id" = ${context.userId} limit 1
    `)[0];
	if (!account) throw new Error("Signed-in account could not be found.");
	const displayName = account.name?.trim() || account.email;
	const email = account.email.trim().toLowerCase();
	const inserted = await sql`
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
var listMySubmissions_createServerFn_handler = createServerRpc({
	id: "d66478dc4a6425bc59f81e4d1c83b1ef33d9d7dbc64e848dfa90067b32e04137",
	name: "listMySubmissions",
	filename: "src/lib/folio/api.ts"
}, (opts) => listMySubmissions.__executeServer(opts));
var listMySubmissions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMySubmissions_createServerFn_handler, async ({ context }) => {
	const profile = await readProfile(context.userId);
	if (!profile || profile.role !== "STUDENT") return [];
	return (await (await getSql())`
      select id, student_id, student_name, student_email, project_name,
             github_url, github_key, demo_url, description, status, created_at, reviewed_at
      from submissions
      where student_id = ${context.userId}
      order by created_at desc
      limit 100
    `).flatMap((row) => {
		const mapped = mapSubmission(row);
		return mapped ? [mapped] : [];
	});
});
var submitProject_createServerFn_handler = createServerRpc({
	id: "db2913381f6f34e4bd66e8c659fa5b1d190655a057425489e4e496f2cda84fd6",
	name: "submitProject",
	filename: "src/lib/folio/api.ts"
}, (opts) => submitProject.__executeServer(opts));
var submitProject = createServerFn({ method: "POST" }).validator((input) => submissionSchema.parse(input)).middleware([authMiddleware]).handler(submitProject_createServerFn_handler, async ({ context, data }) => {
	const profile = await readProfile(context.userId);
	if (!profile || profile.role !== "STUDENT") return {
		ok: false,
		code: "FORBIDDEN",
		message: "Only student accounts can submit a project."
	};
	const github = canonicalGithubUrl(data.githubUrl);
	const demoUrl = canonicalHttpUrl(data.demoUrl);
	if (!github || !demoUrl) return {
		ok: false,
		code: "VALIDATION",
		message: "Check the repository and demo URLs and try again."
	};
	const sql = await getSql();
	if ((await sql`
      select id from submissions
      where student_id = ${context.userId} and github_key = ${github.key}
      limit 1
    `).length > 0) return {
		ok: false,
		code: "DUPLICATE",
		message: "You already submitted this repository."
	};
	const windowStart = new Date(Date.now() - SUBMISSION_WINDOW_MS).toISOString();
	const recent = await sql`
      select created_at from submissions
      where student_id = ${context.userId}
        and created_at >= ${windowStart}::timestamptz
      order by created_at asc
    `;
	if (recent.length >= 3) {
		const oldest = asIso(recent[0]?.created_at);
		const retryAt = oldest ? new Date(oldest).getTime() + SUBMISSION_WINDOW_MS : Date.now();
		const minutes = Math.max(1, Math.ceil((retryAt - Date.now()) / 6e4));
		return {
			ok: false,
			code: "RATE_LIMIT",
			message: `Rate limit reached. You can submit 3 projects every 15 minutes. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`
		};
	}
	try {
		const inserted = await sql`
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
		return {
			ok: true,
			submission
		};
	} catch (error) {
		if (isUniqueViolation(error)) return {
			ok: false,
			code: "DUPLICATE",
			message: "You already submitted this repository."
		};
		throw error;
	}
});
var mentorStats_createServerFn_handler = createServerRpc({
	id: "a865b7f6b712037ab63e710fdb8b1b429128314ec38d25825ba97aa71610666d",
	name: "mentorStats",
	filename: "src/lib/folio/api.ts"
}, (opts) => mentorStats.__executeServer(opts));
var mentorStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(mentorStats_createServerFn_handler, async ({ context }) => {
	const profile = await readProfile(context.userId);
	if (!profile || profile.role !== "MENTOR") throw new Error("Only mentors can view review stats.");
	const rows = await (await getSql())`
      select status, count(*) as count from submissions group by status
    `;
	const stats = {
		pending: 0,
		approved: 0,
		rejected: 0,
		total: 0
	};
	for (const row of rows) {
		const count = Number(row.count) || 0;
		stats.total += count;
		if (row.status === "PENDING") stats.pending = count;
		if (row.status === "APPROVED") stats.approved = count;
		if (row.status === "REJECTED") stats.rejected = count;
	}
	return stats;
});
var listSubmissionsForMentor_createServerFn_handler = createServerRpc({
	id: "10bd78de7c61763546cd6a4c2db757ab7c36bed7b3af8f03f7eb30119e02ccc7",
	name: "listSubmissionsForMentor",
	filename: "src/lib/folio/api.ts"
}, (opts) => listSubmissionsForMentor.__executeServer(opts));
var listSubmissionsForMentor = createServerFn({ method: "POST" }).validator((input) => listInput.parse(input)).middleware([authMiddleware]).handler(listSubmissionsForMentor_createServerFn_handler, async ({ context, data }) => {
	const profile = await readProfile(context.userId);
	if (!profile || profile.role !== "MENTOR") throw new Error("Only mentors can review submissions.");
	const sql = await getSql();
	const includeAll = data.status === "ALL";
	const status = data.status === "ALL" ? "PENDING" : data.status;
	const counts = await sql`
      select count(*) as count from submissions
      where (${includeAll} or status = ${status})
    `;
	const total = Number(counts[0]?.count) || 0;
	const pageCount = Math.max(1, Math.ceil(total / 8));
	const page = Math.min(data.page, pageCount);
	return {
		rows: (await sql`
      select id, student_id, student_name, student_email, project_name,
             github_url, github_key, demo_url, description, status, created_at, reviewed_at
      from submissions
      where (${includeAll} or status = ${status})
      order by created_at desc
      limit ${8} offset ${(page - 1) * 8}
    `).flatMap((row) => {
			const mapped = mapSubmission(row);
			return mapped ? [mapped] : [];
		}),
		page,
		pageSize: 8,
		total,
		pageCount
	};
});
var reviewSubmission_createServerFn_handler = createServerRpc({
	id: "18b8bf467607e8e36a1602b1b18c0086c9fc73bdbdf27407a2c9658134a5db30",
	name: "reviewSubmission",
	filename: "src/lib/folio/api.ts"
}, (opts) => reviewSubmission.__executeServer(opts));
var reviewSubmission = createServerFn({ method: "POST" }).validator((input) => reviewInput.parse(input)).middleware([authMiddleware]).handler(reviewSubmission_createServerFn_handler, async ({ context, data }) => {
	const profile = await readProfile(context.userId);
	if (!profile || profile.role !== "MENTOR") return {
		ok: false,
		code: "FORBIDDEN",
		message: "Only mentors can review submissions."
	};
	const rows = await (await getSql())`
      update submissions
      set status = ${data.status},
          reviewed_at = now(),
          reviewer_id = ${context.userId}
      where id = ${data.id}
      returning id, student_id, student_name, student_email, project_name,
                github_url, github_key, demo_url, description, status, created_at, reviewed_at
    `;
	const submission = rows[0] ? mapSubmission(rows[0]) : null;
	if (!submission) return {
		ok: false,
		code: "NOT_FOUND",
		message: "That submission is no longer available."
	};
	return {
		ok: true,
		submission
	};
});
//#endregion
export { claimProfile_createServerFn_handler, getMyProfile_createServerFn_handler, listMySubmissions_createServerFn_handler, listSubmissionsForMentor_createServerFn_handler, mentorStats_createServerFn_handler, reviewSubmission_createServerFn_handler, submitProject_createServerFn_handler };
