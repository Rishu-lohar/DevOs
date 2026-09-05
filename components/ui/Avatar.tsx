import type { HTMLAttributes } from "react";

export function Avatar({
  initials = "RL",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { initials?: string }) {
  return (
    <div
      className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-violet-600/40 via-purple-600/30 to-indigo-500/40 text-[11px] font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-1 ring-white/10 ${className}`}
      {...props}
    >
      <span>{initials}</span>
    </div>
  );
}
