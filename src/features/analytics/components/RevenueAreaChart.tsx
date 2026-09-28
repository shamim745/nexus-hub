"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "../types/metrics.types";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number | string; name?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="panel rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-ink">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-ink-3">
          {entry.name}:{" "}
          <span className="font-semibold text-ink">
            {typeof entry.value === "number" ? entry.value.toLocaleString("en-US") : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function RevenueAreaChart({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="targetFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--ink-3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--ink-3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--ink-3)", strokeDasharray: "4 4" }} />
        <Area
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#0ea5e9"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          fill="url(#targetFill)"
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#6366f1"
          strokeWidth={2.4}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
