import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-hover text-text-secondary",
        accent: "border-accent-border bg-accent-subtle text-accent",
        success: "border-success/30 bg-success-subtle text-success",
        warning: "border-warning/30 bg-warning-subtle text-warning",
        danger: "border-danger/30 bg-danger-subtle text-danger",
        outline: "border-border bg-transparent text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
