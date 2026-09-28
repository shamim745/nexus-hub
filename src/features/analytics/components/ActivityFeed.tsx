"use client";

import { Badge } from "@/components/ui";
import { relativeTime } from "@/utils/dateFormatter";
import { cn } from "@/utils/cn";
import type { ActivityEvent } from "../types/metrics.types";

const TONE: Record<ActivityEvent["tone"], "brand" | "success" | "warning" | "danger"> = {
  info: "brand",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <ol className="divide-y divide-line">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-3 px-5 py-3.5">
          <span
            className={cn(
              "mt-1.5 size-2 shrink-0 rounded-full",
              event.tone === "success" && "bg-success-500",
              event.tone === "warning" && "bg-warning-500",
              event.tone === "danger" && "bg-danger-500",
              event.tone === "info" && "bg-brand-500",
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs font-medium text-ink">{event.title}</p>
              <Badge tone={TONE[event.tone]}>{event.tone}</Badge>
            </div>
            <p className="mt-0.5 truncate text-xs text-ink-3">{event.detail}</p>
          </div>
          <span className="shrink-0 text-[11px] text-ink-3">{relativeTime(event.at)}</span>
        </li>
      ))}
    </ol>
  );
}
