import type { InputHTMLAttributes } from "react";

type RadioGroupProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  options: string[];
  name?: string;
  value?: string;
  onChangeOption?: (value: string) => void;
};

export function RadioGroup({
  options,
  name = "radio",
  value,
  onChangeOption,
  ...props
}: RadioGroupProps) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-xs sm:text-sm text-slate-300 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value ? value === option : undefined}
            onChange={() => onChangeOption?.(option)}
            className="h-4 w-4 cursor-pointer accent-violet-500"
            {...props}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
