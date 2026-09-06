import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-accent">
        <Compass className="h-4 w-4" />
      </span>
      <p className="mt-5 text-[11px] uppercase tracking-[0.08em] text-text-muted">
        Page not found
      </p>
      <h1 className="mt-1.5 text-[36px] font-semibold tracking-[-0.03em] text-text-primary">
        404
      </h1>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-text-muted">
        The page you are looking for has moved or never existed.
      </p>
      <Button asChild variant="primary" size="lg" className="mt-6">
        <Link href="/dashboard" data-testid="notfound-dashboard">
          Back to dashboard
        </Link>
      </Button>
    </main>
  );
}
