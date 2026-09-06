import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    data-slot="input"
    className={cn(
      "h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary outline-none transition-colors duration-[140ms] placeholder:text-text-muted hover:border-border-strong focus:border-accent disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[72px] w-full resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-[13px] text-text-primary outline-none transition-colors duration-[140ms] placeholder:text-text-muted hover:border-border-strong focus:border-accent",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-[12px] font-medium text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-[11px] text-danger">{children}</p>;
}
