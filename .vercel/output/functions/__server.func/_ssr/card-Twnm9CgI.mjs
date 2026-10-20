import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, u as useAppSelector } from "./button-9i4QBsV6.mjs";
import { n as Library } from "../_libs/lucide-react.mjs";
import { i as UserButton } from "./require-role-CSOHZVHd.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function DashboardFrame({ eyebrow, title, lede, children }) {
	const role = useAppSelector((state) => state.auth.role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
						className: "size-5",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl leading-none",
						children: "Folio"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-sm text-muted-foreground sm:inline",
						children: role === "MENTOR" ? "Mentor" : "Student"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl leading-tight sm:text-4xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-muted-foreground",
					children: lede
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children
				})
			]
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		pending: "border-transparent bg-pending text-pending-foreground",
		approved: "border-transparent bg-approved text-approved-foreground",
		rejected: "border-transparent bg-rejected text-rejected-foreground",
		neutral: "border-border bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "neutral" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			variant,
			className
		})),
		...props
	});
}
var LABEL = {
	PENDING: "Pending",
	APPROVED: "Approved",
	REJECTED: "Rejected"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "PENDING" ? "pending" : status === "APPROVED" ? "approved" : "rejected",
		children: LABEL[status]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-panel border border-border bg-card text-card-foreground", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 p-4", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("font-display text-2xl leading-tight", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-4 pt-0", className),
		...props
	});
}
//#endregion
export { CardTitle as a, CardHeader as i, CardContent as n, DashboardFrame as o, CardDescription as r, StatusBadge as s, Card as t };
