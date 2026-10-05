"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitCommitHorizontal,
  GitPullRequest,
  Plus,
  Sparkles,
} from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/feedback";
import {
  AreaChart,
  ContributionGrid,
  DonutChart,
} from "@/components/charts";
import {
  StatCard,
  StatusBadge,
} from "@/components/domain/primitives";
import { apiRequest } from "@/lib/client-api";
import { useGitHubAnalytics } from "@/components/github/use-github-analytics";
import type { TaskStatus } from "@/lib/types";
import { EmptyState } from "@/components/ui/feedback";

type DashboardProjectRecord = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  user: { id: string; name: string };
  tasks: { id: string; status: string }[];
};

type DashboardTaskRecord = {
  id: string;
  title: string;
  status: string;
  project: { id: string; name: string };
  user: { id: string; name: string };
};

type DashboardResponse = {
  success: boolean;
  data: {
    profile: { name: string };
    projects: DashboardProjectRecord[];
    tasks: DashboardTaskRecord[];
    stats: { activeProjects: number };
  };
};

const taskStatusByValue: Record<string, TaskStatus> = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
  BLOCKED: "blocked",
};

const activityIcons = {
  commit: GitCommitHorizontal,
  pr: GitPullRequest,
} as const;

function timeAgo(date: string) {
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = React.useState<DashboardResponse | null>(null);
  const [dashboardError, setDashboardError] = React.useState("");
  const github = useGitHubAnalytics();

  React.useEffect(() => {
    apiRequest<DashboardResponse>("/api/dashboard")
      .then((data) => {
        setDashboardData(data);
        setDashboardError("");
      })
      .catch((error: unknown) => {
        setDashboardError(error instanceof Error ? error.message : "Failed to load dashboard data");
      });
  }, []);

  const dashboardProjects = dashboardData?.data.projects ?? [];
  const dashboardTasks = dashboardData?.data.tasks ?? [];
  const taskCounts = {
    done: dashboardTasks.filter((task) => task.status === "DONE").length,
    inProgress: dashboardTasks.filter((task) => task.status === "IN_PROGRESS").length,
    todo: dashboardTasks.filter((task) => task.status === "TODO").length,
    blocked: dashboardTasks.filter((task) => task.status === "BLOCKED").length,
  };
  const hasTasks = Object.values(taskCounts).some((count) => count > 0);
  const taskDistribution = [
    { name: "Done", value: taskCounts.done, key: "done" },
    { name: "In Progress", value: taskCounts.inProgress, key: "in-progress" },
    { name: "To Do", value: taskCounts.todo, key: "todo" },
    { name: "Blocked", value: taskCounts.blocked, key: "blocked" },
  ];
  const todaysTasks = dashboardTasks
    .filter((task) => task.status === "TODO" || task.status === "IN_PROGRESS" || task.status === "BLOCKED")
    .slice(0, 5);
  const githubHint = github.data
    ? "GitHub · last 12 months"
    : github.status === "loading"
      ? "Loading GitHub analytics…"
      : github.message;
  const visibleStats = [
    {
      id: "active-projects",
      label: "Active projects",
      value: dashboardData ? String(dashboardData.data.stats.activeProjects) : "—",
      hint: "DevOS workspace",
    },
    {
      id: "tasks-completed",
      label: "Tasks completed",
      value: dashboardData ? String(taskCounts.done) : "—",
      hint: "DevOS workspace",
    },
    {
      id: "contributions",
      label: "Contributions",
      value: github.data ? String(github.data.contributionCount) : "—",
      hint: githubHint,
    },
    {
      id: "open-prs",
      label: "Open PRs",
      value:
        github.data?.openPullRequestsCount == null
          ? "—"
          : String(github.data.openPullRequestsCount),
      hint:
        github.data && !github.data.openPullRequestsAvailable
          ? "GitHub PR data unavailable"
          : githubHint,
    },
  ];
  const openPrs = github.data?.openPullRequests ?? [];
  const dashboardActivities = (github.data?.recentActivity ?? []).map((activity) => ({
      id: activity.id,
      type: activity.type === "review" ? "pr" as const : activity.type,
      title: activity.title,
      detail: activity.detail,
      time: timeAgo(activity.occurredAt),
    })).slice(0, 6);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${dashboardData?.data.profile.name.split(" ")[0] ?? "User"}`}
        description="Here is what is happening across your workspace today."
        actions={
          <>
            <Button variant="secondary" size="sm" data-testid="dashboard-range">
              This week
            </Button>
            <Button variant="primary" size="sm" data-testid="dashboard-new-project">
              <Plus className="h-3 w-3" />
              New project
            </Button>
          </>
        }
      />

      <PageBody className="space-y-4">
        {dashboardError && <p role="alert" className="text-[12px] text-danger">{dashboardError}</p>}
        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleStats.map((s) => (
            <StatCard
              key={s.id}
              label={s.label}
              value={s.value}
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
                  GitHub commits, PRs and reviews over the last 12 weeks
                </p>
              </div>
              <Badge variant="default">GitHub activity</Badge>
            </div>
            <div className="p-3">
              {github.data ? (
                <AreaChart
                  data={github.data.weeklyActivity}
                  xKey="week"
                  series={[
                    { key: "commits" },
                    { key: "prs", color: "var(--success)" },
                    { key: "reviews", color: "var(--warning)" },
                  ]}
                  height={196}
                />
              ) : (
                <p className="py-16 text-center text-[12px] text-text-muted">
                  {github.status === "loading"
                    ? "Loading GitHub activity…"
                    : github.message}
                </p>
              )}
            </div>
          </Card>

          {/* Task summary */}
          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Task summary</p>
              <p className="text-[11px] text-text-muted">DevOS task statuses</p>
            </div>
            <div className="p-4">
              {dashboardData && hasTasks ? (
                <DonutChart data={taskDistribution} height={150} />
              ) : (
                <p className="py-8 text-center text-[12px] text-text-muted">
                  {dashboardError
                    ? "Workspace task data unavailable."
                    : dashboardData
                      ? "No tasks yet."
                      : "Loading workspace data…"}
                </p>
              )}
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
              {dashboardProjects.slice(0, 4).map((project) => {
                const totalTasks = project.tasks.length;
                const completedTasks = project.tasks.filter(
                  (task) => task.status === "DONE",
                ).length;
                const progress = totalTasks
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0;
                return (
                <Link
                  key={project.id}
                  href={`/projects`}
                  data-testid={`dashboard-project-${project.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-text-primary">
                        {project.name}
                      </p>
                      <Badge variant="default">{project.status}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-text-muted">
                      {totalTasks - completedTasks} open · {totalTasks} total · created {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="hidden w-28 shrink-0 sm:block">
                    <Progress value={progress} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[12px] font-medium text-text-primary">
                    {progress}%
                  </span>
                  <AvatarGroup names={[project.user.name]} max={3} size="sm" />
                </Link>
                );
              })}
              {dashboardData && dashboardProjects.length === 0 && (
                <EmptyState
                  title="No projects yet"
                  description="Projects you create in DevOS will appear here."
                />
              )}
              {!dashboardData && dashboardError && (
                <EmptyState title="Workspace data unavailable" description={dashboardError} />
              )}
              {!dashboardData && !dashboardError && (
                <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                  Loading workspace data…
                </p>
              )}
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
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  data-testid={`dashboard-task-${task.id}`}
                  className="flex items-center gap-2.5 px-4 py-2 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-text-primary">{task.title}</p>
                    <p className="text-[11px] text-text-muted">
                      {task.project.name} · {task.user.name}
                    </p>
                  </div>
                  <StatusBadge status={taskStatusByValue[task.status] ?? "todo"} />
                </div>
              ))}
              {dashboardData && todaysTasks.length === 0 && (
                <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                  {dashboardTasks.length === 0 ? "No tasks yet." : "No open tasks."}
                </p>
              )}
              {!dashboardData && (
                <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                  {dashboardError ? "Workspace task data unavailable." : "Loading workspace data…"}
                </p>
              )}
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
              <span className="text-[11px] text-text-muted">
                {github.data
                  ? `${github.data.contributionCount.toLocaleString()} contributions in the last year`
                  : github.status === "loading"
                    ? "Loading GitHub activity…"
                    : "GitHub activity unavailable"}
              </span>
            </div>
            <div className="p-4">
              {github.data ? (
                <ContributionGrid
                  data={github.data.contributionDays.map(({ count }) =>
                    count === 0 ? 0 : count < 4 ? 1 : count < 7 ? 2 : count < 10 ? 3 : 4,
                  )}
                  counts={github.data.contributionDays.map(({ count }) => count)}
                />
              ) : (
                <p className="py-8 text-center text-[12px] text-text-muted">
                  {github.status === "loading"
                    ? "Loading GitHub activity…"
                    : github.message}
                </p>
              )}
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
                  key={pr.url}
                  data-testid={`dashboard-pr-${pr.number}`}
                  className="px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                >
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-3 w-3 shrink-0 text-success" />
                    <p className="truncate text-[12px] text-text-primary">{pr.title}</p>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-text-muted">
                    {pr.repository} #{pr.number} · updated {timeAgo(pr.updatedAt)}
                  </p>
                </div>
              ))}
              {github.data && openPrs.length === 0 && (
                <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                  {github.data.openPullRequestsAvailable
                    ? "No open pull requests."
                    : "Open pull request data is unavailable."}
                </p>
              )}
              {!github.data && (
                <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                  {github.status === "loading" ? "Loading GitHub activity…" : github.message}
                </p>
              )}
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
              {dashboardActivities.map((a) => {
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
              {dashboardActivities.length === 0 && (
                <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                  {github.status === "loading"
                    ? "Loading GitHub activity…"
                    : github.data
                      ? "No GitHub activity in the last year."
                      : github.message}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <p className="text-[13px] font-medium text-text-primary">AI overview</p>
            </div>
            <div className="p-4">
              <p className="text-[12px] leading-relaxed text-text-secondary">
                AI insights are not connected.
              </p>
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
                  {
                    l: "Streak",
                    v: github.data
                      ? github.data.currentStreak === null
                        ? "—"
                        : `${github.data.currentStreak}d`
                      : "—",
                  },
                  { l: "Contributions", v: github.data ? String(github.data.contributionCount) : "—" },
                  { l: "Reviews", v: github.data ? String(github.data.reviews) : "—" },
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
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
