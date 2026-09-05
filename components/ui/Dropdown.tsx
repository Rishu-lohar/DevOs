"use client";

import type { ReactNode } from "react";

export function Dropdown({
  trigger,
  children,
  className = "",
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className="relative inline-block text-left">
      <summary className="list-none cursor-pointer outline-none">{trigger}</summary>
      <div
        className={`absolute right-0 top-full mt-2 z-30 min-w-48 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d121c]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl ${className}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {children}
      </div>
    </details>
  );
}
