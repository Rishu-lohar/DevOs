import type { ReactNode } from "react";

export function Tooltip({
  label,
  children,
  "data-testid": testId,
}: {
  label: string;
  children: ReactNode;
  "data-testid"?: string;
}) {
  return (
    <span data-testid={testId || "ui-tooltip"} className="group relative inline-flex">
      <span>{children}</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[8px] border border-[#232326] bg-[#18181B] px-2.5 py-1 text-[11px] font-medium text-[#FAFAFA] opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50">
        {label}
      </span>
    </span>
  );
}
