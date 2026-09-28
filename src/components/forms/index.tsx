"use client";

import type { FormEvent, ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui";

export function Form({
  onSubmit,
  children,
  className,
  busy = false,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
  busy?: boolean;
}) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) onSubmit(event);
      }}
      className={className}
    >
      {children}
    </form>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  autoFocus = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
      <Input
        type="search"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="pl-9 pr-8 [&::-webkit-search-cancel-button]:hidden"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-3 hover:text-ink"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
