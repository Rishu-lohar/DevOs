export function BarChart({ "data-testid": testId }: { "data-testid"?: string }) {
  const values = [45, 68, 38, 84, 60, 92, 74];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      data-testid={testId || "chart-bar"}
      className="rounded-[16px] border border-[#232326] bg-[#111113] p-5 sm:p-6 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#FAFAFA]">Weekly Commits</h3>
          <p className="mt-1 text-xs text-[#71717A]">Contributions across active repos</p>
        </div>
        <span className="rounded-[6px] border border-[#232326] bg-[#18181B] px-2 py-0.5 text-[11px] font-medium text-[#86EFAC]">
          92 peak
        </span>
      </div>

      <div className="mt-6 flex h-40 items-end justify-between gap-2.5 sm:gap-3">
        {values.map((value, index) => {
          const isPeak = value === Math.max(...values);
          return (
            <div key={index} className="group flex h-full flex-1 flex-col items-end justify-end gap-2">
              <div
                className={`w-full rounded-[6px] transition-colors duration-150 ${
                  isPeak
                    ? "bg-[#22C55E]"
                    : "bg-[#18181B] border border-[#232326] hover:bg-[#7C5CFC]"
                }`}
                style={{ height: `${value}%` }}
              />
              <span
                className={`text-center text-[10px] transition-colors duration-150 ${
                  isPeak ? "font-semibold text-[#86EFAC]" : "text-[#71717A]"
                }`}
              >
                {days[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
