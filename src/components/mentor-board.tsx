import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DashboardFrame } from "@/components/dashboard-frame";
import { RequireRole } from "@/components/require-role";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSubmissionsForMentor, mentorStats, reviewSubmission } from "@/lib/folio/api";
import { formatWhen, safeHref } from "@/lib/folio/rules";
import type { StatusFilter, Submission, SubmissionStatus } from "@/lib/folio/types";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

function LinkOut({ href, children }: { href: string; children: string }) {
  const safe = safeHref(href);
  if (!safe) return <span className="text-muted-foreground">—</span>;
  return (
    <a
      href={safe}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}

export function MentorBoard({ status, page }: { status: StatusFilter; page: number }) {
  return (
    <RequireRole role="MENTOR">
      <MentorDashboard status={status} page={page} />
    </RequireRole>
  );
}

function MentorDashboard({ status, page }: { status: StatusFilter; page: number }) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [rowError, setRowError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ id: number; status: SubmissionStatus } | null>(null);

  const stats = useQuery({
    queryKey: ["mentor-stats"],
    queryFn: () => mentorStats(),
  });

  const list = useQuery({
    queryKey: ["mentor-submissions", status, page],
    queryFn: () => listSubmissionsForMentor({ data: { status, page } }),
  });

  const review = useMutation({
    mutationFn: (input: { id: number; status: "APPROVED" | "REJECTED" }) =>
      reviewSubmission({ data: input }),
    onSuccess: async (result) => {
      if (!result.ok) {
        setRowError(result.message);
        return;
      }
      setRowError(null);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["mentor-submissions"] }),
        client.invalidateQueries({ queryKey: ["mentor-stats"] }),
      ]);
    },
    onError: () => setRowError("The review did not save. Try again."),
    onSettled: () => setPending(null),
  });

  function go(nextStatus: StatusFilter, nextPage: number) {
    void navigate({
      to: "/mentor/dashboard",
      search: { status: nextStatus, page: nextPage },
    });
  }

  function decide(id: number, next: "APPROVED" | "REJECTED") {
    setPending({ id, status: next });
    setRowError(null);
    review.mutate({ id, status: next });
  }

  return (
    <DashboardFrame
      eyebrow="Mentor"
      title="Review queue"
      lede="Every student submission lands here. Filter by status, then approve or reject. Counts stay in step with the table."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Pending"
          value={stats.data?.pending}
          loading={stats.isPending}
          active={status === "PENDING"}
          onClick={() => go("PENDING", 1)}
        />
        <StatCard
          label="Approved"
          value={stats.data?.approved}
          loading={stats.isPending}
          active={status === "APPROVED"}
          onClick={() => go("APPROVED", 1)}
        />
        <StatCard
          label="Rejected"
          value={stats.data?.rejected}
          loading={stats.isPending}
          active={status === "REJECTED"}
          onClick={() => go("REJECTED", 1)}
        />
      </div>

      <div className="mt-6">
        <Tabs
          value={status}
          onValueChange={(value) => go(value as StatusFilter, 1)}
        >
          <TabsList>
            {FILTERS.map((filter) => (
              <TabsTrigger key={filter.value} value={filter.value}>
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card className="mt-4 overflow-hidden">
        {list.isPending ? (
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : list.isError ? (
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">Could not load submissions.</p>
            <Button type="button" variant="outline" className="mt-3" onClick={() => void list.refetch()}>
              Try again
            </Button>
          </CardContent>
        ) : list.data.rows.length === 0 ? (
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              {status === "ALL"
                ? "No projects have been filed yet."
                : `No ${status.toLowerCase()} submissions on this filter.`}
            </p>
          </CardContent>
        ) : (
          <>
            <div className="hidden md:block">
              <SubmissionTable
                rows={list.data.rows}
                pending={pending}
                onDecide={decide}
              />
            </div>
            <ul className="flex flex-col divide-y divide-border md:hidden">
              {list.data.rows.map((row) => (
                <li key={row.id} className="flex flex-col gap-3 p-4">
                  <SubmissionSummary row={row} />
                  <ReviewActions row={row} pending={pending} onDecide={decide} />
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {rowError ? <p className="mt-3 text-sm text-destructive">{rowError}</p> : null}

      {list.data ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground tabular-nums">
            Page {list.data.page} of {list.data.pageCount}
            <span className="hidden sm:inline"> · {list.data.total} total</span>
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={list.data.page <= 1}
              onClick={() => go(status, list.data.page - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={list.data.page >= list.data.pageCount}
              onClick={() => go(status, list.data.page + 1)}
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-muted-foreground">
        Looking for your own filing desk? That view is only for student accounts.{" "}
        <Link to="/" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to Folio
        </Link>
      </p>
    </DashboardFrame>
  );
}

function StatCard({
  label,
  value,
  loading,
  active,
  onClick,
}: {
  label: string;
  value: number | undefined;
  loading: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "rounded-panel border p-4 text-left transition-colors " +
        (active ? "border-foreground bg-card" : "border-border bg-card hover:bg-muted")
      }
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-12" />
      ) : (
        <p className="mt-1 font-display text-3xl tabular-nums">{value ?? 0}</p>
      )}
    </button>
  );
}

function SubmissionSummary({ row }: { row: Submission }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{row.projectName}</p>
          <p className="text-sm text-muted-foreground">{row.studentName}</p>
          <p className="text-sm text-muted-foreground">{row.studentEmail}</p>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <p className="text-sm text-muted-foreground">{row.description}</p>
      <p className="text-sm text-muted-foreground">{formatWhen(row.createdAt)}</p>
      <div className="flex gap-4 text-sm">
        <LinkOut href={row.githubUrl}>Repo</LinkOut>
        <LinkOut href={row.demoUrl}>Live</LinkOut>
      </div>
    </div>
  );
}

function ReviewActions({
  row,
  pending,
  onDecide,
}: {
  row: Submission;
  pending: { id: number; status: SubmissionStatus } | null;
  onDecide: (id: number, status: "APPROVED" | "REJECTED") => void;
}) {
  const busy = pending?.id === row.id;
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        disabled={busy || row.status === "APPROVED"}
        onClick={() => onDecide(row.id, "APPROVED")}
      >
        {busy && pending?.status === "APPROVED" ? "Approving…" : "Approve"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy || row.status === "REJECTED"}
        onClick={() => onDecide(row.id, "REJECTED")}
      >
        {busy && pending?.status === "REJECTED" ? "Rejecting…" : "Reject"}
      </Button>
    </div>
  );
}

function SubmissionTable({
  rows,
  pending,
  onDecide,
}: {
  rows: Submission[];
  pending: { id: number; status: SubmissionStatus } | null;
  onDecide: (id: number, status: "APPROVED" | "REJECTED") => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Links</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <p className="font-medium">{row.studentName}</p>
              <p className="text-muted-foreground">{row.studentEmail}</p>
            </TableCell>
            <TableCell className="max-w-64">
              <p className="font-medium">{row.projectName}</p>
              <p className="line-clamp-2 text-muted-foreground">{row.description}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <LinkOut href={row.githubUrl}>Repo</LinkOut>
                <LinkOut href={row.demoUrl}>Live</LinkOut>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap">{formatWhen(row.createdAt)}</TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell>
              <ReviewActions row={row} pending={pending} onDecide={onDecide} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
