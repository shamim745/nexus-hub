const MS = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
} as const;

export function formatDate(value: string | number | Date, locale = "en-US"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function formatDateTime(value: string | number | Date, locale = "en-US"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function relativeTime(value: string | number | Date, now: Date = new Date()): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const diff = date.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < MS.minute) return formatter.format(Math.round(diff / MS.second), "second");
  if (abs < MS.hour) return formatter.format(Math.round(diff / MS.minute), "minute");
  if (abs < MS.day) return formatter.format(Math.round(diff / MS.hour), "hour");
  if (abs < 30 * MS.day) return formatter.format(Math.round(diff / MS.day), "day");
  if (abs < 365 * MS.day) return formatter.format(Math.round(diff / (30 * MS.day)), "month");
  return formatter.format(Math.round(diff / (365 * MS.day)), "year");
}

export function toInputDate(value: string | number | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function startOfDay(value: Date = new Date()): Date {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}
