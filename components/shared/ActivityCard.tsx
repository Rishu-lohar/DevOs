import { Bot, GitBranch, FolderKanban, UsersRound } from "lucide-react";
import { activities } from "@/lib/mock-data";
import { GlassCard } from "../ui";

const typeConfig = { commit: { icon: GitBranch, color: "text-sky-300 border-sky-500/20 bg-sky-500/10" }, project: { icon: FolderKanban, color: "text-violet-300 border-violet-500/20 bg-violet-500/10" }, ai: { icon: Bot, color: "text-pink-300 border-pink-500/20 bg-pink-500/10" }, team: { icon: UsersRound, color: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10" } };

export function ActivityCard() {
  return <GlassCard className="divide-y divide-white/[.06]">{activities.map((activity) => { const config = typeConfig[activity.type as keyof typeof typeConfig] || typeConfig.commit; const Icon = config.icon; return <div key={activity.title} className="flex items-center gap-3.5 p-4 transition-colors hover:bg-white/[.02]"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.color}`}><Icon size={16} strokeWidth={1.8} /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{activity.title}</p><p className="truncate text-[11px] text-slate-500">{activity.detail}</p></div><span className="shrink-0 rounded-full border border-white/[.06] bg-white/[.02] px-2 py-0.5 text-[10px] text-slate-600">{activity.time}</span></div>; })}</GlassCard>;
}
