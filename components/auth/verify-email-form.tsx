"use client";

import * as React from "react";
import Link from "next/link";
import { MailCheck, ShieldCheck } from "lucide-react";
import { AuthHeading } from "@/components/auth/auth-parts";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/feedback";
import { createClient } from "@/lib/supabase/client";

export function VerifyEmailForm({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = React.useState(initialEmail);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSent(false);
    setIsSubmitting(true);

    try {
      const { error: resendError } = await createClient().auth.resend({
        type: "signup",
        email: email.trim(),
      });

      if (resendError) {
        setError("Unable to resend the verification email. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("Unable to resend the verification email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="verify-otp-page">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-hover text-accent">
        {sent ? <MailCheck className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
      </div>
      <AuthHeading
        title="Verify your email"
        subtitle="Check your inbox for a verification link. Open it to finish setting up your DevOS account."
      />

      <form onSubmit={resendEmail} className="space-y-4">
        <div>
          <Label htmlFor="verify-email">Email address</Label>
          <Input
            id="verify-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 h-9"
          />
          <FieldError>{error}</FieldError>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !email.trim()}
          data-testid="otp-resend"
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Sending…" : "Resend verification email"}
        </Button>

        {sent && (
          <p role="status" className="text-[12px] text-success">
            Verification email sent. Check your inbox.
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-[12px] text-text-muted">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Use another account
        </Link>
      </p>
    </div>
  );
}
