import { chartData } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

export function AreaChart({ "data-testid": testId }: { "data-testid"?: string }) {
  const points = chartData.map((value, index) => `${index * 9},${100 - value}`).join(" ");

  return (
    <div
      data-testid={testId || "chart-area"}
      className="rounded-[16px] border border-[#232326] bg-[#111113] p-5 sm:p-6 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-[#FAFAFA]">Productivity Velocity</h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 text-[11px] font-medium text-[#86EFAC]">
              <TrendingUp size={11} />
              +28.4%
            </span>
          </div>
          <p className="mt-1 text-xs text-[#71717A]">Velocity trajectory across the last 12 engineering sprints</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[6px] border border-[#232326] bg-[#18181B] px-2.5 py-1 text-[11px] text-[#A1A1AA]">
          <span className="h-2 w-2 rounded-full bg-[#7C5CFC]" />
          <span>Output Rate</span>
        </div>
      </div>

      <div className="relative h-44 w-full">
        <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full border-b border-dashed border-[#232326]" />
          ))}
        </div>
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#areaGradient)" />
          <polyline points={points} fill="none" stroke="#7C5CFC" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-[10px] font-medium text-[#71717A]">
        <span>Week 1</span>
        <span>Week 4</span>
        <span>Week 8</span>
        <span>Week 12</span>
      </div>
    </div>
  );
}
