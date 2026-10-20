import { createFileRoute } from "@tanstack/react-router";
import { MentorBoard } from "@/components/mentor-board";
import { STATUS_FILTERS, type StatusFilter } from "@/lib/folio/types";

type MentorSearch = { status: StatusFilter; page: number };

export const Route = createFileRoute("/mentor/dashboard")({
  validateSearch: (search: Record<string, unknown>): MentorSearch => {
    const raw = typeof search.status === "string" ? search.status.toUpperCase() : "ALL";
    const status = (STATUS_FILTERS as readonly string[]).includes(raw)
      ? (raw as StatusFilter)
      : "ALL";
    const numeric = typeof search.page === "number" ? search.page : Number(search.page);
    const page =
      Number.isFinite(numeric) && numeric >= 1 ? Math.min(1000, Math.floor(numeric)) : 1;
    return { status, page };
  },
  head: () => ({ meta: [{ title: "Review queue · Folio" }] }),
  component: MentorPage,
});

function MentorPage() {
  const { status, page } = Route.useSearch();
  return <MentorBoard status={status} page={page} />;
}
