export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#232326] border-t-[#7C5CFC] ${className}`}
    />
  );
}
