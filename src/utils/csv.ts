export interface CsvColumn<T> {
  key: string;
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
  delimiter: string;
  error?: string;
}

function detectDelimiter(sample: string): string {
  const firstLine = sample.split(/\r?\n/, 1)[0] ?? "";
  const candidates = [",", ";", "\t", "|"];
  let best = ",";
  let bestCount = 0;

  for (const candidate of candidates) {
    const count = firstLine.split(candidate).length - 1;
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }

  return best;
}

function escapeCsvValue(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function toCsv<T>(rows: readonly T[], columns: readonly CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCsvValue(column.header)).join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsvValue(column.value(row))).join(","));
  return [header, ...body].join("\r\n");
}

export function parseCsv(input: string, delimiter?: string): ParsedCsv {
  const source = input.replace(/^\uFEFF/, "").trim();
  if (!source) return { headers: [], rows: [], delimiter: ",", error: "No CSV content found." };

  const activeDelimiter = delimiter ?? detectDelimiter(source);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];

    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === activeDelimiter) {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n" || char === "\r") {
      if (char === "\r" && source[i + 1] === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  rows.push(row);

  if (inQuotes) {
    return { headers: [], rows: [], delimiter: activeDelimiter, error: "Malformed CSV: unclosed quote." };
  }

  const [headers = [], ...body] = rows;
  const columnCount = headers.length;
  const normalized = body
    .filter((cells) => cells.some((cell) => cell.trim() !== ""))
    .map((cells) => {
      if (cells.length === columnCount) return cells;
      const padded = [...cells];
      while (padded.length < columnCount) padded.push("");
      return padded.slice(0, columnCount);
    });

  return { headers, rows: normalized, delimiter: activeDelimiter };
}
