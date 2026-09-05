import Link from "next/link";
import { Calendar, Lock, ShieldCheck, Sparkles, Star } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#09090b] text-slate-100 selection:bg-violet-500/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 devos-grid opacity-40" />
      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[1.12fr_0.88fr]">
        <div className="flex flex-col justify-between px-6 py-8 sm:px-12 sm:py-10 lg:px-20 xl:px-28">
          <Link href="/" className="group inline-flex w-fit items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 shadow-[0_0_20px_rgba(139,92,246,.28)] transition-transform group-hover:scale-105">
              <Sparkles size={14} className="text-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">devos<span className="text-rose-400">.ai</span></span>
          </Link>

          <div className="my-10 w-full max-w-[440px]">{children}</div>

          <div className="space-y-4 pt-6 text-[10px]">
            <div className="flex items-center gap-2 font-medium tracking-[0.13em] text-emerald-400/85">
              <Lock size={12} />
              <span>SECURED BY 256-BIT AES AND 256-BIT SSL/TLS ENCRYPTION</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#ff5a43] text-[9px] font-extrabold text-white">G</span>
                <span className="font-semibold text-white">4.8 / 5</span>
                <span className="flex text-amber-400">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={10} fill="currentColor" />)}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5"><ShieldCheck size={12} /><span>GDPR, SOC2, + MORE</span></div>
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden border-l border-white/[0.06] bg-[#0d0e12] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-35 devos-grid" />
          <div className="relative mx-auto mt-4 w-full max-w-[420px]">
            <div className="glass-card overflow-hidden rounded-xl border-white/[0.08] bg-[#18181c]/90 shadow-[0_28px_80px_rgba(0,0,0,.55)]">
              <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border border-violet-500/25 bg-violet-500/10 text-violet-300"><Calendar size={12} /></div>
                <div><p className="text-[10px] font-medium text-white">Product Team Sync</p><p className="text-[9px] text-slate-500">Feb 24 · 09:00 AM - 09:45 AM</p></div>
              </div>
              <div className="px-4 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Meeting Summary</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[8px] font-medium">
                  <span className="fireflies-tag-purple rounded px-1.5 py-0.5">Fireflies</span><span className="fireflies-tag-emerald rounded px-1.5 py-0.5">AI notetaker</span><span className="fireflies-tag-amber rounded px-1.5 py-0.5">Meetings</span><span className="fireflies-tag-blue rounded px-1.5 py-0.5">Horizontal approach</span><span className="fireflies-tag-rose rounded px-1.5 py-0.5">Product-led growth</span>
                </div>
                <p className="mt-3 text-[10px] leading-relaxed text-slate-400">In the meeting, Matt and Krish discuss the growth of Fireflies, an AI notetaker that transcribes, analyzes, and captures engineering conversations...</p>
                <div className="mt-4 border-t border-white/[0.06] pt-3"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Outline</p><p className="mt-2 text-[10px] text-slate-200">1. Introduction <span className="font-mono text-violet-300 underline">04:48 - 10:32</span></p><p className="mt-1.5 pl-3 text-[9px] leading-relaxed text-slate-500">• Matt acknowledges Fireflies AI and its rapid velocity growth<br />• Krish invited to share the origin story of Fireflies architecture</p></div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[420px] border-t border-white/[0.06] pt-5">
            <p className="text-xs font-bold text-white">▲ Vercel</p>
            <blockquote className="mt-3 max-w-sm text-xs leading-relaxed text-slate-300">“Fireflies keeps me 100% present in meetings without losing any of the details.”</blockquote>
            <div className="mt-4 flex items-center gap-2.5"><div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-violet-500 to-pink-500 text-[9px] font-semibold">SB</div><div><p className="text-[10px] font-semibold text-white">Sarup Banskota</p><p className="text-[9px] text-slate-500">Head of Growth</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
