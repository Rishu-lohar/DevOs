import { contributionData } from "@/lib/mock-data";
import { GitCommit, Sparkles } from "lucide-react";

export function ContributionHeatmap({ "data-testid": testId }: { "data-testid"?: string }) {
  const levelColors = [
    "bg-[#18181B] border-[#232326]",
    "bg-[#2E1F5E] border-[#3D2B7A]",
    "bg-[#4D329A] border-[#5E3EBD]",
    "bg-[#6B46F7] border-[#7C5CFC]",
    "bg-[#7C5CFC] border-[#9D80FD]",
  ];

  return (
    <div
      data-testid={testId || "chart-contribution-heatmap"}
      className="rounded-[16px] border border-[#232326] bg-[#111113] p-5 sm:p-6 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-[#FAFAFA]">Contribution Velocity</h3>
            <span className="flex items-center gap-1 text-[11px] font-medium text-[#C4B5FD]">
              <Sparkles size={12} />
              156 this year
            </span>
          </div>
          <p className="mt-1 text-xs text-[#71717A]">GitHub push & PR momentum</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-[#C4B5FD] transition-colors duration-150 hover:text-white">
          <GitCommit size={14} />
          <span>View commit graph →</span>
        </button>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="grid min-w-[500px] grid-flow-col grid-rows-7 gap-1.5">
          {contributionData.map((level, index) => (
            <div
              key={index}
              title={`${level} contributions`}
              className={`h-3 w-3 rounded-[3px] border transition-transform duration-150 hover:scale-125 ${levelColors[level]}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-[#71717A]">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {levelColors.map((color, idx) => (
            <span key={idx} className={`h-2.5 w-2.5 rounded-[2px] border ${color}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
