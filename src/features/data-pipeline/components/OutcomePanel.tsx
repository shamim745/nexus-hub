"use client";

import { CheckCircle2, Download, FileCheck2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { importApplied } from "../store/pipelineSlice";
import { notify } from "@/store/slices/notificationsSlice";
import { toCsv } from "@/utils/csv";
import { downloadFile, timestampSlug } from "@/utils/download";
import { nanoid } from "@reduxjs/toolkit";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export function OutcomePanel() {
  const dispatch = useAppDispatch();
  const dataset = useAppSelector((state) => state.pipeline.dataset);
  const outcome = useAppSelector((state) => state.pipeline.outcome);
  const applied = useAppSelector((state) => state.pipeline.applied);

  if (!dataset) {
    return (
      <Card>
        <CardHeader>
          <div>
            <CardTitle>4 · Result</CardTitle>
            <CardDescription>Cleaned output & export</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-dashed border-line bg-panel-2/60 px-4 py-8 text-center text-xs text-ink-3">
            Parse a dataset and run the pipeline to see transformation metrics here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    { label: "Cells changed", value: outcome?.cellsChanged ?? 0 },
    { label: "Duplicates removed", value: outcome?.duplicatesRemoved ?? 0 },
    { label: "Empty rows dropped", value: outcome?.emptyRemoved ?? 0 },
    { label: "Values filled", value: outcome?.filledCells ?? 0 },
  ];

  const cleanedRows = outcome?.rows ?? [];
  const remainingErrors = outcome?.remaining.filter((issue) => issue.severity === "error").length ?? 0;

  const exportCleaned = () => {
    if (!outcome) return;
    const csv = toCsv(
      outcome.rows,
      dataset.headers.map((header) => ({
        key: header,
        header,
        value: (row: Record<string, string>) => row[header] ?? "",
      })),
    );
    downloadFile(
      csv,
      `cleaned-${dataset.fileName.replace(/\.csv$/i, "")}-${timestampSlug()}.csv`,
      "text/csv;charset=utf-8",
    );
    dispatch(
      notify({
        title: "Cleaned CSV exported",
        message: `${outcome.rows.length} rows written.`,
        tone: "success",
      }),
    );
  };

  const applyImport = () => {
    if (!outcome) return;
    dispatch(
      importApplied({
        id: nanoid(8),
        fileName: dataset.fileName,
        rowCount: outcome.rows.length,
        columnCount: dataset.headers.length,
        at: new Date().toISOString(),
      }),
    );
    dispatch(
      notify({
        title: "Dataset published to workspace",
        message: `${outcome.rows.length} clean rows registered in global state.`,
        tone: "success",
      }),
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>4 · Result</CardTitle>
            <CardDescription>
              {outcome ? "Transformation metrics" : "Awaiting a cleaning run"}
            </CardDescription>
          </div>
          <FileCheck2 className="size-4 text-ink-3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-panel-2 px-3 py-2.5">
                <p className="text-lg font-semibold tabular-nums text-ink">{outcome ? stat.value : "—"}</p>
                <p className="text-[10px] uppercase tracking-wide text-ink-3">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-line px-3 py-2.5 text-xs">
            <CheckCircle2
              className={`mt-0.5 size-3.5 shrink-0 ${remainingErrors === 0 ? "text-success-500" : "text-warning-500"}`}
            />
            <p className="text-ink-2">
              {outcome ? (
                <>
                  <span className="font-medium text-ink">{cleanedRows.length} rows</span> ready ·{" "}
                  {remainingErrors === 0
                    ? "no blocking issues remain"
                    : `${remainingErrors} blocking issues remain`}
                </>
              ) : (
                "Run the cleaning pipeline to generate output."
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={exportCleaned}
              disabled={!outcome}
            >
              <Download className="size-3.5" />
              Export CSV
            </Button>
            <Button size="sm" className="flex-1" onClick={applyImport} disabled={!outcome}>
              <FileCheck2 className="size-3.5" />
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      {applied.length > 0 ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Published imports</CardTitle>
              <CardDescription>Stored in the global pipeline slice</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-5 py-3">
            {applied.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-panel-2 px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{entry.fileName}</p>
                  <p className="text-[11px] text-ink-3">
                    {entry.rowCount} rows · {entry.columnCount} columns
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-ink-3">{entry.id}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
