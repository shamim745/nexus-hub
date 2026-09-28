"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { FileUp, FileText, RotateCcw, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { datasetIngested, datasetReset, pipelineError } from "../store/pipelineSlice";
import { analyzeDataset, SAMPLE_CSV } from "../services/cleaningEngine";
import { parseCsv } from "@/utils/csv";
import { notify } from "@/store/slices/notificationsSlice";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Textarea } from "@/components/ui";

export function SourcePanel() {
  const dispatch = useAppDispatch();
  const dataset = useAppSelector((state) => state.pipeline.dataset);
  const error = useAppSelector((state) => state.pipeline.error);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const ingest = (text: string, fileName: string) => {
    const parsed = parseCsv(text);
    if (parsed.error || parsed.headers.length === 0) {
      dispatch(pipelineError(parsed.error ?? "No columns detected in the provided CSV."));
      return;
    }
    dispatch(
      datasetIngested({
        dataset: {
          fileName,
          delimiter: parsed.delimiter === "\t" ? "tab" : parsed.delimiter,
          headers: parsed.headers,
          rows: parsed.rows,
        },
        issues: analyzeDataset({ headers: parsed.headers, rows: parsed.rows }),
      }),
    );
    dispatch(
      notify({
        title: "Dataset parsed",
        message: `${parsed.rows.length} rows · ${parsed.headers.length} columns · ${fileName}`,
        tone: "success",
      }),
    );
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => ingest(String(reader.result ?? ""), file.name);
    reader.onerror = () => dispatch(pipelineError("Unable to read the selected file."));
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>1 · Read source</CardTitle>
          <CardDescription>Upload a CSV, paste raw text, or load the sample dataset</CardDescription>
        </div>
        {dataset ? (
          <Button size="sm" variant="ghost" onClick={() => dispatch(datasetReset())}>
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-panel-2/60 px-4 py-7 text-center transition-colors hover:border-brand-500/60 hover:bg-panel-2"
        >
          <FileUp className="size-5 text-brand-500" />
          <span className="text-xs font-medium text-ink">Choose a CSV file</span>
          <span className="text-[11px] text-ink-3">Parsed client-side · delimiter auto-detected</span>
        </button>

        <div className="space-y-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="name,email,department,joinDate…"
            rows={4}
            className="font-mono text-xs"
            aria-label="Paste CSV content"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => ingest(draft, "pasted-data.csv")} disabled={!draft.trim()}>
              <FileText className="size-3.5" />
              Parse pasted text
            </Button>
            <Button size="sm" variant="outline" onClick={() => ingest(SAMPLE_CSV, "sample-contacts.csv")}>
              <Sparkles className="size-3.5" />
              Load sample dataset
            </Button>
          </div>
        </div>

        {error ? (
          <p
            className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-xs text-danger-500"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {dataset ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-[11px] text-ink-3">
            <span className="font-medium text-ink-2">{dataset.fileName}</span>
            <span>· {dataset.rows.length} rows</span>
            <span>· {dataset.headers.length} columns</span>
            <span>· delimiter &quot;{dataset.delimiter}&quot;</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
