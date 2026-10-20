import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as signupSchema } from "./rules-yT9t9RWo.mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
import { f as useCurrentUserState, l as useAppDispatch, r as cn, s as setRole, t as Button } from "./button-9i4QBsV6.mjs";
import { a as ChevronDown, o as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { i as ProviderButtons, r as Route$3, s as claimProfile } from "./router-CfOxOTc7.mjs";
import { t as AccessSkeleton } from "./require-role-CSOHZVHd.mjs";
import { n as Label, t as Input } from "./label-C63Q8bbW.mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as Separator, r as rememberSessionToken, t as AuthScaffold } from "./session-token-DBNkd8i2.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-B8Nm-eML.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Select(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, { ...props });
}
function SelectValue(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue$1, { ...props });
}
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-11 w-full items-center justify-between gap-2 rounded-control border border-input bg-card px-3 text-left text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-muted-foreground" })
		})]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("relative z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-menu border border-border bg-card text-foreground shadow-sm", className),
		position: "popper",
		sideOffset: 6,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1.5",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex h-10 cursor-pointer items-center rounded-control pr-8 pl-3 text-sm outline-none select-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
function SignupPage() {
	const { user, isPending } = useCurrentUserState();
	const { role } = Route$3.useSearch();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessSkeleton, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignupForm, { initialRole: role });
}
function SignupForm({ initialRole }) {
	const navigate = Route$3.useNavigate();
	const dispatch = useAppDispatch();
	const client = useQueryClient();
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const form = useForm({
		resolver: u(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: initialRole ?? ""
		}
	});
	const onSubmit = form.handleSubmit(async (values) => {
		setFormError(null);
		setPending(true);
		const role = values.role === "MENTOR" ? "MENTOR" : "STUDENT";
		try {
			const result = await authClient.signUp.email({
				name: values.name,
				email: values.email,
				password: values.password
			});
			if (result.error) {
				const code = "code" in result.error ? String(result.error.code) : "";
				setFormError(code === "USER_ALREADY_EXISTS" ? "An account with that email already exists. Sign in instead." : result.error.message || "Could not create the account.");
				return;
			}
			rememberSessionToken(result.data?.token);
			await authClient.getSession();
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
			setFormError(error instanceof Error ? error.message : "The account was created, but the role was not saved. Sign in and choose it.");
		} finally {
			setPending(false);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthScaffold, {
		title: "Create an account",
		lede: "Pick Student or Mentor. The role is fixed after this step.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Already registered?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "font-medium text-foreground underline-offset-4 hover:underline",
				children: "Sign in"
			})
		] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "flex flex-col gap-4",
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								autoComplete: "name",
								...form.register("name")
							}),
							form.formState.errors.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: form.formState.errors.name.message
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "signup-email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "signup-email",
								type: "email",
								autoComplete: "email",
								...form.register("email")
							}),
							form.formState.errors.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: form.formState.errors.email.message
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "signup-password",
								children: "Password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "signup-password",
								type: "password",
								autoComplete: "new-password",
								...form.register("password")
							}),
							form.formState.errors.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: form.formState.errors.password.message
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "role",
								children: "Account type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								control: form.control,
								name: "role",
								render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: field.value || void 0,
									onValueChange: field.onChange,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "role",
										"aria-label": "Account type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose Student or Mentor" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "STUDENT",
										children: "Student — submit projects"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "MENTOR",
										children: "Mentor — review submissions"
									})] })]
								})
							}),
							form.formState.errors.role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: form.formState.errors.role.message
							}) : null
						]
					}),
					formError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "rounded-control bg-rejected px-3 py-2 text-sm text-rejected-foreground",
						children: formError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending,
						children: pending ? "Creating account…" : "Create account"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "or"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted-foreground",
				children: "Google and X sign-in ask for a role on the next screen."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderButtons, {})
		]
	});
}
//#endregion
export { SignupPage as component };
