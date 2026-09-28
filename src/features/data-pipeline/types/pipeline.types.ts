export interface ParsedDataset {
  fileName: string;
  delimiter: string;
  headers: string[];
  rows: string[][];
}

export type IssueKind = "missing" | "whitespace" | "duplicate" | "email" | "number" | "date" | "casing";

export interface DataIssue {
  id: string;
  kind: IssueKind;
  column: string;
  rowIndex: number;
  value: string;
  message: string;
  severity: "error" | "warning";
}

export interface CleaningRules {
  trim: boolean;
  collapseSpaces: boolean;
  normalizeEmails: boolean;
  titleCase: boolean;
  standardizeDates: boolean;
  dropDuplicates: boolean;
  dropEmptyRows: boolean;
  fillMissing: boolean;
}

export interface CleanOutcome {
  rows: Record<string, string>[];
  cellsChanged: number;
  duplicatesRemoved: number;
  emptyRemoved: number;
  filledCells: number;
  remaining: DataIssue[];
}

export interface AppliedImport {
  id: string;
  fileName: string;
  rowCount: number;
  columnCount: number;
  at: string;
}

export type PipelineStage = "idle" | "parsed" | "cleaned";
