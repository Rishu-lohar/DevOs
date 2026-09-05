import type { HTMLAttributes } from "react";

export function GlassCard({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass-card relative overflow-hidden rounded-[18px] border border-white/[.08] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[.14] ${className}`} {...props}><div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />{children}</div>;
}
