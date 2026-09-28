import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-panel-2 text-ink-2 border-line",
  brand:
    "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/40 dark:text-brand-300 dark:border-brand-800",
  success: "bg-success-100 text-success-600 border-transparent dark:bg-success-500/15 dark:text-success-500",
  warning: "bg-warning-100 text-warning-600 border-transparent dark:bg-warning-500/15 dark:text-warning-500",
  danger: "bg-danger-100 text-danger-600 border-transparent dark:bg-danger-500/15 dark:text-danger-500",
  info: "bg-info-100 text-info-500 border-transparent dark:bg-info-500/15 dark:text-info-500",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
