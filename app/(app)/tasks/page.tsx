"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/feedback";
import { FilterMenu, SearchField } from "@/components/domain/filters";
import { PriorityIndicator, StatCard } from "@/components/domain/primitives";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { apiRequest } from "@/lib/client-api";
import type { Project, Task, TaskStatus } from "@/lib/types";

const groupOrder: TaskStatus[] = ["blocked", "in-progress", "review", "todo", "done"];
const groupMeta: Record<TaskStatus, { label: string; dot: string }> = {
  blocked: { label: "Blocked", dot: "bg-danger" },
  "in-progress": { label: "In Progress", dot: "bg-accent" },
  review: { label: "In Review", dot: "bg-warning" },
  todo: { label: "To Do", dot: "bg-text-muted" },
  done: { label: "Done", dot: "bg-success" },
};

type ProjectOption = Pick<Project, "id" | "name">;
type UserOption = { id: string; name: string };
type TaskRecord = {
  id: string;
  title: string;
  status: string;
  completed: boolean;
  createdAt: string;
  projectId: string;
  userId: string;
  project: { id: string; name: string };
  user: { id: string; name: string };
};
type TaskView = Task & { projectId: string; userId: string };
type DashboardOptionsResponse = {
  data: {
    users: UserOption[];
    projects: { id: string; name: string }[];
  };
};

function toTaskView(record: TaskRecord): TaskView {
  const statusByValue: Record<string, TaskStatus> = {
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    DONE: "done",
    BLOCKED: "blocked",
  };
  const status = statusByValue[record.status] ?? "todo";

  return {
    id: record.id,
    key: record.id.slice(0, 8).toUpperCase(),
    title: record.title,
    status,
    priority: "medium",
    project: record.project.name,
    assignee: record.user.name,
    due: "Not set",
    labels: [],
    estimate: 0,
    projectId: record.projectId,
    userId: record.userId,
  };
}

