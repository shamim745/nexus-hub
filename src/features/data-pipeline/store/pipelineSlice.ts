import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AppliedImport,
  CleanOutcome,
  CleaningRules,
  DataIssue,
  ParsedDataset,
  PipelineStage,
} from "../types/pipeline.types";

export interface PipelineState {
  stage: PipelineStage;
  dataset: ParsedDataset | null;
  rules: CleaningRules;
  issues: DataIssue[];
  outcome: CleanOutcome | null;
  applied: AppliedImport[];
  error: string | null;
}

const defaultRules: CleaningRules = {
  trim: true,
  collapseSpaces: true,
  normalizeEmails: true,
  titleCase: true,
  standardizeDates: true,
  dropDuplicates: true,
  dropEmptyRows: true,
  fillMissing: false,
};

const initialState: PipelineState = {
  stage: "idle",
  dataset: null,
  rules: defaultRules,
  issues: [],
  outcome: null,
  applied: [],
  error: null,
};

const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {
    datasetIngested(state, action: PayloadAction<{ dataset: ParsedDataset; issues: DataIssue[] }>) {
      state.dataset = action.payload.dataset;
      state.issues = action.payload.issues;
      state.stage = "parsed";
      state.outcome = null;
      state.error = null;
    },
    rulesToggled(state, action: PayloadAction<keyof CleaningRules>) {
      state.rules[action.payload] = !state.rules[action.payload];
      state.outcome = null;
      state.stage = state.dataset ? "parsed" : "idle";
    },
    cleaningRan(state, action: PayloadAction<CleanOutcome>) {
      state.outcome = action.payload;
      state.issues = action.payload.remaining;
      state.stage = "cleaned";
    },
    importApplied(state, action: PayloadAction<AppliedImport>) {
      state.applied.unshift(action.payload);
      state.applied = state.applied.slice(0, 5);
    },
    pipelineError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    datasetReset() {
      return initialState;
    },
  },
});

export const { datasetIngested, rulesToggled, cleaningRan, importApplied, pipelineError, datasetReset } =
  pipelineSlice.actions;
export const pipelineReducer = pipelineSlice.reducer;
