export function Progress({
  value,
  color = "bg-[#7C5CFC]",
  "data-testid": testId,
}: {
  value: number;
  color?: string;
  "data-testid"?: string;
}) {
  const percentage = Math.min(100, Math.max(0, value));
  return (
    <div
      data-testid={testId || "ui-progress"}
      className="h-1.5 w-full overflow-hidden rounded-full bg-[#18181B] border border-[#232326]"
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
