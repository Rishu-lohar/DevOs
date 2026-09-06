import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className = "",
  "data-testid": testId,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { "data-testid"?: string }) {
  return (
    <textarea
      data-testid={testId || "ui-textarea"}
      className={`min-h-24 w-full rounded-[12px] border border-[#232326] bg-[#111113] p-3.5 text-sm text-[#FAFAFA] outline-none transition-colors duration-150 placeholder:text-[#71717A] hover:border-[#3F3F46] focus:border-[#7C5CFC] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
