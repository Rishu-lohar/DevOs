import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full rounded-xl border border-white/[0.09] bg-[#0c1018]/80 p-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/[0.16] focus:border-violet-500/80 focus:bg-[#101420] focus:ring-4 focus:ring-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
