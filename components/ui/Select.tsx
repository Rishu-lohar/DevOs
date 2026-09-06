import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export function Select({
  className = "",
  children,
  "data-testid": testId,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { "data-testid"?: string }) {
  return (
    <div className="relative w-full">
      <select
        data-testid={testId || "ui-select"}
        className={`h-10 w-full appearance-none rounded-[12px] border border-[#232326] bg-[#111113] px-3.5 pr-9 text-xs sm:text-sm text-[#FAFAFA] outline-none transition-colors duration-150 hover:border-[#3F3F46] focus:border-[#7C5CFC] ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
    </div>
  );
}
