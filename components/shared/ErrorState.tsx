import { AlertTriangle } from "lucide-react";

export function ErrorState({
  message = "Something went wrong.",
  "data-testid": testId,
}: {
  message?: string;
  "data-testid"?: string;
}) {
  return (
    <div
      data-testid={testId || "error-state"}
      className="flex items-center gap-3 rounded-[12px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] p-4 text-xs sm:text-sm text-[#F87171]"
    >
      <AlertTriangle size={16} className="text-[#EF4444] shrink-0" />
      <span>{message}</span>
    </div>
  );
}
