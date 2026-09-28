import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthUser, LoginPayload, LoginResponse } from "@/features/auth/types/auth.types";
import { authApi } from "@/features/auth/services/authApi";
import { extractErrorMessage } from "@/lib/http/apiClient";

export interface AuthState {
  user: AuthUser | null;
  status: AsyncStatus;
  restoring: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  restoring: true,
  error: null,
};

export const login = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Unable to sign in."));
    }
  },
);

export const restoreSession = createAsyncThunk<LoginResponse, void, { rejectValue: string }>(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.session();
    } catch {
      return rejectWithValue("no-session");
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    sessionRejected(state) {
      state.restoring = false;
      state.status = "idle";
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to sign in.";
      })
      .addCase(restoreSession.pending, (state) => {
        state.restoring = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.restoring = false;
        state.user = action.payload.user;
        state.status = "succeeded";
      })
      .addCase(restoreSession.rejected, (state) => {
        state.restoring = false;
        state.user = null;
        state.status = "idle";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearAuthError, sessionRejected } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsRestoring = (state: { auth: AuthState }) => state.auth.restoring;
