import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
  durationMs: number;
}

export interface NotificationsState {
  toasts: Toast[];
}

const initialState: NotificationsState = { toasts: [] };

export interface ToastInput {
  title: string;
  message?: string;
  tone?: ToastTone;
  durationMs?: number;
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notify: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
        if (state.toasts.length > 4) state.toasts.shift();
      },
      prepare(input: ToastInput): PayloadAction<Toast> {
        return {
          type: notificationsSlice.actions.notify.type,
          payload: {
            id: nanoid(),
            title: input.title,
            message: input.message,
            tone: input.tone ?? "info",
            durationMs: input.durationMs ?? 4200,
          },
        };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { notify, dismissToast, clearToasts } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

export const selectToasts = (state: { notifications: NotificationsState }) => state.notifications.toasts;
