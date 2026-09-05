import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={12} className="text-slate-600" />}
            <span className={isLast ? "font-medium text-slate-200" : "hover:text-slate-300 transition-colors"}>
              {item}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
