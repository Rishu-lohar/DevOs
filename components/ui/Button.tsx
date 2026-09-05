"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragEnd" | "onDragStart" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function Button({ variant = "primary", size = "md", icon, className = "", children, ...props }: ButtonProps) {
  const styles = {
    primary: "border border-violet-300/20 bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_10px_26px_rgba(124,58,237,.24)] hover:brightness-110 hover:shadow-[0_14px_34px_rgba(124,58,237,.34)]",
    secondary: "border border-white/[.1] bg-white/[.055] text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,.18)] hover:border-white/[.18] hover:bg-white/[.09]",
    glass: "border border-white/[.09] bg-white/[.04] text-slate-200 backdrop-blur-xl hover:border-white/[.16] hover:bg-white/[.075]",
    ghost: "text-slate-400 hover:bg-white/[.06] hover:text-white",
    danger: "border border-rose-400/25 bg-rose-500/12 text-rose-300 hover:bg-rose-500/20",
  };
  const sizes = { sm: "h-8 rounded-lg px-3 text-xs gap-1.5", md: "h-10 rounded-xl px-4 text-xs sm:text-sm gap-2", lg: "h-12 rounded-xl px-6 text-sm sm:text-base gap-2.5 font-semibold" };
  return <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} transition={{ duration: .16, ease: "easeOut" }} className={`inline-flex items-center justify-center font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${sizes[size]} ${className}`} {...props}>{icon && <span className="shrink-0">{icon}</span>}{children}</motion.button>;
}
