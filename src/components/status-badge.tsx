import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/lib/folio/types";

const LABEL: Record<SubmissionStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const variant = status === "PENDING" ? "pending" : status === "APPROVED" ? "approved" : "rejected";
  return <Badge variant={variant}>{LABEL[status]}</Badge>;
}
