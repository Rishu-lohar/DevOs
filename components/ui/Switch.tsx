"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Switch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
        checked
          ? "border-violet-500/50 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
          : "border-white/10 bg-white/[0.08]"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
