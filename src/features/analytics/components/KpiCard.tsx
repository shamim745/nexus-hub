"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currencyParser";
import type { KpiMetric } from "../types/metrics.types";
import { Sparkline } from "./Sparkline";

const ACCENT_STROKE: Record<KpiMetric["accent"], string> = {
  brand: "var(--color-brand-500)",
  success: "var(--color-success-500)",
  warning: "var(--color-warning-500)",
  info: "var(--color-info-500)",
};

function formatValue(metric: KpiMetric): string {
  if (metric.format === "currency") return formatCurrency(metric.value, { compact: false, decimals: 0 });
  if (metric.format === "percent") return `${metric.value.toFixed(2)}%`;
  return new Intl.NumberFormat("en-US").format(metric.value);
}

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const positive = metric.delta >= 0;

  return (
    <article className="panel rounded-xl p-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-3">
            {metric.label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">{formatValue(metric)}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
            positive ? "bg-success-100 text-success-600" : "bg-danger-100 text-danger-500",
          )}
        >
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(metric.delta).toFixed(1)}%
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[11px] text-ink-3">vs previous period</p>
        <Sparkline data={metric.spark} stroke={ACCENT_STROKE[metric.accent]} />
      </div>
    </article>
  );
}
