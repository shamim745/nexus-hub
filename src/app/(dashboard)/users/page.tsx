"use client";

import { useEffect, useState } from "react";
import { Download, FileText, RefreshCw, Users2, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelection,
  fetchUsers,
  setPage,
  setPageSize,
  toggleSelect,
  toggleSelectPage,
  toggleSort,
} from "@/features/users/store/usersSlice";
import { UserTable } from "@/features/users/components/UserTable";
import { UserFilters } from "@/features/users/components/UserFilters";
import { UserDetailDialog } from "@/features/users/components/UserDetailDialog";
import { exportUsersCsv, exportUsersPdf } from "@/features/users/services/userExporters";
import { PageHeader } from "@/components/common/PageHeader";
import { notify } from "@/store/slices/notificationsSlice";
import { Badge, Button, Card, Pagination } from "@/components/ui";
import type { User } from "@/features/users/types/user.types";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, summary, total, page, pageSize, pageCount, sort, filters, selectedIds, status, error } =
    useAppSelector((state) => state.users);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch, page, pageSize, sort.key, sort.direction, filters.role, filters.status, filters.department]);

  const selectedRows = items.filter((item) => selectedIds.includes(item.id));

  const handleExport = (format: "csv" | "pdf") => {
    const rows = selectedRows.length > 0 ? selectedRows : items;
    if (rows.length === 0) {
      dispatch(
        notify({ title: "Nothing to export", message: "Load or select records first.", tone: "warning" }),
      );
      return;
    }
    if (format === "csv") exportUsersCsv(rows, selectedRows.length > 0 ? "users-selection" : "users-page");
    else exportUsersPdf(rows);
    dispatch(
      notify({
        title: `${format.toUpperCase()} export ready`,
        message: `${rows.length} record${rows.length === 1 ? "" : "s"} written to your device.`,
        tone: "success",
      }),
    );
  };

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Users & permissions"
        description="Server-side datatable: sorting, fuzzy search, faceted filters and pagination executed against /api/users."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void dispatch(fetchUsers())}
              loading={status === "loading"}
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <FileText className="size-3.5" />
              Export PDF
            </Button>
            <Button size="sm" onClick={() => handleExport("csv")}>
              <Download className="size-3.5" />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="neutral">
          <Users2 className="size-3" />
          {summary?.total ?? total} records
        </Badge>
        {summary ? (
          <>
            <Badge tone="success">{summary.active} active</Badge>
            <Badge tone="warning">{summary.invited} invited</Badge>
            <Badge tone="danger">{summary.suspended} suspended</Badge>
          </>
        ) : null}
        {selectedIds.length > 0 ? (
          <Badge tone="brand">
            {selectedIds.length} selected
            <button
              type="button"
              onClick={() => dispatch(clearSelection())}
              className="ml-1 inline-flex items-center hover:text-brand-700"
              aria-label="Clear selection"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ) : null}
      </div>

      <div className="mb-4">
        <UserFilters departments={summary?.departments ?? []} />
      </div>

      <Card className="overflow-hidden">
        <UserTable
          items={items}
          status={status}
          error={error}
          sort={sort}
          selectedIds={selectedIds}
          onSort={(key) => dispatch(toggleSort(key))}
          onToggle={(id) => dispatch(toggleSelect(id))}
          onToggleAll={() => dispatch(toggleSelectPage())}
          onView={setDetailUser}
          onRetry={() => void dispatch(fetchUsers())}
        />
        <div className="border-t border-line">
          <Pagination
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            total={total}
            onPageChange={(next) => dispatch(setPage(next))}
            onPageSizeChange={(next) => dispatch(setPageSize(next))}
          />
        </div>
      </Card>

      <UserDetailDialog user={detailUser} onClose={() => setDetailUser(null)} />
    </div>
  );
}
