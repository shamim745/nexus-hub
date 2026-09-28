import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { metricsApi } from "../services/metricsApi";
import type { LiveTick, MetricsBundle } from "../types/metrics.types";
import { extractErrorMessage } from "@/lib/http/apiClient";

export type ConnectionStatus = "idle" | "connecting" | "live" | "polling" | "offline";

export interface MetricsState {
  bundle: MetricsBundle | null;
  live: LiveTick | null;
  bundleStatus: AsyncStatus;
  connection: ConnectionStatus;
  lastSyncedAt: string | null;
  error: string | null;
}

const initialState: MetricsState = {
  bundle: null,
  live: null,
  bundleStatus: "idle",
  connection: "idle",
  lastSyncedAt: null,
  error: null,
};

export const fetchMetrics = createAsyncThunk<MetricsBundle, void, { rejectValue: string }>(
  "metrics/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await metricsApi.getBundle();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load metrics."));
    }
  },
);

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    liveTickReceived(state, action: PayloadAction<LiveTick>) {
      state.live = action.payload;
      state.lastSyncedAt = action.payload.at;
      state.error = null;
    },
    setConnection(state, action: PayloadAction<ConnectionStatus>) {
      state.connection = action.payload;
    },
    syncFailed(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload ?? "Realtime sync interrupted.";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.bundleStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.bundleStatus = "succeeded";
        state.bundle = action.payload;
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.bundleStatus = "failed";
        state.error = action.payload ?? "Failed to load metrics.";
      });
  },
});

export const { liveTickReceived, setConnection, syncFailed } = metricsSlice.actions;
export const metricsReducer = metricsSlice.reducer;
