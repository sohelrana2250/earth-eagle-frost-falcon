import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard-frame";
import { RequireRole } from "@/components/require-role";
import { StatusBadge } from "@/components/status-badge";
import { SubmissionForm } from "@/components/submission-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listMySubmissions } from "@/lib/folio/api";
import { formatWhen, safeHref } from "@/lib/folio/rules";

function LinkOut({ href, children }: { href: string; children: string }) {
  const safe = safeHref(href);
  if (!safe) return <span className="text-sm text-muted-foreground">Unavailable</span>;
  return (
    <a
      href={safe}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}

export function StudentBoard() {
  return (
    <RequireRole role="STUDENT">
      <StudentDashboard />
    </RequireRole>
  );
}

function StudentDashboard() {
  const submissions = useQuery({
    queryKey: ["my-submissions"],
    queryFn: () => listMySubmissions(),
  });

  return (
    <DashboardFrame
      eyebrow="Student"
      title="File a project"
      lede="Send a repository, a live demo, and a short note. You will see the review status here as soon as a mentor decides."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>New submission</CardTitle>
            <CardDescription>GitHub links only. Three submissions every 15 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionForm existing={submissions.data ?? []} />
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">My submissions</h2>
          {submissions.isPending ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-28 rounded-panel" />
              <Skeleton className="h-28 rounded-panel" />
            </div>
          ) : submissions.isError ? (
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-destructive">Could not load your submissions.</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-medium underline-offset-4 hover:underline"
                  onClick={() => void submissions.refetch()}
                >
                  Try again
                </button>
              </CardContent>
            </Card>
          ) : submissions.data.length === 0 ? (
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Nothing filed yet. Your first project will show up in this column.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ul className="flex flex-col gap-3">
              {submissions.data.map((item) => (
                <li key={item.id}>
                  <Card>
                    <CardHeader className="flex-row items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">{item.projectName}</CardTitle>
                        <CardDescription>{formatWhen(item.createdAt)}</CardDescription>
                      </div>
                      <StatusBadge status={item.status} />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <LinkOut href={item.githubUrl}>Repository</LinkOut>
                        <LinkOut href={item.demoUrl}>Live demo</LinkOut>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardFrame>
  );
}
