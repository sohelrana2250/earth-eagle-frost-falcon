import { Link } from "@tanstack/react-router";
import { Library } from "lucide-react";
import type { ReactNode } from "react";

export function AuthScaffold({
  title,
  lede,
  children,
  footer,
}: {
  title: string;
  lede: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-primary px-10 py-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <Library className="size-5" aria-hidden="true" />
          <span className="font-display text-xl">Folio</span>
        </Link>
        <div className="max-w-md">
          <p className="font-display text-4xl leading-tight">A desk for the work, and for the review.</p>
          <p className="mt-4 text-primary-foreground/80">
            Students file a repository and a live demo. Mentors approve it or send it back. One
            account, one role.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">Pending, approved, or rejected. Nothing in between.</p>
      </aside>
      <main className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 text-foreground lg:hidden">
            <Library className="size-5" aria-hidden="true" />
            <span className="font-display text-xl">Folio</span>
          </Link>
          <h1 className="font-display text-3xl leading-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{lede}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  );
}
