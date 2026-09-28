import { NextResponse, type NextRequest } from "next/server";
import { authenticate, encodeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/mock/session";

const MAX_AGE_MS = 60_000;
const rateWindow = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateWindow.get(key);
  if (!entry || entry.resetAt < now) {
    rateWindow.set(key, { count: 1, resetAt: now + MAX_AGE_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 320));

  const session = authenticate(email, password);
  if (!session) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json(
    {
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
    },
    { status: 200 },
  );
  response.cookies.set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions());
  return response;
}
