"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { forgotSchema, type ForgotValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/feedback";
import { AuthHeading } from "@/components/auth/auth-parts";

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 450));
    setSent(true);
  };

  if (sent) {
    return (
      <div data-testid="forgot-password-sent">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-hover text-success">
          <MailCheck className="h-4 w-4" />
        </div>
        <AuthHeading
          title="Check your inbox"
          subtitle={`We sent a reset link to ${getValues("email")}. The link expires in 30 minutes.`}
        />
        <Button asChild variant="secondary" size="lg" className="w-full">
          <Link href="/login" data-testid="forgot-back-to-login">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to log in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div data-testid="forgot-password-page">
      <AuthHeading
        title="Reset your password"
        subtitle="Enter the email linked to your workspace and we will send a reset link."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            data-testid="forgot-email"
            className="mt-1.5 h-9"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          data-testid="forgot-submit"
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Sending link…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12px] text-text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
