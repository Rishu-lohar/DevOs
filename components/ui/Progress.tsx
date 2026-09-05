export function Progress({
  value,
  color = "bg-gradient-to-r from-violet-500 to-indigo-500",
}: {
  value: number;
  color?: string;
}) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08] p-[0.5px]">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(139,92,246,0.35)] ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
