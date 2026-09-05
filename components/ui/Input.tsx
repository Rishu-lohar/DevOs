import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-11 w-full rounded-xl border border-white/[.09] bg-white/[.035] px-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/[.16] focus:border-violet-400/70 focus:bg-white/[.055] focus:ring-4 focus:ring-violet-500/12 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
}
