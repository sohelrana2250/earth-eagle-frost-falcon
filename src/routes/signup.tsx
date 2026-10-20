import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ProviderButtons } from "@/routes/login";
import { AuthScaffold } from "@/components/auth-scaffold";
import { AccessSkeleton } from "@/components/require-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimProfile } from "@/lib/folio/api";
import { signupSchema } from "@/lib/folio/rules";
import { rememberSessionToken } from "@/lib/folio/session-token";
import type { Role } from "@/lib/folio/types";
import { setRole } from "@/store/authSlice";
import { useAppDispatch } from "@/store/store";
import type { z } from "zod";

type SignupSearch = { role?: Role };

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => ({
    role: search.role === "MENTOR" || search.role === "STUDENT" ? search.role : undefined,
  }),
  head: () => ({ meta: [{ title: "Create account · Folio" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { user, isPending } = useCurrentUserState();
  const { role } = Route.useSearch();
  if (isPending) return <AccessSkeleton />;
  if (user) return <Navigate to="/" />;
  return <SignupForm initialRole={role} />;
}

function SignupForm({ initialRole }: { initialRole?: Role }) {
  const navigate = Route.useNavigate();
  const dispatch = useAppDispatch();
  const client = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<z.input<typeof signupSchema>, unknown, z.output<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: initialRole ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setPending(true);
    const role: Role = values.role === "MENTOR" ? "MENTOR" : "STUDENT";
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (result.error) {
        const code = "code" in result.error ? String(result.error.code) : "";
        setFormError(
          code === "USER_ALREADY_EXISTS"
            ? "An account with that email already exists. Sign in instead."
            : result.error.message || "Could not create the account.",
        );
        return;
      }
      rememberSessionToken(result.data?.token);
      await authClient.getSession();
      const profile = await claimProfile({ data: { role } });
      dispatch(setRole(profile.role));
      await client.invalidateQueries({ queryKey: ["profile"] });
      if (profile.role === "MENTOR") {
        await navigate({ to: "/mentor/dashboard", search: { status: "ALL", page: 1 } });
      } else {
        await navigate({ to: "/student/dashboard" });
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "The account was created, but the role was not saved. Sign in and choose it.",
      );
    } finally {
      setPending(false);
    }
  });

  return (
    <AuthScaffold
      title="Create an account"
      lede="Pick Student or Mentor. The role is fixed after this step."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Account type</Label>
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="role" aria-label="Account type">
                  <SelectValue placeholder="Choose Student or Mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student — submit projects</SelectItem>
                  <SelectItem value="MENTOR">Mentor — review submissions</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.role ? (
            <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
          ) : null}
        </div>
        {formError ? (
          <p role="alert" className="rounded-control bg-rejected px-3 py-2 text-sm text-rejected-foreground">
            {formError}
          </p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3">
        <Separator />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator />
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        Google and X sign-in ask for a role on the next screen.
      </p>
      <ProviderButtons />
    </AuthScaffold>
  );
}
