"use client";

import { Bell, Sparkles } from "lucide-react";
import { Dropdown } from "../ui/Dropdown";
import { notifications } from "@/lib/mock-data";

export function NotificationDropdown({ "data-testid": testId }: { "data-testid"?: string }) {
  return (
    <Dropdown
      data-testid={testId || "notification-dropdown"}
      trigger={
        <span
          data-testid="notification-bell-trigger"
          className="relative inline-flex items-center justify-center rounded-[8px] p-2 text-[#71717A] transition-colors duration-150 hover:bg-[#18181B] hover:text-[#FAFAFA]"
        >
          <Bell size={17} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#7C5CFC]" />
        </span>
      }
      className="w-72 sm:w-80"
    >
      <div className="flex items-center justify-between border-b border-[#232326] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FAFAFA]">
          <Sparkles size={12} className="text-[#7C5CFC]" />
          <span>Notifications</span>
        </div>
        <span className="rounded-full bg-[rgba(124,92,252,0.12)] px-2 py-0.5 text-[10px] font-medium text-[#C4B5FD] border border-[rgba(124,92,252,0.25)]">
          {notifications.length} new
        </span>
      </div>
      <div className="divide-y divide-[#232326]">
        {notifications.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 px-3.5 py-3 text-xs text-[#A1A1AA] transition-colors duration-150 hover:bg-[#18181B]"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7C5CFC]" />
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </Dropdown>
  );
}
