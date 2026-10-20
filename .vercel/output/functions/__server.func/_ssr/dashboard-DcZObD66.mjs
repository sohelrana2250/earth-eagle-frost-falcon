import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as submissionSchema, p as submissionsLeftInWindow, r as canonicalGithubUrl, s as formatWhen, u as safeHref } from "./rules-yT9t9RWo.mjs";
import { r as cn, t as Button } from "./button-9i4QBsV6.mjs";
import { s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as listMySubmissions, f as submitProject } from "./router-CfOxOTc7.mjs";
import { t as Skeleton } from "./skeleton-CTjrzKa9.mjs";
import { r as RequireRole } from "./require-role-CSOHZVHd.mjs";
import { n as Label, t as Input } from "./label-C63Q8bbW.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as DashboardFrame, r as CardDescription, s as StatusBadge, t as Card } from "./card-Twnm9CgI.mjs";
import { r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DcZObD66.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-32 w-full rounded-control border border-input bg-card px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function FieldError({ message }) {
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-destructive",
		children: message
	});
}
function SubmissionForm({ existing }) {
	const client = useQueryClient();
	const [banner, setBanner] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(submissionSchema),
		defaultValues: {
			projectName: "",
			githubUrl: "",
			demoUrl: "",
			description: ""
		}
	});
	const mutation = useMutation({
		mutationFn: (values) => submitProject({ data: values }),
		onSuccess: (result) => {
			if (!result.ok) return;
			client.invalidateQueries({ queryKey: ["my-submissions"] });
		}
	});
	const remaining = submissionsLeftInWindow(existing.map((item) => item.createdAt));
	const onSubmit = form.handleSubmit(async (values) => {
		setBanner(null);
		const key = canonicalGithubUrl(values.githubUrl)?.key;
		if (key && existing.some((item) => item.githubKey === key)) {
			setBanner({
				tone: "err",
				message: "You already submitted this repository."
			});
			return;
		}
		if (remaining <= 0) {
			setBanner({
				tone: "err",
				message: `Rate limit reached. You can submit 3 projects every 15 minutes.`
			});
			return;
		}
		const result = await mutation.mutateAsync(values);
		if (!result.ok) {
			setBanner({
				tone: "err",
				message: result.message
			});
			return;
		}
		form.reset();
		setBanner({
			tone: "ok",
			message: "Submitted. A mentor can review it now."
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "flex flex-col gap-4",
		noValidate: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "projectName",
						children: "Project name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "projectName",
						autoComplete: "off",
						...form.register("projectName")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: form.formState.errors.projectName?.message })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "githubUrl",
						children: "GitHub repository"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "githubUrl",
						inputMode: "url",
						placeholder: "https://github.com/org/repo",
						autoComplete: "off",
						...form.register("githubUrl")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: form.formState.errors.githubUrl?.message })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "demoUrl",
						children: "Live demo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "demoUrl",
						inputMode: "url",
						placeholder: "https://example.com",
						autoComplete: "off",
						...form.register("demoUrl")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: form.formState.errors.demoUrl?.message })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "description",
						children: "Description"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "description",
						placeholder: "What should a mentor look at first?",
						...form.register("description")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { message: form.formState.errors.description?.message })
				]
			}),
			banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: banner.tone === "ok" ? "rounded-control bg-approved px-3 py-2 text-sm text-approved-foreground" : "rounded-control bg-rejected px-3 py-2 text-sm text-rejected-foreground",
				children: banner.message
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mutation.isPending || remaining <= 0,
					children: mutation.isPending ? "Submitting…" : "Submit project"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground tabular-nums",
					children: [
						remaining,
						" of ",
						3,
						" left this 15 minutes"
					]
				})]
			})
		]
	});
}
function LinkOut({ href, children }) {
	const safe = safeHref(href);
	if (!safe) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-sm text-muted-foreground",
		children: "Unavailable"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: safe,
		target: "_blank",
		rel: "noreferrer",
		className: "inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
			className: "size-3.5",
			"aria-hidden": "true"
		})]
	});
}
function StudentBoard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: "STUDENT",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDashboard, {})
	});
}
function StudentDashboard() {
	const submissions = useQuery({
		queryKey: ["my-submissions"],
		queryFn: () => listMySubmissions()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardFrame, {
		eyebrow: "Student",
		title: "File a project",
		lede: "Send a repository, a live demo, and a short note. You will see the review status here as soon as a mentor decides.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "New submission" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "GitHub links only. Three submissions every 15 minutes." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionForm, { existing: submissions.data ?? [] }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "My submissions"
				}), submissions.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-panel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-panel" })]
				}) : submissions.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: "Could not load your submissions."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-3 text-sm font-medium underline-offset-4 hover:underline",
						onClick: () => void submissions.refetch(),
						children: "Try again"
					})]
				}) }) : submissions.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing filed yet. Your first project will show up in this column."
					})
				}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-3",
					children: submissions.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xl",
							children: item.projectName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: formatWhen(item.createdAt) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: item.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkOut, {
								href: item.githubUrl,
								children: "Repository"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkOut, {
								href: item.demoUrl,
								children: "Live demo"
							})]
						})]
					})] }) }, item.id))
				})]
			})]
		})
	});
}
var SplitComponent = StudentBoard;
//#endregion
export { SplitComponent as component };
