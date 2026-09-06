import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority, ProjectHealth, TaskStatus } from "@/lib/types";

export function StatCard({
  label,
  value,
  delta,
  trend,
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  hint?: string;
  className?: string;
}) {
  return (
    <div
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "rounded-xl border border-border bg-card px-4 py-3 transition-colors duration-[140ms] hover:border-border-strong",
        className,
      )}
    >
      <p className="text-[12px] text-text-muted">{label}</p>
      <div className="mt-1.5 flex items-end gap-2">
        <span className="text-[22px] font-semibold leading-none tracking-[-0.02em] text-text-primary">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "flex items-center gap-0.5 pb-0.5 text-[11px] font-medium",
              trend === "down" ? "text-danger" : "text-success",
            )}
          >
            {trend === "down" ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <ArrowUpRight className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-text-muted">{hint}</p>}
    </div>
  );
}

const statusMap: Record<TaskStatus, { label: string; dot: string; variant: "default" | "accent" | "success" | "warning" | "danger" }> = {
  todo: { label: "To Do", dot: "bg-text-muted", variant: "default" },
  "in-progress": { label: "In Progress", dot: "bg-accent", variant: "accent" },
  review: { label: "In Review", dot: "bg-warning", variant: "warning" },
  done: { label: "Done", dot: "bg-success", variant: "success" },
  blocked: { label: "Blocked", dot: "bg-danger", variant: "danger" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const s = statusMap[status];
  return (
    <Badge variant={s.variant} data-testid={`status-${status}`}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </Badge>
  );
}

const priorityMap: Record<Priority, { label: string; className: string }> = {
  urgent: { label: "Urgent", className: "text-danger" },
  high: { label: "High", className: "text-warning" },
  medium: { label: "Medium", className: "text-accent" },
  low: { label: "Low", className: "text-text-muted" },
};

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const p = priorityMap[priority];
  const bars = { urgent: 4, high: 3, medium: 2, low: 1 }[priority];
  return (
    <span
      title={`${p.label} priority`}
      data-testid={`priority-${priority}`}
      className={cn("inline-flex items-end gap-[2px]", p.className)}
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "w-[2px] rounded-full",
            i <= bars ? "bg-current" : "bg-border-strong",
          )}
          style={{ height: `${3 + i * 2}px` }}
        />
      ))}
    </span>
  );
}

export function HealthBadge({ health }: { health: ProjectHealth }) {
  const map = {
    "on-track": { label: "On track", variant: "success" as const },
    "at-risk": { label: "At risk", variant: "warning" as const },
    "off-track": { label: "Off track", variant: "danger" as const },
  };
  const h = map[health];
  return <Badge variant={h.variant}>{h.label}</Badge>;
}

export function LanguageDot({ language }: { language: string }) {
  const colors: Record<string, string> = {
    TypeScript: "bg-accent",
    JavaScript: "bg-warning",
    Python: "bg-success",
    Go: "bg-accent",
    Rust: "bg-danger",
    CSS: "bg-accent",
    MDX: "bg-text-muted",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
      <span
        className={cn("h-2 w-2 rounded-full", colors[language] ?? "bg-text-muted")}
      />
      {language}
    </span>
  );
}

export function MetricRow({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[132px] shrink-0 truncate text-[12px] text-text-secondary">
        {label}
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-active">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-[12px] font-medium text-text-primary">
        {value}
        {suffix ?? "%"}
      </span>
    </div>
  );
}
