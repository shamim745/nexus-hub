"use client";

import { Badge, Dialog, FormField, Input } from "@/components/ui";
import { formatDate, relativeTime } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/currencyParser";
import { permissionsFor, ROLE_META } from "@/lib/rbac";
import type { User } from "../types/user.types";

export function UserDetailDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
  if (!user) return null;

  const meta = ROLE_META[user.role];

  return (
    <Dialog
      open
      onClose={onClose}
      title={user.name}
      description={`${meta.label} · ${meta.description}`}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-panel-2"
        >
          Close
        </button>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Record ID">
            <Input readOnly value={user.id} className="font-mono text-xs" />
          </FormField>
          <FormField label="Work email">
            <Input readOnly value={user.email} className="text-xs" />
          </FormField>
          <FormField label="Department">
            <Input readOnly value={user.department} />
          </FormField>
          <FormField label="Region">
            <Input readOnly value={user.region} />
          </FormField>
          <FormField label="Joined">
            <Input readOnly value={formatDate(user.joinedAt)} />
          </FormField>
          <FormField label="Last active">
            <Input readOnly value={relativeTime(user.lastActiveAt)} />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-panel-2 p-3 text-center">
            <p className="text-lg font-semibold text-ink">{formatCurrency(user.revenue, { decimals: 0 })}</p>
            <p className="text-[11px] text-ink-3">Lifetime revenue</p>
          </div>
          <div className="rounded-lg bg-panel-2 p-3 text-center">
            <p className="text-lg font-semibold text-ink">{user.orders}</p>
            <p className="text-[11px] text-ink-3">Orders</p>
          </div>
          <div className="rounded-lg bg-panel-2 p-3 text-center">
            <p className="text-lg font-semibold capitalize text-ink">{user.status}</p>
            <p className="text-[11px] text-ink-3">Account status</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-ink-2">Effective RBAC permissions</p>
          <div className="flex flex-wrap gap-1.5">
            {permissionsFor(user.role).map((permission) => (
              <Badge key={permission} tone="brand">
                <code className="font-mono text-[10px]">{permission}</code>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
