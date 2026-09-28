import { BarChart3, DatabaseZap, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { can, type Permission } from "@/lib/rbac";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  permission: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/overview",
    label: "Overview",
    description: "Live operations console",
    icon: LayoutDashboard,
    permission: "overview:view",
  },
  {
    href: "/users",
    label: "Users",
    description: "Directory & permissions",
    icon: Users,
    permission: "users:view",
  },
  {
    href: "/analytics",
    label: "Analytics",
    description: "Revenue intelligence",
    icon: BarChart3,
    permission: "analytics:view",
  },
  {
    href: "/data-pipeline",
    label: "Data Pipeline",
    description: "Import, read & clean",
    icon: DatabaseZap,
    permission: "pipeline:run",
  },
  {
    href: "/access-control",
    label: "Access Control",
    description: "Role permission matrix",
    icon: ShieldCheck,
    permission: "rbac:manage",
  },
];

export function visibleNavItems(role: Role | undefined): NavItem[] {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => can(role, item.permission));
}
