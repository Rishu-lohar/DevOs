import { CheckCircle2 } from "lucide-react";

export function Toast({ message, visible = true }: { message: string; visible?: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d121c]/95 px-4 py-3 text-xs sm:text-sm font-medium text-white shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-float">
      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
