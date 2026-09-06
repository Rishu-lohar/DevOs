import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = "md",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    xs: "h-4 w-4 text-[8px]",
    sm: "h-5 w-5 text-[9px]",
    md: "h-6 w-6 text-[10px]",
    lg: "h-8 w-8 text-[11px]",
    xl: "h-12 w-12 text-[15px]",
  };
  const chars = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <span
      title={name}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-active font-medium text-text-secondary",
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        chars
      )}
    </span>
  );
}

export function AvatarGroup({
  names,
  max = 4,
  size = "md",
}: {
  names: string[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-1.5">
        {shown.map((n) => (
          <Avatar
            key={n}
            name={n}
            size={size}
            className="ring-1 ring-card"
          />
        ))}
      </div>
      {rest > 0 && (
        <span className="ml-2 text-[11px] text-text-muted">+{rest}</span>
      )}
    </div>
  );
}
