import { GlassCard } from "../ui";

export function BarChart() {
  const values = [45, 68, 38, 84, 60, 92, 74];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return <GlassCard className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold tracking-tight text-white">Weekly Commits</h3><p className="mt-1 text-xs text-slate-500">Contributions across active repos</p></div><span className="rounded-lg border border-white/[.07] bg-white/[.04] px-2 py-0.5 text-[11px] font-medium text-emerald-300">92 peak</span></div><div className="mt-6 flex h-40 items-end justify-between gap-2.5 sm:gap-3">{values.map((value, index) => { const isPeak = value === Math.max(...values); return <div key={index} className="group flex h-full flex-1 flex-col items-end justify-end gap-2"><div className={`w-full rounded-lg transition-all duration-300 group-hover:brightness-125 ${isPeak ? "bg-gradient-to-t from-emerald-500/70 to-teal-300" : "bg-gradient-to-t from-white/10 to-white/20 hover:from-emerald-500/40 hover:to-emerald-300"}`} style={{ height: `${value}%` }} /><span className={`text-center text-[10px] transition-colors ${isPeak ? "font-semibold text-emerald-300" : "text-slate-600"}`}>{days[index]}</span></div>; })}</div></GlassCard>;
}
