"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[var(--sidebar-width)]">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main
          data-testid="app-main"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
