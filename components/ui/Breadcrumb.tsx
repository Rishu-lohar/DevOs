import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
  "data-testid": testId,
}: {
  items: string[];
  "data-testid"?: string;
}) {
  return (
    <nav data-testid={testId || "ui-breadcrumb"} aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#71717A]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={12} className="text-[#52525B]" />}
            <span className={isLast ? "font-medium text-[#FAFAFA]" : "hover:text-[#A1A1AA] transition-colors duration-150"}>
              {item}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
