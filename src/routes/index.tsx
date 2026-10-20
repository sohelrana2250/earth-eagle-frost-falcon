import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppSelector } from "@/store/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, isPending } = useCurrentUserState();
  const auth = useAppSelector((state) => state.auth);
  const client = useQueryClient();

  if (!isPending && user && auth.status === "ready") {
    if (auth.role === "MENTOR") {
      return <Navigate to="/mentor/dashboard" search={{ status: "ALL", page: 1 }} />;
    }
    if (auth.role === "STUDENT") return <Navigate to="/student/dashboard" />;
    return <Navigate to="/choose-role" />;
  }

  const signedOut = !isPending && !user;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="flex items-center gap-2">
          <Library className="size-5" aria-hidden="true" />
          <span className="font-display text-xl">Folio</span>
        </span>
        {signedOut ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
        ) : (
          <Skeleton className="h-10 w-24" />
        )}
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-16">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Project review desk</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
            Submit the work. Review it once.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Students file a repository, a live demo, and a note. Mentors see the queue, filter it,
            and mark each project approved or rejected.
          </p>
          {auth.status === "error" && user ? (
            <div className="mt-6 max-w-md rounded-panel border border-border bg-card p-4">
              <p className="text-sm">Your session loaded, but the account role did not.</p>
              <Button
                type="button"
                className="mt-3"
                onClick={() => void client.invalidateQueries({ queryKey: ["profile", user.id] })}
              >
                Retry
              </Button>
            </div>
          ) : null}
        </div>
        <div className="grid gap-3">
          <RoleCard
            kicker="Student"
            title="File a project"
            body="Name, GitHub URL, live demo, and a description. Track pending, approved, and rejected."
            href="/signup"
            search={{ role: "STUDENT" }}
            cta="Create a student account"
            ready={signedOut}
          />
          <RoleCard
            kicker="Mentor"
            title="Review the queue"
            body="Counts, a filterable table, and approve or reject with the page in the URL."
            href="/signup"
            search={{ role: "MENTOR" }}
            cta="Create a mentor account"
            ready={signedOut}
          />
        </div>
      </main>
    </div>
  );
}

function RoleCard({
  kicker,
  title,
  body,
  href,
  search,
  cta,
  ready,
}: {
  kicker: string;
  title: string;
  body: string;
  href: "/signup";
  search: { role: "STUDENT" | "MENTOR" };
  cta: string;
  ready: boolean;
}) {
  return (
    <article className="rounded-panel border border-border bg-card p-4">
      <p className="text-sm font-medium text-muted-foreground">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <div className="mt-4">
        {ready ? (
          <Button asChild>
            <Link to={href} search={search}>
              {cta}
            </Link>
          </Button>
        ) : (
          <Skeleton className="h-11 w-48" />
        )}
      </div>
    </article>
  );
}
