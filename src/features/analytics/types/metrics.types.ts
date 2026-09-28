export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  delta: number;
  spark: number[];
  accent: "brand" | "success" | "warning" | "info";
}

export interface SeriesPoint {
  label: string;
  revenue: number;
  orders: number;
  target: number;
}

export interface ChannelSlice {
  name: string;
  value: number;
  color: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  at: string;
  tone: "info" | "success" | "warning" | "danger";
}

export interface FunnelStage {
  label: string;
  visitors: number;
}

export interface RegionRow {
  region: string;
  revenue: number;
  growth: number;
}

export interface MetricsBundle {
  kpis: KpiMetric[];
  series: SeriesPoint[];
  channels: ChannelSlice[];
  activity: ActivityEvent[];
  funnel: FunnelStage[];
  regions: RegionRow[];
  retention: number[][];
}

export interface LiveTick {
  activeUsers: number;
  ordersPerMin: number;
  revenueToday: number;
  latencyMs: number;
  errorRate: number;
  at: string;
}
