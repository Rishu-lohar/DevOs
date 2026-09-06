"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  GitCommitHorizontal,
  GitPullRequest,
  Plus,
  Sparkles,
  UserPlus,
  CircleCheck,
  Rocket,
  CircleDot,
} from "lucide-react";
import { PageBody, PageHeader, SectionTitle } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/feedback";
import {
  AreaChart,
  ContributionGrid,
  DonutChart,
} from "@/components/charts";
import {
  HealthBadge,
  PriorityIndicator,
  StatCard,
  StatusBadge,
} from "@/components/domain/primitives";
import {
  activities,
  contributionHeatmap,
  dashboardStats,
  projects,
  pullRequests,
  taskDistribution,
  tasks,
  velocitySeries,
  currentUser,
  learningProgress,
} from "@/lib/data";

const activityIcons = {
  commit: GitCommitHorizontal,
  pr: GitPullRequest,
  issue: CircleDot,
  task: CircleCheck,
  member: UserPlus,
  ai: Bot,
  release: Rocket,
} as const;

export default function DashboardPage() {
  const todaysTasks = tasks.filter((t) => t.status !== "done").slice(0, 5);
  const openPrs = pullRequests.filter((p) => p.state === "open");

  return (
    <>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here is what is happening across your workspace today."
        actions={
          <>
            <Button variant="secondary" size="sm" data-testid="dashboard-range">
              May 25 – May 31
            </Button>
            <Button variant="primary" size="sm" data-testid="dashboard-new-project">
              <Plus className="h-3 w-3" />
              New project
            </Button>
          </>
        }
      />

      <PageBody className="space-y-4">
        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((s) => (
            <StatCard
              key={s.id}
              label={s.label}
              value={s.value}
              delta={s.delta}
              trend={s.trend}
              hint={s.hint}
            />
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          {/* Velocity */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div>
                <p className="text-[13px] font-medium text-text-primary">
                  Engineering velocity
                </p>
                <p className="text-[11px] text-text-muted">
                  Commits, PRs and reviews across 12 sprints
                </p>
              </div>
              <Badge variant="success">+28.4%</Badge>
            </div>
            <div className="p-3">
              <AreaChart
                data={velocitySeries}
                xKey="week"
                series={[
                  { key: "commits" },
                  { key: "prs", color: "var(--success)" },
                  { key: "reviews", color: "var(--warning)" },
                ]}
                height={196}
              />
            </div>
          </Card>

          {/* Task summary */}
          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Task summary</p>
              <p className="text-[11px] text-text-muted">Current sprint allocation</p>
            </div>
            <div className="p-4">
              <DonutChart data={taskDistribution} height={150} />
            </div>
          </Card>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          {/* Project overview */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">
                Project overview
              </p>
              <Button asChild variant="ghost" size="xs">
                <Link href="/projects" data-testid="dashboard-view-projects">
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects`}
                  data-testid={`dashboard-project-${p.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-text-primary">
                        {p.name}
                      </p>
                      <HealthBadge health={p.health} />
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-text-muted">
                      {p.openTasks} open · {p.totalTasks} total · updated {p.updatedAt}
                    </p>
                  </div>
                  <div className="hidden w-28 shrink-0 sm:block">
                    <Progress value={p.progress} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[12px] font-medium text-text-primary">
                    {p.progress}%
                  </span>
                  <AvatarGroup names={p.members} max={3} size="sm" />
                </Link>
              ))}
            </div>
          </Card>

          {/* Today's focus */}
          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Today&apos;s focus</p>
              <Button asChild variant="ghost" size="xs">
                <Link href="/tasks">All tasks</Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {todaysTasks.map((t) => (
                <div
                  key={t.id}
                  data-testid={`dashboard-task-${t.key}`}
                  className="flex items-center gap-2.5 px-4 py-2 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <PriorityIndicator priority={t.priority} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-text-primary">{t.title}</p>
                    <p className="text-[11px] text-text-muted">
                      <span className="font-mono">{t.key}</span> · {t.due}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* GitHub activity + heatmap */}
        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">
                Contribution activity
              </p>
              <span className="text-[11px] text-text-muted">156 contributions this year</span>
            </div>
            <div className="p-4">
              <ContributionGrid data={contributionHeatmap} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Open pull requests</p>
              <Button asChild variant="ghost" size="xs">
                <Link href="/github">GitHub</Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {openPrs.map((pr) => (
                <div
                  key={pr.id}
                  data-testid={`dashboard-pr-${pr.number}`}
                  className="px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-3 w-3 shrink-0 text-success" />
                    <p className="truncate text-[12px] text-text-primary">{pr.title}</p>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-text-muted">
                    {pr.repo} #{pr.number} · {pr.checks}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity + AI + Growth */}
        <div className="grid gap-3 xl:grid-cols-3">
          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Recent activity</p>
            </div>
            <div className="divide-y divide-border">
              {activities.slice(0, 6).map((a) => {
                const Icon = activityIcons[a.type];
                return (
                  <div key={a.id} className="flex gap-2.5 px-4 py-2.5">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-text-primary">{a.title}</p>
                      <p className="truncate text-[11px] text-text-muted">{a.detail}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-text-muted">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <p className="text-[13px] font-medium text-text-primary">AI overview</p>
              <Badge variant="accent" className="ml-auto">4 new</Badge>
            </div>
            <div className="p-4">
              <p className="text-[12px] leading-relaxed text-text-secondary">
                You shipped 156 contributions this sprint with steady velocity. Before
                starting the analytics module, close the two open PRs on the
                authentication flow — both have passing checks.
              </p>
              <div className="mt-3 space-y-1.5">
                {[
                  "Detect silent auth handler failure",
                  "Add unit tests for token rotation",
                  "Optimise bundle size on mobile shell",
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="truncate text-[11px] text-text-secondary">{s}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
                <Link href="/ai-mentor" data-testid="dashboard-open-mentor">
                  Open AI Mentor
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Growth summary</p>
              <Button asChild variant="ghost" size="xs">
                <Link href="/growth">Details</Link>
              </Button>
            </div>
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "Streak", v: "35d" },
                  { l: "Skills", v: "12" },
                  { l: "Hours", v: "48" },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="rounded-lg border border-border bg-surface px-2.5 py-2 text-center"
                  >
                    <p className="text-[15px] font-semibold text-text-primary">{x.v}</p>
                    <p className="text-[10px] text-text-muted">{x.l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-1">
                {learningProgress.slice(0, 3).map((lp) => (
                  <div key={lp.id}>
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="truncate text-text-secondary">{lp.topic}</span>
                      <span className="font-medium text-text-primary">{lp.progress}%</span>
                    </div>
                    <Progress value={lp.progress} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
