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
const BEARER_KEY = "grok-auth.bearer-token";

export function rememberSessionToken(token: string | null | undefined): void {
  if (typeof window === "undefined" || !token) return;
  let embedded = false;
  try {
    embedded =
      window.location.hostname.endsWith(".grok-sandbox.com") || window.self !== window.top;
  } catch {
    embedded = true;
  }
  if (!embedded) return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
  } catch {
    /* storage unavailable */
  }
}
