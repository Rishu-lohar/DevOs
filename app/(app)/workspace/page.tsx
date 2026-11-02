"use client";

import * as React from "react";
import {
  Boxes,
  FileCode,
  Plus,
  Sparkles,
  CircleCheck,
  CircleDashed,
  CircleDot,
} from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/feedback";
import { DonutChart } from "@/components/charts";
import { StatCard, StatusBadge } from "@/components/domain/primitives";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { apiRequest } from "@/lib/client-api";
import type { TaskStatus } from "@/lib/types";

type WorkspaceProject = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  role: "OWNER" | "MANAGER" | "DEVELOPER";
  createdAt: string;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
};

type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  skills: string[];
  role: "OWNER" | "MANAGER" | "DEVELOPER";
  workload: { openTasks: number; estimateHours: number };
};

type WorkspaceTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  estimate: number | null;
  dueDate: string | null;
  completed: boolean;
  user: { id: string; name: string };
  assignee: Pick<WorkspaceMember, "id" | "name" | "email" | "avatarUrl" | "jobTitle" | "skills"> | null;
  milestone: { id: string; title: string } | null;
  dependsOn: Array<{ dependsOnTask: { id: string; title: string } }>;
  dependents: Array<{ task: { id: string; title: string } }>;
};

type WorkspaceMilestone = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "LATE";
  _count: { tasks: number };
};

type WorkspaceActivity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null } | null;
  task: { id: string; title: string } | null;
};

type WorkspaceDocument = {
  id: string;
  name: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
  uploadedBy: { id: string; name: string; email: string };
};

type WorkspaceData = {
  projects: Array<Pick<WorkspaceProject, "id" | "name" | "description" | "role">>;
  project: WorkspaceProject | null;
  members: WorkspaceMember[];
  tasks: WorkspaceTask[];
  milestones: WorkspaceMilestone[];
  activities: WorkspaceActivity[];
  documents: WorkspaceDocument[];
  insights: {
    completion: number;
    distribution: Array<{ name: string; value: number }>;
    upcomingDeadlines: Array<{ id: string; title: string; kind: string; dueDate: string }>;
    blockedTasks: Array<{ id: string; title: string; dueDate: string | null }>;
    workload: Array<{
      id: string;
      name: string;
      role: string;
      openTasks: number;
      estimateHours: number;
    }>;
    risks: string[];
    recommendations: string[];
    aiRisks: string[];
    recommendationSource: "ollama" | "fallback" | null;
    latestPlanAt: string | null;
  };
};

type PlanMilestone = {
  title: string;
  description: string;
  dueDate: string | null;
};

type PlanTask = {
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  estimate: number;
  milestoneIndex: number | null;
  dependencies: number[];
  dueDate: string | null;
};

type Plan = {
  title: string;
  source: "ollama" | "fallback";
  fallbackReason: string | null;
  milestones: PlanMilestone[];
  tasks: PlanTask[];
  recommendations: string[];
  risks: string[];
};

type PlanAssignment = { assigneeId: string | null; explanation: string };
type PlanPreview = {
  projectId: string | null;
  mode: "individual" | "manager";
  plan: Plan;
  assignments: PlanAssignment[];
  members: Array<{ id: string; name: string; jobTitle: string | null; skills: string[] }>;
  allocationNote: string | null;
};

const emptyInsights: WorkspaceData["insights"] = {
  completion: 0,
  distribution: [],
  upcomingDeadlines: [],
  blockedTasks: [],
  workload: [],
  risks: [],
  recommendations: [],
  aiRisks: [],
  recommendationSource: null,
  latestPlanAt: null,
};

function formatDate(value: string | null | undefined) {
  if (!value) return "No date set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function formatSize(bytes: number | null) {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function taskStatus(status: string): TaskStatus {
  switch (status) {
    case "IN_PROGRESS":
      return "in-progress";
    case "DONE":
      return "done";
    case "BLOCKED":
      return "blocked";
    case "REVIEW":
      return "review";
    default:
      return "todo";
  }
}

