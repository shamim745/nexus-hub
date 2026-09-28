# NexusHub — Enterprise Frontend Architecture Blueprint

Role-based operations console (ERP/CRM style) built to production standards: feature-driven Next.js
App Router structure, strict TypeScript, centralized Redux Toolkit state, RBAC-guarded routing,
server-side datatables, realtime sync and a client-side read & clean data pipeline.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

### Demo accounts

| Role    | Email            | Password  | Access                          |
| ------- | ---------------- | --------- | ------------------------------- |
| Admin   | admin@nexus.io   | demo1234  | Everything incl. access control |
| Manager | manager@nexus.io | demo1234  | Overview, users, analytics, pipeline |
| Staff   | staff@nexus.io   | demo1234  | Overview only                   |

## Architecture

```
src/
├── app/                    # Routing only (App Router + API route handlers)
│   ├── (auth)/login        # Public session entry
│   ├── (dashboard)/        # Cookie-protected shell (overview, users, analytics…)
│   └── api/                # auth · users · metrics · metrics/stream (SSE)
├── components/
│   ├── ui/                 # 10 reusable atomic primitives (Button, Dialog, Table…)
│   ├── common/             # AppShell, Sidebar, Topbar, RouteGuard, Toaster, PageHeader
│   └── forms/              # Form + debounced SearchInput wrappers
├── features/               # Domain-driven modules (components · hooks · services · store · types)
│   ├── auth/               # Login flow, session restore, auth API
│   ├── users/              # Server-side datatable slice, filters, exporters
│   ├── analytics/          # Charts, KPI cards, realtime sync hook, metrics slice
│   └── data-pipeline/      # CSV read → analyze → clean → preview → publish
├── hooks/                  # useDebounce, useNetworkState, useMediaQuery, useInterval
├── lib/                    # http client (interceptors), rbac matrix, mock server & sessions
├── store/                  # Redux root, ui/auth/notifications slices, StoreProvider
├── styles/globals.css      # Tailwind v4 design tokens (light/dark)
└── utils/                  # csv · pdf · date · currency · fuzzy (pure functions)
```

## Senior blueprint checklist

- **Absolute imports** — `@/components/ui/Button`, zero deep relative chains.
- **Zero `any`** — strict TS; every API boundary is explicitly typed (`src/types/shared.d.ts`).
- **Reusable components** — atomic UI kit with variant/size APIs, no duplicated markup.
- **Read & clean functionality** — CSV ingestion, issue detection (missing/duplicate/format),
  toggleable cleaning rules, before/after preview, CSV export and publish-to-state.
- **Global state** — Redux Toolkit slices for `ui`, `auth`, `notifications`, `users`, `metrics`,
  `pipeline` with typed hooks (`useAppDispatch` / `useAppSelector`) and persistent UI prefs.
- **RBAC** — one permission matrix (`src/lib/rbac.ts`) drives server redirect guards, client
  `RouteGuard`, sidebar visibility and API authorization.
- **Realtime** — SSE stream with automatic polling fallback, offline pause and live status badge.
- **Responsive UI** — token-driven Tailwind v4 theme, dark mode, mobile drawer navigation.
- **Fresh dependencies only** — Next 16, React 19, Tailwind v4, Redux Toolkit, Recharts,
  lucide-react; no legacy or unused packages.

## Scripts

| Command              | Purpose                        |
| -------------------- | ------------------------------ |
| `npm run dev`        | Development server             |
| `npm run build`      | Production build               |
| `npm run start`      | Serve production build         |
| `npm run lint`       | ESLint (flat config)           |
| `npm run typecheck`  | Strict TypeScript check        |
| `npm run format`     | Prettier normalization         |
