import { Navigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { Role } from "@/lib/folio/types";
import { useAppSelector } from "@/store/store";

export function AccessSkeleton() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-display text-xl">Folio</span>
          <Skeleton className="h-8 w-24" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-64" />
        <Skeleton className="mt-6 h-40 w-full rounded-panel" />
      </main>
    </div>
  );
}

function ProfileError() {
  const client = useQueryClient();
  const { user } = useCurrentUserState();
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="font-display text-3xl">We could not load your account</h1>
      <p className="text-muted-foreground">
        The session is there, but the role lookup failed. Nothing was changed.
      </p>
      <Button
        type="button"
        className="w-fit"
        onClick={() => {
          void client.invalidateQueries({ queryKey: ["profile", user?.id] });
        }}
      >
        Try again
      </Button>
    </main>
  );
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const auth = useAppSelector((state) => state.auth);

  if (isPending || auth.status === "unknown" || auth.status === "loading") {
    return <AccessSkeleton />;
  }
  if (!user || !auth.isAuthenticated) return <RedirectToSignIn />;
  if (auth.status === "error") return <ProfileError />;
  if (!auth.role) return <Navigate to="/choose-role" />;
  if (auth.role !== role) {
    if (auth.role === "MENTOR") {
      return <Navigate to="/mentor/dashboard" search={{ status: "ALL", page: 1 }} />;
    }
    return <Navigate to="/student/dashboard" />;
  }
  return <>{children}</>;
}
