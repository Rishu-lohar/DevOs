"use client";

import * as React from "react";
import { LayoutGrid, List, Pencil, Plus, Trash2 } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";
import { EmptyState, Progress } from "@/components/ui/feedback";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { HealthBadge, StatCard } from "@/components/domain/primitives";
import { FilterMenu, SearchField } from "@/components/domain/filters";
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
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProjectRecord = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  userId: string;
  user: { id: string; name: string };
  tasks: { id: string; status: string }[];
};

type ProjectView = Project & { userId: string };
type UserOption = { id: string; name: string };

type DashboardUsersResponse = {
  data: { users: UserOption[] };
};

function toProjectView(record: ProjectRecord): ProjectView {
  const totalTasks = record.tasks.length;
  const doneTasks = record.tasks.filter((task) => task.status === "DONE").length;

  return {
    id: record.id,
    name: record.name,
    slug: `${record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${record.id.slice(-5)}`,
    description: record.description ?? "",
    progress: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    health: record.status === "ACTIVE" ? "on-track" : "at-risk",
    stack: [],
    members: [record.user.name],
    lead: record.user.name,
    due: "Not set",
    openTasks: totalTasks - doneTasks,
    totalTasks,
    updatedAt: new Date(record.createdAt).toLocaleDateString(),
    userId: record.userId,
  };
}

