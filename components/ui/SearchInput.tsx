"use client";

import { Command, Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & { showShortcut?: boolean };

export function SearchInput({ showShortcut = true, className = "", ...props }: SearchInputProps) {
  return <div className="relative w-full"><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input {...props} className={`h-10 w-full rounded-xl border border-white/[.09] bg-white/[.035] pl-10 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-500 hover:border-white/[.16] focus:border-violet-400/70 focus:bg-white/[.055] focus:ring-4 focus:ring-violet-500/12 ${className}`} />{showShortcut && <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/[.08] bg-white/[.04] px-1.5 py-0.5 text-[10px] font-medium text-slate-400"><Command size={10} /><span>K</span></div>}</div>;
}
