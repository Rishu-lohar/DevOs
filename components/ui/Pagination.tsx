export function Pagination({
  pages = 3,
  current = 1,
  onChange,
}: {
  pages?: number;
  current?: number;
  onChange?: (page: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: pages }, (_, index) => index + 1).map((page) => {
        const isActive = page === current;
        return (
          <button
            key={page}
            onClick={() => onChange?.(page)}
            className={`h-8 w-8 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? "bg-white text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