export default function TasksPage() {
  const [query, setQuery] = React.useState("");
  const [priority, setPriority] = React.useState("all");
  const [project, setProject] = React.useState("all");
  const [tasks, setTasks] = React.useState<TaskView[]>([]);
  const [projects, setProjects] = React.useState<ProjectOption[]>([]);
  const [users, setUsers] = React.useState<UserOption[]>([]);
  const [error, setError] = React.useState("");
  const [editorError, setEditorError] = React.useState("");
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskView | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const [taskRecords, dashboard] = await Promise.all([
        apiRequest<TaskRecord[]>("/api/tasks"),
        apiRequest<DashboardOptionsResponse>("/api/dashboard"),
      ]);
      setTasks(taskRecords.map(toTaskView));
      setProjects(dashboard.data.projects);
      setUsers(dashboard.data.users);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load tasks");
    }
  }, []);

  React.useEffect(() => {
    Promise.all([
      apiRequest<TaskRecord[]>("/api/tasks"),
      apiRequest<DashboardOptionsResponse>("/api/dashboard"),
    ])
      .then(([taskRecords, dashboard]) => {
        setTasks(taskRecords.map(toTaskView));
        setProjects(dashboard.data.projects);
        setUsers(dashboard.data.users);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Failed to load tasks");
      });
  }, []);

  const filtered = React.useMemo(
    () =>
      tasks.filter((t) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.key.toLowerCase().includes(q) ||
          t.labels.some((l) => l.toLowerCase().includes(q));
        const matchP = priority === "all" || t.priority === priority;
        const matchProj = project === "all" || t.project === project;
        return matchQ && matchP && matchProj;
      }),
    [tasks, query, priority, project],
  );

  const grouped = groupOrder
    .map((status) => ({ status, items: filtered.filter((t) => t.status === status) }))
    .filter((g) => g.items.length > 0);

  async function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      projectId: String(form.get("projectId") ?? ""),
      userId: String(form.get("userId") ?? ""),
      status: String(form.get("status") ?? "TODO"),
    };

    try {
      await apiRequest(
        editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks",
        {
          method: editingTask ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      setEditorOpen(false);
      await loadData();
    } catch (cause) {
      setEditorError(cause instanceof Error ? cause.message : "Failed to save task");
    }
  }

  async function deleteTask(task: TaskView) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await apiRequest(`/api/tasks/${task.id}`, { method: "DELETE" });
      await loadData();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to delete task");
    }
  }

  function openEditor(task?: TaskView) {
    setEditingTask(task ?? null);
    setEditorError("");
    setEditorOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Every task across your workspace, grouped by status."
        actions={
          <Button variant="primary" size="sm" onClick={() => openEditor()} data-testid="tasks-new">
            <Plus className="h-3 w-3" />
            New task
          </Button>
        }
      />

      <PageBody className="space-y-4">
        {error && <p role="alert" className="text-[12px] text-danger">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total tasks" value={String(tasks.length)} hint="in workspace" />
          <StatCard label="In progress" value={String(tasks.filter((t) => t.status === "in-progress").length)} hint="active now" />
          <StatCard label="Blocked" value={String(tasks.filter((t) => t.status === "blocked").length)} hint="need unblocking" />
          <StatCard label="Completed" value={String(tasks.filter((t) => t.status === "done").length)} delta="+15%" trend="up" hint="this sprint" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search tasks, keys, labels…"
            className="w-full sm:w-64"
            testId="tasks-search"
          />
          <FilterMenu
            label="Priority"
            value={priority}
            onChange={setPriority}
            testId="tasks-filter-priority"
            options={[
              { value: "all", label: "All priorities" },
              { value: "urgent", label: "Urgent" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />
          <FilterMenu
            label="Project"
            value={project}
            onChange={setProject}
            testId="tasks-filter-project"
            options={[
              { value: "all", label: "All projects" },
              ...projects.map((p) => ({ value: p.name, label: p.name })),
            ]}
          />
          <span className="ml-auto text-[11px] text-text-muted">
            {filtered.length} of {tasks.length} tasks
          </span>
        </div>

        {grouped.length === 0 ? (
          <Card>
            <EmptyState
              title="No tasks match your filters"
              description="Adjust the search term, priority or project filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setPriority("all");
                    setProject("all");
                  }}
                  data-testid="tasks-reset-filters"
                >
                  Reset filters
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {grouped.map((g) => (
              <Card key={g.status} data-testid={`task-group-${g.status}`}>
                <div className="flex items-center gap-2 border-b border-border px-4 py-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${groupMeta[g.status].dot}`} />
                  <p className="text-[12px] font-medium text-text-primary">
                    {groupMeta[g.status].label}
                  </p>
                  <span className="text-[11px] text-text-muted">{g.items.length}</span>
                </div>
                <div className="divide-y divide-border">
                  {g.items.map((t) => (
                    <div
                      key={t.id}
                      data-testid={`task-row-${t.key}`}
                      className="flex items-center gap-3 px-4 py-2 transition-colors duration-[140ms] hover:bg-surface-hover"
                    >
                      <PriorityIndicator priority={t.priority} />
                      <span className="w-[68px] shrink-0 font-mono text-[11px] text-text-muted">
                        {t.key}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-[13px] text-text-primary">
                        {t.title}
                      </p>
                      <div className="hidden shrink-0 gap-1 lg:flex">
                        {t.labels.map((l) => (
                          <Badge key={l} variant="outline">{l}</Badge>
                        ))}
                      </div>
                      <span className="hidden w-[150px] shrink-0 truncate text-[11px] text-text-muted md:block">
                        {t.project}
                      </span>
                      <span className="w-[64px] shrink-0 text-right text-[11px] text-text-muted">
                        {t.due}
                      </span>
                      <Avatar name={t.assignee} size="sm" />
                      <div className="flex shrink-0 items-center">
                        <Button variant="ghost" size="xs" onClick={() => openEditor(t)} aria-label={`Edit ${t.title}`}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="xs" onClick={() => void deleteTask(t)} aria-label={`Delete ${t.title}`}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageBody>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit task" : "New task"}</DialogTitle>
            <DialogDescription>Save task details to your workspace.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveTask}>
            <div className="space-y-3 p-4">
              {editorError && <p role="alert" className="text-[12px] text-danger">{editorError}</p>}
              {(projects.length === 0 || users.length === 0) && (
                <p role="alert" className="text-[12px] text-danger">
                  Add a project and workspace user before creating or assigning tasks.
                </p>
              )}
              <div>
                <Label htmlFor="task-title">Title</Label>
                <Input id="task-title" name="title" required defaultValue={editingTask?.title ?? ""} />
              </div>
              <div>
                <Label htmlFor="task-project">Project</Label>
                <select
                  id="task-project"
                  name="projectId"
                  required
                  defaultValue={editingTask?.projectId ?? projects[0]?.id ?? ""}
                  className="h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary"
                >
                  {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="task-assignee">Assignee</Label>
                <select
                  id="task-assignee"
                  name="userId"
                  required
                  defaultValue={editingTask?.userId ?? users[0]?.id ?? ""}
                  className="h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary"
                >
                  {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="task-status">Status</Label>
                <select
                  id="task-status"
                  name="status"
                  defaultValue={editingTask ? {
                    todo: "TODO",
                    "in-progress": "IN_PROGRESS",
                    done: "DONE",
                    blocked: "BLOCKED",
                    review: "TODO",
                  }[editingTask.status] : "TODO"}
                  className="h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[13px] text-text-primary"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
