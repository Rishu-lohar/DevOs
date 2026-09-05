"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragEnd" | "onDragStart" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border border-white/20 shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.55)] hover:brightness-110",
    secondary:
      "border border-white/10 bg-[#121622]/85 text-slate-100 hover:bg-[#182030] hover:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:text-white",
    glass:
      "border border-white/[0.08] bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] hover:border-white/[0.15] backdrop-blur-xl",
    ghost: "text-slate-400 hover:bg-white/[0.06] hover:text-white",
    danger: "border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
    md: "h-10 px-4 text-xs sm:text-sm rounded-xl gap-2",
    lg: "h-12 px-6 text-sm sm:text-base rounded-xl gap-2.5 font-semibold",
  };

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.008 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`inline-flex items-center justify-center font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
