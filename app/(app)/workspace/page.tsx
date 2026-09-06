"use client";

import * as React from "react";
import {
  Boxes,
  FileCode,
  GitBranch,
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
import { HealthBadge, StatCard, StatusBadge } from "@/components/domain/primitives";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import {
  activities,
  branches,
  members,
  projects,
  taskDistribution,
  tasks,
  timeline,
  workspaceFiles,
} from "@/lib/data";

export default function WorkspacePage() {
  const project = projects[0];
  const projectTasks = tasks.filter((t) => t.project === project.name);
  const projectBranches = branches.filter((b) => b.repo === "devos-platform");

  return (
    <>
      <PageHeader
        title="AI Workspace"
        description={`${project.name} · led by ${project.lead}`}
        actions={
          <>
            <Button variant="secondary" size="sm" data-testid="workspace-invite">
              Invite member
            </Button>
            <Button variant="primary" size="sm" data-testid="workspace-new-task">
              <Plus className="h-3 w-3" />
              New task
            </Button>
          </>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Sprint progress" value={`${project.progress}%`} delta="+8%" trend="up" hint="vs last week" />
          <StatCard label="Open tasks" value={String(project.openTasks)} delta="-3" trend="down" hint="closed this week" />
          <StatCard label="Members" value={String(project.members.length)} hint="active contributors" />
          <StatCard label="Branches" value={String(projectBranches.length)} hint="tracked in workspace" />
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
                    <p className="text-[13px] font-medium text-text-primary">{project.name}</p>
                    <HealthBadge health={project.health} />
                  </div>
                  <span className="text-[11px] text-text-muted">Due {project.due}</span>
                </div>
                <div className="space-y-4 p-4">
                  <p className="text-[12px] leading-relaxed text-text-secondary">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                      <span className="text-text-muted">Overall progress</span>
                      <span className="font-medium text-text-primary">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { l: "Completed", v: project.totalTasks - project.openTasks, i: CircleCheck, c: "text-success" },
                      { l: "In flight", v: 8, i: CircleDot, c: "text-accent" },
                      { l: "Backlog", v: project.openTasks - 8, i: CircleDashed, c: "text-text-muted" },
                    ].map((x) => (
                      <div key={x.l} className="rounded-lg border border-border bg-surface px-3 py-2">
                        <x.i className={`h-3.5 w-3.5 ${x.c}`} />
                        <p className="mt-1.5 text-[16px] font-semibold text-text-primary">{x.v}</p>
                        <p className="text-[11px] text-text-muted">{x.l}</p>
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
                    <DonutChart data={taskDistribution} height={140} />
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    <p className="text-[13px] font-medium text-text-primary">AI suggestions</p>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      "Detect silent authentication handler failure",
                      "Add unit tests for token rotation",
                      "Optimise bundle size on mobile shell",
                      "Improve folder structure for services",
                    ].map((s) => (
                      <div key={s} className="flex items-start gap-2 px-4 py-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-[12px] leading-snug text-text-secondary">{s}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <Card className="mt-3">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Workspace tasks</p>
              </div>
              <div className="divide-y divide-border">
                {projectTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="font-mono text-[11px] text-text-muted">{t.key}</span>
                    <p className="min-w-0 flex-1 truncate text-[12px] text-text-primary">{t.title}</p>
                    <Avatar name={t.assignee} size="sm" />
                    <StatusBadge status={t.status} />
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
              <ol className="p-4">
                {timeline.map((t, i) => (
                  <li key={t.id} className="relative flex gap-3 pb-5 last:pb-0">
                    {i < timeline.length - 1 && (
                      <span className="absolute left-[5px] top-4 h-full w-px bg-border" />
                    )}
                    <span
                      className={`relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full border ${
                        t.state === "done"
                          ? "border-success bg-success"
                          : t.state === "active"
                            ? "border-accent bg-accent"
                            : "border-border-strong bg-surface"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] font-medium text-text-primary">{t.title}</p>
                        {t.state === "active" && <Badge variant="accent">In progress</Badge>}
                        {t.state === "done" && <Badge variant="success">Complete</Badge>}
                      </div>
                      <p className="mt-0.5 text-[12px] text-text-muted">{t.detail}</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">{t.date}</p>
                    </div>
                  </li>
                ))}
              </ol>
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
                    <TH className="text-right">Tasks</TH>
                  </TR>
                </THead>
                <TBody>
                  {members.map((m, i) => (
                    <TR key={m.id} data-testid={`member-row-${m.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <Avatar name={m.name} size="sm" />
                          <span className="text-text-primary">{m.name}</span>
                        </span>
                      </TD>
                      <TD>{m.role}</TD>
                      <TD className="font-mono text-[11px]">{m.email}</TD>
                      <TD className="text-right text-text-primary">{[6, 4, 5, 3, 2, 1][i]}</TD>
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
                  {workspaceFiles.map((f) => (
                    <TR key={f.id} data-testid={`file-row-${f.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <FileCode className="h-3.5 w-3.5 text-text-muted" />
                          <span className="text-text-primary">{f.name}</span>
                        </span>
                      </TD>
                      <TD className="font-mono text-[11px]">{f.path}</TD>
                      <TD>{f.author}</TD>
                      <TD className="text-right">{f.size}</TD>
                      <TD className="text-right">{f.time}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="branches">
            <Card>
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
                  {branches.map((b) => (
                    <TR key={b.id} data-testid={`branch-row-${b.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <GitBranch className="h-3.5 w-3.5 text-text-muted" />
                          <span className="font-mono text-[12px] text-text-primary">{b.name}</span>
                          {b.isDefault && <Badge variant="accent">default</Badge>}
                        </span>
                      </TD>
                      <TD>{b.author}</TD>
                      <TD className="text-right text-success">+{b.ahead}</TD>
                      <TD className="text-right text-danger">−{b.behind}</TD>
                      <TD className="text-right">{b.time}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <div className="divide-y divide-border">
                {activities.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                    <Avatar name={a.actor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-text-primary">{a.title}</p>
                      <p className="truncate text-[11px] text-text-muted">{a.detail}</p>
                    </div>
                    <span className="text-[11px] text-text-muted">{a.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}
