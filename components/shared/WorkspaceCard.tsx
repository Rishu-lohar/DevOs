import { ArrowRight, Cpu, Sparkles } from "lucide-react";
import { Progress } from "../ui";
import Link from "next/link";

export function WorkspaceCard({ "data-testid": testId }: { "data-testid"?: string }) {
  return (
    <div
      data-testid={testId || "workspace-card"}
      className="group rounded-[16px] border border-[#232326] bg-[#111113] p-6 sm:p-7 transition-colors duration-150 hover:border-[#3F3F46]"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] px-2.5 py-0.5 text-[11px] font-medium text-[#C4B5FD]">
            <Sparkles size={12} />
            <span>Active AI Workspace</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-[#FAFAFA] sm:text-xl">
            DevConnect Mobile App
          </h3>
          <p className="mt-1 text-xs text-[#71717A]">
            Intelligent mobile companion for asynchronous developer peer reviews.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            {["React Native", "Firebase Auth", "TypeScript"].map((tag) => (
              <span
                key={tag}
                className="rounded-[6px] border border-[#232326] bg-[#18181B] px-2 py-0.5 text-[#A1A1AA]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden h-10 w-10 items-center justify-center rounded-[10px] border border-[#232326] bg-[#18181B] text-[#7C5CFC] sm:flex">
          <Cpu size={18} />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#71717A]">Sprint Completion</span>
          <span className="font-semibold text-[#C4B5FD]">60%</span>
        </div>
        <div className="mt-2.5">
          <Progress value={60} color="bg-[#7C5CFC]" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#232326] pt-4">
        <span className="text-xs text-[#71717A]">Last synchronized 12 mins ago</span>
        <Link
          href="/workspace"
          data-testid="resume-workspace-button"
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#232326] bg-[#18181B] px-3.5 py-2 text-xs font-semibold text-[#FAFAFA] transition-colors duration-150 hover:bg-[#232326] hover:border-[#3F3F46]"
        >
          <span>Resume Workspace</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
