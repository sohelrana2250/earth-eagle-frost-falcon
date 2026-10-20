import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitProject } from "@/lib/folio/api";
import {
  SUBMISSION_RATE_LIMIT,
  canonicalGithubUrl,
  submissionSchema,
  submissionsLeftInWindow,
  type SubmissionInput,
} from "@/lib/folio/rules";
import type { Submission } from "@/lib/folio/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function SubmissionForm({ existing }: { existing: Submission[] }) {
  const client = useQueryClient();
  const [banner, setBanner] = useState<{ tone: "ok" | "err"; message: string } | null>(null);
  const form = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { projectName: "", githubUrl: "", demoUrl: "", description: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: SubmissionInput) => submitProject({ data: values }),
    onSuccess: (result) => {
      if (!result.ok) return;
      void client.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });

  const remaining = submissionsLeftInWindow(existing.map((item) => item.createdAt));

  const onSubmit = form.handleSubmit(async (values) => {
    setBanner(null);
    const key = canonicalGithubUrl(values.githubUrl)?.key;
    if (key && existing.some((item) => item.githubKey === key)) {
      setBanner({ tone: "err", message: "You already submitted this repository." });
      return;
    }
    if (remaining <= 0) {
      setBanner({
        tone: "err",
        message: `Rate limit reached. You can submit ${SUBMISSION_RATE_LIMIT} projects every 15 minutes.`,
      });
      return;
    }
    const result = await mutation.mutateAsync(values);
    if (!result.ok) {
      setBanner({ tone: "err", message: result.message });
      return;
    }
    form.reset();
    setBanner({ tone: "ok", message: "Submitted. A mentor can review it now." });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="projectName">Project name</Label>
        <Input id="projectName" autoComplete="off" {...form.register("projectName")} />
        <FieldError message={form.formState.errors.projectName?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="githubUrl">GitHub repository</Label>
        <Input
          id="githubUrl"
          inputMode="url"
          placeholder="https://github.com/org/repo"
          autoComplete="off"
          {...form.register("githubUrl")}
        />
        <FieldError message={form.formState.errors.githubUrl?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="demoUrl">Live demo</Label>
        <Input
          id="demoUrl"
          inputMode="url"
          placeholder="https://example.com"
          autoComplete="off"
          {...form.register("demoUrl")}
        />
        <FieldError message={form.formState.errors.demoUrl?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What should a mentor look at first?"
          {...form.register("description")}
        />
        <FieldError message={form.formState.errors.description?.message} />
      </div>

      {banner ? (
        <p
          role="status"
          className={
            banner.tone === "ok"
              ? "rounded-control bg-approved px-3 py-2 text-sm text-approved-foreground"
              : "rounded-control bg-rejected px-3 py-2 text-sm text-rejected-foreground"
          }
        >
          {banner.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={mutation.isPending || remaining <= 0}>
          {mutation.isPending ? "Submitting…" : "Submit project"}
        </Button>
        <p className="text-sm text-muted-foreground tabular-nums">
          {remaining} of {SUBMISSION_RATE_LIMIT} left this 15 minutes
        </p>
      </div>
    </form>
  );
}
