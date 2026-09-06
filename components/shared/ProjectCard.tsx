import { CalendarDays } from "lucide-react";
import { Avatar, Badge, Progress } from "../ui";

type Project = {
  name: string;
  description: string;
  progress: number;
  status: string;
  due: string;
  members: string[];
  color: string;
};

export function ProjectCard({
  project,
  "data-testid": testId,
}: {
  project: Project;
  "data-testid"?: string;
}) {
  const isComplete = project.progress === 100;

  return (
    <div
      data-testid={testId || `project-card-${project.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="group rounded-[16px] border border-[#232326] bg-[#111113] p-5 sm:p-6 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#FAFAFA] transition-colors duration-150 group-hover:text-white">
            {project.name}
          </h3>
          <p className="mt-1 text-xs text-[#71717A]">{project.description}</p>
        </div>
        <Badge
          variant={isComplete ? "emerald" : "purple"}
          className="shrink-0"
        >
          {project.status}
        </Badge>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#71717A]">Velocity Progress</span>
          <span className="font-semibold text-[#FAFAFA]">{project.progress}%</span>
        </div>
        <div className="mt-2">
          <Progress
            value={project.progress}
            color={project.progress > 75 ? "bg-[#22C55E]" : "bg-[#7C5CFC]"}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#232326] pt-3">
        <div className="flex -space-x-2">
          {project.members.map((member) => (
            <Avatar key={member} initials={member} className="h-6 w-6 border-2 border-[#111113] text-[9px]" />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#71717A]">
          <CalendarDays size={12} className="text-[#52525B]" />
          <span>{project.due}</span>
        </div>
      </div>
    </div>
  );
}
