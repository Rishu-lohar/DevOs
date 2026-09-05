import { GlassCard } from "../ui";
import { chartData } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

export function AreaChart() {
  const points = chartData.map((value, index) => `${index * 9},${100 - value}`).join(" ");

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-white">Productivity Velocity</h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              <TrendingUp size={11} />
              +28.4%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Velocity trajectory across the last 12 engineering sprints</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          <span>Output Rate</span>
        </div>
      </div>

      <div className="relative h-44 w-full">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-white/30 w-full" />
          <div className="border-b border-dashed border-white/30 w-full" />
          <div className="border-b border-dashed border-white/30 w-full" />
          <div className="border-b border-dashed border-white/30 w-full" />
        </div>

        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#8b5cf6" floodOpacity="0.8" />
            </filter>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#areaGradient)" />
          <polyline
            points={points}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
            filter="url(#glow)"
          />
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-500">
        <span>Week 1</span>
        <span>Week 4</span>
        <span>Week 8</span>
        <span>Week 12</span>
      </div>
    </GlassCard>
  );
}