export default function ProjectsPage() {
  const [query, setQuery] = React.useState("");
  const [health, setHealth] = React.useState("all");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [projects, setProjects] = React.useState<ProjectView[]>([]);
  const [users, setUsers] = React.useState<UserOption[]>([]);
  const [error, setError] = React.useState("");
  const [editorError, setEditorError] = React.useState("");
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<ProjectView | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const [projectRecords, dashboard] = await Promise.all([
        apiRequest<ProjectRecord[]>("/api/projects"),
        apiRequest<DashboardUsersResponse>("/api/dashboard"),
      ]);
      setProjects(projectRecords.map(toProjectView));
      setUsers(dashboard.data.users);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load projects");
    }
  }, []);

  React.useEffect(() => {
    Promise.all([
      apiRequest<ProjectRecord[]>("/api/projects"),
      apiRequest<DashboardUsersResponse>("/api/dashboard"),
    ])
      .then(([projectRecords, dashboard]) => {
        setProjects(projectRecords.map(toProjectView));
        setUsers(dashboard.data.users);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Failed to load projects");
      });
  }, []);

  const filtered = React.useMemo(
    () =>
      projects.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.stack.some((s) => s.toLowerCase().includes(q));
        const matchH = health === "all" || p.health === health;
        return matchQ && matchH;
      }),
    [projects, query, health],
  );

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      userId: String(form.get("userId") ?? ""),
    };

    try {
      await apiRequest(
        editingProject ? `/api/projects/${editingProject.id}` : "/api/projects",
        {
          method: editingProject ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      setEditorOpen(false);
      await loadData();
    } catch (cause) {
      setEditorError(cause instanceof Error ? cause.message : "Failed to save project");
    }
  }

  async function deleteProject(project: ProjectView) {
    if (!window.confirm(`Delete "${project.name}"?`)) return;
    try {
      await apiRequest(`/api/projects/${project.id}`, { method: "DELETE" });
      await loadData();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to delete project");
    }
  }

  function openEditor(project?: ProjectView) {
    setEditingProject(project ?? null);
    setEditorError("");
    setEditorOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create and organise all of your engineering projects."
        actions={
          <Button variant="primary" size="sm" onClick={() => openEditor()} data-testid="projects-new">
            <Plus className="h-3 w-3" />
            New project
          </Button>
        }
      />

      <PageBody className="space-y-4">
        {error && <p role="alert" className="text-[12px] text-danger">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total projects" value={String(projects.length)} hint="across the workspace" />
          <StatCard label="On track" value={String(projects.filter((p) => p.health === "on-track").length)} hint="healthy delivery" />
          <StatCard label="At risk" value={String(projects.filter((p) => p.health !== "on-track").length)} hint="need attention" />
          <StatCard label="Avg. progress" value={`${Math.round(projects.reduce((s, p) => s + p.progress, 0) / (projects.length || 1))}%`} hint="completion" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search projects, stacks…"
            className="w-full sm:w-64"
            testId="projects-search"
          />
          <FilterMenu
            label="Health"
            value={health}
            onChange={setHealth}
            testId="projects-filter-health"
            options={[
              { value: "all", label: "All health" },
              { value: "on-track", label: "On track" },
              { value: "at-risk", label: "At risk" },
              { value: "off-track", label: "Off track" },
            ]}
          />
          <div className="ml-auto flex items-center gap-0.5 rounded-md border border-border bg-surface p-0.5">
            <button
              onClick={() => setView("grid")}
              data-testid="projects-view-grid"
              aria-label="Grid view"
              className={cn(
                "rounded p-1 transition-colors duration-[140ms]",
                view === "grid" ? "bg-surface-active text-text-primary" : "text-text-muted",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              data-testid="projects-view-list"
              aria-label="List view"
              className={cn(
                "rounded p-1 transition-colors duration-[140ms]",
                view === "list" ? "bg-surface-active text-text-primary" : "text-text-muted",
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              title="No projects match your filters"
              description="Try a different search term or reset the health filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setHealth("all");
                  }}
                  data-testid="projects-reset-filters"
                >
                  Reset filters
                </Button>
              }
            />
          </Card>
        ) : view === "grid" ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <Card
                key={p.id}
                data-testid={`project-card-${p.slug}`}
                className="p-4 hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-text-primary">{p.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-text-muted">
                      {p.description}
                    </p>
                  </div>
                  <HealthBadge health={p.health} />
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-text-muted">
                      {p.totalTasks - p.openTasks}/{p.totalTasks} tasks
                    </span>
                    <span className="font-medium text-text-primary">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <AvatarGroup names={p.members} max={3} size="sm" />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-text-muted">Due {p.due}</span>
                    <Button variant="ghost" size="xs" onClick={() => openEditor(p)} aria-label={`Edit ${p.name}`}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => void deleteProject(p)} aria-label={`Delete ${p.name}`}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <THead>
                <TR>
                  <TH>Project</TH>
                  <TH>Health</TH>
                  <TH>Lead</TH>
                  <TH className="w-[160px]">Progress</TH>
                  <TH className="text-right">Tasks</TH>
                  <TH className="text-right">Due</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((p) => (
                  <TR key={p.id} data-testid={`project-row-${p.slug}`}>
                    <TD>
                      <span className="block truncate text-text-primary">{p.name}</span>
                      <span className="block truncate text-[11px] text-text-muted">
                        {p.stack.join(" · ")}
                      </span>
                    </TD>
                    <TD><HealthBadge health={p.health} /></TD>
                    <TD>{p.lead}</TD>
                    <TD>
                      <span className="flex items-center gap-2">
                        <Progress value={p.progress} className="w-20" />
                        <span className="text-[11px] font-medium text-text-primary">
                          {p.progress}%
                        </span>
                      </span>
                    </TD>
                    <TD className="text-right">{p.openTasks}/{p.totalTasks}</TD>
                    <TD className="text-right">{p.due}</TD>
                    <TD className="text-right">
                      <Button variant="ghost" size="xs" onClick={() => openEditor(p)} aria-label={`Edit ${p.name}`}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="xs" onClick={() => void deleteProject(p)} aria-label={`Delete ${p.name}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        )}
      </PageBody>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>Save project details to your workspace.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveProject}>
            <div className="space-y-3 p-4">
              {editorError && <p role="alert" className="text-[12px] text-danger">{editorError}</p>}
              {users.length === 0 && (
                <p role="alert" className="text-[12px] text-danger">
                  Add a workspace user before creating or assigning projects.
                </p>
              )}
              <div>
                <Label htmlFor="project-name">Name</Label>
                <Input id="project-name" name="name" required defaultValue={editingProject?.name ?? ""} />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea id="project-description" name="description" defaultValue={editingProject?.description ?? ""} />
              </div>
              <div>
                <Label htmlFor="project-owner">Owner</Label>
                <select
                  id="project-owner"
                  name="userId"
                  required
                  defaultValue={editingProject?.userId ?? users[0]?.id ?? ""}
                  className="h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary"
                >
                  {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
