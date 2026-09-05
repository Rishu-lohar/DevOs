import Link from "next/link";
import { Lock, Star, Calendar, Sparkles } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full bg-[#06080d] text-slate-100 selection:bg-violet-500/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-[40rem] w-[40rem] rounded-full bg-violet-600/10 blur-[128px]" />
        <div className="absolute right-0 top-1/4 h-[45rem] w-[45rem] rounded-full bg-indigo-600/8 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[35rem] w-[35rem] rounded-full bg-purple-600/10 blur-[120px]" />
        {/* Engineering mesh grid */}
        <div className="absolute inset-0 devos-grid opacity-70" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[1.1fr_1fr]">
        {/* Left Column: Brand, Auth Form & Compliance Footer */}
        <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-20 xl:px-24">
          <div>
            {/* Logo matching Fireflies.ai style */}
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-transform group-hover:scale-105">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors">
                devos<span className="text-rose-400">.ai</span>
              </span>
            </Link>
          </div>

          {/* Dynamic Content (Login / Signup Forms) */}
          <div className="my-8 max-w-lg w-full">
            {children}
          </div>

          {/* Security & Compliance Footer (Exact match to screenshot) */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-emerald-400">
              <Lock size={13} className="text-emerald-400" />
              <span>SECURED BY 256-BIT AES AND 256-BIT SSL/TLS ENCRYPTION</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5a43] text-[10px] font-extrabold text-white">
                  G
                </div>
                <span className="font-semibold text-white">4.8 / 5</span>
                <div className="flex text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock size={12} className="text-slate-500" />
                <span>GDPR, SOC2, + MORE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Preview Card & Testimonial (Matching screenshot) */}
        <div className="relative hidden lg:flex flex-col justify-between border-l border-white/[0.06] bg-[#080b12]/60 p-12 xl:p-16 backdrop-blur-2xl overflow-hidden">
          {/* Subtle top spotlight */}
          <div className="pointer-events-none absolute -top-24 right-10 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-20 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Floating preview card */}
          <div className="relative mx-auto w-full max-w-lg mt-4">
            <div className="glass-card relative overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0f1420]/90 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
              {/* Top rim highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Card Header: Product Team Sync */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-violet-300 shadow-sm">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-white">
                    Product Team Sync
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Feb 24 · 09:00 AM - 09:45 AM
                  </p>
                </div>
              </div>

              {/* Meeting Summary Title */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Meeting Summary
                </p>

                {/* Color-coded tags (matching screenshot colors) */}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
                  <span className="rounded-md border border-violet-500/40 bg-violet-950/60 px-2.5 py-1 text-violet-300">
                    Fireflies
                  </span>
                  <span className="rounded-md border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-emerald-300">
                    AI notetaker
                  </span>
                  <span className="rounded-md border border-amber-500/40 bg-amber-950/60 px-2.5 py-1 text-amber-300">
                    Meetings
                  </span>
                  <span className="rounded-md border border-blue-500/40 bg-blue-950/60 px-2.5 py-1 text-blue-300">
                    Horizontal approach
                  </span>
                  <span className="rounded-md border border-pink-500/40 bg-pink-950/60 px-2.5 py-1 text-pink-300">
                    Product-led growth
                  </span>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  In the meeting, Matt and Krish discuss the growth of Fireflies, an AI notetaker that transcribes, analyzes, and captures engineering conversations...
                </p>
              </div>

              {/* Outline Section */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Outline
                </p>
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <p className="text-slate-200 font-medium">
                      1. Introduction <span className="font-mono text-[11px] text-violet-400 underline decoration-violet-400/40">04:48 - 10:32</span>
                    </p>
                    <ul className="mt-2 space-y-1.5 pl-3 text-slate-400 text-[11px]">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                        <span>Matt acknowledges Fireflies AI and its rapid velocity growth</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                        <span>Krish invited to share the origin story of Fireflies architecture</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary subtle floating depth layer */}
            <div className="mx-auto -mt-3 h-4 w-[92%] rounded-b-2xl border-x border-b border-white/[0.06] bg-[#0c1018]/60 backdrop-blur-xl" />
          </div>

          {/* Testimonial Quote at Bottom Right (Exact match to screenshot) */}
          <div className="relative mt-8 pt-6 border-t border-white/[0.06] max-w-lg mx-auto w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold tracking-tight text-white">▲ Vercel</span>
            </div>
            <blockquote className="text-sm text-slate-300 leading-relaxed italic">
              &ldquo;Fireflies keeps me 100% present in meetings without losing any of the details.&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-white/20 bg-gradient-to-tr from-violet-600 to-pink-500 p-0.5">
                <div className="h-full w-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-white">
                  SB
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Sarup Banskota</p>
                <p className="text-[11px] text-slate-500">Head of Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
