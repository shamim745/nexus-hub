import { createHttpClient, HttpError } from "./client";

export interface ApiErrorPayload {
  message: string;
  status: number;
}

export const apiClient = createHttpClient({
  baseUrl: "/api",
  timeoutMs: 15_000,
  requestInterceptors: [
    (request) => ({
      ...request,
      headers: {
        "X-Client": "nexus-hub-web",
        ...request.headers,
      },
    }),
  ],
  errorInterceptors: [
    (error, request) => {
      if (error instanceof HttpError) {
        if (error.status === 401 && !request.url.endsWith("/auth/login")) {
          return new HttpError("Session expired. Please sign in again.", 401, error.payload);
        }
        if (error instanceof DOMException && error.name === "TimeoutError") {
          return new HttpError("The request timed out. Please retry.", 408);
        }
      }
      return error;
    },
  ],
});

export function extractErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof HttpError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
