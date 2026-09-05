import { CalendarDays } from "lucide-react";
import { Badge, Avatar, GlassCard, Progress } from "../ui";

type Project = {
  name: string;
  description: string;
  progress: number;
  status: string;
  due: string;
  members: string[];
  color: string;
};

export function ProjectCard({ project }: { project: Project }) {
  const isComplete = project.progress === 100;

  return (
    <GlassCard className="group relative overflow-hidden p-5 sm:p-6 transition-all duration-300 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100 group-hover:bg-violet-500/25"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white group-hover:text-violet-200 transition-colors">
            {project.name}
          </h3>
          <p className="mt-1 text-xs text-slate-400">{project.description}</p>
        </div>
        <Badge
          className={
            isComplete
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              : "border-violet-500/30 bg-violet-500/15 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
          }
        >
          {project.status}
        </Badge>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Velocity Progress</span>
          <span className="font-semibold text-white">{project.progress}%</span>
        </div>
        <div className="mt-2">
          <Progress
            value={project.progress}
            color={
              project.progress > 75
                ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                : "bg-gradient-to-r from-violet-500 to-indigo-500"
            }
          />
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <div className="flex -space-x-2">
          {project.members.map((member) => (
            <Avatar
              key={member}
              initials={member}
              className="h-7 w-7 border-2 border-[#0c1018] text-[9px] shadow-sm"
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <CalendarDays size={13} className="text-slate-500" />
          <span>{project.due}</span>
        </div>
      </div>
    </GlassCard>
  );
}
