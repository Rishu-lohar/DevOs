import { ArrowUpRight } from "lucide-react";

export function SectionHeader({
  title,
  description,
  action,
  onAction,
  "data-testid": testId,
}: {
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={testId || "section-header"} className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-[#FAFAFA] sm:text-base">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-[#71717A]">{description}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          data-testid="section-header-action"
          className="group flex shrink-0 items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-medium text-[#C4B5FD] transition-colors duration-150 hover:bg-[#18181B] hover:text-[#FAFAFA]"
        >
          <span>{action}</span>
          <ArrowUpRight size={13} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
}
