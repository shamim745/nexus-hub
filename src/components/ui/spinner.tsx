import { cn } from "@/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin text-current", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M10 2a10 10 0 0 1 12 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse-soft rounded-md bg-panel-2", className)} aria-hidden="true" />;
}

export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton key={colIndex} className={cn("h-4 flex-1", colIndex === 0 && "max-w-32")} />
          ))}
        </div>
      ))}
    </div>
  );
}
