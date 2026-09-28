import { NextResponse, type NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/mock/session";

export async function GET(request: NextRequest) {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  const session = decodeSession(raw);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        department: session.department,
      },
      expiresAt: session.expiresAt,
    },
  });
}
