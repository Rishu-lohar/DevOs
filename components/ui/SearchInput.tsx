"use client";

import { Command, Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  showShortcut?: boolean;
  "data-testid"?: string;
};

export function SearchInput({
  showShortcut = true,
  className = "",
  "data-testid": testId,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
      <input
        data-testid={testId || "search-input"}
        {...props}
        className={`h-10 w-full rounded-[12px] border border-[#232326] bg-[#111113] pl-10 pr-12 text-sm text-[#FAFAFA] outline-none transition-colors duration-150 placeholder:text-[#71717A] hover:border-[#3F3F46] focus:border-[#7C5CFC] ${className}`}
      />
      {showShortcut && (
        <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-[6px] border border-[#232326] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A]">
          <Command size={10} />
          <span>K</span>
        </div>
      )}
    </div>
  );
}
