"use client";

import { Command, Menu, Search } from "lucide-react";
import { NotificationDropdown } from "../shared/NotificationDropdown";
import { ThemeToggle } from "../shared/ThemeToggle";

type NavbarProps = {
  onMenuClick: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-4 z-30 mx-4 flex h-16 items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1018]/80 px-4 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:mx-6 lg:mx-8">
      {/* Top rim highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Left: Mobile Drawer Button & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Raycast / Linear Style Search Bar */}
        <div className="relative w-full hidden sm:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-14 text-xs sm:text-sm text-slate-200 outline-none placeholder:text-slate-500 transition-all hover:border-white/15 focus:border-violet-500/70 focus:bg-[#101522] focus:ring-4 focus:ring-violet-500/15"
            placeholder="Search projects, tasks, branches, AI actions..."
          />
          <div className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Status indicator */}
        <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>DevOS Cloud · Connected</span>
        </div>

        <NotificationDropdown />
        <ThemeToggle />

        {/* User profile avatar with gradient border & status dot */}
        <div className="relative ml-1 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1.5 pr-3 cursor-pointer transition-colors hover:bg-white/[0.06]">
          <div className="relative h-8 w-8 rounded-full border border-violet-400/40 bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#121622] text-[11px] font-bold text-white">
              RL
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0c1018] bg-emerald-400" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Rishu Lohar</p>
            <p className="text-[10px] text-slate-400 leading-tight">Pro Member</p>
          </div>
        </div>
      </div>
    </header>
  );
}