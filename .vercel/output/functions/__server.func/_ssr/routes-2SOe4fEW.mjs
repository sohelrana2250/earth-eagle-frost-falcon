import { b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useCurrentUserState, t as Button, u as useAppSelector } from "./button-9i4QBsV6.mjs";
import { n as Library } from "../_libs/lucide-react.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as Skeleton } from "./skeleton-CTjrzKa9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-2SOe4fEW.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user, isPending } = useCurrentUserState();
	const auth = useAppSelector((state) => state.auth);
	const client = useQueryClient();
	if (!isPending && user && auth.status === "ready") {
		if (auth.role === "MENTOR") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/mentor/dashboard",
			search: {
				status: "ALL",
				page: 1
			}
		});
		if (auth.role === "STUDENT") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/student/dashboard" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/choose-role" });
	}
	const signedOut = !isPending && !user;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
					className: "size-5",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl",
					children: "Folio"
				})]
			}), signedOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					children: "Sign in"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-24" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "Project review desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl",
					children: "Submit the work. Review it once."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-lg text-muted-foreground",
					children: "Students file a repository, a live demo, and a note. Mentors see the queue, filter it, and mark each project approved or rejected."
				}),
				auth.status === "error" && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 max-w-md rounded-panel border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Your session loaded, but the account role did not."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "mt-3",
						onClick: () => void client.invalidateQueries({ queryKey: ["profile", user.id] }),
						children: "Retry"
					})]
				}) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
					kicker: "Student",
					title: "File a project",
					body: "Name, GitHub URL, live demo, and a description. Track pending, approved, and rejected.",
					href: "/signup",
					search: { role: "STUDENT" },
					cta: "Create a student account",
					ready: signedOut
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
					kicker: "Mentor",
					title: "Review the queue",
					body: "Counts, a filterable table, and approve or reject with the page in the URL.",
					href: "/signup",
					search: { role: "MENTOR" },
					cta: "Create a mentor account",
					ready: signedOut
				})]
			})]
		})]
	});
}
function RoleCard({ kicker, title, body, href, search, cta, ready }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-panel border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted-foreground",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: href,
						search,
						children: cta
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-11 w-48" })
			})
		]
	});
}
//#endregion
export { Home as component };
