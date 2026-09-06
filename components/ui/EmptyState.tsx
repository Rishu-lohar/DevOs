import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title = "Nothing here yet",
  description = "New activity and updates will appear here automatically.",
  icon,
  action,
  "data-testid": testId,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={testId || "ui-empty-state"} className="flex flex-col items-center justify-center py-14 text-center px-4">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#232326] bg-[#18181B] text-[#71717A]">
        {icon ?? <Inbox size={22} />}
      </div>
      <p className="text-sm font-semibold text-[#FAFAFA]">{title}</p>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[#71717A]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
