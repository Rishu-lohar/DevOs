import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <div className="relative w-full"><select className={`h-10 w-full appearance-none rounded-xl border border-white/[.09] bg-white/[.035] px-3.5 pr-9 text-xs sm:text-sm text-white outline-none transition-all hover:border-white/[.16] focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/12 ${className}`} {...props}>{children}</select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /></div>;
}
