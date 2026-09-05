import { ArrowUpRight } from "lucide-react";

export function SectionHeader({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-white sm:text-base">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="group flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-violet-300 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <span>{action}</span>
          <ArrowUpRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      )}
    </div>
  );
}
