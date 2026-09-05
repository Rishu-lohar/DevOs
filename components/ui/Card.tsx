import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-[24px] border border-white/[0.07] bg-[#0c1017]/80 shadow-[0_20px_60px_rgba(0,0,0,.2)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.13] ${className}`} {...props} />;
}
