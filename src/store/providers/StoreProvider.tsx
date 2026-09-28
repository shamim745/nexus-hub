"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { loadPersistedUi, persistUiState } from "../persistence";
import { rehydrate } from "../slices/uiSlice";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    const persisted = loadPersistedUi();
    if (persisted) store.dispatch(rehydrate(persisted));
    return persistUiState(store);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
