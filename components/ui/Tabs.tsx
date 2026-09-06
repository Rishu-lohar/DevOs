"use client";

import { useState } from "react";

export function Tabs({
  items,
  defaultValue,
  onChange,
  "data-testid": testId,
}: {
  items: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  "data-testid"?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? items[0]);

  return (
    <div
      data-testid={testId || "ui-tabs"}
      className="inline-flex items-center gap-1 rounded-[12px] border border-[#232326] bg-[#09090B] p-1"
    >
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            data-testid={`tab-${item.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              setActive(item);
              onChange?.(item);
            }}
            className={`relative rounded-[8px] px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
              isActive
                ? "bg-[#18181B] text-[#FAFAFA] border border-[#232326]"
                : "text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#111113] border border-transparent"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
