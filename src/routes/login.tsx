import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthScaffold } from "@/components/auth-scaffold";
import { AccessSkeleton } from "@/components/require-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { credentialsSchema } from "@/lib/folio/rules";
import { rememberSessionToken } from "@/lib/folio/session-token";
import type { z } from "zod";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · Folio" }] }),
  component: LoginPage,
});

type Credentials = z.infer<typeof credentialsSchema>;

function authMessage(error: { message?: string; code?: string } | null): string {
  if (!error) return "Something went wrong. Try again.";
  if (error.code === "INVALID_EMAIL_OR_PASSWORD") return "That email and password do not match.";
  if (error.code === "USER_ALREADY_EXISTS") {
    return "An account with that email already exists. Sign in instead.";
  }
  return error.message || "Something went wrong. Try again.";
}

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <AccessSkeleton />;
  if (user) return <Navigate to="/" />;
  return <LoginForm />;
}

function LoginForm() {
  const navigate = Route.useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setPending(true);
    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (result.error) {
        setFormError(authMessage(result.error));
        return;
      }
      rememberSessionToken(result.data?.token);
      await authClient.getSession();
      await navigate({ to: "/" });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  });

  return (
    <AuthScaffold
      title="Sign in"
      lede="Students and mentors use the same door. Your role sends you to the right desk."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        {formError ? (
          <p role="alert" className="rounded-control bg-rejected px-3 py-2 text-sm text-rejected-foreground">
            {formError}
          </p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3">
        <Separator />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator />
      </div>
      <ProviderButtons />
    </AuthScaffold>
  );
}

export function ProviderButtons() {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      {GROK_PROVIDERS.map((provider) => (
        <Button
          key={provider.providerId}
          type="button"
          variant="outline"
          onClick={() => {
            setMessage(null);
            void signIn(provider.providerId, { callbackURL: "/" }).catch((error: unknown) => {
              setMessage(error instanceof Error ? error.message : "Sign-in failed");
            });
          }}
        >
          Continue with {provider.label}
        </Button>
      ))}
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}
