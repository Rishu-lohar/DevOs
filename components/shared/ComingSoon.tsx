"use client";

import { Sparkles, Terminal, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-4xl py-6 sm:py-12">
      <GlassCard className="relative overflow-hidden p-8 sm:p-14 text-center border-white/[0.12]">
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-indigo-600/15 blur-2xl" />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-300 shadow-[0_0_35px_rgba(139,92,246,0.3)]">
          <Sparkles size={28} className="animate-pulse" />
        </div>

        <div className="relative mt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-[11px] font-medium text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
            <span>DevOS Engineering Suite · Next Generation</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            This module is being fine-tuned with autonomous AI agents, real-time telemetry, and seamless developer ecosystem integrations.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="relative mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md">
            <Zap size={18} className="text-amber-400 mb-2" />
            <p className="text-xs font-semibold text-white">Sub-millisecond Sync</p>
            <p className="mt-1 text-[11px] text-slate-400">Real-time local state streaming across team environments.</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md">
            <Activity size={18} className="text-emerald-400 mb-2" />
            <p className="text-xs font-semibold text-white">Neural Telemetry</p>
            <p className="mt-1 text-[11px] text-slate-400">Contextual code recommendations and proactive diagnostics.</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md">
            <ShieldCheck size={18} className="text-violet-400 mb-2" />
            <p className="text-xs font-semibold text-white">Zero-trust Security</p>
            <p className="mt-1 text-[11px] text-slate-400">Client-side encryption for repos, tokens, and workspaces.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button variant="primary" size="md" icon={<Terminal size={15} />}>
            Request Early Beta Access
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" size="md" icon={<ArrowRight size={15} />}>
              Return to Dashboard
            </Button>
          </Link>
        </div>

        <p className="relative mt-8 text-xs text-slate-600">
          Secured with 256-bit AES encryption · SOC2 Type II Certified
        </p>
      </GlassCard>
    </div>
  );
}
