import { Spinner } from "@/components/ui/feedback";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner className="h-5 w-5" />
      <p className="text-[12px] text-text-muted">Loading workspace…</p>
    </div>
  );
}
