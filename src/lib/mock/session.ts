import type { AuthUser } from "@/features/auth/types/auth.types";

export const SESSION_COOKIE = "nh_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
export const DEMO_PASSWORD = "demo1234";

interface SessionRecord extends AuthUser {
  issuedAt: string;
  expiresAt: string;
}

const DEMO_ACCOUNTS: AuthUser[] = [
  {
    id: "usr_admin",
    name: "Abdul Karim Shamim",
    email: "admin@nexus.io",
    role: "admin",
    department: "Platform",
  },
  {
    id: "usr_manager",
    name: "Elena Petrova",
    email: "manager@nexus.io",
    role: "manager",
    department: "Revenue Ops",
  },
  { id: "usr_staff", name: "Marcus Hansen", email: "staff@nexus.io", role: "staff", department: "Support" },
];

export const demoAccounts = DEMO_ACCOUNTS;

export function authenticate(email: string, password: string): SessionRecord | null {
  const account = DEMO_ACCOUNTS.find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase());
  if (!account || password !== DEMO_PASSWORD) return null;

  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_TTL_MS);
  return { ...account, issuedAt: now.toISOString(), expiresAt: expires.toISOString() };
}

export function encodeSession(session: SessionRecord): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(raw: string | undefined): SessionRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as SessionRecord;
    if (!parsed?.email || !parsed?.role) return null;
    if (new Date(parsed.expiresAt).getTime() < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}
