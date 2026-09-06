import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: string;
  "data-testid"?: string;
};

export function StatCard({
  label,
  value,
  trend,
  positive = true,
  icon: Icon,
  accent = "text-[#A78BFA]",
  "data-testid": testId,
}: StatCardProps) {
  return (
    <div
      data-testid={testId || `stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="group rounded-[16px] border border-[#232326] bg-[#111113] p-5 sm:p-6 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#232326] bg-[#18181B] text-xs ${accent}`}
        >
          <Icon size={16} strokeWidth={1.75} />
        </div>
        <button
          aria-label="More options"
          className="rounded-[6px] p-1 text-[#52525B] transition-colors duration-150 hover:bg-[#18181B] hover:text-[#A1A1AA]"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-[#71717A]">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-[#FAFAFA] sm:text-3xl">{value}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
            positive
              ? "border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] text-[#86EFAC]"
              : "border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] text-[#FECDD3]"
          }`}
        >
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {trend}
        </span>
      </div>
    </div>
  );
}
