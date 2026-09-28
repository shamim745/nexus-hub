import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  DatabaseZap,
  LayoutDashboard,
  Radio,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { PERMISSION_MATRIX, ROLE_META } from "@/lib/rbac";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Multi-role RBAC",
    body: "Admin, manager and staff sessions drive server-side redirects plus client-side route and navigation filtering.",
  },
  {
    icon: ServerCog,
    title: "Server-side datatable",
    body: "Sorting, fuzzy search, multi-criteria filters and pagination run against the API — 184 records without hydration cost.",
  },
  {
    icon: Radio,
    title: "Realtime sync",
    body: "EventSource streaming from a SSE endpoint with automatic polling fallback, offline pause and reconnect states.",
  },
  {
    icon: LayoutDashboard,
    title: "Global state hub",
    body: "Redux Toolkit slices for auth, UI, users, metrics and pipeline — with typed hooks and persistent UI preferences.",
  },
  {
    icon: DatabaseZap,
    title: "Read & clean pipeline",
    body: "Parse CSV, detect quality issues, toggle cleaning rules, preview the diff, then export or publish the dataset.",
  },
  {
    icon: Sparkles,
    title: "Design system",
    body: "Atomic, reusable primitives — buttons, dialogs, tables, toasts — over a token-driven Tailwind v4 theme with dark mode.",
  },
];

