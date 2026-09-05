"use client";

import { motion } from "framer-motion";
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
import { Badge, GlassCard, Progress, StatCard } from "@/components/ui";
import { projects, tasks } from "@/lib/mock-data";
import Link from "next/link";

const quickLinks = [
  {
    title: "AI Workspace",
    icon: Sparkles,
    color: "text-violet-300",
    bg: "bg-violet-500/10 border-violet-500/20",
    desc: "Autonomous code agent",
    href: "/workspace",
  },
  {
    title: "GitHub Sync",
    icon: GitBranch,
    color: "text-sky-300",
    bg: "bg-sky-500/10 border-sky-500/20",
    desc: "Repos & pull requests",
    href: "/github",
  },
  {
    title: "Open Source",
    icon: Lightbulb,
    color: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/20",
    desc: "Discovery & bounties",
    href: "/open-source",
  },
  {
    title: "Industry Intel",
    icon: TrendingUp,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    desc: "Tech trends & stacks",
    href: "/industry",
  },
  {
    title: "Growth Tracker",
    icon: BarChart3,
    color: "text-orange-300",
    bg: "bg-orange-500/10 border-orange-500/20",
    desc: "Developer analytics",
    href: "/growth",
  },
  {
    title: "AI Mentor",
    icon: Bot,
    color: "text-pink-300",
    bg: "bg-pink-500/10 border-pink-500/20",
    desc: "Architecture guidance",
    href: "/ai-mentor",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Tuesday, May 27, 2025</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Welcome back, Rishu! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
            Here&apos;s a high-level summary of your engineering velocity, active AI tasks, and team momentum today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-white/20">
            <Calendar size={14} className="text-slate-400" />
            <span>View Calendar</span>
          </button>
          <button className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] transition-all hover:shadow-[0_0_32px_rgba(139,92,246,0.55)] hover:brightness-110">
            <Plus size={14} />
            <span>New Project</span>
          </button>
        </div>
      </motion.section>

      {/* 4 Stat Cards Row */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="Active Projects"
            value="4"
            trend="+2 from last week"
            icon={FolderKanban}
            accent="text-violet-300 border-violet-500/30 bg-violet-500/10"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="Tasks Completed"
            value="23"
            trend="+15% velocity"
            icon={CheckCircle2}
            accent="text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="GitHub Contributions"
            value="156"
            trend="+28% this sprint"
            icon={GitBranch}
            accent="text-sky-300 border-sky-500/30 bg-sky-500/10"
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="AI Suggestions"
            value="12"
            trend="4 ready to review"
            icon={Bot}
            accent="text-pink-300 border-pink-500/30 bg-pink-500/10"
          />
        </motion.div>
      </motion.div>

      {/* Workspace & Today's Focus Row */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section>
          <SectionHeader title="Active AI Workspace" description="Autonomous context and local state streaming" />
          <WorkspaceCard />
        </section>

        <section>
          <SectionHeader title="Today's Focus" description="Priority tasks scheduled for today" action="View all tasks" />
          <GlassCard className="divide-y divide-white/[0.06]">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.title} className="flex items-center gap-3.5 p-4 transition-colors hover:bg-white/[0.025]">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    task.priority === "High"
                      ? "bg-rose-400 shadow-[0_0_8px_#fb7185]"
                      : task.priority === "Medium"
                      ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                      : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">{task.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{task.project}</p>
                </div>
                <Badge
                  className={
                    task.status === "Completed"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/[0.04] text-slate-300"
                  }
                >
                  {task.status}
                </Badge>
              </div>
            ))}
          </GlassCard>
        </section>
      </div>

      {/* Recent Projects Section */}
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

      {/* Quick Access Tools Grid */}
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
              className="glass-card group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${bg} ${color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={19} />
              </div>
              <p className="mt-4 text-xs font-semibold text-white tracking-tight">{title}</p>
              <p className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">{desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-violet-300 group-hover:text-white transition-colors">
                <span>Open tool</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Momentum & Activity Row */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionHeader
            title="Contribution Velocity"
            description="GitHub push, commit, and PR momentum over the past year"
          />
          <ContributionHeatmap />
        </section>
        <section>
          <SectionHeader title="Live Activity Stream" description="Recent workspace and team updates" />
          <ActivityCard />
        </section>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaChart />
        </div>
        <PieChart />
        <div className="lg:col-span-3">
          <BarChart />
        </div>
      </div>

      {/* Sprint Target & AI Mentor Recommendation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="p-6">
          <SectionHeader title="Sprint Goal Target" description="Weekly team target completion" action="Adjust" />
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">72%</p>
              <p className="mt-1 text-xs text-slate-400">3 of 4 planned milestones completed</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Target size={24} />
            </div>
          </div>
          <div className="mt-6">
            <Progress value={72} color="bg-gradient-to-r from-emerald-400 to-teal-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeader
            title="AI Mentor Insight"
            description="Proactive recommendations for your current sprint"
            action="Ask Mentor"
          />
          <div className="mt-4 flex gap-4 items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/15 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                &ldquo;You have shipped 156 contributions this sprint with remarkable consistency. Before branching into the new analytics module, consider resolving the 2 open PRs on the authentication flow.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 text-[10px] font-medium text-violet-300">
                  DevOS Autonomous Mentor
                </span>
                <span className="text-[10px] text-slate-500">Just now</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}