const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BDT: "৳",
  JPY: "¥",
};

export function formatCurrency(
  amount: number,
  options: { currency?: string; locale?: string; compact?: boolean; decimals?: number } = {},
): string {
  const { currency = "USD", locale = "en-US", compact = false, decimals } = options;
  const value = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: decimals ?? (compact ? 1 : 2),
    minimumFractionDigits: decimals ?? 0,
  }).format(value);
}

export function parseCurrency(input: string, currency = "USD"): number {
  if (typeof input === "number") return input;
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";
  const normalized = input
    .replace(new RegExp(`\\${symbol}`, "g"), "")
    .replace(/[^\d.,-]/g, "")
    .trim();

  const cleaned = normalized.includes(",")
    ? normalized.replace(/\.(?=\d{3}\b)/g, "").replace(/,/g, ".")
    : normalized.replace(/,/g, "");

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPercent(value: number, decimals = 1): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe > 0 ? "+" : ""}${safe.toFixed(decimals)}%`;
}

export function compactNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    Number.isFinite(value) ? value : 0,
  );
}
