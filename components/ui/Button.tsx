"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  "data-testid"?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  "data-testid": testId,
  ...props
}: ButtonProps) {
  const styles = {
    primary: "border border-transparent bg-[#7C5CFC] text-white hover:bg-[#6B46F7] active:bg-[#5A32F5]",
    secondary: "border border-[#232326] bg-[#18181B] text-[#FAFAFA] hover:bg-[#232326] hover:border-[#3F3F46] active:bg-[#141416]",
    outline: "border border-[#232326] bg-transparent text-[#FAFAFA] hover:bg-[#18181B] hover:border-[#3F3F46]",
    glass: "border border-[#232326] bg-[#18181B] text-[#FAFAFA] hover:bg-[#232326] hover:border-[#3F3F46]",
    ghost: "border border-transparent bg-transparent text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]",
    danger: "border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] text-[#F87171] hover:bg-[rgba(239,68,68,0.18)]",
  };

  const sizes = {
    sm: "h-8 rounded-[10px] px-3 text-xs gap-1.5",
    md: "h-10 rounded-[12px] px-4 text-xs sm:text-sm gap-2",
    lg: "h-11 rounded-[12px] px-5 text-sm sm:text-base gap-2.5 font-medium",
  };

  return (
    <button
      data-testid={testId || "ui-button"}
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
