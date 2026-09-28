declare type Role = "admin" | "manager" | "staff";

declare type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

declare type SortDirection = "asc" | "desc";

declare interface SortSpec {
  key: string;
  direction: SortDirection;
}

declare interface PageRequest {
  page: number;
  pageSize: number;
  search?: string;
  sort?: SortSpec;
  filters?: Record<string, string>;
}

declare interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

declare interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

declare type ThemePreference = "light" | "dark";
