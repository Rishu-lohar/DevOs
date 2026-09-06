import Link from "next/link";
import { Terminal } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_460px]">
      {/* Brand rail */}
      <div className="relative hidden overflow-hidden border-r border-border lg:block">
        <div className="pointer-events-none absolute inset-0 landing-grid opacity-50" />
        <div className="pointer-events-none absolute inset-0 landing-aurora animate-aurora" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link href="/" className="flex w-fit items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent text-accent-foreground">
              <Terminal className="h-3 w-3" />
            </span>
            <span className="text-[14px] font-semibold tracking-[-0.015em]">DevOS</span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary">
              Build better. Together.
              <br />
              <span className="text-text-muted">Learn deeper. Grow faster.</span>
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-text-secondary">
              One workspace for projects, reviews, repositories and growth —
              designed for engineers who keep it open all day.
            </p>

            <div className="mt-8 rounded-xl border border-border bg-card p-4">
              <p className="text-[12px] leading-relaxed text-text-secondary">
                “DevOS replaced four tabs and a spreadsheet. Our review latency
                dropped by half in one sprint.”
              </p>
              <div className="mt-3 flex items-center gap-2.5 border-t border-border pt-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-active text-[10px] font-medium text-text-secondary">
                  SB
                </span>
                <span>
                  <span className="block text-[12px] font-medium text-text-primary">
                    Sarup Banskota
                  </span>
                  <span className="block text-[11px] text-text-muted">Head of Growth</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span>SOC2 Type II</span>
            <span className="h-3 w-px bg-border" />
            <span>GDPR ready</span>
            <span className="h-3 w-px bg-border" />
            <span>256-bit TLS</span>
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[340px]">{children}</div>
      </div>
    </div>
  );
}
