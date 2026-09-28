"use client";

import { Play, Wand2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cleaningRan, rulesToggled } from "../store/pipelineSlice";
import { applyCleaning } from "../services/cleaningEngine";
import { notify } from "@/store/slices/notificationsSlice";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Switch } from "@/components/ui";
import type { CleaningRules } from "../types/pipeline.types";

const RULE_META: { key: keyof CleaningRules; label: string; description: string }[] = [
  { key: "trim", label: "Trim whitespace", description: "Strip leading & trailing spaces" },
  { key: "collapseSpaces", label: "Collapse spaces", description: "Reduce repeated inner spaces" },
  { key: "normalizeEmails", label: "Normalize emails", description: "Lowercase email addresses" },
  { key: "titleCase", label: "Standardize casing", description: "Title-case name-like columns" },
  { key: "standardizeDates", label: "Standardize dates", description: "Convert to YYYY-MM-DD" },
  { key: "dropDuplicates", label: "Drop duplicates", description: "Remove repeated records" },
  { key: "dropEmptyRows", label: "Drop empty rows", description: "Skip blank records" },
  { key: "fillMissing", label: "Fill missing values", description: "Replace blanks with defaults" },
];

export function RulesPanel() {
  const dispatch = useAppDispatch();
  const dataset = useAppSelector((state) => state.pipeline.dataset);
  const rules = useAppSelector((state) => state.pipeline.rules);
  const stage = useAppSelector((state) => state.pipeline.stage);

  const run = () => {
    if (!dataset) return;
    const outcome = applyCleaning({ headers: dataset.headers, rows: dataset.rows }, rules);
    dispatch(cleaningRan(outcome));
    dispatch(
      notify({
        title: "Cleaning pass complete",
        message: `${outcome.cellsChanged} cells normalized · ${outcome.duplicatesRemoved} duplicates removed`,
        tone: outcome.remaining.some((issue) => issue.severity === "error") ? "warning" : "success",
      }),
    );
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>3 · Cleaning rules</CardTitle>
          <CardDescription>Composable, deterministic transforms — pure functions</CardDescription>
        </div>
        <Wand2 className="size-4 text-ink-3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3.5">
          {RULE_META.map((rule) => (
            <Switch
              key={rule.key}
              checked={rules[rule.key]}
              onChange={() => dispatch(rulesToggled(rule.key))}
              label={rule.label}
              description={rule.description}
            />
          ))}
        </div>

        <Button
          className="w-full"
          onClick={run}
          disabled={!dataset}
          loading={stage === "cleaned" && !dataset}
        >
          <Play className="size-4" />
          Run cleaning pipeline
        </Button>
        <p className="text-[11px] leading-4 text-ink-3">
          Toggling a rule invalidates the previous result so the preview always reflects the active ruleset.
        </p>
      </CardContent>
    </Card>
  );
}
