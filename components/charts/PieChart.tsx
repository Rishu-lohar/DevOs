const segments = [
  { dot: "bg-[#7C5CFC]", label: "Completed", value: "60%" },
  { dot: "bg-[#22C55E]", label: "In Progress", value: "21%" },
  { dot: "bg-[#F59E0B]", label: "To Do", value: "13%" },
  { dot: "bg-[#EF4444]", label: "Blocked", value: "6%" },
];

export function PieChart({ "data-testid": testId }: { "data-testid"?: string }) {
  return (
    <div
      data-testid={testId || "chart-pie"}
      className="rounded-[16px] border border-[#232326] bg-[#111113] p-5 sm:p-6 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#FAFAFA]">Task Distribution</h3>
          <p className="mt-1 text-xs text-[#71717A]">Current sprint allocation</p>
        </div>
        <span className="rounded-[6px] border border-[#232326] bg-[#18181B] px-2 py-0.5 text-[11px] text-[#A1A1AA]">
          38 Total
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="relative h-32 w-32 shrink-0 rounded-full p-2">
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "conic-gradient(#7C5CFC 0% 60%, #22C55E 60% 81%, #F59E0B 81% 94%, #EF4444 94% 100%)",
            }}
          />
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full border border-[#232326] bg-[#111113] text-center">
            <span className="text-lg font-bold leading-none text-[#FAFAFA]">38</span>
            <span className="mt-0.5 text-[10px] font-medium text-[#71717A]">Tasks</span>
          </div>
        </div>

        <div className="w-full space-y-2.5 text-xs text-[#A1A1AA]">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${segment.dot}`} />
                <span>{segment.label}</span>
              </span>
              <span className="font-semibold text-[#FAFAFA]">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
