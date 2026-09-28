import { downloadFile, timestampSlug } from "./download";

export interface PdfTableInput {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: string[][];
  fileName?: string;
}

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const MARGIN = 40;
const ROW_HEIGHT = 16;
const FONT_SIZE = 9;

function sanitize(text: string): string {
  return text
    .replace(/€/g, "EUR ")
    .replace(/£/g, "GBP ")
    .replace(/¥/g, "JPY ")
    .replace(/[^\x20-\x7E]/g, "?");
}

function escapePdfText(text: string): string {
  return sanitize(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildContentStream(columns: string[], rows: string[][], chunkStart: number): string {
  const usableWidth = PAGE_WIDTH - MARGIN * 2;
  const colWidth = usableWidth / Math.max(columns.length, 1);
  const commands: string[] = [];

  const drawRow = (cells: string[], y: number, bold: boolean) => {
    commands.push("BT", `/F1 ${bold ? FONT_SIZE + 1 : FONT_SIZE} Tf`, `1 0 0 1 ${MARGIN} ${y} Tm`);
    cells.forEach((cell, index) => {
      const clipped = cell.length > 34 ? `${cell.slice(0, 31)}...` : cell;
      commands.push(
        `0 0 0 rg`,
        `1 0 0 1 ${MARGIN + index * colWidth} ${y} Tm`,
        `(${escapePdfText(clipped)}) Tj`,
      );
    });
    commands.push("ET");
  };

  let y = PAGE_HEIGHT - MARGIN - 34;
  drawRow(columns, y, true);
  commands.push(`0.75 w 0.2 0.3 0.7 RG`, `${MARGIN} ${y - 4} m ${PAGE_WIDTH - MARGIN} ${y - 4} l S`);
  y -= ROW_HEIGHT + 4;

  const slice = rows.slice(chunkStart, chunkStart + 30);
  for (const row of slice) {
    drawRow(row, y, false);
    y -= ROW_HEIGHT;
  }

  return commands.join("\n");
}

function buildPdf(input: PdfTableInput): string {
  const { columns, rows } = input;
  const chunks: number[] = [];
  for (let start = 0; start < Math.max(rows.length, 1); start += 30) chunks.push(start);

  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const pageCount = Math.max(chunks.length, 1);
  const pagesObjectId = 2;
  const fontObjectId = 3;
  const firstPageObjectId = 4;

  for (let index = 0; index < pageCount; index += 1) {
    const contentObjectId = firstPageObjectId + index * 2 + 1;
    pageObjectIds.push(firstPageObjectId + index * 2);

    const stream = chunks.length
      ? buildContentStream(columns, rows, chunks[index])
      : "BT /F1 11 Tf 40 500 Tm (No data available.) Tj ET";

    objects[contentObjectId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[firstPageObjectId + index * 2] =
      `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
  }

  objects[1] = `<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`;
  objects[pagesObjectId] =
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`;
  objects[fontObjectId] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${String(offsets[id] ?? 0).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdf;
}

export function exportTableToPdf(input: PdfTableInput): void {
  const pdf = buildPdf(input);
  const fileName =
    input.fileName ?? `${input.title.toLowerCase().replace(/\s+/g, "-")}-${timestampSlug()}.pdf`;
  downloadFile(pdf, fileName, "application/pdf");
}
