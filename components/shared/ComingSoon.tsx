"use client";

import { Sparkles, Terminal, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-4xl py-6 sm:py-12">
      <GlassCard className="relative overflow-hidden p-8 text-center border-white/[.1] sm:p-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-indigo-600/10 blur-2xl" />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/[.08] text-violet-300">
          <Sparkles size={26} className="animate-pulse" />
        </div>

        <div className="relative mt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-500/12 px-3 py-1 text-[11px] font-medium text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
            <span>DevOS Engineering Suite · Next Generation</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            This module is being fine-tuned with autonomous AI agents, real-time telemetry, and seamless developer ecosystem integrations.
          </p>
        </div>

        <div className="relative mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[.07] bg-white/[.03] p-4 backdrop-blur-md">
            <Zap size={18} className="mb-2 text-amber-300" />
            <p className="text-xs font-semibold text-white">Sub-millisecond Sync</p>
            <p className="mt-1 text-[11px] text-slate-500">Real-time local state streaming across team environments.</p>
          </div>
          <div className="rounded-2xl border border-white/[.07] bg-white/[.03] p-4 backdrop-blur-md">
            <Activity size={18} className="mb-2 text-emerald-300" />
            <p className="text-xs font-semibold text-white">Neural Telemetry</p>
            <p className="mt-1 text-[11px] text-slate-500">Contextual code recommendations and proactive diagnostics.</p>
          </div>
          <div className="rounded-2xl border border-white/[.07] bg-white/[.03] p-4 backdrop-blur-md">
            <ShieldCheck size={18} className="mb-2 text-violet-300" />
            <p className="text-xs font-semibold text-white">Zero-trust Security</p>
            <p className="mt-1 text-[11px] text-slate-500">Client-side encryption for repos, tokens, and workspaces.</p>
          </div>
        </div>

        <div className="relative mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Button variant="primary" size="md" icon={<Terminal size={15} />}>Request Early Beta Access</Button>
          <Link href="/dashboard">
            <Button variant="secondary" size="md" icon={<ArrowRight size={15} />}>Return to Dashboard</Button>
          </Link>
        </div>

        <p className="relative mt-8 text-xs text-slate-700">Secured with 256-bit AES encryption · SOC2 Type II Certified</p>
      </GlassCard>
    </div>
  );
}
