import type {
  CleaningRules,
  CleanOutcome,
  DataIssue,
  IssueKind,
  ParsedDataset,
} from "../types/pipeline.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const NUMERIC_PATTERN = /^[-+]?[£$€]?[\d,]+(\.\d+)?%?$/;
const DATE_PATTERNS: {
  pattern: RegExp;
  parse: (match: RegExpMatchArray) => [number, number, number] | null;
}[] = [
  { pattern: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, parse: (m) => [Number(m[1]), Number(m[2]), Number(m[3])] },
  { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parse: (m) => [Number(m[3]), Number(m[1]), Number(m[2])] },
  { pattern: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, parse: (m) => [Number(m[3]), Number(m[2]), Number(m[1])] },
  { pattern: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, parse: (m) => [Number(m[1]), Number(m[2]), Number(m[3])] },
];

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

export type ColumnKind = "email" | "date" | "number" | "text" | "empty";

function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

function isNumericLike(value: string): boolean {
  return NUMERIC_PATTERN.test(value.trim());
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function normalizeDate(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  for (const { pattern, parse } of DATE_PATTERNS) {
    const match = raw.match(pattern);
    if (!match) continue;
    const parts = parse(match);
    if (!parts) continue;
    const [year, month, day] = parts;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  const named = raw.match(/^([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})$/);
  if (named) {
    const month = MONTHS[named[1].slice(0, 3).toLowerCase()];
    if (month) return `${named[3]}-${pad(month)}-${pad(Number(named[2]))}`;
  }

  return null;
}

export function titleCase(value: string): string {
  return value.toLowerCase().replace(/\b[\p{L}]/gu, (char) => char.toUpperCase());
}

export function detectColumnKind(values: readonly string[]): ColumnKind {
  const filled = values.map((value) => value.trim()).filter(Boolean);
  if (filled.length === 0) return "empty";

  const sample = filled.slice(0, 40);
  const emails = sample.filter(isEmail).length;
  if (emails / sample.length >= 0.7) return "email";

  const dates = sample.filter((value) => normalizeDate(value) !== null).length;
  if (dates / sample.length >= 0.7) return "date";

  const numbers = sample.filter(isNumericLike).length;
  if (numbers / sample.length >= 0.7) return "number";

  return "text";
}

function issue(
  kind: IssueKind,
  column: string,
  rowIndex: number,
  value: string,
  message: string,
  severity: DataIssue["severity"],
): DataIssue {
  return { id: `${kind}:${column}:${rowIndex}`, kind, column, rowIndex, value, message, severity };
}

export function analyzeDataset(dataset: Pick<ParsedDataset, "headers" | "rows">): DataIssue[] {
  const { headers, rows } = dataset;
  const issues: DataIssue[] = [];
  const seen = new Map<string, number>();

  const kinds = headers.map((_, columnIndex) => detectColumnKind(rows.map((row) => row[columnIndex] ?? "")));

  rows.forEach((row, rowIndex) => {
    const joined = row.map((cell) => cell.trim().toLowerCase()).join("¦");
    const duplicateOf = seen.get(joined);
    if (duplicateOf !== undefined) {
      issues.push(
        issue("duplicate", "—", rowIndex, joined, `Duplicate of row ${duplicateOf + 1}`, "warning"),
      );
    } else {
      seen.set(joined, rowIndex);
    }

    const isEmptyRow = row.every((cell) => cell.trim() === "");
    if (isEmptyRow) {
      issues.push(issue("missing", "—", rowIndex, "", "Empty row", "warning"));
    }

    headers.forEach((header, columnIndex) => {
      const value = row[columnIndex] ?? "";
      const kind = kinds[columnIndex];

      if (value.trim() === "") {
        issues.push(issue("missing", header, rowIndex, value, `Missing value in "${header}"`, "error"));
        return;
      }
      if (value !== value.trim() || /\s{2,}/.test(value)) {
        issues.push(
          issue("whitespace", header, rowIndex, value, `Unnormalized spacing in "${header}"`, "warning"),
        );
      }
      if (kind === "email" && !isEmail(value.trim())) {
        issues.push(issue("email", header, rowIndex, value, `"${value}" is not a valid email`, "error"));
      }
      if (kind === "email" && value !== value.toLowerCase()) {
        issues.push(issue("casing", header, rowIndex, value, `Email should be lowercase`, "warning"));
      }
      if (kind === "number" && !isNumericLike(value)) {
        issues.push(issue("number", header, rowIndex, value, `"${value}" is not numeric`, "error"));
      }
      if (kind === "date" && normalizeDate(value) === null) {
        issues.push(
          issue("date", header, rowIndex, value, `"${value}" could not be parsed as a date`, "error"),
        );
      }
    });
  });

  return issues;
}

function normalizeCell(value: string, kind: ColumnKind, header: string, rules: CleaningRules): string {
  let next = value;
  if (rules.trim) next = next.trim();
  if (rules.collapseSpaces) next = next.replace(/\s{2,}/g, " ");

  if (kind === "email" && rules.normalizeEmails) next = next.toLowerCase();
  if (kind === "date" && rules.standardizeDates) {
    const normalized = normalizeDate(next);
    if (normalized) next = normalized;
  }
  if (
    kind === "text" &&
    rules.titleCase &&
    /name|city|country|department|region|status|title|role/i.test(header) &&
    !/\d/.test(next)
  ) {
    next = titleCase(next);
  }

  return next;
}

export function applyCleaning(
  dataset: Pick<ParsedDataset, "headers" | "rows">,
  rules: CleaningRules,
): CleanOutcome {
  const { headers } = dataset;
  const kinds = headers.map((_, columnIndex) =>
    detectColumnKind(dataset.rows.map((row) => row[columnIndex] ?? "")),
  );

  let working = dataset.rows.map((row) => headers.map((_, columnIndex) => row[columnIndex] ?? ""));
  let emptyRemoved = 0;

  if (rules.dropEmptyRows) {
    const before = working.length;
    working = working.filter((row) => row.some((cell) => cell.trim() !== ""));
    emptyRemoved = before - working.length;
  }

  let cellsChanged = 0;
  working = working.map((row) =>
    row.map((cell, columnIndex) => {
      const next = normalizeCell(cell, kinds[columnIndex], headers[columnIndex], rules);
      if (next !== cell) cellsChanged += 1;
      return next;
    }),
  );

  let duplicatesRemoved = 0;
  if (rules.dropDuplicates) {
    const seen = new Set<string>();
    working = working.filter((row) => {
      const key = row.map((cell) => cell.trim().toLowerCase()).join("¦");
      if (seen.has(key)) {
        duplicatesRemoved += 1;
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  let filledCells = 0;
  if (rules.fillMissing) {
    working = working.map((row) =>
      row.map((cell, columnIndex) => {
        if (cell.trim() !== "") return cell;
        filledCells += 1;
        const kind = kinds[columnIndex];
        return kind === "number" ? "0" : kind === "date" ? "" : "N/A";
      }),
    );
  }

  const rows = working.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])),
  );

  const remaining = analyzeDataset({ headers, rows: working });

  return { rows, cellsChanged, duplicatesRemoved, emptyRemoved, filledCells, remaining };
}

export const SAMPLE_CSV = `Name,Email,Department,Join Date,Revenue
  amelia carter  ,AMELIA.CARTER@Example.com,Sales,03/14/2023,"$12,400.00"
Noah Nakamura,noah.nakamura@example.com,Engineering,2022-11-02,"$48,120.50"
,missing.person@example.com,Support,05/09/2021,"$9,800.00"
sofia  silva,Sofia.Silva@Example.com,marketing,Jan 5 2024,"$33,900.00"
sofia  silva,Sofia.Silva@Example.com,marketing,Jan 5 2024,"$33,900.00"
Liam  Okafor,liam.okafor@example.com,Finance,12-01-2020,"$71,250.00"
Zara Hansen,zara.hansen@example.com,Engineering,2023-07-19,"$56,780.00"
Ethan Rossi,,Operations,02/28/2022,"$21,450.75"
Maya  Kowalski,MAYA.KOWALSKI@example.com,Sales,9/1/2021,"$18,990.00"

Oliver Meyer,oliver.meyer@example.com,Support,2024-01-15,"$7,600.00"
Elena Dubois,elena.dubois@@example.com,Marketing,06/22/2023,"$29,300.00"`.trim();
