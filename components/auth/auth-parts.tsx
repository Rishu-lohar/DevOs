"use client";

import * as React from "react";
import { GithubIcon } from "@/components/icons/github";
import { Button } from "@/components/ui/button";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function OAuthButtons({ verb = "Continue" }: { verb?: string }) {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        data-testid="oauth-github"
      >
        <GithubIcon className="h-3.5 w-3.5" />
        {verb} with GitHub
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        data-testid="oauth-google"
      >
        <GoogleGlyph />
        {verb} with Google
      </Button>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] uppercase tracking-[0.08em] text-text-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-text-primary">
        {title}
      </h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{subtitle}</p>
    </div>
  );
}
