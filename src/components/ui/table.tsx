import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className={cn("w-full min-w-[720px] border-collapse text-left text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-panel-2/70 text-ink-3", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-line", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("transition-colors hover:bg-panel-2/60", className)} {...props} />;
}

export function TableHeader({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn("px-4 py-2.5 text-xs font-semibold uppercase tracking-wide", className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle text-ink-2", className)} {...props} />;
}
