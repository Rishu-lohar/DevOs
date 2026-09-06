"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function DashboardShell({
  children,
  "data-testid": testId,
}: {
  children: React.ReactNode;
  "data-testid"?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      data-testid={testId || "dashboard-shell"}
      className="relative flex min-h-screen w-full bg-[#09090B] text-[#FAFAFA] antialiased"
    >
      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col bg-[#09090B]">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-8 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
