"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";
import { AuthHeading } from "@/components/auth/auth-parts";

const LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    const next = Array(LENGTH).fill("");
    text.split("").forEach((c, idx) => (next[idx] = c));
    setDigits(next);
    refs.current[Math.min(text.length, LENGTH - 1)]?.focus();
  };

  const code = digits.join("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== LENGTH) {
      setError("Enter the 6-digit code");
      return;
    }
    setError(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    router.push("/dashboard");
  };

  return (
    <div data-testid="verify-otp-page">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-hover text-accent">
        <ShieldCheck className="h-4 w-4" />
      </div>
      <AuthHeading
        title="Verify your email"
        subtitle="Enter the 6-digit code we sent to your inbox to finish setting up your workspace."
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              data-testid={`otp-digit-${i}`}
              className="h-11 w-full rounded-md border border-border bg-surface text-center font-mono text-[16px] text-text-primary outline-none transition-colors duration-[140ms] hover:border-border-strong focus:border-accent"
            />
          ))}
        </div>
        {error && <p className="text-[11px] text-danger">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={submitting}
          data-testid="otp-submit"
        >
          {submitting ? <Spinner /> : null}
          {submitting ? "Verifying…" : "Verify and continue"}
          {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-[12px] text-text-muted">
        <button
          type="button"
          data-testid="otp-resend"
          className="transition-colors hover:text-text-primary"
        >
          Resend code
        </button>
        <Link href="/login" className="font-medium text-accent hover:underline">
          Use another account
        </Link>
      </div>
    </div>
  );
}
