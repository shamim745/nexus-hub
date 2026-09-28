"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useAppSelector } from "@/store/hooks";
import { selectMobileNavOpen } from "@/store/slices/uiSlice";
import { selectSidebarCollapsed } from "@/store/slices/uiSlice";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "./Toaster";
import { WifiOff } from "lucide-react";
import { useNetworkState } from "@/hooks/useNetworkState";

export function AppShell({ children }: { children: ReactNode }) {
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const mobileOpen = useAppSelector(selectMobileNavOpen);
  const { online } = useNetworkState();

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]",
          mobileOpen && "lg:pl-[260px]",
        )}
      >
        <Topbar />
        {!online ? (
          <div className="flex items-center justify-center gap-2 bg-warning-500/15 px-4 py-2 text-xs font-medium text-warning-600">
            <WifiOff className="size-3.5" />
            You are offline — realtime sync paused, cached data stays visible.
          </div>
        ) : null}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        <footer className="border-t border-line px-4 py-4 text-[11px] text-ink-3 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
            <span>NexusHub · Enterprise Frontend Architecture Blueprint</span>
            <span>Feature-driven · Redux Toolkit · Strict TypeScript</span>
          </div>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
