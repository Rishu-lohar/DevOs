import type { HTMLAttributes } from "react";

export function Avatar({
  initials = "RL",
  className = "",
  "data-testid": testId,
  ...props
}: HTMLAttributes<HTMLDivElement> & { initials?: string; "data-testid"?: string }) {
  return (
    <div
      data-testid={testId || "ui-avatar"}
      className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#232326] bg-[#18181B] text-[11px] font-medium text-[#FAFAFA] ${className}`}
      {...props}
    >
      <span>{initials}</span>
    </div>
  );
}
