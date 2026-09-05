"use client";

import { Bell, Sparkles } from "lucide-react";
import { Dropdown } from "../ui/Dropdown";
import { notifications } from "@/lib/mock-data";

export function NotificationDropdown() {
  return (
    <Dropdown
      trigger={
        <span className="relative inline-flex items-center justify-center rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_#8b5cf6]" />
        </span>
      }
      className="w-72 sm:w-80"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Sparkles size={12} className="text-violet-400" />
          <span>Notifications</span>
        </div>
        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-300">
          {notifications.length} new
        </span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {notifications.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 px-3.5 py-3 text-xs text-slate-300 transition-colors hover:bg-white/[0.03]"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </Dropdown>
  );
}
