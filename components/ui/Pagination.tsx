export function Pagination({
  pages = 3,
  current = 1,
  onChange,
  "data-testid": testId,
}: {
  pages?: number;
  current?: number;
  onChange?: (page: number) => void;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={testId || "ui-pagination"} className="flex items-center gap-1.5">
      {Array.from({ length: pages }, (_, index) => index + 1).map((page) => {
        const isActive = page === current;
        return (
          <button
            key={page}
            data-testid={`page-button-${page}`}
            onClick={() => onChange?.(page)}
            className={`h-8 w-8 rounded-[8px] text-xs font-medium transition-colors duration-150 ${
              isActive
                ? "bg-[#7C5CFC] text-white"
                : "border border-[#232326] bg-[#111113] text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
