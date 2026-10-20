import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/folio/api";
import { clearAuth, markError, markLoading, setSession } from "@/store/authSlice";
import { useAppDispatch } from "@/store/store";

/**
 * Copies the verified session into Redux. Role comes from the profiles table,
 * not from anything the browser claims.
 */
export function AuthSync() {
  const dispatch = useAppDispatch();
  const { user, isPending } = useCurrentUserState();
  const session = authClient.useSession();
  const userId = user?.id ?? null;
  const token = session.data?.session.token ?? null;

  const profile = useQuery({
    queryKey: ["profile", userId],
    enabled: !isPending && Boolean(userId),
    queryFn: () => getMyProfile(),
  });

  useEffect(() => {
    if (isPending) {
      dispatch(markLoading());
      return;
    }
    if (!userId || !user) {
      dispatch(clearAuth());
      return;
    }
    if (profile.isPending) {
      dispatch(markLoading());
      return;
    }
    if (profile.isError) {
      dispatch(markError());
      return;
    }
    dispatch(
      setSession({
        user: {
          id: user.id,
          name: profile.data?.displayName || user.displayName || "Member",
          email: profile.data?.email || user.primaryEmail || "",
        },
        token,
        role: profile.data?.role ?? null,
      }),
    );
  }, [
    dispatch,
    isPending,
    user,
    userId,
    token,
    profile.isPending,
    profile.isError,
    profile.data,
  ]);

  return null;
}