function milestoneState(status: WorkspaceMilestone["status"]) {
  if (status === "COMPLETED") return "done";
  if (status === "IN_PROGRESS") return "active";
  return "upcoming";
}

export default function WorkspacePage() {
  const [workspace, setWorkspace] = React.useState<WorkspaceData | null>(null);
  const [workspaceError, setWorkspaceError] = React.useState("");
  const [selectedProjectId, setSelectedProjectId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const requestSequence = React.useRef(0);

  const [planOpen, setPlanOpen] = React.useState(false);
  const [planProjectId, setPlanProjectId] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [mode, setMode] = React.useState<"individual" | "manager">("individual");
  const [planPreview, setPlanPreview] = React.useState<PlanPreview | null>(null);
  const [planError, setPlanError] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSavingPlan, setIsSavingPlan] = React.useState(false);

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [taskError, setTaskError] = React.useState("");
  const [isSavingTask, setIsSavingTask] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteError, setInviteError] = React.useState("");
  const [inviteResult, setInviteResult] = React.useState("");
  const [isSavingInvite, setIsSavingInvite] = React.useState(false);

  const refreshWorkspace = React.useCallback(async (projectId?: string) => {
    const sequence = ++requestSequence.current;
    setIsLoading(true);
    setWorkspaceError("");
    try {
      const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
      const data = await apiRequest<WorkspaceData>(`/api/workspace${query}`, {
        cache: "no-store",
      });
      if (sequence !== requestSequence.current) return;
      setWorkspaceError("");
      setWorkspace(data);
    } catch (error) {
      if (sequence !== requestSequence.current) return;
      setWorkspaceError(error instanceof Error ? error.message : "Unable to load workspace");
    } finally {
      if (sequence === requestSequence.current) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const sequence = ++requestSequence.current;
    let active = true;
    const query = selectedProjectId
      ? `?projectId=${encodeURIComponent(selectedProjectId)}`
      : "";
    void apiRequest<WorkspaceData>(`/api/workspace${query}`, { cache: "no-store" })
      .then((data) => {
        if (!active || sequence !== requestSequence.current) return;
        setWorkspaceError("");
        setWorkspace(data);
        if (!selectedProjectId && data.project) setSelectedProjectId(data.project.id);
      })
      .catch((error: unknown) => {
        if (!active || sequence !== requestSequence.current) return;
        setWorkspaceError(error instanceof Error ? error.message : "Unable to load workspace");
      })
      .finally(() => {
        if (active && sequence === requestSequence.current) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedProjectId]);

  const project = workspace?.project ?? null;
  const projects = workspace?.projects ?? [];
  const members = workspace?.members ?? [];
  const projectTasks = workspace?.tasks ?? [];
  const milestones = workspace?.milestones ?? [];
  const activities = workspace?.activities ?? [];
  const documents = workspace?.documents ?? [];
  const insights = workspace?.insights ?? emptyInsights;
  const isManager = project?.role === "OWNER" || project?.role === "MANAGER";
  const completedTasks = projectTasks.filter((task) => task.completed || task.status === "DONE").length;
  const inFlightTasks = projectTasks.filter((task) => task.status === "IN_PROGRESS").length;
  const backlogTasks = projectTasks.filter((task) => task.status === "TODO").length;
  const openTasks = projectTasks.filter((task) => !task.completed && task.status !== "DONE").length;
  const maximumWorkload = Math.max(1, ...insights.workload.map((item) => item.estimateHours));

  function openPlanDialog() {
    setPlanError("");
    setPlanPreview(null);
    setRequirements("");
    setProjectName("");
    setPlanProjectId(selectedProjectId);
    setMode("individual");
    setPlanOpen(true);
  }

  function updatePlanTask(index: number, patch: Partial<PlanTask>) {
    setPlanPreview((current) =>
      current
        ? {
            ...current,
            plan: {
              ...current.plan,
              tasks: current.plan.tasks.map((task, taskIndex) =>
                taskIndex === index ? { ...task, ...patch } : task,
              ),
            },
          }
        : current,
    );
  }

  function updatePlanMilestone(index: number, patch: Partial<PlanMilestone>) {
    setPlanPreview((current) =>
      current
        ? {
            ...current,
            plan: {
              ...current.plan,
              milestones: current.plan.milestones.map((milestone, milestoneIndex) =>
                milestoneIndex === index ? { ...milestone, ...patch } : milestone,
              ),
            },
          }
        : current,
    );
  }

  async function generatePlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setPlanError("");
    setPlanPreview(null);
    try {
      const result = await apiRequest<PlanPreview>("/api/workspace/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: planProjectId || undefined,
          projectName: planProjectId ? undefined : projectName,
          requirements,
          mode,
        }),
      });
      setPlanPreview(result);
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : "Unable to generate a plan");
    } finally {
      setIsGenerating(false);
    }
  }

  async function approvePlan() {
    if (!planPreview) return;
    setIsSavingPlan(true);
    setPlanError("");
    try {
      const result = await apiRequest<{ projectId: string }>("/api/workspace/plan/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: planPreview.projectId || undefined,
          newProject: planPreview.projectId
            ? undefined
            : { name: projectName, description: requirements.slice(0, 2000) },
          mode: planPreview.mode,
          requirements,
          plan: planPreview.plan,
          assigneeIds: planPreview.assignments.map((assignment) =>
            planPreview.mode === "manager" ? assignment.assigneeId : null,
          ),
        }),
      });
      setPlanOpen(false);
      setSelectedProjectId(result.projectId);
      await refreshWorkspace(result.projectId);
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : "Unable to save the approved plan");
    } finally {
      setIsSavingPlan(false);
    }
  }

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) return;
    setIsSavingTask(true);
    setTaskError("");
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          title: form.get("title"),
          description: form.get("description") || undefined,
          priority: form.get("priority"),
          estimate: Number(form.get("estimate")),
          dueDate: form.get("dueDate") || undefined,
        }),
      });
      setTaskOpen(false);
      await refreshWorkspace(project.id);
    } catch (error) {
      setTaskError(error instanceof Error ? error.message : "Unable to create task");
    } finally {
      setIsSavingTask(false);
    }
  }

  async function createInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) return;
    setIsSavingInvite(true);
    setInviteError("");
    setInviteResult("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await apiRequest<{ delivery: string }>("/api/workspace/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          email: form.get("email"),
          role: form.get("role"),
        }),
      });
      setInviteResult(
        result.delivery === "not_configured"
          ? "Invitation saved. Email delivery is not configured."
          : "Invitation sent.",
      );
      event.currentTarget.reset();
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : "Unable to save invitation");
    } finally {
      setIsSavingInvite(false);
    }
  }

  const selectedProjectRole = projects.find((item) => item.id === planProjectId)?.role;
  const canUseManagerMode = selectedProjectRole === "OWNER" || selectedProjectRole === "MANAGER";

  return (
    <>
      <PageHeader
        title="AI Workspace"
        description={
          project
            ? `${project.name} · ${project.role.toLowerCase()}`
            : "Create a personal project plan or choose a workspace"
        }
        actions={
          <>
            {projects.length > 1 && (
              <select
                aria-label="Select workspace project"
                className="h-7 max-w-[190px] rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary"
                value={project?.id ?? ""}
                onChange={(event) => {
                  setIsLoading(true);
                  setSelectedProjectId(event.target.value);
                }}
              >
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            )}
            <Button
              variant="secondary"
              size="sm"
              data-testid="workspace-invite"
              disabled={!project || !isManager}
              onClick={() => {
                setInviteError("");
                setInviteResult("");
                setInviteOpen(true);
              }}
            >
              Invite member
            </Button>
            <Button
              variant="primary"
              size="sm"
              data-testid="workspace-new-task"
              disabled={!project}
              onClick={() => {
                setTaskError("");
                setTaskOpen(true);
              }}
            >
              <Plus className="h-3 w-3" />
              New task
            </Button>
          </>
        }
      />

      <PageBody className="space-y-4">
        {workspaceError && (
          <p role="alert" className="rounded-md border border-danger/30 bg-danger-subtle px-3 py-2 text-[12px] text-danger">
            {workspaceError}
          </p>
        )}
        {isLoading && !workspace && (
          <p className="text-[12px] text-text-muted" role="status">Loading workspace data…</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Project completion" value={`${insights.completion}%`} hint={`${completedTasks} of ${projectTasks.length} saved tasks complete`} />
          <StatCard label="Open tasks" value={String(openTasks)} hint="from saved project tasks" />
          <StatCard label="Members" value={String(members.length)} hint="project owner and members" />
          <StatCard label="Branches" value="—" hint="GitHub branch data is not connected" />
        </div>

        <Tabs defaultValue="overview">
          <TabsList data-testid="workspace-tabs">
            <TabsTrigger value="overview" data-testid="workspace-tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline" data-testid="workspace-tab-timeline">Timeline</TabsTrigger>
            <TabsTrigger value="members" data-testid="workspace-tab-members">Members</TabsTrigger>
            <TabsTrigger value="files" data-testid="workspace-tab-files">Files</TabsTrigger>
            <TabsTrigger value="branches" data-testid="workspace-tab-branches">Branches</TabsTrigger>
            <TabsTrigger value="activity" data-testid="workspace-tab-activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-3 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-3.5 w-3.5 text-accent" />
                    <p className="text-[13px] font-medium text-text-primary">{project?.name ?? "No project selected"}</p>
                    {project && <Badge variant="outline">{project.status}</Badge>}
                  </div>
                  {project && <span className="text-[11px] text-text-muted">Created {formatDate(project.createdAt)}</span>}
                </div>
                <div className="space-y-4 p-4">
                  <p className="text-[12px] leading-relaxed text-text-secondary">
                    {project?.description || "Create a plan to start a personal project, or select a project you can access."}
                  </p>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                      <span className="text-text-muted">Overall progress</span>
                      <span className="font-medium text-text-primary">{insights.completion}%</span>
                    </div>
                    <Progress value={insights.completion} />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { label: "Completed", value: completedTasks, Icon: CircleCheck, color: "text-success" },
                      { label: "In flight", value: inFlightTasks, Icon: CircleDot, color: "text-accent" },
                      { label: "Backlog", value: backlogTasks, Icon: CircleDashed, color: "text-text-muted" },
                    ].map(({ label, value, Icon, color }) => (
                      <div key={label} className="rounded-lg border border-border bg-surface px-3 py-2">
                        <Icon className={`h-3.5 w-3.5 ${color}`} />
                        <p className="mt-1.5 text-[16px] font-semibold text-text-primary">{value}</p>
                        <p className="text-[11px] text-text-muted">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="space-y-3">
                <Card>
                  <div className="border-b border-border px-4 py-2.5">
                    <p className="text-[13px] font-medium text-text-primary">Task distribution</p>
                  </div>
                  <div className="p-4">
                    <DonutChart data={insights.distribution} height={140} />
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                      <p className="text-[13px] font-medium text-text-primary">AI suggestions</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {insights.recommendationSource && (
                        <Badge variant={insights.recommendationSource === "fallback" ? "warning" : "success"}>
                          {insights.recommendationSource === "fallback" ? "Fallback" : "Ollama"}
                        </Badge>
                      )}
                      <Button size="xs" variant="subtle" data-testid="workspace-generate-plan" onClick={openPlanDialog}>
                        Generate plan
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {insights.recommendations.length === 0 && (
                      <p className="px-4 py-2 text-[12px] text-text-muted">
                        No approved AI plan recommendations yet. Generate and approve a project plan to see recommendations here.
                      </p>
                    )}
                    {insights.recommendations.map((recommendation, index) => (
                      <div key={`${recommendation}-${index}`} className="flex items-start gap-2 px-4 py-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-[12px] leading-snug text-text-secondary">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-2">
                    <p className="text-[11px] font-medium text-text-muted">Project risks</p>
                    {insights.risks.length === 0 ? (
                      <p className="mt-1 text-[12px] text-text-secondary">No blocked or overdue records detected.</p>
                    ) : (
                      insights.risks.map((risk) => (
                        <p key={risk} className="mt-1 text-[12px] text-warning">{risk}</p>
                      ))
                    )}
                    {insights.aiRisks.map((risk, index) => (
                      <p key={`${risk}-${index}`} className="mt-1 text-[12px] text-text-secondary">{risk}</p>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-2">
                    <p className="text-[11px] font-medium text-text-muted">Upcoming deadlines</p>
                    {insights.upcomingDeadlines.length === 0 ? (
                      <p className="mt-1 text-[12px] text-text-secondary">No upcoming task or milestone dates are recorded.</p>
                    ) : (
                      insights.upcomingDeadlines.slice(0, 3).map((deadline) => (
                        <p key={`${deadline.kind}-${deadline.id}`} className="mt-1 flex justify-between gap-2 text-[12px] text-text-secondary">
                          <span className="truncate">{deadline.title}</span>
                          <span className="shrink-0">{formatDate(deadline.dueDate)}</span>
                        </p>
                      ))
                    )}
                  </div>
                  <div className="border-t border-border px-4 py-2">
                    <p className="text-[11px] font-medium text-text-muted">Workload</p>
                    {insights.workload.length === 0 ? (
                      <p className="mt-1 text-[12px] text-text-secondary">No project members are available.</p>
                    ) : (
                      insights.workload.map((member) => (
                        <div key={member.id} className="mt-2">
                          <div className="mb-1 flex justify-between gap-2 text-[11px] text-text-secondary">
                            <span className="truncate">{member.name}</span>
                            <span className="shrink-0">{member.openTasks} tasks · {member.estimateHours}h</span>
                          </div>
                          <Progress value={Math.round((member.estimateHours / maximumWorkload) * 100)} />
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>

            <Card className="mt-3">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Workspace tasks</p>
              </div>
              <div className="divide-y divide-border">
                {projectTasks.length === 0 && (
                  <p className="px-4 py-3 text-[12px] text-text-muted">No tasks have been saved to this project.</p>
                )}
                {projectTasks.map((task) => (
                  <div key={task.id} data-testid={`workspace-task-${task.id}`} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="font-mono text-[11px] text-text-muted">{task.id.slice(-8)}</span>
                    <p className="min-w-0 flex-1 truncate text-[12px] text-text-primary">{task.title}</p>
                    <Avatar name={task.assignee?.name ?? task.user.name} size="sm" />
                    <StatusBadge status={taskStatus(task.status)} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Project timeline</p>
              </div>
              {milestones.length === 0 ? (
                <p className="px-4 py-3 text-[12px] text-text-muted">No milestones have been saved to this project.</p>
              ) : (
                <ol className="p-4">
                  {milestones.map((milestone, index) => {
                    const state = milestoneState(milestone.status);
                    return (
                      <li key={milestone.id} className="relative flex gap-3 pb-5 last:pb-0">
                        {index < milestones.length - 1 && (
                          <span className="absolute left-[5px] top-4 h-full w-px bg-border" />
                        )}
                        <span
                          className={`relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full border ${
                            state === "done"
                              ? "border-success bg-success"
                              : state === "active"
                                ? "border-accent bg-accent"
                                : "border-border-strong bg-surface"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[13px] font-medium text-text-primary">{milestone.title}</p>
                            {state === "active" && <Badge variant="accent">In progress</Badge>}
                            {state === "done" && <Badge variant="success">Complete</Badge>}
                          </div>
                          <p className="mt-0.5 text-[12px] text-text-muted">{milestone.description || "No description"}</p>
                          <p className="mt-0.5 text-[11px] text-text-muted">
                            {formatDate(milestone.dueDate)} · {milestone._count.tasks} linked tasks
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <Table>
                <THead>
                  <TR>
                    <TH>Member</TH>
                    <TH>Role</TH>
                    <TH>Email</TH>
                    <TH className="text-right">Open tasks · hours</TH>
                  </TR>
                </THead>
                <TBody>
                  {members.map((member) => (
                    <TR key={member.id} data-testid={`member-row-${member.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <Avatar name={member.name} size="sm" />
                          <span className="text-text-primary">{member.name}</span>
                        </span>
                      </TD>
                      <TD>{member.jobTitle || member.role}</TD>
                      <TD className="font-mono text-[11px]">{member.email}</TD>
                      <TD className="text-right text-text-primary">
                        {member.workload.openTasks} · {member.workload.estimateHours}h
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <Table>
                <THead>
                  <TR>
                    <TH>File</TH>
                    <TH>Path</TH>
                    <TH>Author</TH>
                    <TH className="text-right">Size</TH>
                    <TH className="text-right">Updated</TH>
                  </TR>
                </THead>
                <TBody>
                  {documents.map((document) => (
                    <TR key={document.id} data-testid={`file-row-${document.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <FileCode className="h-3.5 w-3.5 text-text-muted" />
                          <span className="text-text-primary">{document.name}</span>
                        </span>
                      </TD>
                      <TD className="max-w-[240px] truncate font-mono text-[11px]">{document.fileUrl}</TD>
                      <TD>{document.uploadedBy.name}</TD>
                      <TD className="text-right">{formatSize(document.sizeBytes)}</TD>
                      <TD className="text-right">{formatDate(document.createdAt)}</TD>
                    </TR>
                  ))}
                  {documents.length === 0 && (
                    <TR>
                      <TD colSpan={5} className="text-center text-text-muted">No project documents are recorded.</TD>
                    </TR>
                  )}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="branches">
            <Card>
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[12px] text-text-muted">GitHub branch records are not connected to this workspace yet.</p>
              </div>
              <Table>
                <THead>
                  <TR>
                    <TH>Branch</TH>
                    <TH>Author</TH>
                    <TH className="text-right">Ahead</TH>
                    <TH className="text-right">Behind</TH>
                    <TH className="text-right">Updated</TH>
                  </TR>
                </THead>
                <TBody>
                  <TR>
                    <TD colSpan={5} className="text-center text-text-muted">No branch data is available from the connected integrations.</TD>
                  </TR>
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <div className="divide-y divide-border">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 px-4 py-2.5">
                    <Avatar name={activity.user?.name ?? "System"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-text-primary">{activity.message}</p>
                      <p className="truncate text-[11px] text-text-muted">
                        {activity.type.replaceAll("_", " ").toLowerCase()}
                        {activity.task ? ` · ${activity.task.title}` : ""}
                      </p>
                    </div>
                    <span className="text-[11px] text-text-muted">{formatDate(activity.createdAt)}</span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="px-4 py-3 text-[12px] text-text-muted">No activity has been recorded.</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>

      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate a project plan</DialogTitle>
            <DialogDescription>
              Review and edit the locally generated plan before any tasks or milestones are saved.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={generatePlan}>
            <div className="space-y-3 px-4 py-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="plan-mode">Planning mode</Label>
                  <select
                    id="plan-mode"
                    data-testid="workspace-plan-mode"
                    className="mt-1 h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[12px] text-text-primary"
                    value={mode}
                    onChange={(event) => {
                      setPlanPreview(null);
                      setMode(event.target.value as "individual" | "manager");
                    }}
                  >
                    <option value="individual">Individual Developer</option>
                    <option value="manager" disabled={!canUseManagerMode}>Manager / Team</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="plan-project">Project</Label>
                  <select
                    id="plan-project"
                    data-testid="workspace-plan-project"
                    className="mt-1 h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[12px] text-text-primary"
                    value={planProjectId}
                    onChange={(event) => {
                      const nextProjectId = event.target.value;
                      const nextRole = projects.find((item) => item.id === nextProjectId)?.role;
                      setPlanPreview(null);
                      setPlanProjectId(nextProjectId);
                      if (mode === "manager" && nextRole !== "OWNER" && nextRole !== "MANAGER") {
                        setMode("individual");
                      }
                    }}
                  >
                    <option value="">Create a personal project</option>
                    {projects.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {!planProjectId && (
                <div>
                  <Label htmlFor="plan-project-name">New project name</Label>
                  <Input
                    id="plan-project-name"
                    data-testid="workspace-plan-project-name"
                    value={projectName}
                    onChange={(event) => {
                      setPlanPreview(null);
                      setProjectName(event.target.value);
                    }}
                    required
                    maxLength={160}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="plan-requirements">Project requirements</Label>
                <Textarea
                  id="plan-requirements"
                  data-testid="workspace-plan-requirements"
                  value={requirements}
                  onChange={(event) => {
                    setPlanPreview(null);
                    setRequirements(event.target.value);
                  }}
                  required
                  maxLength={20000}
                  placeholder="Describe the outcome, constraints, and acceptance criteria."
                />
              </div>
              {mode === "manager" && planPreview?.allocationNote && (
                <p className="text-[11px] text-warning">{planPreview.allocationNote}</p>
              )}
              {planError && <p role="alert" className="text-[12px] text-danger">{planError}</p>}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  data-testid="workspace-plan-generate"
                  disabled={isGenerating || (mode === "manager" && !canUseManagerMode)}
                >
                  <Sparkles className="h-3 w-3" />
                  {isGenerating ? "Generating…" : planPreview ? "Regenerate plan" : "Generate plan"}
                </Button>
              </div>

              {planPreview && (
                <section data-testid="workspace-plan-preview" className="space-y-3 border-t border-border pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[13px] font-medium text-text-primary">{planPreview.plan.title}</h3>
                    {planPreview.plan.source === "fallback" ? (
                      <Badge variant="warning">Fallback plan</Badge>
                    ) : (
                      <Badge variant="success">Ollama · Qwen3</Badge>
                    )}
                  </div>
                  {planPreview.plan.fallbackReason && (
                    <p className="text-[11px] text-warning">{planPreview.plan.fallbackReason}</p>
                  )}
                  {planPreview.plan.risks.map((risk, index) => (
                    <p key={`plan-risk-${index}`} className="text-[11px] text-text-secondary">{risk}</p>
                  ))}

                  <div className="space-y-2">
                    {planPreview.plan.milestones.map((milestone, index) => (
                      <div key={`milestone-${index}`} className="rounded-md border border-border p-3">
                        <p className="mb-2 text-[11px] font-medium text-text-muted">Milestone {index + 1}</p>
                        <Input
                          aria-label={`Milestone ${index + 1} title`}
                          value={milestone.title}
                          onChange={(event) => updatePlanMilestone(index, { title: event.target.value })}
                          maxLength={160}
                        />
                        <Textarea
                          aria-label={`Milestone ${index + 1} description`}
                          className="mt-2"
                          value={milestone.description}
                          onChange={(event) => updatePlanMilestone(index, { description: event.target.value })}
                          maxLength={2000}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {planPreview.plan.tasks.map((task, index) => (
                      <div key={`plan-task-${index}`} className="rounded-md border border-border p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-[11px] font-medium text-text-muted">Task {index + 1}</p>
                          <span className="text-[10px] text-text-muted">
                            {task.dependencies.length
                              ? `Depends on ${task.dependencies.map((dependency) => dependency + 1).join(", ")}`
                              : "No dependencies"}
                          </span>
                        </div>
                        <Input
                          aria-label={`Task ${index + 1} title`}
                          value={task.title}
                          onChange={(event) => updatePlanTask(index, { title: event.target.value })}
                          maxLength={200}
                        />
                        <Textarea
                          aria-label={`Task ${index + 1} description`}
                          className="mt-2"
                          value={task.description}
                          onChange={(event) => updatePlanTask(index, { description: event.target.value })}
                          maxLength={4000}
                        />
                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <select
                            aria-label={`Task ${index + 1} priority`}
                            className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary"
                            value={task.priority}
                            onChange={(event) =>
                              updatePlanTask(index, { priority: event.target.value as PlanTask["priority"] })
                            }
                          >
                            {["urgent", "high", "medium", "low"].map((priority) => (
                              <option key={priority} value={priority}>{priority}</option>
                            ))}
                          </select>
                          <Input
                            aria-label={`Task ${index + 1} estimate`}
                            type="number"
                            min={1}
                            max={160}
                            value={task.estimate}
                            onChange={(event) =>
                              updatePlanTask(index, { estimate: Number(event.target.value) })
                            }
                          />
                          {mode === "manager" && (
                            <select
                              aria-label={`Task ${index + 1} assignee`}
                              className="h-8 rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary"
                              value={planPreview.assignments[index]?.assigneeId ?? ""}
                              onChange={(event) =>
                                setPlanPreview((current) =>
                                  current
                                    ? {
                                        ...current,
                                        assignments: current.assignments.map((assignment, assignmentIndex) =>
                                          assignmentIndex === index
                                            ? {
                                                assigneeId: event.target.value || null,
                                                explanation:
                                                  event.target.value === assignment.assigneeId
                                                    ? assignment.explanation
                                                    : "Assignment was changed by the manager.",
                                              }
                                            : assignment,
                                        ),
                                      }
                                    : current,
                                )
                              }
                            >
                              <option value="">Leave unassigned</option>
                              {planPreview.members.map((member) => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                              ))}
                            </select>
                          )}
                        </div>
                        {mode === "manager" && planPreview.assignments[index] && (
                          <p className="mt-1.5 text-[11px] text-text-muted">
                            {planPreview.assignments[index].explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-text-muted">
                    No database tasks or milestones are created until you approve this plan.
                  </p>
                </section>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" size="sm" onClick={() => setPlanOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                data-testid="workspace-plan-approve"
                disabled={!planPreview || isSavingPlan || isGenerating}
                onClick={approvePlan}
              >
                {isSavingPlan ? "Saving…" : "Approve and save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>Save a task to {project?.name ?? "this project"}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createTask}>
            <div className="space-y-3 px-4 py-3">
              <div>
                <Label htmlFor="workspace-task-title">Title</Label>
                <Input id="workspace-task-title" name="title" required maxLength={200} />
              </div>
              <div>
                <Label htmlFor="workspace-task-description">Description</Label>
                <Textarea id="workspace-task-description" name="description" maxLength={4000} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="workspace-task-priority">Priority</Label>
                  <select id="workspace-task-priority" name="priority" className="mt-1 h-8 w-full rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary">
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="workspace-task-estimate">Estimate (hours)</Label>
                  <Input id="workspace-task-estimate" name="estimate" type="number" min={1} max={160} defaultValue={1} required />
                </div>
              </div>
              <div>
                <Label htmlFor="workspace-task-due-date">Due date</Label>
                <Input id="workspace-task-due-date" name="dueDate" type="date" />
              </div>
              {taskError && <p role="alert" className="text-[12px] text-danger">{taskError}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" size="sm" onClick={() => setTaskOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSavingTask}>
                {isSavingTask ? "Saving…" : "Create task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>Save a project invitation for {project?.name ?? "this project"}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createInvitation}>
            <div className="space-y-3 px-4 py-3">
              <div>
                <Label htmlFor="workspace-invite-email">Email</Label>
                <Input id="workspace-invite-email" name="email" type="email" required maxLength={320} />
              </div>
              <div>
                <Label htmlFor="workspace-invite-role">Project role</Label>
                <select id="workspace-invite-role" name="role" className="mt-1 h-8 w-full rounded-md border border-border bg-surface px-2 text-[12px] text-text-primary">
                  <option value="DEVELOPER">Developer</option>
                  {project?.role === "OWNER" && <option value="MANAGER">Manager</option>}
                </select>
              </div>
              <p className="text-[11px] text-text-muted">Email delivery is not configured; the invitation will be recorded in the database.</p>
              {inviteError && <p role="alert" className="text-[12px] text-danger">{inviteError}</p>}
              {inviteResult && <p role="status" className="text-[12px] text-success">{inviteResult}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" size="sm" onClick={() => setInviteOpen(false)}>Close</Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSavingInvite}>
                {isSavingInvite ? "Saving…" : "Save invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
