"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="relative flex min-h-screen w-full bg-[#09090b] text-slate-100 antialiased"><div className="pointer-events-none fixed inset-0 devos-grid opacity-25" /><div className="relative z-10 flex min-h-screen w-full"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><Navbar onMenuClick={() => setSidebarOpen(true)} /><main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-7 sm:px-6 lg:px-10">{children}</main></div></div></div>;
}
