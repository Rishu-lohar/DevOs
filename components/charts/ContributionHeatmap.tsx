import { GlassCard } from "../ui";
import { contributionData } from "@/lib/mock-data";
import { GitCommit, Sparkles } from "lucide-react";

export function ContributionHeatmap() {
  const levelColors = [
    "bg-white/[0.04] border-white/[0.04]",
    "bg-emerald-950/70 border-emerald-800/30",
    "bg-emerald-800/80 border-emerald-600/40",
    "bg-emerald-500 border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.35)]",
    "bg-emerald-300 border-white/60 shadow-[0_0_12px_rgba(110,231,183,0.7)]",
  ];

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-white">Contribution Velocity</h3>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <Sparkles size={12} />
              156 this year
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">GitHub push & PR momentum</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-violet-300 transition-colors hover:text-white">
          <GitCommit size={14} />
          <span>View commit graph →</span>
        </button>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
          {contributionData.map((level, index) => (
            <div
              key={index}
              title={`${level} contributions`}
              className={`h-3 w-3 rounded-[3px] border transition-transform hover:scale-125 ${levelColors[level]}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate-500">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {levelColors.map((color, idx) => (
            <span key={idx} className={`h-2.5 w-2.5 rounded-[2px] border ${color}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </GlassCard>
  );
}
