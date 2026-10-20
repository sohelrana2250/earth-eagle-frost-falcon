import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./button-9i4QBsV6.mjs";
import { n as Library } from "../_libs/lucide-react.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function AuthScaffold({ title, lede, children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden flex-col justify-between bg-primary px-10 py-12 text-primary-foreground lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
						className: "size-5",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl",
						children: "Folio"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl leading-tight",
						children: "A desk for the work, and for the review."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-primary-foreground/80",
						children: "Students file a repository and a live demo. Mentors approve it or send it back. One account, one role."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary-foreground/70",
					children: "Pending, approved, or rejected. Nothing in between."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex flex-col justify-center px-4 py-10 sm:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mb-8 flex items-center gap-2 text-foreground lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
							className: "size-5",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl",
							children: "Folio"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl leading-tight",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: lede
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-sm text-muted-foreground",
						children: footer
					})
				]
			})
		})]
	});
}
function Separator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("h-px w-full bg-border", className),
		...props
	});
}
/**
* Better Auth keeps the real session in an HttpOnly cookie. The live preview
* iframe cannot rely on that cookie (SameSite=Lax inside a third-party frame),
* so the prewired auth client forwards `grok-auth.bearer-token` from
* sessionStorage. Email sign-in returns the same session token — stash it only
* when we are embedded, then let the existing client attach it.
*
* Redux may mirror the token for client state. Server functions never trust it
* from a payload; `authMiddleware` resolves the caller.
*/
var BEARER_KEY = "grok-auth.bearer-token";
function rememberSessionToken(token) {
	if (typeof window === "undefined" || !token) return;
	let embedded = false;
	try {
		embedded = window.location.hostname.endsWith(".grok-sandbox.com") || window.self !== window.top;
	} catch {
		embedded = true;
	}
	if (!embedded) return;
	try {
		window.sessionStorage.setItem(BEARER_KEY, token);
	} catch {}
}
//#endregion
export { Separator as n, rememberSessionToken as r, AuthScaffold as t };
