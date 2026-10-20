import { createFileRoute } from "@tanstack/react-router";
import { StudentBoard } from "@/components/student-board";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({ meta: [{ title: "My submissions · Folio" }] }),
  component: StudentBoard,
});
