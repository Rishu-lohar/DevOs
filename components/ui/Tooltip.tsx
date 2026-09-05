import type { ReactNode } from "react";

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      <span>{children}</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0f1420]/95 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-xl backdrop-blur-md opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 z-50">
        {label}
      </span>
    </span>
  );
}
