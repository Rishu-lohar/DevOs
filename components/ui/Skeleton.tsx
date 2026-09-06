export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[12px] bg-[#18181B] border border-[#232326] animate-pulse ${className}`}
    />
  );
}
