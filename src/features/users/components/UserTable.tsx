"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components/ui";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, relativeTime } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/currencyParser";
import type { User, UserStatus } from "../types/user.types";

const STATUS_TONE: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  invited: "warning",
  suspended: "danger",
};

interface SortableHeader {
  label: string;
  key: string;
  className?: string;
}

const HEADERS: SortableHeader[] = [
  { label: "Member", key: "name" },
  { label: "Role", key: "role" },
  { label: "Department", key: "department" },
  { label: "Status", key: "status" },
  { label: "Region", key: "region" },
  { label: "Revenue", key: "revenue", className: "text-right" },
  { label: "Last active", key: "lastActiveAt" },
];

export function UserTable({
  items,
  status,
  error,
  sort,
  selectedIds,
  onSort,
  onToggle,
  onToggleAll,
  onView,
  onRetry,
}: {
  items: User[];
  status: AsyncStatus;
  error: string | null;
  sort: SortSpec;
  selectedIds: string[];
  onSort: (key: string) => void;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onView: (user: User) => void;
  onRetry: () => void;
}) {
  const pageIds = items.map((item) => item.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected = !allSelected && pageIds.some((id) => selectedIds.includes(id));

  if (status === "failed" && error) {
    return (
      <div className="grid place-items-center border-b border-line p-6">
        <EmptyState
          icon={TriangleAlert}
          title="Directory failed to load"
          description={error}
          compact
          action={
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RefreshCw className="size-3.5" />
              Retry request
            </Button>
          }
        />
      </div>
    );
  }

  if (status === "loading" && items.length === 0) {
    return <TableSkeleton rows={8} columns={7} />;
  }

  if (items.length === 0) {
    return (
      <div className="border-b border-line">
        <EmptyState
          icon={ArrowUpDown}
          title="No users match this query"
          description="Adjust the search text or clear the active role, status and department filters."
          compact
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", status === "loading" && "opacity-60")}>
      <Table>
        <TableHead>
          <TableRow className="hover:bg-transparent">
            <TableHeader className="w-10">
              <Checkbox
                label=""
                aria-label="Select page"
                checked={allSelected}
                ref={(node) => {
                  if (node) node.indeterminate = someSelected;
                }}
                onChange={onToggleAll}
                className="justify-center"
              />
            </TableHeader>
            {HEADERS.map((header) => {
              const active = sort.key === header.key;
              return (
                <TableHeader key={header.key} className={header.className}>
                  <button
                    type="button"
                    onClick={() => onSort(header.key)}
                    className={cn(
                      "inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-ink",
                      active && "text-brand-500",
                    )}
                  >
                    {header.label}
                    {active ? (
                      sort.direction === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 opacity-40" />
                    )}
                  </button>
                </TableHeader>
              );
            })}
            <TableHeader className="text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((user) => {
            const selected = selectedIds.includes(user.id);
            return (
              <TableRow key={user.id} className={cn(selected && "bg-brand-600/5")}>
                <TableCell>
                  <Checkbox
                    label=""
                    aria-label={`Select ${user.name}`}
                    checked={selected}
                    onChange={() => onToggle(user.id)}
                    className="justify-center"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} className="size-7 text-[10px]" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-ink">{user.name}</p>
                      <p className="truncate font-mono text-[11px] text-ink-3">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    tone={user.role === "admin" ? "brand" : user.role === "manager" ? "info" : "neutral"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{user.department}</TableCell>
                <TableCell>
                  <Badge tone={STATUS_TONE[user.status]} dot>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{user.region}</TableCell>
                <TableCell className="text-right text-xs font-medium tabular-nums text-ink">
                  {formatCurrency(user.revenue, { decimals: 0 })}
                </TableCell>
                <TableCell className="text-xs" title={formatDate(user.lastActiveAt)}>
                  {relativeTime(user.lastActiveAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => onView(user)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function TableLoadingOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <Skeleton className="h-4 w-40 rounded-full" />
    </div>
  );
}
