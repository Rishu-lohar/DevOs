"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Boxes,
  CheckSquare2,
  ChevronDown,
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
  { label: "Tasks", href: "/tasks", icon: CheckSquare2 },
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
};

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-label="Close navigation"
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#07090e]/95 px-4 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:static lg:translate-x-0"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-4 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-transform group-hover:scale-105">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                devos<span className="text-rose-400">.ai</span>
              </div>
              <div className="text-[10px] tracking-wide text-slate-500 font-medium">Developer Operating System</div>
            </div>
          </Link>
          <button
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto pr-1 py-1" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                {/* Active animated pill background */}
                {active && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/20 to-indigo-600/10 shadow-[inset_0_0_15px_rgba(139,92,246,0.15)]"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}

                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={`relative z-10 transition-colors ${
                    active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span className="relative z-10 flex-1 truncate">{item.label}</span>
                {active && <ChevronRight size={14} className="relative z-10 text-slate-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Pro Upgrade Banner & User Pill */}
        <div className="mt-auto pt-3 space-y-2.5 border-t border-white/[0.06]">
          {/* Pro Plan Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-600/15 via-purple-600/10 to-indigo-600/10 p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <Zap size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white">DevOS Pro Tier</p>
                <p className="text-[10px] text-slate-400">Autonomous AI enabled</p>
              </div>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                Active
              </span>
            </div>
          </div>

          {/* User Account Pill */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.06] cursor-pointer">
            <div className="relative h-8 w-8 rounded-full border border-violet-400/40 bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#121622] text-[11px] font-bold text-white">
                RL
              </div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#07090e] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">Rishu Lohar</p>
              <p className="truncate text-[10px] text-slate-500">rishu@devos.ai</p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}