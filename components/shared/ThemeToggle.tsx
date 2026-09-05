"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
      className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
    >
      {dark ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
    </button>
  );
}