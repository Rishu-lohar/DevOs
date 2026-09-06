import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  "data-testid"?: string;
};

export function Checkbox({ label, className = "", "data-testid": testId, ...props }: CheckboxProps) {
  return (
    <label
      data-testid={testId || "ui-checkbox-label"}
      className="inline-flex cursor-pointer items-center gap-2.5 text-xs sm:text-sm text-[#A1A1AA] transition-colors duration-150 hover:text-[#FAFAFA] select-none"
    >
      <input
        type="checkbox"
        data-testid="ui-checkbox-input"
        className={`h-4 w-4 rounded-[4px] border-[#232326] bg-[#111113] text-[#7C5CFC] focus:ring-0 cursor-pointer accent-[#7C5CFC] ${className}`}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
