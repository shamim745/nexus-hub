import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  theme: ThemePreference;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  theme: "light",
  sidebarCollapsed: false,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    rehydrate(state, action: PayloadAction<Partial<UiState>>) {
      Object.assign(state, action.payload);
    },
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
  },
});

export const { rehydrate, setTheme, toggleTheme, toggleSidebar, setMobileNavOpen } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
export const selectSidebarCollapsed = (state: { ui: UiState }) => state.ui.sidebarCollapsed;
export const selectMobileNavOpen = (state: { ui: UiState }) => state.ui.mobileNavOpen;
