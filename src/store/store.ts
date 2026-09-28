import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { notificationsReducer } from "./slices/notificationsSlice";
import { uiReducer } from "./slices/uiSlice";
import { usersReducer } from "@/features/users/store/usersSlice";
import { metricsReducer } from "@/features/analytics/store/metricsSlice";
import { pipelineReducer } from "@/features/data-pipeline/store/pipelineSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      notifications: notificationsReducer,
      users: usersReducer,
      metrics: metricsReducer,
      pipeline: pipelineReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActionPaths: [],
        },
      }),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
