import { apiClient } from "@/lib/http/apiClient";
import type { User, UserSummary } from "../types/user.types";

export interface UsersFilterInput {
  role: string;
  status: string;
  department: string;
}

export interface UsersRequest {
  page: number;
  pageSize: number;
  search: string;
  sort: SortSpec;
  filters: UsersFilterInput;
}

export interface UsersResponse {
  data: PageResult<User>;
  meta: { summary: UserSummary; actor: Role };
}

function buildQuery(request: UsersRequest): string {
  const params = new URLSearchParams();
  params.set("page", String(request.page));
  params.set("pageSize", String(request.pageSize));
  if (request.search) params.set("search", request.search);
  params.set("sort", request.sort.key);
  params.set("order", request.sort.direction);
  if (request.filters.role) params.set("role", request.filters.role);
  if (request.filters.status) params.set("status", request.filters.status);
  if (request.filters.department) params.set("department", request.filters.department);
  return params.toString();
}

export const usersApi = {
  list: async (request: UsersRequest): Promise<UsersResponse> => {
    const envelope = await apiClient.get<{ data: PageResult<User>; meta: UsersResponse["meta"] }>(
      `/users?${buildQuery(request)}`,
    );
    return { data: envelope.data, meta: envelope.meta };
  },
};
