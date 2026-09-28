"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "../types/metrics.types";

export function OrdersBarChart({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--ink-3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: "var(--ink-3)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "var(--panel-2)", opacity: 0.6 }}
          contentStyle={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--ink)",
          }}
        />
        <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}
