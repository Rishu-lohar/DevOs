import { CheckCircle2 } from "lucide-react";

export function Toast({
  message,
  visible = true,
  "data-testid": testId,
}: {
  message: string;
  visible?: boolean;
  "data-testid"?: string;
}) {
  if (!visible) return null;

  return (
    <div
      data-testid={testId || "ui-toast"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-[12px] border border-[#232326] bg-[#111113] px-4 py-3 text-xs sm:text-sm font-medium text-[#FAFAFA]"
    >
      <CheckCircle2 size={16} className="text-[#22C55E] shrink-0" />
      <span>{message}</span>
    </div>
  );
}
