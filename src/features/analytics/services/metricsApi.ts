import { apiClient } from "@/lib/http/apiClient";
import type { MetricsBundle } from "../types/metrics.types";

export const metricsApi = {
  getBundle: async (): Promise<MetricsBundle> => {
    const envelope = await apiClient.get<ApiEnvelope<MetricsBundle>>("/metrics");
    return envelope.data;
  },
};
