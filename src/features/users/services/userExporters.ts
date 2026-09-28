import { downloadFile, timestampSlug } from "@/utils/download";
import { toCsv, type CsvColumn } from "@/utils/csv";
import { exportTableToPdf } from "@/utils/pdfExport";
import { formatDate, relativeTime } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/currencyParser";
import type { User } from "../types/user.types";

export const USER_COLUMNS: CsvColumn<User>[] = [
  { key: "id", header: "ID", value: (row) => row.id },
  { key: "name", header: "Name", value: (row) => row.name },
  { key: "email", header: "Email", value: (row) => row.email },
  { key: "role", header: "Role", value: (row) => row.role },
  { key: "department", header: "Department", value: (row) => row.department },
  { key: "status", header: "Status", value: (row) => row.status },
  { key: "region", header: "Region", value: (row) => row.region },
  { key: "joinedAt", header: "Joined", value: (row) => formatDate(row.joinedAt) },
  { key: "revenue", header: "Revenue (USD)", value: (row) => row.revenue.toFixed(2) },
  { key: "orders", header: "Orders", value: (row) => row.orders },
];

export function exportUsersCsv(rows: readonly User[], suffix = "users"): void {
  downloadFile(toCsv(rows, USER_COLUMNS), `${suffix}-${timestampSlug()}.csv`, "text/csv;charset=utf-8");
}

export function exportUsersPdf(rows: readonly User[], title = "User Directory Export"): void {
  exportTableToPdf({
    title,
    subtitle: `Generated ${new Date().toLocaleString()}`,
    columns: ["Name", "Email", "Role", "Dept", "Status", "Joined", "Revenue"],
    rows: rows.map((row) => [
      row.name,
      row.email,
      row.role,
      row.department,
      row.status,
      relativeTime(row.joinedAt),
      formatCurrency(row.revenue, { decimals: 0 }),
    ]),
    fileName: `users-${timestampSlug()}.pdf`,
  });
}
