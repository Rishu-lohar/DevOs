"use client";

import {
  BarChart3,
  Bot,
  Calendar,
  CheckCircle2,
  FolderKanban,
  GitBranch,
  Lightbulb,
  MessageCircle,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { AreaChart, BarChart, ContributionHeatmap, PieChart } from "@/components/charts";
import { ActivityCard, ProjectCard, SectionHeader, WorkspaceCard } from "@/components/shared";
import { Badge, Progress, StatCard } from "@/components/ui";
import { projects, tasks } from "@/lib/mock-data";
import Link from "next/link";

const quickLinks = [
  {
    title: "AI Workspace",
    icon: Sparkles,
    color: "text-[#C4B5FD]",
    bg: "bg-[rgba(124,92,252,0.12)] border-[rgba(124,92,252,0.25)]",
    desc: "Autonomous code agent",
    href: "/workspace",
  },
  {
    title: "GitHub Sync",
    icon: GitBranch,
    color: "text-[#BAE6FD]",
    bg: "bg-[rgba(56,189,248,0.1)] border-[rgba(56,189,248,0.25)]",
    desc: "Repos & pull requests",
    href: "/github",
  },
  {
    title: "Open Source",
    icon: Lightbulb,
    color: "text-[#FDE68A]",
    bg: "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.25)]",
    desc: "Discovery & bounties",
    href: "/open-source",
  },
  {
    title: "Industry Intel",
    icon: TrendingUp,
    color: "text-[#86EFAC]",
    bg: "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]",
    desc: "Tech trends & stacks",
    href: "/industry",
  },
  {
    title: "Growth Tracker",
    icon: BarChart3,
    color: "text-[#FED7AA]",
    bg: "bg-[rgba(251,146,60,0.1)] border-[rgba(251,146,60,0.25)]",
    desc: "Developer analytics",
    href: "/growth",
  },
  {
    title: "AI Mentor",
    icon: Bot,
    color: "text-[#FECDD3]",
    bg: "bg-[rgba(244,63,94,0.1)] border-[rgba(244,63,94,0.25)]",
    desc: "Architecture guidance",
    href: "/ai-mentor",
  },
];

export default function DashboardPage() {
  return (
    <div data-testid="dashboard-page" className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] px-3 py-1 text-xs font-medium text-[#86EFAC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            <span>Tuesday, May 27, 2025</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA] sm:text-3xl lg:text-[34px]">
            Welcome back, Rishu!
          </h1>
          <p className="mt-2 max-w-xl text-xs text-[#71717A] sm:text-sm">
            Here&apos;s a high-level summary of your engineering velocity, active AI tasks, and team momentum today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            data-testid="view-calendar-button"
            className="inline-flex items-center gap-2 rounded-[12px] border border-[#232326] bg-[#18181B] px-4 py-2.5 text-xs font-medium text-[#FAFAFA] transition-colors duration-150 hover:border-[#3F3F46] hover:bg-[#232326]"
          >
            <Calendar size={14} className="text-[#71717A]" />
            <span>View Calendar</span>
          </button>
          <button
            data-testid="new-project-button"
            className="inline-flex items-center gap-2 rounded-[12px] bg-[#7C5CFC] px-4 py-2.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#6B46F7] active:bg-[#5A32F5]"
          >
            <Plus size={14} />
            <span>New Project</span>
          </button>
        </div>
      </section>

      {/* Top 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Projects"
          value="4"
          trend="+2 from last week"
          icon={FolderKanban}
          accent="text-[#C4B5FD]"
        />
        <StatCard
          label="Tasks Completed"
          value="23"
          trend="+15% velocity"
          icon={CheckCircle2}
          accent="text-[#86EFAC]"
        />
        <StatCard
          label="GitHub Contributions"
          value="156"
          trend="+28% this sprint"
          icon={GitBranch}
          accent="text-[#BAE6FD]"
        />
        <StatCard
          label="AI Suggestions"
          value="12"
          trend="4 ready to review"
          icon={Bot}
          accent="text-[#FECDD3]"
        />
      </div>

      {/* AI Workspace & Today's Focus */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section>
          <SectionHeader
            title="Active AI Workspace"
            description="Autonomous context and local state streaming"
          />
          <WorkspaceCard />
        </section>
        <section>
          <SectionHeader
            title="Today's Focus"
            description="Priority tasks scheduled for today"
            action="View all tasks"
          />
          <div className="rounded-[16px] border border-[#232326] bg-[#111113] divide-y divide-[#232326] overflow-hidden">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.title}
                data-testid={`today-task-${task.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-3.5 p-4 transition-colors duration-150 hover:bg-[#18181B]"
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    task.priority === "High"
                      ? "bg-[#EF4444]"
                      : task.priority === "Medium"
                      ? "bg-[#F59E0B]"
                      : "bg-[#22C55E]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#FAFAFA]">{task.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#71717A]">{task.project}</p>
                </div>
                <Badge
                  variant={task.status === "Completed" ? "emerald" : "default"}
                >
                  {task.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Workspaces & Repos */}
      <section>
        <SectionHeader
          title="Recent Workspaces & Repos"
          description="Active code repositories and team progress"
          action="View all projects"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* Tooling Suite */}
      <section>
        <SectionHeader
          title="Intelligent Tooling Suite"
          description="Instant jump into specialized DevOS developer instruments"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {quickLinks.map(({ title, icon: Icon, color, bg, desc, href }) => (
            <Link
              key={title}
              href={href}
              data-testid={`tool-link-${title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group rounded-[16px] border border-[#232326] bg-[#111113] p-4 transition-colors duration-150 hover:border-[#3F3F46] hover:bg-[#18181B]"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-[10px] border ${bg} ${color}`}
              >
                <Icon size={17} strokeWidth={1.75} />
              </div>
              <p className="mt-3.5 text-xs font-semibold tracking-tight text-[#FAFAFA]">{title}</p>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-[#71717A]">{desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#C4B5FD] transition-colors group-hover:text-white">
                <span>Open tool</span>
                <ArrowRight size={11} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Heatmap & Activity Stream */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionHeader
            title="Contribution Velocity"
            description="GitHub push, commit, and PR momentum over the past year"
          />
          <ContributionHeatmap />
        </section>
        <section>
          <SectionHeader
            title="Live Activity Stream"
            description="Recent workspace and team updates"
          />
          <ActivityCard />
        </section>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaChart />
        </div>
        <PieChart />
        <div className="lg:col-span-3">
          <BarChart />
        </div>
      </div>

      {/* Sprint Goal & AI Mentor Insight Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div
          data-testid="sprint-goal-card"
          className="rounded-[16px] border border-[#232326] bg-[#111113] p-6 transition-colors duration-150 hover:border-[#3F3F46]"
        >
          <SectionHeader
            title="Sprint Goal Target"
            description="Weekly team target completion"
            action="Adjust"
          />
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">72%</p>
              <p className="mt-1 text-xs text-[#71717A]">3 of 4 planned milestones completed</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.1)] text-[#86EFAC]">
              <Target size={20} />
            </div>
          </div>
          <div className="mt-6">
            <Progress value={72} color="bg-[#22C55E]" />
          </div>
        </div>

        <div
          data-testid="ai-mentor-card"
          className="rounded-[16px] border border-[#232326] bg-[#111113] p-6 transition-colors duration-150 hover:border-[#3F3F46]"
        >
          <SectionHeader
            title="AI Mentor Insight"
            description="Proactive recommendations for your current sprint"
            action="Ask Mentor"
          />
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] text-[#C4B5FD]">
              <MessageCircle size={16} />
            </div>
            <div>
              <p className="text-xs font-medium leading-relaxed text-[#A1A1AA] sm:text-sm">
                &ldquo;You have shipped 156 contributions this sprint with remarkable consistency. Before branching into the new analytics module, consider resolving the 2 open PRs on the authentication flow.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full border border-[rgba(124,92,252,0.25)] bg-[rgba(124,92,252,0.12)] px-2.5 py-0.5 text-[10px] font-medium text-[#C4B5FD]">
                  DevOS Autonomous Mentor
                </span>
                <span className="text-[10px] text-[#52525B]">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
