import Link from "next/link";
import type { ReactNode } from "react";
import { Command } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-canvas lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="absolute inset-0 grid-glow opacity-70" aria-hidden="true" />
        <div
          className="absolute -left-32 top-1/4 size-[420px] rounded-full bg-brand-600/25 blur-[120px]"
          aria-hidden="true"
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">
            <Command className="size-4" />
          </span>
          <span className="text-sm font-semibold text-ink">
            Nexus<span className="text-brand-500">Hub</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
            Enterprise Frontend Architecture
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
            One console for every role in your operation.
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink-2">
            RBAC-guarded routing, server-side datatables, realtime telemetry and a centralized Redux Toolkit
            store — orchestrated inside a feature-driven Next.js App Router codebase.
          </p>
          <ul className="mt-8 space-y-2.5 text-sm text-ink-2">
            {[
              "Role-based view filtering: admin, manager, staff",
              "Server-side sort, filter, search & pagination",
              "WebSocket streaming with polling fallback",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-3">Portfolio-grade architecture sample · 2026</p>
      </div>

      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
      </div>
    </div>
  );
}
