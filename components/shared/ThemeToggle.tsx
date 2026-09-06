"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle({ "data-testid": testId }: { "data-testid"?: string }) {
  const [dark, setDark] = useState(true);
  return (
    <button
      data-testid={testId || "theme-toggle-button"}
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
      className="rounded-[8px] p-2 text-[#71717A] transition-colors duration-150 hover:bg-[#18181B] hover:text-[#FAFAFA]"
    >
      {dark ? <Moon size={17} /> : <Sun size={17} className="text-[#FBBF24]" />}
    </button>
  );
}
