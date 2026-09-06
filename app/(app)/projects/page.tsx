"use client";

import * as React from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";
import { EmptyState, Progress } from "@/components/ui/feedback";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { HealthBadge, StatCard } from "@/components/domain/primitives";
import { FilterMenu, SearchField } from "@/components/domain/filters";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [query, setQuery] = React.useState("");
  const [health, setHealth] = React.useState("all");
  const [view, setView] = React.useState<"grid" | "list">("grid");

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
    [query, health],
  );

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create and organise all of your engineering projects."
        actions={
          <Button variant="primary" size="sm" data-testid="projects-new">
            <Plus className="h-3 w-3" />
            New project
          </Button>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total projects" value={String(projects.length)} hint="across the workspace" />
          <StatCard label="On track" value={String(projects.filter((p) => p.health === "on-track").length)} hint="healthy delivery" />
          <StatCard label="At risk" value={String(projects.filter((p) => p.health !== "on-track").length)} hint="need attention" />
          <StatCard label="Avg. progress" value={`${Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)}%`} hint="completion" />
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
                  <span className="text-[11px] text-text-muted">Due {p.due}</span>
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
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        )}
      </PageBody>
    </>
  );
}
