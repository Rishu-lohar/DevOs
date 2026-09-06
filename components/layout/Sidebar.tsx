"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Boxes,
  CheckSquare,
  ChevronRight,
  FolderKanban,
  GitBranch,
  Grid2X2,
  Lightbulb,
  MessageCircle,
  ClipboardList,
  Settings,
  Sparkles,
  Zap,
  X,
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Grid2X2 },
  { label: "Workspace", href: "/workspace", icon: Boxes },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Collaboration", href: "/collaboration", icon: MessageCircle },
  { label: "GitHub", href: "/github", icon: GitBranch },
  { label: "Open Source", href: "/open-source", icon: Lightbulb },
  { label: "Industry Intelligence", href: "/industry", icon: Sparkles },
  { label: "Growth Tracker", href: "/growth", icon: BarChart3 },
  { label: "AI Mentor", href: "/ai-mentor", icon: Bot },
  { label: "Reports", href: "/reports", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
  "data-testid"?: string;
};

export function Sidebar({ open = true, onClose, "data-testid": testId }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        aria-label="Close navigation"
        className={`fixed inset-0 z-40 bg-black/75 transition-opacity duration-150 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        data-testid={testId || "main-sidebar"}
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[#232326] bg-[#09090B] px-3 py-4 transition-transform duration-150 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#232326] px-2 pb-4">
          <Link
            href="/dashboard"
            data-testid="sidebar-brand-logo"
            className="group flex items-center gap-2.5"
            onClick={onClose}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#7C5CFC] text-white">
              <Sparkles size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
                devos<span className="text-[#7C5CFC]">.ai</span>
              </div>
              <div className="text-[9px] font-medium tracking-wide text-[#71717A]">
                Developer OS
              </div>
            </div>
          </Link>
          <button
            className="rounded-[6px] p-1.5 text-[#71717A] hover:bg-[#18181B] hover:text-[#FAFAFA] lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto pr-1" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={onClose}
                className={`group relative flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-xs font-medium transition-colors duration-150 ${
                  active
                    ? "bg-[#18181B] text-[#FAFAFA] font-medium"
                    : "text-[#71717A] hover:bg-[#111113] hover:text-[#FAFAFA]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-[#7C5CFC]" />
                )}
                <Icon
                  size={15}
                  strokeWidth={1.75}
                  className={active ? "text-[#7C5CFC]" : "text-[#71717A] group-hover:text-[#FAFAFA]"}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {active && <ChevronRight size={12} className="text-[#52525B]" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Tier & User Profile */}
        <div className="mt-auto space-y-2.5 border-t border-[#232326] pt-3">
          <div className="rounded-[12px] border border-[#232326] bg-[#111113] p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[rgba(124,92,252,0.12)] text-[#7C5CFC]">
                <Zap size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[#FAFAFA]">DevOS Pro Tier</p>
                <p className="text-[9px] text-[#71717A]">Autonomous AI active</p>
              </div>
              <span className="rounded-full bg-[rgba(124,92,252,0.12)] px-1.5 py-0.5 text-[9px] font-medium text-[#C4B5FD] border border-[rgba(124,92,252,0.25)]">
                Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-[12px] border border-[#232326] bg-[#111113] p-2">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#232326] bg-[#18181B] text-[10px] font-medium text-[#FAFAFA]">
              RL
              <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-[#FAFAFA]">Rishu Lohar</p>
              <p className="truncate text-[9px] text-[#71717A]">rishu@devos.ai</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
