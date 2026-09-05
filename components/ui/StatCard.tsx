import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { GlassCard } from "./GlassCard";

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: string;
};

export function StatCard({
  label,
  value,
  trend,
  positive = true,
  icon: Icon,
  accent = "text-violet-300",
}: StatCardProps) {
  return (
    <GlassCard className="group p-5 transition-all duration-300 hover:border-white/20">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105 ${accent}`}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <button
          aria-label="More options"
          className="rounded-lg p-1 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {value}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${
            positive
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      </div>
    </GlassCard>
  );
}
