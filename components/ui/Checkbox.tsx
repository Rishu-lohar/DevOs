import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs sm:text-sm text-slate-300 transition hover:text-white select-none">
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500/30 focus:ring-offset-0 transition cursor-pointer accent-violet-500 ${className}`}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
