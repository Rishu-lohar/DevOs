import Link from "next/link";
import { Calendar, Lock, ShieldCheck, Sparkles, Star } from "lucide-react";

export function AuthShell({
  children,
  "data-testid": testId,
}: {
  children: React.ReactNode;
  "data-testid"?: string;
}) {
  return (
    <div
      data-testid={testId || "auth-shell"}
      className="relative flex min-h-screen w-full overflow-hidden bg-[#09090B] text-[#FAFAFA]"
    >
      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Interactive Form & Security Proofs */}
        <div className="flex flex-col justify-between px-6 py-8 sm:px-12 sm:py-10 lg:px-20 xl:px-28">
          <Link href="/" data-testid="auth-brand-link" className="group inline-flex w-fit items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#7C5CFC] text-white">
              <Sparkles size={14} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[#FAFAFA]">
              devos<span className="text-[#7C5CFC]">.ai</span>
            </span>
          </Link>

          <div className="my-10 w-full max-w-[440px]">{children}</div>

          <div className="space-y-4 pt-6 text-[10px]">
            <div className="flex items-center gap-2 font-medium tracking-[0.1em] text-[#86EFAC]">
              <Lock size={12} />
              <span>SECURED BY 256-BIT AES AND 256-BIT SSL/TLS ENCRYPTION</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EA4335] text-[9px] font-extrabold text-white">
                  G
                </span>
                <span className="font-semibold text-[#FAFAFA]">4.8 / 5</span>
                <span className="flex text-[#F59E0B]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={10} fill="currentColor" />
                  ))}
                </span>
              </div>
              <span className="text-[#3F3F46]">|</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} />
                <span>GDPR, SOC2, + MORE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fireflies-style Visual Card Reference */}
        <div className="relative hidden border-l border-[#232326] bg-[#09090B] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="relative mx-auto mt-4 w-full max-w-[420px]">
            {/* Flat Clean SaaS Card matching Fireflies.ai Screenshot */}
            <div
              data-testid="auth-feature-preview-card"
              className="rounded-[16px] border border-[#232326] bg-[#111113] overflow-hidden"
            >
              <div className="flex items-center gap-2.5 border-b border-[#232326] px-4 py-3.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] text-[#C4B5FD]">
                  <Calendar size={12} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#FAFAFA]">Product Team Sync</p>
                  <p className="text-[9px] text-[#71717A]">Feb 24 · 09:00 AM - 09:45 AM</p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">Meeting Summary</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5 text-[9px] font-medium">
                  <span className="fireflies-tag-purple rounded-[6px] px-2 py-0.5">Fireflies</span>
                  <span className="fireflies-tag-emerald rounded-[6px] px-2 py-0.5">AI notetaker</span>
                  <span className="fireflies-tag-amber rounded-[6px] px-2 py-0.5">Meetings</span>
                  <span className="fireflies-tag-blue rounded-[6px] px-2 py-0.5">Horizontal approach</span>
                  <span className="fireflies-tag-rose rounded-[6px] px-2 py-0.5">Product-led growth</span>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-[#A1A1AA]">
                  In the meeting, Matt and Krish discuss the growth of Fireflies, an AI notetaker that transcribes, analyzes, and captures engineering conversations...
                </p>
                <div className="mt-4 border-t border-[#232326] pt-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#71717A]">Outline</p>
                  <p className="mt-2 text-[10px] text-[#FAFAFA]">
                    1. Introduction <span className="font-mono text-[#C4B5FD] underline">04:48 - 10:32</span>
                  </p>
                  <p className="mt-1.5 pl-3 text-[10px] leading-relaxed text-[#71717A]">
                    • Matt acknowledges Fireflies AI and its growth velocity<br />
                    • Krish invited to share the origin story of Fireflies
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] border-t border-[#232326] pt-5">
            <p className="text-xs font-bold text-[#FAFAFA]">▲ Vercel</p>
            <blockquote className="mt-2.5 max-w-sm text-xs leading-relaxed text-[#A1A1AA]">
              &ldquo;Fireflies keeps me 100% present in meetings without losing any of the details.&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#232326] bg-[#18181B] text-[10px] font-semibold text-[#FAFAFA]">
                SB
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#FAFAFA]">Sarup Banskota</p>
                <p className="text-[9px] text-[#71717A]">Head of Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
