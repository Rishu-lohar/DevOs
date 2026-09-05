export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent ${className}`}
    />
  );
}
