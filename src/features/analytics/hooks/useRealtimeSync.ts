"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { liveTickReceived, setConnection, syncFailed, type ConnectionStatus } from "../store/metricsSlice";
import type { LiveTick } from "../types/metrics.types";
import { useNetworkState } from "@/hooks/useNetworkState";

const POLL_MS = 4_000;

function applyTick(dispatch: ReturnType<typeof useAppDispatch>, tick: LiveTick, status: ConnectionStatus) {
  dispatch(liveTickReceived(tick));
  dispatch(setConnection(status));
}

export function useRealtimeSync(enabled: boolean): void {
  const dispatch = useAppDispatch();
  const { online } = useNetworkState();

  useEffect(() => {
    if (!enabled) return;

    if (!online) {
      dispatch(setConnection("offline"));
      return;
    }

    dispatch(setConnection("connecting"));
    let disposed = false;
    let source: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (disposed || pollTimer) return;
      if (source) {
        source.close();
        source = null;
      }
      dispatch(setConnection("polling"));

      const poll = async () => {
        if (document.hidden) return;
        try {
          const response = await fetch("/api/metrics/live", { headers: { Accept: "application/json" } });
          if (response.status === 401) {
            dispatch(syncFailed("Session expired — live sync paused."));
            if (pollTimer) clearInterval(pollTimer);
            pollTimer = null;
            return;
          }
          if (!response.ok) throw new Error("poll failed");
          const payload = (await response.json()) as { data: LiveTick };
          applyTick(dispatch, payload.data, "polling");
        } catch {
          dispatch(syncFailed());
          dispatch(setConnection("offline"));
        }
      };

      void poll();
      pollTimer = setInterval(() => void poll(), POLL_MS);
    };

    try {
      source = new EventSource("/api/metrics/stream");
      source.addEventListener("open", () => !disposed && dispatch(setConnection("live")));
      source.addEventListener("tick", (event) => {
        if (disposed) return;
        try {
          const tick = JSON.parse((event as MessageEvent<string>).data) as LiveTick;
          applyTick(dispatch, tick, "live");
        } catch {
          dispatch(syncFailed("Malformed realtime payload."));
        }
      });
      source.addEventListener("error", () => {
        if (disposed) return;
        dispatch(setConnection("connecting"));
        startPolling();
      });
    } catch {
      startPolling();
    }

    return () => {
      disposed = true;
      source?.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [dispatch, enabled, online]);
}
