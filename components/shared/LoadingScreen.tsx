import { Spinner } from "../ui/Spinner";

export function LoadingScreen() {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_25px_rgba(139,92,246,0.15)]">
        <Spinner className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium text-slate-500">Loading DevOS workspace...</p>
    </div>
  );
}
