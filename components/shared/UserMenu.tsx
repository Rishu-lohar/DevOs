import { ChevronDown } from "lucide-react";
import { Avatar } from "../ui/Avatar";

export function UserMenu() {
  return (
    <button className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-white/[0.05]">
      <Avatar initials="RL" />
      <div className="hidden text-left sm:block">
        <p className="text-xs font-semibold text-white leading-tight">Rishu Lohar</p>
        <p className="text-[10px] text-slate-400 leading-tight">DevOS Engineer</p>
      </div>
      <ChevronDown size={14} className="text-slate-500" />
    </button>
  );
}
