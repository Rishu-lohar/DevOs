"use client";

import { useState } from "react";

export function Switch({
  defaultChecked = false,
  "data-testid": testId,
}: {
  defaultChecked?: boolean;
  "data-testid"?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      role="switch"
      data-testid={testId || "ui-switch"}
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-150 ${
        checked
          ? "border-[#7C5CFC] bg-[#7C5CFC]"
          : "border-[#232326] bg-[#18181B]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-150 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
