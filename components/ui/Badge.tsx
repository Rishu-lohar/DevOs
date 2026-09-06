import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "purple" | "emerald" | "amber" | "blue" | "rose";
  "data-testid"?: string;
};

export function Badge({
  variant = "default",
  className = "",
  "data-testid": testId,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "border-[#232326] bg-[#18181B] text-[#A1A1AA]",
    purple: "border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] text-[#C4B5FD]",
    emerald: "border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] text-[#86EFAC]",
    amber: "border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.1)] text-[#FDE68A]",
    blue: "border-[rgba(56,189,248,0.25)] bg-[rgba(56,189,248,0.1)] text-[#BAE6FD]",
    rose: "border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.1)] text-[#FECDD3]",
  };

  return (
    <span
      data-testid={testId || "ui-badge"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors duration-150 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
