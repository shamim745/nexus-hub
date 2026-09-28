"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMetrics } from "@/features/analytics/store/metricsSlice";
import { useRealtimeSync } from "@/features/analytics/hooks/useRealtimeSync";
import { OrdersBarChart } from "@/features/analytics/components/OrdersBarChart";
import { FunnelChart, RegionsTable, RetentionHeatmap } from "@/features/analytics/components/Panels";
import { LiveMetricsPanel } from "@/features/analytics/components/LiveMetricsPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton, Tabs } from "@/components/ui";

const RANGES = [
  { id: "3", label: "3 months" },
  { id: "6", label: "6 months" },
  { id: "12", label: "12 months" },
];

const COHORT_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const bundle = useAppSelector((state) => state.metrics.bundle);
  const status = useAppSelector((state) => state.metrics.bundleStatus);
  const [range, setRange] = useState("12");

  useRealtimeSync(true);

  useEffect(() => {
    void dispatch(fetchMetrics());
  }, [dispatch]);

  const series = useMemo(() => {
    if (!bundle) return [];
    const count = Number(range);
    return bundle.series.slice(-count);
  }, [bundle, range]);

  if (!bundle) {
    return (
      <div>
        <PageHeader
          eyebrow="Intelligence"
          title="Analytics"
          description="Revenue, funnel and retention analysis."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Intelligence"
        title="Analytics & forecasting"
        description="Multi-dimensional reporting powered by the global metrics slice — filters update every visual at once."
        actions={<Tabs items={RANGES} value={range} onChange={setRange} className="w-auto" />}
      />

      {status === "failed" ? (
        <p className="mb-4 rounded-lg border border-warning-500/30 bg-warning-500/10 px-4 py-2.5 text-xs text-warning-600">
          Showing cached analytics — live refresh failed, retrying on next cycle.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Order volume</CardTitle>
              <CardDescription>Fulfilled orders across the selected window</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <OrdersBarChart data={series} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Conversion funnel</CardTitle>
              <CardDescription>Visit → purchase progression</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <FunnelChart stages={bundle.funnel} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Retention cohorts</CardTitle>
              <CardDescription>Weekly active return rate by signup cohort (%)</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <RetentionHeatmap data={bundle.retention} labels={COHORT_LABELS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue by region</CardTitle>
              <CardDescription>Contribution & period growth</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <RegionsTable rows={bundle.regions} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <LiveMetricsPanel />
      </div>
    </div>
  );
}
