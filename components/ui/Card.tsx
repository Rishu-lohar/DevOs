import type { HTMLAttributes } from "react";

export function Card({ className = "", "data-testid": testId, ...props }: HTMLAttributes<HTMLDivElement> & { "data-testid"?: string }) {
  return (
    <div
      data-testid={testId || "ui-card"}
      className={`rounded-[16px] border border-[#232326] bg-[#111113] transition-colors duration-150 hover:border-[#3F3F46] ${className}`}
      {...props}
    />
  );
}
