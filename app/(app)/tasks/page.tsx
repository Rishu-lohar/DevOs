"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/feedback";
import { FilterMenu, SearchField } from "@/components/domain/filters";
import { PriorityIndicator, StatCard } from "@/components/domain/primitives";
import { projects, tasks } from "@/lib/data";
import type { TaskStatus } from "@/lib/types";

const groupOrder: TaskStatus[] = ["blocked", "in-progress", "review", "todo", "done"];
const groupMeta: Record<TaskStatus, { label: string; dot: string }> = {
  blocked: { label: "Blocked", dot: "bg-danger" },
  "in-progress": { label: "In Progress", dot: "bg-accent" },
  review: { label: "In Review", dot: "bg-warning" },
  todo: { label: "To Do", dot: "bg-text-muted" },
  done: { label: "Done", dot: "bg-success" },
};

export default function TasksPage() {
  const [query, setQuery] = React.useState("");
  const [priority, setPriority] = React.useState("all");
  const [project, setProject] = React.useState("all");

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
    [query, priority, project],
  );

  const grouped = groupOrder
    .map((status) => ({ status, items: filtered.filter((t) => t.status === status) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Every task across your workspace, grouped by status."
        actions={
          <Button variant="primary" size="sm" data-testid="tasks-new">
            <Plus className="h-3 w-3" />
            New task
          </Button>
        }
      />

      <PageBody className="space-y-4">
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
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
