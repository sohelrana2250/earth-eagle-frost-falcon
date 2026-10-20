import { Link } from "@tanstack/react-router";
import { Library } from "lucide-react";
import type { ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useAppSelector } from "@/store/store";

export function DashboardFrame({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  const role = useAppSelector((state) => state.auth.role);
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <Library className="size-5" aria-hidden="true" />
            <span className="font-display text-xl leading-none">Folio</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {role === "MENTOR" ? "Mentor" : "Student"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{lede}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
