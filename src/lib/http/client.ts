export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

export interface HttpRequest {
  url: string;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export type RequestInterceptor = (request: HttpRequest) => HttpRequest | Promise<HttpRequest>;
export type ResponseInterceptor = (response: Response, request: HttpRequest) => Response | Promise<Response>;
export type ErrorInterceptor = (error: unknown, request: HttpRequest) => unknown;

export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}

export interface HttpClient {
  request<T>(request: Omit<HttpRequest, "url"> & { url: string }): Promise<T>;
  get<T>(url: string, init?: Omit<HttpRequest, "url" | "method" | "body">): Promise<T>;
  post<T>(url: string, body?: unknown, init?: Omit<HttpRequest, "url" | "method" | "body">): Promise<T>;
  patch<T>(url: string, body?: unknown, init?: Omit<HttpRequest, "url" | "method" | "body">): Promise<T>;
  delete<T>(url: string, init?: Omit<HttpRequest, "url" | "method" | "body">): Promise<T>;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  return await response.text();
}

export function createHttpClient(options: HttpClientOptions): HttpClient {
  const {
    baseUrl,
    timeoutMs = 15_000,
    requestInterceptors = [],
    responseInterceptors = [],
    errorInterceptors = [],
  } = options;

  async function execute<T>(raw: Omit<HttpRequest, "url"> & { url: string }): Promise<T> {
    let request: HttpRequest = { ...raw, url: raw.url.startsWith("http") ? raw.url : `${baseUrl}${raw.url}` };

    for (const interceptor of requestInterceptors) {
      request = await interceptor(request);
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(new DOMException("Request timed out", "TimeoutError")),
      timeoutMs,
    );
    const externalSignal = request.signal;
    const onAbort = () => controller.abort(externalSignal?.reason);
    externalSignal?.addEventListener("abort", onAbort, { once: true });

    try {
      let response = await fetch(request.url, {
        method: request.method,
        headers: { Accept: "application/json", ...request.headers },
        body: request.body === undefined ? undefined : JSON.stringify(request.body),
        signal: controller.signal,
        credentials: "same-origin",
      });

      for (const interceptor of responseInterceptors) {
        response = await interceptor(response, request);
      }

      const payload = await parseBody(response);

      if (!response.ok) {
        const message =
          typeof payload === "object" && payload !== null && "error" in payload
            ? String((payload as { error: unknown }).error)
            : `Request failed with status ${response.status}`;
        throw new HttpError(message, response.status, payload);
      }

      return payload as T;
    } catch (error) {
      let handled: unknown = error;
      for (const interceptor of errorInterceptors) {
        handled = interceptor(handled, request);
      }
      if (handled instanceof Error) throw handled;
      throw new HttpError("Unexpected request failure", 0, handled);
    } finally {
      clearTimeout(timeout);
      externalSignal?.removeEventListener("abort", onAbort);
    }
  }

  return {
    request: execute,
    get: (url, init) => execute({ ...init, url, method: "GET" }),
    post: (url, body, init) => execute({ ...init, url, method: "POST", body }),
    patch: (url, body, init) => execute({ ...init, url, method: "PATCH", body }),
    delete: (url, init) => execute({ ...init, url, method: "DELETE" }),
  };
}
