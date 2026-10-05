"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import type { AuthenticatedProfile } from "@/lib/auth";

export function AppShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: AuthenticatedProfile;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        profile={profile}
      />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[var(--sidebar-width)]">
        <Navbar onMenuClick={() => setMobileOpen(true)} profile={profile} />
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
