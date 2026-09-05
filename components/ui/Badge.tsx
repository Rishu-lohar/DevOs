import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "purple" | "emerald" | "amber" | "blue" | "rose";
};

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-white/10 bg-white/[0.06] text-slate-300",
    purple: "border-violet-500/30 bg-violet-500/15 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
    emerald: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber: "border-amber-500/30 bg-amber-500/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    blue: "border-blue-500/30 bg-blue-500/15 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    rose: "border-rose-500/30 bg-rose-500/15 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
