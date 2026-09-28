"use client";

import { Activity, CircleAlert, Gauge, Radio, Timer, Users } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAppSelector } from "@/store/hooks";
import type { ConnectionStatus } from "../store/metricsSlice";
import { relativeTime } from "@/utils/dateFormatter";

const CONNECTION_META: Record<ConnectionStatus, { label: string; className: string; dotClass: string }> = {
  idle: { label: "Idle", className: "text-ink-3", dotClass: "bg-ink-3" },
  connecting: {
    label: "Connecting…",
    className: "text-warning-500",
    dotClass: "bg-warning-500 animate-pulse-soft",
  },
  live: {
    label: "Live stream",
    className: "text-success-500",
    dotClass: "bg-success-500 animate-pulse-soft",
  },
  polling: {
    label: "Polling fallback",
    className: "text-info-500",
    dotClass: "bg-info-500 animate-pulse-soft",
  },
  offline: { label: "Offline", className: "text-danger-500", dotClass: "bg-danger-500" },
};

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const meta = CONNECTION_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[11px] font-medium",
        meta.className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  );
}

export function LiveMetricsPanel() {
  const live = useAppSelector((state) => state.metrics.live);
  const connection = useAppSelector((state) => state.metrics.connection);
  const lastSyncedAt = useAppSelector((state) => state.metrics.lastSyncedAt);

  const metrics = [
    { label: "Active users", value: live ? live.activeUsers.toLocaleString("en-US") : "—", icon: Users },
    { label: "Orders / min", value: live ? live.ordersPerMin.toLocaleString("en-US") : "—", icon: Activity },
    {
      label: "Revenue today",
      value: live ? `$${live.revenueToday.toLocaleString("en-US")}` : "—",
      icon: Gauge,
    },
    { label: "p95 latency", value: live ? `${live.latencyMs}ms` : "—", icon: Timer },
  ];

  return (
    <div className="panel rounded-xl">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-brand-500" />
          <div>
            <h3 className="text-sm font-semibold text-ink">Realtime microservice sync</h3>
            <p className="text-[11px] text-ink-3">
              {lastSyncedAt ? `Last event ${relativeTime(lastSyncedAt)}` : "Awaiting first event"}
            </p>
          </div>
        </div>
        <ConnectionBadge status={connection} />
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-line">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="px-5 py-4">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-ink-3">
                <Icon className="size-3.5" />
                {metric.label}
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums text-ink">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 border-t border-line px-5 py-3 text-[11px] text-ink-3">
        <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-warning-500" />
        SSE stream with automatic polling fallback; sync pauses while the tab is hidden or the device is
        offline.
      </div>
    </div>
  );
}
