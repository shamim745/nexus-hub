import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/mock/session";
import { queryUsers, userSummary } from "@/lib/mock/dashboardData";
import type { UserQuery } from "@/features/users/types/user.types";

const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(5, Number(params.get("pageSize") ?? 10) || 10));
  const sortKey = params.get("sort") ?? undefined;
  const sortDirection = (params.get("order") ?? "asc") === "desc" ? "desc" : "asc";

  const query: UserQuery = {
    page,
    pageSize,
    search: params.get("search") ?? undefined,
    sort: sortKey ? { key: sortKey, direction: sortDirection } : undefined,
    filters: {
      role: params.get("role") ?? "",
      status: params.get("status") ?? "",
      department: params.get("department") ?? "",
    },
  };

  await new Promise((resolve) => setTimeout(resolve, 160 + Math.random() * 180));

  const result = queryUsers(query);
  return NextResponse.json({ data: result, meta: { summary: userSummary(), actor: session.role } });
}
