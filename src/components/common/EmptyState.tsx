import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${compact ? "px-4 py-10" : "px-6 py-16"}`}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-panel-2 text-ink-3">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 max-w-sm text-xs text-ink-3">{description}</p>
      </div>
      {action}
    </div>
  );
}
