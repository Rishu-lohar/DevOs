import { GlassCard } from "../ui";

export function PieChart() {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white">Task Distribution</h3>
          <p className="mt-1 text-xs text-slate-400">Current sprint allocation</p>
        </div>
        <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400">
          38 Total
        </span>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative h-32 w-32 shrink-0 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.15)] p-2">
          {/* Conic donut */}
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "conic-gradient(#8b5cf6 0% 60%, #10b981 60% 81%, #f59e0b 81% 94%, #f43f5e 94% 100%)",
            }}
          />
          {/* Inner cutout for donut hole */}
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[#0c1018] text-center shadow-inner">
            <span className="text-lg font-bold text-white leading-none">38</span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Tasks</span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300 w-full">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
              <span>Completed</span>
            </span>
            <span className="font-semibold text-white">60%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              <span>In Progress</span>
            </span>
            <span className="font-semibold text-white">21%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span>To Do</span>
            </span>
            <span className="font-semibold text-white">13%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
              <span>Blocked</span>
            </span>
            <span className="font-semibold text-white">6%</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}