"use client";

import type { ReactNode } from "react";

export function Dropdown({
  trigger,
  children,
  className = "",
  "data-testid": testId,
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <details data-testid={testId || "ui-dropdown"} className="relative inline-block text-left">
      <summary className="list-none cursor-pointer outline-none">{trigger}</summary>
      <div
        className={`absolute right-0 top-full mt-2 z-30 min-w-48 overflow-hidden rounded-[14px] border border-[#232326] bg-[#111113] p-1.5 ${className}`}
      >
        {children}
      </div>
    </details>
  );
}
