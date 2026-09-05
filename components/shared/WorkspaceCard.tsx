import { ArrowRight, Sparkles, Cpu } from "lucide-react";
import { GlassCard, Progress } from "../ui";
import Link from "next/link";

export function WorkspaceCard() {
  return (
    <GlassCard className="group relative overflow-hidden p-6 sm:p-7 border-white/[0.12] hover:border-violet-500/40 transition-all duration-300">
      {/* Dynamic ambient radial lighting */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl transition duration-500 group-hover:bg-violet-500/30" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-indigo-600/15 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-medium text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <Sparkles size={12} className="text-violet-300" />
            <span>Active AI Workspace</span>
          </div>
          <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
            DevConnect Mobile App
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Intelligent mobile companion for asynchronous developer peer reviews.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-slate-300">
              React Native
            </span>
            <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-slate-300">
              Firebase Auth
            </span>
            <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-slate-300">
              TypeScript
            </span>
          </div>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
          <Cpu size={24} />
        </div>
      </div>

      <div className="relative mt-7">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Sprint Completion</span>
          <span className="font-semibold text-violet-300">60%</span>
        </div>
        <div className="mt-2.5">
          <Progress value={60} color="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
        </div>
      </div>

      <div className="relative mt-7 flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span className="text-xs text-slate-500">Last synchronized 12 mins ago</span>
        <Link
          href="/workspace"
          className="group/btn inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/15 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all hover:bg-violet-500/25 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          <span>Resume Workspace</span>
          <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </GlassCard>
  );
}
