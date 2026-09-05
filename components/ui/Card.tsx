import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[18px] border border-white/[.07] bg-[#111115]/80 shadow-[0_18px_50px_rgba(0,0,0,.3)] backdrop-blur-xl transition-all duration-300 hover:border-white/[.13] ${className}`} {...props} />;
}
