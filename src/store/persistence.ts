import type { UiState } from "./slices/uiSlice";
import type { AppStore } from "./store";

const STORAGE_KEY = "nexus-hub:ui:v1";

export function loadPersistedUi(): Partial<UiState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UiState>;
    const result: Partial<UiState> = {};
    if (parsed.theme === "dark" || parsed.theme === "light") result.theme = parsed.theme;
    if (typeof parsed.sidebarCollapsed === "boolean") result.sidebarCollapsed = parsed.sidebarCollapsed;
    return result;
  } catch {
    return null;
  }
}

export function persistUiState(store: AppStore): () => void {
  if (typeof window === "undefined") return () => undefined;
  return store.subscribe(() => {
    const { ui } = store.getState();
    const snapshot: Partial<UiState> = {
      theme: ui.theme,
      sidebarCollapsed: ui.sidebarCollapsed,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Storage may be unavailable (private mode / quota).
    }
  });
}
