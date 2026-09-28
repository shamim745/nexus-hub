import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { Select } from "./input";

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

function buildPages(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  const output: (number | "…")[] = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) output.push("…");
    output.push(value);
    previous = value;
  }
  return output;
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 px-4 py-3", className)}>
      <p className="text-xs text-ink-3">
        Showing{" "}
        <span className="font-medium text-ink-2">
          {start}–{end}
        </span>{" "}
        of <span className="font-medium text-ink-2">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        {onPageSizeChange ? (
          <label className="flex items-center gap-2 text-xs text-ink-3">
            Rows
            <Select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-8 w-16 px-2 text-xs"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>
        ) : null}

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-line p-1.5 text-ink-2 transition-colors hover:bg-panel-2 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>

          {buildPages(page, pageCount).map((entry, index) =>
            entry === "…" ? (
              <span key={`gap-${index}`} className="px-1.5 text-xs text-ink-3">
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                onClick={() => onPageChange(entry)}
                aria-current={entry === page ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 rounded-md border px-2 text-xs transition-colors",
                  entry === page
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line text-ink-2 hover:bg-panel-2",
                )}
              >
                {entry}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-line p-1.5 text-ink-2 transition-colors hover:bg-panel-2 disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
