"use client";

import { Command, Menu, Search } from "lucide-react";
import { NotificationDropdown } from "../shared/NotificationDropdown";
import { ThemeToggle } from "../shared/ThemeToggle";

type NavbarProps = {
  onMenuClick: () => void;
  "data-testid"?: string;
};

export function Navbar({ onMenuClick, "data-testid": testId }: NavbarProps) {
  return (
    <header
      data-testid={testId || "main-navbar"}
      className="sticky top-0 z-30 flex h-14 w-full items-center justify-between gap-4 border-b border-[#232326] bg-[#09090B] px-4 sm:px-6 lg:px-8"
    >
      <div className="flex max-w-xl flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          data-testid="navbar-mobile-toggle"
          className="rounded-[8px] p-2 text-[#71717A] transition-colors duration-150 hover:bg-[#18181B] hover:text-[#FAFAFA] lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="relative hidden w-full sm:block">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            data-testid="navbar-search-input"
            className="h-9 w-full rounded-[10px] border border-[#232326] bg-[#111113] pl-9 pr-12 text-xs text-[#FAFAFA] outline-none placeholder:text-[#71717A] transition-colors duration-150 hover:border-[#3F3F46] focus:border-[#7C5CFC]"
            placeholder="Search projects, tasks, branches, AI actions..."
          />
          <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-[4px] border border-[#232326] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A]">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden xl:flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 text-[11px] font-medium text-[#86EFAC]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          DevOS Cloud · Connected
        </div>
        <NotificationDropdown />
        <ThemeToggle />
        <div
          data-testid="navbar-user-profile"
          className="relative ml-1 flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[#232326] bg-[#111113] p-1.5 pr-3 transition-colors duration-150 hover:bg-[#18181B] hover:border-[#3F3F46]"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#232326] bg-[#18181B] text-[10px] font-medium text-[#FAFAFA]">
            RL
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#111113] bg-[#22C55E]" />
          </div>
          <div className="hidden text-left md:block">
            <p className="text-[11px] font-semibold leading-tight text-[#FAFAFA]">Rishu Lohar</p>
            <p className="text-[9px] leading-tight text-[#71717A]">Pro Member</p>
          </div>
        </div>
      </div>
    </header>
  );
}
