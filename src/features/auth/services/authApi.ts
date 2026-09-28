import { apiClient } from "@/lib/http/apiClient";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiEnvelope<LoginResponse>>("/auth/login", payload);
    return response.data;
  },
  session: async (): Promise<LoginResponse> => {
    const response = await apiClient.get<ApiEnvelope<LoginResponse>>("/auth/session");
    return response.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post<ApiEnvelope<{ ok: boolean }>>("/auth/logout");
  },
};
