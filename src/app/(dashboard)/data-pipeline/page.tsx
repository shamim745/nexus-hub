"use client";

import { DatabaseZap } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui";
import { SourcePanel } from "@/features/data-pipeline/components/SourcePanel";
import { IssueList } from "@/features/data-pipeline/components/IssueList";
import { RulesPanel } from "@/features/data-pipeline/components/RulesPanel";
import { OutcomePanel } from "@/features/data-pipeline/components/OutcomePanel";
import { PreviewTable } from "@/features/data-pipeline/components/PreviewTable";

export default function DataPipelinePage() {
  const stage = useAppSelector((state) => state.pipeline.stage);

  return (
    <div>
      <PageHeader
        eyebrow="Read & clean"
        title="Data pipeline"
        description="Ingest CSV sources, detect quality issues, apply deterministic cleaning rules, preview the diff and publish the result — entirely client-side."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-3">
            <DatabaseZap className="size-3.5 text-brand-500" />
            stage · {stage}
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SourcePanel />
        <Card className="lg:col-span-1">
          <IssueList />
        </Card>
        <RulesPanel />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <PreviewTable />
          </Card>
        </div>
        <OutcomePanel />
      </div>
    </div>
  );
}
