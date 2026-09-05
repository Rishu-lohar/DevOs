"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Tabs({
  items,
  defaultValue,
  onChange,
}: {
  items: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [active, setActive] = useState(defaultValue ?? items[0]);

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0c1018]/90 p-1 shadow-inner backdrop-blur-md">
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            onClick={() => {
              setActive(item);
              onChange?.(item);
            }}
            className={`relative rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 rounded-lg border border-white/15 bg-white/[0.1] shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{item}</span>
          </button>
        );
      })}
    </div>
  );
}
