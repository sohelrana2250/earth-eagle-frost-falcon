import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
import { n as useDispatch, r as useSelector } from "../_libs/react-redux+[...].mjs";
import { n as createSlice, t as configureStore } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-9i4QBsV6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var initialState = {
	user: null,
	token: null,
	role: null,
	isAuthenticated: false,
	status: "unknown"
};
var authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		markLoading(state) {
			if (state.status === "loading") return;
			state.status = "loading";
		},
		markError(state) {
			if (state.status === "error") return;
			state.status = "error";
		},
		clearAuth() {
			return initialState.status === "unknown" ? {
				...initialState,
				status: "ready"
			} : {
				...initialState,
				status: "ready"
			};
		},
		setSession(state, action) {
			const next = action.payload;
			if (state.status === "ready" && state.isAuthenticated && state.token === next.token && state.role === next.role && state.user?.id === next.user.id && state.user.name === next.user.name && state.user.email === next.user.email) return;
			state.user = next.user;
			state.token = next.token;
			state.role = next.role;
			state.isAuthenticated = true;
			state.status = "ready";
		},
		setRole(state, action) {
			state.role = action.payload;
			state.status = "ready";
			state.isAuthenticated = true;
		}
	}
});
var { markLoading, markError, clearAuth, setSession, setRole } = authSlice.actions;
var authReducer = authSlice.reducer;
function makeStore() {
	return configureStore({ reducer: { auth: authReducer } });
}
var useAppDispatch = useDispatch.withTypes();
var useAppSelector = useSelector.withTypes();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-[background-color,opacity] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			outline: "border border-border bg-card text-foreground hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-10 px-3",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
export { markError as a, setSession as c, useCurrentUser as d, useCurrentUserState as f, makeStore as i, useAppDispatch as l, clearAuth as n, markLoading as o, cn as r, setRole as s, Button as t, useAppSelector as u };
