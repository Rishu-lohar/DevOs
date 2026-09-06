"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  CircleCheck,
  FolderKanban,
  GitBranch,
  LayoutGrid,
  Lightbulb,
  Newspaper,
  Settings,
  Sparkles,
  TrendingUp,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { navGroups } from "@/lib/navigation";
import { currentUser } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const icons = {
  LayoutGrid,
  Boxes,
  FolderKanban,
  CircleCheck,
  GitBranch,
  Lightbulb,
  Newspaper,
  TrendingUp,
  Sparkles,
  Settings,
} as const;

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-[var(--overlay)] transition-opacity duration-[200ms] lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        data-testid="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col overflow-hidden border-r border-border bg-sidebar",
          "transition-transform duration-[200ms] ease-[cubic-bezier(0.32,0.72,0,1)] lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand — pinned */}
        <div className="flex h-[var(--navbar-height)] shrink-0 items-center justify-between border-b border-border px-3">
          <Link
            href="/dashboard"
            data-testid="sidebar-brand"
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent text-accent-foreground">
              <Terminal className="h-3 w-3" />
            </span>
            <span className="text-[13px] font-semibold tracking-[-0.015em] text-text-primary">
              DevOS
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-md p-1 text-text-muted transition-colors duration-[140ms] hover:bg-surface-hover hover:text-text-primary lg:hidden"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Navigation — the ONLY scrollable region */}
        <nav
          aria-label="Primary"
          className="min-h-0 flex-1 overflow-y-auto scrollbar-none px-2 py-3"
        >
          {navGroups.map((group, gi) => (
            <div key={group.label ?? `g-${gi}`} className={gi > 0 ? "mt-4" : ""}>
              {group.label && (
                <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-[0.08em] text-text-muted">
                  {group.label}
                </p>
              )}
              <ul className="space-y-px">
                {group.items.map((item) => {
                  const Icon = icons[item.icon];
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        data-testid={`nav-${item.href.replace("/", "")}`}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex h-7 items-center gap-2 rounded-md px-2 text-[13px] transition-colors duration-[140ms]",
                          active
                            ? "bg-surface-active font-medium text-text-primary"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-r-full bg-accent" />
                        )}
                        <Icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            active ? "text-accent" : "text-text-muted group-hover:text-text-secondary",
                          )}
                          strokeWidth={1.75}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Subscription — pinned, never scrolls */}
        <div className="shrink-0 border-t border-border p-2">
          <div
            data-testid="sidebar-subscription"
            className="rounded-lg border border-border bg-surface px-2.5 py-2"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 shrink-0 text-accent" strokeWidth={2} />
              <p className="flex-1 truncate text-[12px] font-medium text-text-primary">
                DevOS {currentUser.plan}
              </p>
              <span className="rounded border border-success/30 bg-success-subtle px-1 text-[10px] font-medium text-success">
                Active
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-text-muted">
              Unlimited repositories & AI reviews
            </p>
          </div>
        </div>

        {/* User profile — pinned, never scrolls */}
        <div className="shrink-0 border-t border-border p-2">
          <Link
            href="/settings"
            data-testid="sidebar-profile"
            onClick={onClose}
            className="flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors duration-[140ms] hover:bg-surface-hover"
          >
            <Avatar name={currentUser.name} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-medium text-text-primary">
                {currentUser.name}
              </span>
              <span className="block truncate text-[11px] text-text-muted">
                {currentUser.email}
              </span>
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
