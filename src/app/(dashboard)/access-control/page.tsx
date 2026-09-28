"use client";

import { Check, Lock, ShieldCheck, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { PERMISSION_MATRIX, ROLE_META, type Permission } from "@/lib/rbac";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

const ALL_PERMISSIONS: Permission[] = [
  "overview:view",
  "users:view",
  "users:manage",
  "analytics:view",
  "pipeline:run",
  "rbac:manage",
];

export default function AccessControlPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const roles = Object.keys(ROLE_META) as Role[];

  return (
    <div>
      <PageHeader
        eyebrow="Governance"
        title="Access control matrix"
        description="Single source of truth for role permissions — the same matrix drives route guards, navigation visibility and API authorization."
        actions={
          <Badge tone="brand" dot>
            Signed in as {currentUser?.role}
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const meta = ROLE_META[role];
          const isCurrent = currentUser?.role === role;
          return (
            <Card key={role} className={isCurrent ? "border-brand-500/50" : undefined}>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-brand-500" />
                    {meta.label}
                  </CardTitle>
                  <CardDescription>{meta.description}</CardDescription>
                </div>
                <Badge tone={meta.tone === "brand" ? "brand" : meta.tone === "info" ? "info" : "neutral"}>
                  {role}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-medium text-ink-3">
                  {PERMISSION_MATRIX[role].length} of {ALL_PERMISSIONS.length} permissions granted
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-2">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(PERMISSION_MATRIX[role].length / ALL_PERMISSIONS.length) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Permission matrix</CardTitle>
            <CardDescription>Enforced by src/lib/rbac.ts · consumed by RouteGuard & Sidebar</CardDescription>
          </div>
          <Lock className="size-4 text-ink-3" />
        </CardHeader>
        <Table>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <TableHeader>Permission</TableHeader>
              {roles.map((role) => (
                <TableHeader key={role} className="text-center">
                  {role}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ALL_PERMISSIONS.map((permission) => (
              <TableRow key={permission}>
                <TableCell className="font-mono text-xs text-ink">{permission}</TableCell>
                {roles.map((role) => {
                  const granted = PERMISSION_MATRIX[role].includes(permission);
                  return (
                    <TableCell key={role} className="text-center">
                      {granted ? (
                        <Check className="mx-auto size-4 text-success-500" />
                      ) : (
                        <X className="mx-auto size-4 text-ink-3" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
