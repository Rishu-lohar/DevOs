"use client";

import { Sparkles, Terminal, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ComingSoon({
  title,
  "data-testid": testId,
}: {
  title: string;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={testId || "coming-soon-module"} className="mx-auto max-w-4xl py-6 sm:py-10">
      <div className="rounded-[16px] border border-[#232326] bg-[#111113] p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[12px] border border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] text-[#C4B5FD]">
          <Sparkles size={24} />
        </div>

        <div className="mt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] px-3 py-1 text-[11px] font-medium text-[#C4B5FD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
            <span>DevOS Engineering Suite · Next Generation</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#71717A]">
            This module is being fine-tuned with autonomous AI agents, real-time telemetry, and seamless developer ecosystem integrations.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          <div className="rounded-[12px] border border-[#232326] bg-[#18181B] p-4">
            <Zap size={16} className="mb-2 text-[#FBBF24]" />
            <p className="text-xs font-semibold text-[#FAFAFA]">Sub-millisecond Sync</p>
            <p className="mt-1 text-[11px] text-[#71717A]">Real-time local state streaming across team environments.</p>
          </div>
          <div className="rounded-[12px] border border-[#232326] bg-[#18181B] p-4">
            <Activity size={16} className="mb-2 text-[#4ADE80]" />
            <p className="text-xs font-semibold text-[#FAFAFA]">Neural Telemetry</p>
            <p className="mt-1 text-[11px] text-[#71717A]">Contextual code recommendations and proactive diagnostics.</p>
          </div>
          <div className="rounded-[12px] border border-[#232326] bg-[#18181B] p-4">
            <ShieldCheck size={16} className="mb-2 text-[#C4B5FD]" />
            <p className="text-xs font-semibold text-[#FAFAFA]">Zero-trust Security</p>
            <p className="mt-1 text-[11px] text-[#71717A]">Client-side encryption for repos, tokens, and workspaces.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="md"
            data-testid="request-beta-button"
            icon={<Terminal size={14} />}
          >
            Request Early Beta Access
          </Button>
          <Link href="/dashboard">
            <Button
              variant="secondary"
              size="md"
              data-testid="return-dashboard-button"
              icon={<ArrowRight size={14} />}
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#52525B]">
          Secured with 256-bit AES encryption · SOC2 Type II Certified
        </p>
      </div>
    </div>
  );
}
