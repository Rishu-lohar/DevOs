import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "purple" | "emerald" | "amber" | "blue" | "rose" };

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  const variantStyles = { default: "border-white/10 bg-white/[.06] text-slate-300", purple: "border-violet-400/25 bg-violet-500/12 text-violet-300", emerald: "border-emerald-400/25 bg-emerald-500/12 text-emerald-300", amber: "border-amber-400/25 bg-amber-500/12 text-amber-300", blue: "border-blue-400/25 bg-blue-500/12 text-blue-300", rose: "border-rose-400/25 bg-rose-500/12 text-rose-300" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors ${variantStyles[variant]} ${className}`} {...props} />;
}
