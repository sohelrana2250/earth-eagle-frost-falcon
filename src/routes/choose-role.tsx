import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AccessSkeleton } from "@/components/require-role";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimProfile } from "@/lib/folio/api";
import type { Role } from "@/lib/folio/types";
import { setRole } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const Route = createFileRoute("/choose-role")({
  head: () => ({ meta: [{ title: "Choose a role · Folio" }] }),
  component: ChooseRolePage,
});

function ChooseRolePage() {
  const { user, isPending } = useCurrentUserState();
  const auth = useAppSelector((state) => state.auth);
  if (isPending || auth.status === "unknown" || auth.status === "loading") return <AccessSkeleton />;
  if (!user) return <RedirectToSignIn />;
  if (auth.status === "ready" && auth.role === "MENTOR") {
    return <Navigate to="/mentor/dashboard" search={{ status: "ALL", page: 1 }} />;
  }
  if (auth.status === "ready" && auth.role === "STUDENT") return <Navigate to="/student/dashboard" />;
  return <ChooseRole />;
}

function ChooseRole() {
  const navigate = Route.useNavigate();
  const dispatch = useAppDispatch();
  const client = useQueryClient();
  const [role, setSelected] = useState<Role | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      if (profile.role === "MENTOR") {
        await navigate({ to: "/mentor/dashboard", search: { status: "ALL", page: 1 } });
      } else {
        await navigate({ to: "/student/dashboard" });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the role.");
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <p className="font-display text-xl">Folio</p>
        <UserButton />
      </div>
      <h1 className="font-display text-3xl">Which desk is yours?</h1>
      <p className="mt-2 text-muted-foreground">
        This sticks to the account. You can submit projects, or you can review them — not both.
      </p>
      <div className="mt-6 grid gap-3">
        <RoleOption
          selected={role === "STUDENT"}
          title="Student"
          body="Submit repositories and watch the review status."
          onClick={() => setSelected("STUDENT")}
        />
        <RoleOption
          selected={role === "MENTOR"}
          title="Mentor"
          body="See every submission, filter it, and approve or reject."
          onClick={() => setSelected("MENTOR")}
        />
      </div>
      {message ? <p className="mt-4 text-sm text-destructive">{message}</p> : null}
      <Button type="button" className="mt-6" disabled={pending} onClick={() => void save()}>
        {pending ? "Saving…" : "Continue"}
      </Button>
    </main>
  );
}

function RoleOption({
  selected,
  title,
  body,
  onClick,
}: {
  selected: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        "rounded-panel border p-4 text-left " +
        (selected ? "border-foreground bg-accent" : "border-border bg-card")
      }
    >
      <span className="font-medium">{title}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
    </button>
  );
}
