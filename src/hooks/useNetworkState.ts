"use client";

import { useEffect, useState } from "react";

export interface NetworkState {
  online: boolean;
  effectiveType: string | null;
}

export function useNetworkState(): NetworkState {
  const [state, setState] = useState<NetworkState>({ online: true, effectiveType: null });

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: EventTarget & { effectiveType?: string } })
      .connection;

    const sync = () => {
      setState({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType ?? null,
      });
    };

    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    connection?.addEventListener?.("change", sync);

    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      connection?.removeEventListener?.("change", sync);
    };
  }, []);

  return state;
}
