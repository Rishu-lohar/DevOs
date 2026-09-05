import { GlassCard } from "../ui";

const segments = [
  { dot: "bg-violet-400", label: "Completed", value: "60%" },
  { dot: "bg-emerald-400", label: "In Progress", value: "21%" },
  { dot: "bg-amber-400", label: "To Do", value: "13%" },
  { dot: "bg-rose-400", label: "Blocked", value: "6%" },
];

export function PieChart() {
  return <GlassCard className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold tracking-tight text-white">Task Distribution</h3><p className="mt-1 text-xs text-slate-500">Current sprint allocation</p></div><span className="rounded-lg border border-white/[.07] bg-white/[.04] px-2 py-0.5 text-[11px] text-slate-400">38 Total</span></div><div className="mt-6 flex flex-col items-center justify-between gap-6 sm:flex-row"><div className="relative h-32 w-32 shrink-0 rounded-full p-2"><div className="h-full w-full rounded-full" style={{ background: "conic-gradient(#a78bfa 0% 60%, #34d399 60% 81%, #fbbf24 81% 94%, #fb7185 94% 100%)" }} /><div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-white/[.07] bg-[#111115] text-center"><span className="text-lg font-bold leading-none text-white">38</span><span className="mt-0.5 text-[10px] font-medium text-slate-500">Tasks</span></div></div><div className="w-full space-y-2.5 text-xs text-slate-300">{segments.map((segment) => <div key={segment.label} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${segment.dot}`} /><span>{segment.label}</span></span><span className="font-semibold text-white">{segment.value}</span></div>)}</div></div></GlassCard>;
}
