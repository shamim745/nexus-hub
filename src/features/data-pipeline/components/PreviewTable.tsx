"use client";

import { useState } from "react";
import { TableProperties } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Tabs, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/utils/cn";

const PREVIEW_LIMIT = 12;

export function PreviewTable() {
  const dataset = useAppSelector((state) => state.pipeline.dataset);
  const outcome = useAppSelector((state) => state.pipeline.outcome);
  const [view, setView] = useState<"raw" | "cleaned">("raw");

  if (!dataset) {
    return (
      <EmptyState
        icon={TableProperties}
        title="Nothing to preview yet"
        description="Load a CSV source above — the first rows will appear here with a source/cleaned comparison."
        compact
      />
    );
  }

  const cleanedActive = view === "cleaned" && Boolean(outcome);
  const headers = dataset.headers;

  const rows =
    cleanedActive && outcome
      ? outcome.rows.slice(0, PREVIEW_LIMIT).map((row) => headers.map((header) => row[header] ?? ""))
      : dataset.rows.slice(0, PREVIEW_LIMIT).map((row) => headers.map((_, index) => row[index] ?? ""));

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Data preview</h3>
          <p className="text-[11px] text-ink-3">
            First {Math.min(rows.length, PREVIEW_LIMIT)} of{" "}
            {cleanedActive ? (outcome?.rows.length ?? 0) : dataset.rows.length} rows
          </p>
        </div>
        <Tabs
          value={cleanedActive ? "cleaned" : "raw"}
          onChange={(id) => setView(id as "raw" | "cleaned")}
          items={[
            { id: "raw", label: "Source" },
            { id: "cleaned", label: "Cleaned", count: outcome ? outcome.rows.length : undefined },
          ]}
          className="w-auto"
        />
      </div>

      <div className="max-h-[420px] overflow-auto scrollbar-thin">
        <Table>
          <TableHead className="sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHeader className="w-10">#</TableHeader>
              {headers.map((header) => (
                <TableHeader key={header}>{header}</TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((cells, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="font-mono text-[10px] text-ink-3">{rowIndex + 1}</TableCell>
                {cells.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={cn("whitespace-nowrap text-xs", !cell && "text-ink-3")}
                  >
                    {cell || "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!cleanedActive && outcome ? (
        <p className="border-t border-line px-5 py-2.5 text-[11px] text-ink-3">
          Switch to the <span className="font-medium text-brand-500">Cleaned</span> tab to inspect transformed
          output.
        </p>
      ) : null}
    </div>
  );
}
