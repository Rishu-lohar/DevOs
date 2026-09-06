"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { notifications, currentUser } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header
      data-testid="app-navbar"
      className="sticky top-0 z-30 flex h-[var(--navbar-height)] shrink-0 items-center gap-2 border-b border-border bg-background px-3 sm:px-4"
    >
      <button
        onClick={onMenuClick}
        aria-label="Open navigation"
        data-testid="navbar-menu-button"
        className="rounded-md p-1.5 text-text-muted transition-colors duration-[140ms] hover:bg-surface-hover hover:text-text-primary lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <input
          data-testid="navbar-search"
          placeholder="Search projects, tasks, repositories…"
          className="h-7 w-full rounded-md border border-border bg-surface pl-8 pr-12 text-[12px] text-text-primary outline-none transition-colors duration-[140ms] placeholder:text-text-muted hover:border-border-strong focus:border-accent"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-surface-hover px-1 font-mono text-[10px] text-text-muted">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1">
        <span className="mr-1 hidden items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-text-secondary xl:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          All systems operational
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
          data-testid="theme-toggle"
        >
          {theme === "dark" ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              data-testid="notifications-trigger"
              className="relative"
            >
              <Bell className="h-3.5 w-3.5" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-[12px] font-medium text-text-primary">
                Notifications
              </span>
              <span className="text-[11px] text-text-muted">{unread} unread</span>
            </div>
            <div className="max-h-[280px] overflow-y-auto py-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  data-testid={`notification-${n.id}`}
                  className="flex gap-2 px-3 py-2 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? "bg-accent" : "bg-border-strong"}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-text-primary">
                      {n.title}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">{n.detail}</p>
                    <p className="mt-0.5 text-[10px] text-text-muted">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              data-testid="user-menu-trigger"
              className="ml-1 flex items-center gap-2 rounded-md p-0.5 pr-1.5 transition-colors duration-[140ms] hover:bg-surface-hover"
            >
              <Avatar name={currentUser.name} size="md" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuLabel>{currentUser.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" data-testid="user-menu-profile">
                Profile settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Appearance</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/growth">Growth tracker</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" data-testid="user-menu-logout">
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
