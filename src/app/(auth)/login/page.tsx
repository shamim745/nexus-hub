"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, Command, KeyRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthError,
  login,
  selectAuthError,
  selectAuthStatus,
  selectAuthUser,
} from "@/store/slices/authSlice";
import { notify } from "@/store/slices/notificationsSlice";
import { DEMO_ACCOUNTS } from "@/features/auth/constants/demoAccounts";
import { Button, Card, CardContent, FormField, Input } from "@/components/ui";
import { Form } from "@/components/forms";

function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState("admin@nexus.io");
  const [password, setPassword] = useState("demo1234");
  const [touched, setTouched] = useState(false);

  const nextPath = searchParams.get("next") ?? "/overview";
  const busy = status === "loading";

  useEffect(() => {
    if (user) router.replace(nextPath);
  }, [user, nextPath, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const fieldErrors = {
    email: touched && !email.trim() ? "Email is required." : "",
    password: touched && !password ? "Password is required." : "",
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!email.trim() || !password) return;

    const result = await dispatch(login({ email: email.trim(), password }));
    if (login.fulfilled.match(result)) {
      dispatch(
        notify({
          title: "Welcome back",
          message: `Signed in as ${result.payload.user.role}.`,
          tone: "success",
        }),
      );
      router.replace(nextPath);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-[11px] font-medium text-ink-3 lg:hidden">
          <Command className="size-3.5 text-brand-500" />
          NexusHub
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Sign in to your workspace</h1>
        <p className="text-sm text-ink-3">
          Authenticated via secure httpOnly session cookie issued by{" "}
          <code className="font-mono text-xs">/api/auth/login</code>.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 py-5">
          <Form onSubmit={handleSubmit} busy={busy} className="space-y-4">
            <FormField label="Work email" required htmlFor="email" error={fieldErrors.email}>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                value={email}
                invalid={Boolean(fieldErrors.email)}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>

            <FormField
              label="Password"
              required
              htmlFor="password"
              error={fieldErrors.password}
              hint="Demo password: demo1234"
            >
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                invalid={Boolean(fieldErrors.password)}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>

            {error ? (
              <div
                className="flex items-start gap-2 rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2.5 text-xs text-danger-500"
                role="alert"
              >
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                {error}
              </div>
            ) : null}

            <Button type="submit" loading={busy} className="w-full">
              Sign in
              <ArrowRight className="size-4" />
            </Button>
          </Form>

          <div className="border-t border-line pt-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
              <KeyRound className="size-3.5" />
              Demo roles
            </p>
            <div className="grid gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => {
                    setEmail(account.snapshot.email);
                    setPassword(account.snapshot.password);
                    dispatch(clearAuthError());
                  }}
                  className="flex items-center justify-between rounded-lg border border-line bg-panel-2 px-3 py-2 text-left transition-colors hover:border-brand-500/50 hover:bg-panel"
                >
                  <span className="text-xs font-medium text-ink">{account.label}</span>
                  <span className="font-mono text-[11px] text-ink-3">{account.snapshot.email}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-ink-3">
        Exploring first?{" "}
        <Link href="/" className="font-medium text-brand-600 hover:underline">
          Back to architecture overview
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <LoginScreen />
    </Suspense>
  );
}
