"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, Command, Radio } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/store/slices/authSlice";
import {
  selectMobileNavOpen,
  selectSidebarCollapsed,
  setMobileNavOpen,
  toggleSidebar,
} from "@/store/slices/uiSlice";
import { visibleNavItems } from "./navigation";
import { Badge } from "@/components/ui";

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-0")}>
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/40">
        <Command className="size-4" />
      </span>
      {!collapsed ? (
        <span className="text-sm font-semibold tracking-tight text-ink">
          Nexus<span className="text-brand-500">Hub</span>
        </span>
      ) : null}
    </div>
  );
}

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const items = visibleNavItems(user?.role);

  return (
    <nav className="flex-1 space-y-1 px-3 py-2">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                : "text-ink-2 hover:bg-panel-2 hover:text-ink",
              collapsed && "justify-center px-0",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const mobileOpen = useAppSelector(selectMobileNavOpen);
  const user = useAppSelector(selectAuthUser);

  const closeMobile = () => dispatch(setMobileNavOpen(false));

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-line bg-panel transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-[260px]",
        )}
      >
        <Brand collapsed={collapsed} />
        <NavLinks collapsed={collapsed} />

        <div className="border-t border-line p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg bg-panel-2 px-3 py-2.5",
              collapsed && "justify-center px-0",
            )}
          >
            <Radio className="size-4 shrink-0 text-success-500 animate-pulse-soft" />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-ink">Realtime sync</p>
                <p className="truncate text-[11px] text-ink-3">WebSocket + polling</p>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-ink-3 transition-colors hover:bg-panel-2 hover:text-ink",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[272px] animate-fade-in flex-col border-r border-line bg-panel">
            <div className="flex items-center justify-between pr-3">
              <Brand collapsed={false} />
              <button
                type="button"
                onClick={closeMobile}
                className="rounded-md p-1.5 text-ink-3 hover:bg-panel-2"
                aria-label="Close navigation"
              >
                <ChevronsLeft className="size-4" />
              </button>
            </div>
            <NavLinks collapsed={false} onNavigate={closeMobile} />
            {user ? (
              <div className="border-t border-line px-5 py-4">
                <Badge tone="brand" dot>
                  {user.role}
                </Badge>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
