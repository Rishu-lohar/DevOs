import { AlertTriangle } from "lucide-react";

export function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-xs sm:text-sm text-rose-200 backdrop-blur-md">
      <AlertTriangle size={18} className="text-rose-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
