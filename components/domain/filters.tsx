"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
  className,
  testId = "search-field",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
      <input
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-7 w-full rounded-md border border-border bg-surface pl-8 pr-2.5 text-[12px] text-text-primary outline-none transition-colors duration-[140ms] placeholder:text-text-muted hover:border-border-strong focus:border-accent"
      />
    </div>
  );
}

export function FilterMenu({
  label,
  options,
  value,
  onChange,
  testId,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  testId?: string;
}) {
  const active = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          data-testid={testId ?? `filter-${label.toLowerCase()}`}
        >
          <SlidersHorizontal className="h-3 w-3" />
          {active && active.value !== "all" ? active.label : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((o) => (
          <DropdownMenuItem
            key={o.value}
            data-testid={`filter-option-${o.value}`}
            onClick={() => onChange(o.value)}
            className={o.value === value ? "text-text-primary" : ""}
          >
            {o.label}
            {o.value === value && <span className="ml-auto text-accent">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
