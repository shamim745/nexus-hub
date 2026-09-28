"use client";

import { cn } from "@/utils/cn";
import type { FunnelStage, RegionRow } from "../types/metrics.types";
import { formatCurrency } from "@/utils/currencyParser";
import { Badge } from "@/components/ui";

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((stage) => stage.visitors), 1);

  return (
    <div className="space-y-3 px-5 py-4">
      {stages.map((stage, index) => {
        const width = (stage.visitors / max) * 100;
        const previous = index > 0 ? stages[index - 1].visitors : null;
        const conversion = previous ? ((stage.visitors / previous) * 100).toFixed(1) : null;
        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-2">{stage.label}</span>
              <span className="tabular-nums text-ink-3">
                {stage.visitors.toLocaleString("en-US")}
                {conversion ? <span className="ml-2 text-brand-500">{conversion}%</span> : null}
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-md bg-panel-2">
              <div
                className="flex h-full items-center rounded-md bg-gradient-to-r from-brand-600 to-brand-400 pl-2.5 text-[11px] font-semibold text-white transition-all duration-500"
                style={{ width: `${Math.max(width, 8)}%` }}
              >
                {Math.round(width)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RetentionHeatmap({ data, labels }: { data: number[][]; labels: string[] }) {
  return (
    <div className="overflow-x-auto px-5 py-4 scrollbar-thin">
      <table className="w-full min-w-[440px] border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left font-medium text-ink-3">Cohort</th>
            {["W0", "W1", "W2", "W3", "W4", "W5"].map((week) => (
              <th key={week} className="px-2 py-1 text-center font-medium text-ink-3">
                {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={labels[rowIndex] ?? rowIndex}>
              <td className="px-2 py-1 font-medium text-ink-2">{labels[rowIndex] ?? `C${rowIndex + 1}`}</td>
              {row.map((value, cellIndex) => (
                <td
                  key={cellIndex}
                  className="rounded-md px-2 py-1.5 text-center font-medium tabular-nums"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--color-brand-500) ${Math.round((value / 100) * 80)}%, var(--panel-2))`,
                    color: value > 55 ? "#fff" : "var(--ink-2)",
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RegionsTable({ rows }: { rows: RegionRow[] }) {
  const max = Math.max(...rows.map((row) => row.revenue), 1);

  return (
    <div className="divide-y divide-line">
      {rows.map((row) => (
        <div key={row.region} className="flex items-center gap-4 px-5 py-3.5">
          <div className="w-32 shrink-0">
            <p className="truncate text-xs font-medium text-ink">{row.region}</p>
            <p className="text-[11px] text-ink-3">{formatCurrency(row.revenue, { decimals: 0 })}</p>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel-2">
            <div
              className={cn("h-full rounded-full bg-brand-500")}
              style={{ width: `${(row.revenue / max) * 100}%` }}
            />
          </div>
          <Badge tone={row.growth >= 0 ? "success" : "danger"} className="w-16 justify-center">
            {row.growth >= 0 ? "+" : ""}
            {row.growth.toFixed(1)}%
          </Badge>
        </div>
      ))}
    </div>
  );
}
