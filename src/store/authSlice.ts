import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, Role } from "@/lib/folio/types";

/**
 * Client mirror of the signed-in session. The token is the Better Auth session
 * token when the client can see one; it is never sent as a user id. Every read
 * and write goes through a server function guarded by `authMiddleware`.
 */
export type AuthStatus = "unknown" | "loading" | "ready" | "error";

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  status: AuthStatus;
};

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  status: "unknown",
};

type SessionPayload = {
  user: AuthUser;
  token: string | null;
  role: Role | null;
};

const authSlice = createSlice({
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
      return initialState.status === "unknown"
        ? { ...initialState, status: "ready" as const }
        : { ...initialState, status: "ready" as const };
    },
    setSession(state, action: PayloadAction<SessionPayload>) {
      const next = action.payload;
      if (
        state.status === "ready" &&
        state.isAuthenticated &&
        state.token === next.token &&
        state.role === next.role &&
        state.user?.id === next.user.id &&
        state.user.name === next.user.name &&
        state.user.email === next.user.email
      ) {
        return;
      }
      state.user = next.user;
      state.token = next.token;
      state.role = next.role;
      state.isAuthenticated = true;
      state.status = "ready";
    },
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      state.status = "ready";
      state.isAuthenticated = true;
    },
  },
});

export const { markLoading, markError, clearAuth, setSession, setRole } = authSlice.actions;
export const authReducer = authSlice.reducer;
