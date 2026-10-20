import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as credentialsSchema } from "./rules-yT9t9RWo.mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { f as useCurrentUserState, t as Button } from "./button-9i4QBsV6.mjs";
import { t as GROK_PROVIDERS } from "./server-Bz5T0TZR.mjs";
import { a as Route$4 } from "./router-CfOxOTc7.mjs";
import { t as AccessSkeleton } from "./require-role-CSOHZVHd.mjs";
import { n as Label, t as Input } from "./label-C63Q8bbW.mjs";
import { r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as Separator, r as rememberSessionToken, t as AuthScaffold } from "./session-token-DBNkd8i2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BeptWxJ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function authMessage(error) {
	if (!error) return "Something went wrong. Try again.";
	if (error.code === "INVALID_EMAIL_OR_PASSWORD") return "That email and password do not match.";
	if (error.code === "USER_ALREADY_EXISTS") return "An account with that email already exists. Sign in instead.";
	return error.message || "Something went wrong. Try again.";
}
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessSkeleton, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {});
}
function LoginForm() {
	const navigate = Route$4.useNavigate();
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const form = useForm({
		resolver: u(credentialsSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const onSubmit = form.handleSubmit(async (values) => {
		setFormError(null);
		setPending(true);
		try {
			const result = await authClient.signIn.email({
				email: values.email,
				password: values.password
			});
			if (result.error) {
				setFormError(authMessage(result.error));
				return;
			}
			rememberSessionToken(result.data?.token);
			await authClient.getSession();
			await navigate({ to: "/" });
		} catch (error) {
			setFormError(error instanceof Error ? error.message : "Could not sign in.");
		} finally {
			setPending(false);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthScaffold, {
		title: "Sign in",
		lede: "Students and mentors use the same door. Your role sends you to the right desk.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"New here?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/signup",
				className: "font-medium text-foreground underline-offset-4 hover:underline",
				children: "Create an account"
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
								htmlFor: "email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
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
								htmlFor: "password",
								children: "Password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								autoComplete: "current-password",
								...form.register("password")
							}),
							form.formState.errors.password ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								children: form.formState.errors.password.message
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
						children: pending ? "Signing in…" : "Sign in"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderButtons, {})
		]
	});
}
function ProviderButtons() {
	const [message, setMessage] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "outline",
			onClick: () => {
				setMessage(null);
				signIn(provider.providerId, { callbackURL: "/" }).catch((error) => {
					setMessage(error instanceof Error ? error.message : "Sign-in failed");
				});
			},
			children: ["Continue with ", provider.label]
		}, provider.providerId)), message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: message
		}) : null]
	});
}
//#endregion
export { ProviderButtons, LoginPage as component };
