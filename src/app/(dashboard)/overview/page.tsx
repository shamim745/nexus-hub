"use client";

import { useEffect } from "react";
import { BarChart3, Gauge, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMetrics } from "@/features/analytics/store/metricsSlice";
import { useRealtimeSync } from "@/features/analytics/hooks/useRealtimeSync";
import { KpiCard } from "@/features/analytics/components/KpiCard";
import { RevenueAreaChart } from "@/features/analytics/components/RevenueAreaChart";
import { ChannelDonut } from "@/features/analytics/components/ChannelDonut";
import { ActivityFeed } from "@/features/analytics/components/ActivityFeed";
import { ConnectionBadge, LiveMetricsPanel } from "@/features/analytics/components/LiveMetricsPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@/components/ui";

function OverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-xl lg:col-span-2" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const dispatch = useAppDispatch();
  const bundle = useAppSelector((state) => state.metrics.bundle);
  const status = useAppSelector((state) => state.metrics.bundleStatus);
  const connection = useAppSelector((state) => state.metrics.connection);

  useRealtimeSync(true);

  useEffect(() => {
    void dispatch(fetchMetrics());
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        eyebrow="Command center"
        title="Operations Overview"
        description="Live business health across revenue, orders and platform activity — streamed from the metrics microservice."
        actions={
          <>
            <ConnectionBadge status={connection} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => void dispatch(fetchMetrics())}
              loading={status === "loading"}
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </Button>
          </>
        }
      />

      {status === "failed" && !bundle ? (
        <Card>
          <EmptyState
            icon={Gauge}
            title="Metrics unavailable"
            description="The metrics endpoint did not respond. Retry the request to restore the dashboard."
            action={
              <Button size="sm" onClick={() => void dispatch(fetchMetrics())}>
                Retry
              </Button>
            }
          />
        </Card>
      ) : !bundle && status === "loading" ? (
        <OverviewSkeleton />
      ) : bundle ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bundle.kpis.map((metric) => (
              <KpiCard key={metric.id} metric={metric} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Revenue performance vs target</CardTitle>
                  <CardDescription>Trailing 12 months · server-generated series</CardDescription>
                </div>
                <BarChart3 className="size-4 text-ink-3" />
              </CardHeader>
              <CardContent>
                <RevenueAreaChart data={bundle.series} />
              </CardContent>
            </Card>

            <LiveMetricsPanel />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Acquisition channels</CardTitle>
                  <CardDescription>Share of new customers</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-2">
                <ChannelDonut data={bundle.channels} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Recent system activity</CardTitle>
                  <CardDescription>Audit trail across roles and services</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ActivityFeed events={bundle.activity} />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
