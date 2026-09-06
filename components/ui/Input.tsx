import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  "data-testid": testId,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { "data-testid"?: string }) {
  return (
    <input
      data-testid={testId || "ui-input"}
      className={`h-11 w-full rounded-[12px] border border-[#232326] bg-[#111113] px-3.5 text-sm text-[#FAFAFA] outline-none transition-colors duration-150 placeholder:text-[#71717A] hover:border-[#3F3F46] focus:border-[#7C5CFC] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
