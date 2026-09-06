import { Bot, GitBranch, FolderKanban, UsersRound } from "lucide-react";
import { activities } from "@/lib/mock-data";

const typeConfig = {
  commit: { icon: GitBranch, color: "text-[#38BDF8]" },
  project: { icon: FolderKanban, color: "text-[#C4B5FD]" },
  ai: { icon: Bot, color: "text-[#FECDD3]" },
  team: { icon: UsersRound, color: "text-[#86EFAC]" },
};

export function ActivityCard({ "data-testid": testId }: { "data-testid"?: string }) {
  return (
    <div
      data-testid={testId || "activity-card"}
      className="rounded-[16px] border border-[#232326] bg-[#111113] divide-y divide-[#232326] overflow-hidden"
    >
      {activities.map((activity) => {
        const config = typeConfig[activity.type as keyof typeof typeConfig] || typeConfig.commit;
        const Icon = config.icon;
        return (
          <div
            key={activity.title}
            className="flex items-center gap-3.5 p-4 transition-colors duration-150 hover:bg-[#18181B]"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#232326] bg-[#18181B] ${config.color}`}
            >
              <Icon size={15} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#FAFAFA]">{activity.title}</p>
              <p className="truncate text-[11px] text-[#71717A]">{activity.detail}</p>
            </div>
            <span className="shrink-0 rounded-[6px] border border-[#232326] bg-[#18181B] px-2 py-0.5 text-[10px] text-[#71717A]">
              {activity.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