const TREE = `nexus-hub/src
├── app/                  # Routing only (App Router)
│   ├── (auth)/login/
│   ├── (dashboard)/overview|users|analytics|...
│   └── api/              # Route handlers (auth, users, SSE)
├── components/
│   ├── ui/               # Atomic design units
│   ├── common/           # Shell, sidebar, guards, toaster
│   └── forms/            # Form & search wrappers
├── features/             # Domain-driven modules
│   ├── auth/             # components · hooks · services · types
│   ├── users/            # datatable slice + api
│   ├── analytics/        # charts + realtime sync
│   └── data-pipeline/    # read & clean engine
├── hooks/                # useDebounce, useNetworkState...
├── lib/                  # http client, rbac, mock server
├── store/                # Redux root, slices, providers
└── utils/                # csv · pdf · date · currency · fuzzy`;

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-line glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/40">
              <LayoutDashboard className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Nexus<span className="text-brand-500">Hub</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-ink-2 md:flex">
            <a href="#features" className="transition-colors hover:text-ink">
              Capabilities
            </a>
            <a href="#architecture" className="transition-colors hover:text-ink">
              Architecture
            </a>
            <a href="#roles" className="transition-colors hover:text-ink">
              Roles
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className={`${buttonVariants("ghost", "sm")} hidden sm:inline-flex`}>
              Sign in
            </Link>
            <Link href="/login" className={buttonVariants("primary", "sm")}>
              Open console
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-glow opacity-60" aria-hidden="true" />
        <div
          className="absolute -right-40 -top-32 size-[460px] rounded-full bg-brand-600/20 blur-[130px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 lg:pt-24">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-[11px] font-medium text-ink-2">
              <Sparkles className="size-3.5 text-brand-500" />
              Enterprise role-based dashboard architecture
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              A production-grade frontend blueprint for{" "}
              <span className="bg-gradient-to-r from-brand-500 to-info-500 bg-clip-text text-transparent">
                ERP-grade systems
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-2">
              NexusHub demonstrates 4+ years of senior frontend engineering: feature-driven Next.js
              architecture, strict TypeScript, centralized global state, RBAC-guarded routing, realtime
              telemetry and a readable, cleanable data pipeline — zero legacy packages.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className={buttonVariants("primary", "lg")}>
                Launch live demo
                <ArrowRight className="size-4" />
              </Link>
              <a href="#architecture" className={buttonVariants("outline", "lg")}>
                Explore the structure
              </a>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["6", "feature domains"],
                ["10", "UI primitives"],
                ["0", "legacy packages"],
                ["100%", "strict TS"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-line bg-panel px-4 py-3">
                  <dt className="text-xl font-semibold text-ink">{value}</dt>
                  <dd className="text-[11px] uppercase tracking-wide text-ink-3">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-5 pb-24">
        <div className="panel overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-line bg-panel-2/70 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-danger-500/70" />
            <span className="size-2.5 rounded-full bg-warning-500/70" />
            <span className="size-2.5 rounded-full bg-success-500/70" />
            <span className="ml-3 font-mono text-[11px] text-ink-3">nexus-hub / overview</span>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            {[
              { label: "Monthly revenue", value: "$421,300", delta: "+8.4%" },
              { label: "Active users", value: "1,284", delta: "+3.1%" },
              { label: "Orders / min", value: "46", delta: "+12.0%" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-line bg-panel-2/50 p-4">
                <p className="text-[11px] uppercase tracking-wide text-ink-3">{kpi.label}</p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight">{kpi.value}</p>
                <p className="mt-1 text-xs font-medium text-success-500">{kpi.delta} vs last period</p>
              </div>
            ))}
            <div className="rounded-xl border border-line bg-panel-2/50 p-4 md:col-span-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium text-ink-2">Revenue trend · realtime stream</p>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-success-500">
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-success-500" />
                  live
                </span>
              </div>
              <div className="flex h-24 items-end gap-1.5">
                {[38, 45, 42, 56, 51, 63, 58, 72, 66, 78, 74, 88].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600/70 to-brand-400"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">Capabilities</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Senior-level features, not demo toys
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-2">
            Every module is isolated by domain, typed end-to-end and wired through a single centralized state
            repository.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-line bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-brand-500/40"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-brand-600/10 text-brand-500 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-2 text-xs leading-5 text-ink-3">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="architecture" className="border-y border-line bg-panel">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
              Architecture
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Feature-driven, domain-segregated structure
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-2">
              Components are grouped by business capability instead of technical type — the layout used by
              high-end enterprise codebases.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Absolute imports via @/ — no deep relative chains",
                "Zero `any` — every API boundary is explicitly typed",
                "Pure utility layer (csv · pdf · date · fuzzy) isolated from UI",
                "Interceptors-based HTTP client with timeout & error pipelines",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-ink-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-500" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript strict",
                "Tailwind v4",
                "Redux Toolkit",
                "Recharts",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-panel-2 px-3 py-1 text-[11px] font-medium text-ink-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-canvas">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-[11px] text-ink-3">
              <span className="size-2 rounded-full bg-success-500" />
              feature-driven tree
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-5 text-ink-2 scrollbar-thin">
              {TREE}
            </pre>
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">Access model</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Three roles, one permission matrix
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(Object.keys(ROLE_META) as Role[]).map((role) => {
            const meta = ROLE_META[role];
            return (
              <div key={role} className="rounded-2xl border border-line bg-panel p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{meta.label}</h3>
                  <span className="rounded-full bg-brand-600/10 px-2 py-0.5 text-[11px] font-medium uppercase text-brand-600">
                    {role}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink-3">{meta.description}</p>
                <ul className="mt-4 space-y-2">
                  {PERMISSION_MATRIX[role].map((permission) => (
                    <li key={permission} className="flex items-center gap-2 text-xs text-ink-2">
                      <CheckCircle2 className="size-3.5 text-success-500" />
                      <code className="font-mono">{permission}</code>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-brand-500/30 bg-brand-600/5 p-8 text-center">
          <Users className="size-6 text-brand-500" />
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Ready to inspect the code?</h3>
            <p className="mt-1 text-sm text-ink-2">Sign in with a demo role and explore every module.</p>
          </div>
          <Link href="/login" className={buttonVariants("primary", "lg")}>
            Open the console
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-ink-3 sm:flex-row">
          <span className="flex items-center gap-2">
            <BarChart3 className="size-3.5" />
            NexusHub — Enterprise Frontend Architecture Plan
          </span>
          <span>Built with strict TypeScript · reusable components · global state</span>
        </div>
      </footer>
    </div>
  );
}
