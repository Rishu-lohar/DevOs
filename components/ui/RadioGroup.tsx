import type { InputHTMLAttributes } from "react";

type RadioGroupProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  options: string[];
  name?: string;
  value?: string;
  onChangeOption?: (value: string) => void;
  "data-testid"?: string;
};

export function RadioGroup({
  options,
  name = "radio",
  value,
  onChangeOption,
  "data-testid": testId,
  ...props
}: RadioGroupProps) {
  return (
    <div data-testid={testId || "ui-radiogroup"} className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#232326] bg-[#111113] p-3 text-xs sm:text-sm text-[#FAFAFA] transition-colors duration-150 hover:border-[#3F3F46] hover:bg-[#18181B]"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value ? value === option : undefined}
            onChange={() => onChangeOption?.(option)}
            className="h-4 w-4 cursor-pointer accent-[#7C5CFC]"
            {...props}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
