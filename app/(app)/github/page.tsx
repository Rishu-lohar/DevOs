"use client";

import * as React from "react";
import {
  CircleDot,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,

  Play,
  RefreshCw,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { AreaChart, BarChart, ContributionGrid } from "@/components/charts";
import {
  LanguageDot,
  MetricRow,
  StatCard,
} from "@/components/domain/primitives";
import {
  branches,
  commits,
  contributionHeatmap,
  githubActions,
  issues,
  pullRequests,
  repoHealth,
  repos,
  velocitySeries,
  weeklyCommits,
} from "@/lib/data";
import { formatNumber } from "@/lib/utils";

const prStateVariant = {
  open: "success",
  merged: "accent",
  draft: "default",
  closed: "danger",
} as const;

const checksVariant = {
  passing: "success",
  failing: "danger",
  pending: "warning",
} as const;

export default function GithubPage() {
  return (
    <>
      <PageHeader
        title="GitHub"
        description="Connected as rishu-lohar · 6 repositories synced"
        actions={
          <>
            <Button variant="secondary" size="sm" data-testid="github-sync">
              <RefreshCw className="h-3 w-3" />
              Sync now
            </Button>
            <Button variant="primary" size="sm" data-testid="github-connect">
              <GithubIcon className="h-3 w-3" />
              Connect repository
            </Button>
          </>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Contributions" value="156" delta="+28%" trend="up" hint="this sprint" />
          <StatCard label="Open PRs" value={String(pullRequests.filter((p) => p.state === "open").length)} hint="awaiting review" />
          <StatCard label="Open issues" value={String(issues.filter((i) => i.state === "open").length)} hint="across repos" />
          <StatCard label="Total stars" value={formatNumber(repos.reduce((s, r) => s + r.stars, 0))} delta="+312" trend="up" hint="all repositories" />
        </div>

        <Tabs defaultValue="overview">
          <TabsList data-testid="github-tabs">
            <TabsTrigger value="overview" data-testid="github-tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="repositories" data-testid="github-tab-repositories">Repositories</TabsTrigger>
            <TabsTrigger value="commits" data-testid="github-tab-commits">Commits</TabsTrigger>
            <TabsTrigger value="pulls" data-testid="github-tab-pulls">Pull Requests</TabsTrigger>
            <TabsTrigger value="issues" data-testid="github-tab-issues">Issues</TabsTrigger>
            <TabsTrigger value="branches" data-testid="github-tab-branches">Branches</TabsTrigger>
            <TabsTrigger value="health" data-testid="github-tab-health">Repository Health</TabsTrigger>
            <TabsTrigger value="actions" data-testid="github-tab-actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-3 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <div className="border-b border-border px-4 py-2.5">
                  <p className="text-[13px] font-medium text-text-primary">Commit & PR volume</p>
                </div>
                <div className="p-3">
                  <AreaChart
                    data={velocitySeries}
                    xKey="week"
                    series={[{ key: "commits" }, { key: "prs", color: "var(--success)" }]}
                    height={190}
                  />
                </div>
              </Card>
              <Card>
                <div className="border-b border-border px-4 py-2.5">
                  <p className="text-[13px] font-medium text-text-primary">Commits this week</p>
                </div>
                <div className="p-3">
                  <BarChart data={weeklyCommits} xKey="day" yKey="commits" height={190} />
                </div>
              </Card>
            </div>

            <Card className="mt-3">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Contribution graph</p>
              </div>
              <div className="p-4">
                <ContributionGrid data={contributionHeatmap} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="repositories">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {repos.map((r) => (
                <Card key={r.id} data-testid={`repo-card-${r.id}`} className="p-4 hover:border-border-strong">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate font-mono text-[12px] text-text-primary">
                      {r.name}
                    </p>
                    <Badge variant={r.visibility === "public" ? "outline" : "accent"}>
                      {r.visibility}
                    </Badge>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-text-muted">
                    {r.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                    <LanguageDot language={r.language} />
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {formatNumber(r.stars)}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitPullRequest className="h-3 w-3" />
                      {r.prs}
                    </span>
                    <span className="flex items-center gap-1">
                      <CircleDot className="h-3 w-3" />
                      {r.issues}
                    </span>
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <MetricRow label="Health score" value={r.health} />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commits">
            <Card>
              <div className="divide-y divide-border">
                {commits.map((c) => (
                  <div
                    key={c.id}
                    data-testid={`commit-row-${c.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                  >
                    <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-text-primary">{c.message}</p>
                      <p className="truncate text-[11px] text-text-muted">
                        <span className="font-mono">{c.sha}</span> · {c.repo} · {c.branch} · {c.author}
                      </p>
                    </div>
                    <span className="hidden shrink-0 gap-2 font-mono text-[11px] sm:flex">
                      <span className="text-success">+{c.additions}</span>
                      <span className="text-danger">−{c.deletions}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-text-muted">{c.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pulls">
            <Card>
              <Table>
                <THead>
                  <TR>
                    <TH>Pull request</TH>
                    <TH>State</TH>
                    <TH>Checks</TH>
                    <TH>Author</TH>
                    <TH className="text-right">Diff</TH>
                    <TH className="text-right">Updated</TH>
                  </TR>
                </THead>
                <TBody>
                  {pullRequests.map((pr) => (
                    <TR key={pr.id} data-testid={`pr-row-${pr.number}`}>
                      <TD>
                        <span className="block truncate text-text-primary">{pr.title}</span>
                        <span className="block truncate font-mono text-[11px] text-text-muted">
                          {pr.repo} #{pr.number}
                        </span>
                      </TD>
                      <TD><Badge variant={prStateVariant[pr.state]}>{pr.state}</Badge></TD>
                      <TD><Badge variant={checksVariant[pr.checks]}>{pr.checks}</Badge></TD>
                      <TD>{pr.author}</TD>
                      <TD className="text-right font-mono text-[11px]">
                        <span className="text-success">+{pr.additions}</span>{" "}
                        <span className="text-danger">−{pr.deletions}</span>
                      </TD>
                      <TD className="text-right">{pr.time}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <div className="divide-y divide-border">
                {issues.map((i) => (
                  <div
                    key={i.id}
                    data-testid={`issue-row-${i.number}`}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                  >
                    <CircleDot
                      className={`h-3.5 w-3.5 shrink-0 ${i.state === "open" ? "text-success" : "text-text-muted"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-text-primary">{i.title}</p>
                      <p className="truncate text-[11px] text-text-muted">
                        {i.repo} #{i.number} · {i.author} · {i.comments} comments
                      </p>
                    </div>
                    <div className="hidden shrink-0 gap-1 sm:flex">
                      {i.labels.map((l) => (
                        <Badge key={l} variant="outline">{l}</Badge>
                      ))}
                    </div>
                    <span className="shrink-0 text-[11px] text-text-muted">{i.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="branches">
            <Card>
              <Table>
                <THead>
                  <TR>
                    <TH>Branch</TH>
                    <TH>Repository</TH>
                    <TH>Author</TH>
                    <TH className="text-right">Ahead / Behind</TH>
                    <TH className="text-right">Updated</TH>
                  </TR>
                </THead>
                <TBody>
                  {branches.map((b) => (
                    <TR key={b.id} data-testid={`gh-branch-row-${b.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <GitBranch className="h-3.5 w-3.5 text-text-muted" />
                          <span className="font-mono text-[12px] text-text-primary">{b.name}</span>
                          {b.isDefault && <Badge variant="accent">default</Badge>}
                        </span>
                      </TD>
                      <TD className="font-mono text-[11px]">{b.repo}</TD>
                      <TD>{b.author}</TD>
                      <TD className="text-right font-mono text-[11px]">
                        <span className="text-success">+{b.ahead}</span>{" "}
                        <span className="text-danger">−{b.behind}</span>
                      </TD>
                      <TD className="text-right">{b.time}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <div className="grid gap-3 xl:grid-cols-2">
              <Card>
                <div className="border-b border-border px-4 py-2.5">
                  <p className="text-[13px] font-medium text-text-primary">Health metrics</p>
                  <p className="text-[11px] text-text-muted">Measured against team targets</p>
                </div>
                <div className="space-y-3 p-4">
                  {repoHealth.map((h) => (
                    <div key={h.id} data-testid={`health-metric-${h.id}`}>
                      <MetricRow label={h.metric} value={h.value} />
                      <p className="ml-[144px] mt-1 text-[10px] text-text-muted">
                        target {h.target}% ·{" "}
                        <span
                          className={
                            h.status === "good"
                              ? "text-success"
                              : h.status === "warn"
                                ? "text-warning"
                                : "text-danger"
                          }
                        >
                          {h.status === "good" ? "meeting target" : h.status === "warn" ? "near target" : "below target"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="border-b border-border px-4 py-2.5">
                  <p className="text-[13px] font-medium text-text-primary">Repository scores</p>
                </div>
                <div className="space-y-3 p-4">
                  {repos.map((r) => (
                    <MetricRow key={r.id} label={r.name.split("/")[1]} value={r.health} />
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <Table>
                <THead>
                  <TR>
                    <TH>Workflow</TH>
                    <TH>Repository</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Duration</TH>
                    <TH className="text-right">Started</TH>
                  </TR>
                </THead>
                <TBody>
                  {githubActions.map((a) => (
                    <TR key={a.id} data-testid={`action-row-${a.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <Play className="h-3 w-3 text-text-muted" />
                          <span className="text-text-primary">{a.name}</span>
                        </span>
                      </TD>
                      <TD className="font-mono text-[11px]">{a.repo}</TD>
                      <TD>
                        <Badge
                          variant={
                            a.status === "passing"
                              ? "success"
                              : a.status === "failing"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TD>
                      <TD className="text-right font-mono text-[11px]">{a.duration}</TD>
                      <TD className="text-right">{a.time}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}
