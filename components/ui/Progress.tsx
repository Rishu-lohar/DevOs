export function Progress({ value, color = "bg-gradient-to-r from-violet-400 to-violet-700" }: { value: number; color?: string }) {
  const percentage = Math.min(100, Math.max(0, value));
  return <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[.08]"><div className={`h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_14px_rgba(139,92,246,.3)] ${color}`} style={{ width: `${percentage}%` }} /></div>;
}
