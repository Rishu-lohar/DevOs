"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium select-none outline-none transition-[color,background-color,border-color] duration-[140ms] ease-[cubic-bezier(0.32,0.72,0,1)] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground border border-transparent hover:bg-accent-hover active:bg-accent-active",
        secondary:
          "bg-surface text-text-primary border border-border hover:bg-surface-hover hover:border-border-strong",
        ghost:
          "bg-transparent text-text-secondary border border-transparent hover:bg-surface-hover hover:text-text-primary",
        outline:
          "bg-transparent text-text-primary border border-border hover:bg-surface-hover hover:border-border-strong",
        subtle:
          "bg-accent-subtle text-accent border border-accent-border hover:bg-accent/20",
        danger:
          "bg-danger-subtle text-danger border border-danger/30 hover:bg-danger/20",
        link: "bg-transparent text-accent border-none underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-6 rounded-md px-2 text-[11px]",
        sm: "h-7 rounded-md px-2.5 text-[12px]",
        md: "h-8 rounded-md px-3 text-[13px]",
        lg: "h-9 rounded-lg px-4 text-[13px]",
        xl: "h-10 rounded-lg px-5 text-[14px]",
        icon: "h-7 w-7 rounded-md",
        "icon-sm": "h-6 w-6 rounded-md",
        "icon-lg": "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
