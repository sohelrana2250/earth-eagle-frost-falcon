import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useCurrentUserState, l as useAppDispatch, s as setRole, t as Button, u as useAppSelector } from "./button-9i4QBsV6.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { o as Route$5, s as claimProfile } from "./router-CfOxOTc7.mjs";
import { i as UserButton, n as RedirectToSignIn, t as AccessSkeleton } from "./require-role-CSOHZVHd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/choose-role-5CHxV_ch.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChooseRolePage() {
	const { user, isPending } = useCurrentUserState();
	const auth = useAppSelector((state) => state.auth);
	if (isPending || auth.status === "unknown" || auth.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessSkeleton, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (auth.status === "ready" && auth.role === "MENTOR") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/mentor/dashboard",
		search: {
			status: "ALL",
			page: 1
		}
	});
	if (auth.status === "ready" && auth.role === "STUDENT") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/student/dashboard" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChooseRole, {});
}
function ChooseRole() {
	const navigate = Route$5.useNavigate();
	const dispatch = useAppDispatch();
	const client = useQueryClient();
	const [role, setSelected] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	async function save() {
		if (!role) {
			setMessage("Choose Student or Mentor.");
			return;
		}
		setPending(true);
		setMessage(null);
		try {
			const profile = await claimProfile({ data: { role } });
			dispatch(setRole(profile.role));
			await client.invalidateQueries({ queryKey: ["profile"] });
			if (profile.role === "MENTOR") await navigate({
				to: "/mentor/dashboard",
				search: {
					status: "ALL",
					page: 1
				}
			});
			else await navigate({ to: "/student/dashboard" });
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Could not save the role.");
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Folio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Which desk is yours?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "This sticks to the account. You can submit projects, or you can review them — not both."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleOption, {
					selected: role === "STUDENT",
					title: "Student",
					body: "Submit repositories and watch the review status.",
					onClick: () => setSelected("STUDENT")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleOption, {
					selected: role === "MENTOR",
					title: "Mentor",
					body: "See every submission, filter it, and approve or reject.",
					onClick: () => setSelected("MENTOR")
				})]
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-destructive",
				children: message
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				className: "mt-6",
				disabled: pending,
				onClick: () => void save(),
				children: pending ? "Saving…" : "Continue"
			})
		]
	});
}
function RoleOption({ selected, title, body, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-pressed": selected,
		className: "rounded-panel border p-4 text-left " + (selected ? "border-foreground bg-accent" : "border-border bg-card"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block text-sm text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { ChooseRolePage as component };
