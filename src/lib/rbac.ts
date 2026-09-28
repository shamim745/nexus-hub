export const ROLES = ["admin", "manager", "staff"] as const;

export type Permission =
  "overview:view" | "users:view" | "users:manage" | "analytics:view" | "pipeline:run" | "rbac:manage";

export const PERMISSION_MATRIX: Record<Role, readonly Permission[]> = {
  admin: ["overview:view", "users:view", "users:manage", "analytics:view", "pipeline:run", "rbac:manage"],
  manager: ["overview:view", "users:view", "analytics:view", "pipeline:run"],
  staff: ["overview:view"],
};

const ROLE_RANK: Record<Role, number> = { staff: 1, manager: 2, admin: 3 };

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[role].includes(permission);
}

export function atLeast(role: Role | undefined | null, minimum: Role): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function permissionsFor(role: Role): readonly Permission[] {
  return PERMISSION_MATRIX[role];
}

export const ROLE_META: Record<
  Role,
  { label: string; description: string; tone: "brand" | "info" | "neutral" }
> = {
  admin: { label: "Administrator", description: "Full system control", tone: "brand" },
  manager: { label: "Manager", description: "Team operations & analytics", tone: "info" },
  staff: { label: "Staff", description: "Read-only workspace access", tone: "neutral" },
};
