"use client";

import { useMemo, useState } from "react";
import { CircleCheck } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Tabs } from "@/components/ui";
import { cn } from "@/utils/cn";
import type { DataIssue } from "../types/pipeline.types";

const SEVERITY_LABEL: Record<DataIssue["severity"], string> = {
  error: "Blocking",
  warning: "Advisory",
};

export function IssueList() {
  const issues = useAppSelector((state) => state.pipeline.issues);
  const [severity, setSeverity] = useState("all");

  const counts = useMemo(() => {
    const errors = issues.filter((issue) => issue.severity === "error").length;
    return { all: issues.length, error: errors, warning: issues.length - errors };
  }, [issues]);

  const visible = useMemo(() => {
    const filtered = severity === "all" ? issues : issues.filter((issue) => issue.severity === severity);
    return filtered.slice(0, 60);
  }, [issues, severity]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">2 · Quality analysis</h3>
          <p className="text-[11px] text-ink-3">
            {counts.error} blocking · {counts.warning} advisory
          </p>
        </div>
        <Tabs
          value={severity}
          onChange={setSeverity}
          items={[
            { id: "all", label: "All", count: counts.all },
            { id: "error", label: "Blocking", count: counts.error },
            { id: "warning", label: "Advisory", count: counts.warning },
          ]}
        />
      </div>

      <div className="max-h-[360px] flex-1 divide-y divide-line overflow-y-auto scrollbar-thin">
        {visible.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <CircleCheck className="size-6 text-success-500" />
            <p className="text-xs font-medium text-ink">No issues detected</p>
            <p className="text-[11px] text-ink-3">Every cell passed validation for the current ruleset.</p>
          </div>
        ) : (
          visible.map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 px-5 py-2.5">
              <span
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  issue.severity === "error" ? "bg-danger-500" : "bg-warning-500",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-ink">{issue.message}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-3">
                  {issue.kind} · row {issue.rowIndex + 1} · {issue.column}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  issue.severity === "error"
                    ? "bg-danger-100 text-danger-500"
                    : "bg-warning-100 text-warning-600",
                )}
              >
                {SEVERITY_LABEL[issue.severity]}
              </span>
            </div>
          ))
        )}
      </div>

      {issues.length > visible.length ? (
        <p className="border-t border-line px-5 py-2 text-[11px] text-ink-3">
          Showing {visible.length} of {issues.length} issues
        </p>
      ) : null}
    </div>
  );
}
