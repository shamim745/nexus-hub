"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { ROLE_META } from "@/lib/rbac";
import { Badge, buttonVariants } from "@/components/ui";

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const user = useAppSelector((state) => state.auth.user);
  const meta = user ? ROLE_META[user.role] : null;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-danger-500/10 text-danger-500">
        <ShieldAlert className="size-7" />
      </span>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-danger-500">Error 403</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Role privileges insufficient</h1>
        <p className="max-w-md text-sm leading-6 text-ink-3">
          Your current role cannot open <code className="font-mono text-xs">{from ?? "this route"}</code>. The
          guard evaluated the permission matrix and denied access before any protected data was rendered.
        </p>
      </div>

      {meta ? (
        <div className="flex items-center gap-2 text-xs text-ink-3">
          Current session role
          <Badge tone={meta.tone === "brand" ? "brand" : meta.tone === "info" ? "info" : "neutral"}>
            {user?.role}
          </Badge>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/overview" className={buttonVariants("primary", "md")}>
          <ArrowLeft className="size-4" />
          Back to overview
        </Link>
        <Link href="/login?next=/access-control" className={buttonVariants("outline", "md")}>
          Switch role account
        </Link>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <AccessDeniedContent />
    </Suspense>
  );
}
