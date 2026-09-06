import { ChevronDown } from "lucide-react";
import { Avatar } from "../ui/Avatar";

export function UserMenu({ "data-testid": testId }: { "data-testid"?: string }) {
  return (
    <button
      data-testid={testId || "user-menu-button"}
      className="flex items-center gap-2.5 rounded-[10px] border border-[#232326] bg-[#111113] p-1.5 pr-3 transition-colors duration-150 hover:bg-[#18181B] hover:border-[#3F3F46]"
    >
      <Avatar initials="RL" />
      <div className="hidden text-left sm:block">
        <p className="text-xs font-semibold text-[#FAFAFA] leading-tight">Rishu Lohar</p>
        <p className="text-[10px] text-[#71717A] leading-tight">DevOS Engineer</p>
      </div>
      <ChevronDown size={13} className="text-[#71717A]" />
    </button>
  );
}
