"use client";

import * as React from "react";
import { Award, Flame, Lock, Target } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/feedback";
import {
  AreaChart,
  BarChart,
  ContributionGrid,
  DonutChart,
  LineChart,
} from "@/components/charts";
import { MetricRow, StatCard } from "@/components/domain/primitives";
import {
  achievements,
  contributionHeatmap,
  languageBreakdown,
  learningProgress,
  velocitySeries,
  weeklyCommits,
} from "@/lib/data";

export default function GrowthPage() {
  return (
    <>
      <PageHeader
        title="Growth Tracker"
        description="Your engineering velocity, skills and achievements over time."
        actions={
          <Button variant="secondary" size="sm" data-testid="growth-export">
            Export report
          </Button>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Current streak" value="35 days" delta="+7" trend="up" hint="longest this year" />
          <StatCard label="Contributions" value="156" delta="+28%" trend="up" hint="last 12 sprints" />
          <StatCard label="Skills tracked" value={String(learningProgress.length)} hint="in progress" />
          <StatCard label="Achievements" value={`${achievements.filter((a) => a.earned).length}/${achievements.length}`} hint="unlocked" />
        </div>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div>
              <p className="text-[13px] font-medium text-text-primary">Contribution heatmap</p>
              <p className="text-[11px] text-text-muted">156 contributions in the last year</p>
            </div>
            <Badge variant="success">
              <Flame className="h-3 w-3" />
              35-day streak
            </Badge>
          </div>
          <div className="p-4">
            <ContributionGrid data={contributionHeatmap} />
          </div>
        </Card>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Velocity trend</p>
              <p className="text-[11px] text-text-muted">Commits, PRs and reviews per sprint</p>
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
                height={200}
              />
            </div>
          </Card>

          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Language mix</p>
            </div>
            <div className="p-4">
              <DonutChart data={languageBreakdown} height={150} />
            </div>
          </Card>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Weekly commits</p>
            </div>
            <div className="p-3">
              <BarChart data={weeklyCommits} xKey="day" yKey="commits" height={186} />
            </div>
          </Card>

          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Review throughput</p>
            </div>
            <div className="p-3">
              <LineChart
                data={velocitySeries}
                xKey="week"
                series={[{ key: "reviews", color: "var(--accent)" }]}
                height={186}
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Learning progress</p>
              <span className="text-[11px] text-text-muted">57 hours logged</span>
            </div>
            <div className="space-y-4 p-4">
              {learningProgress.map((lp) => (
                <div key={lp.id} data-testid={`learning-${lp.id}`}>
                  <MetricRow label={lp.topic} value={lp.progress} />
                  <p className="ml-[144px] mt-1 text-[11px] text-text-muted">
                    {lp.hours} hours studied
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Achievements</p>
              <Badge variant="accent">
                {achievements.filter((a) => a.earned).length} unlocked
              </Badge>
            </div>
            <div className="divide-y divide-border">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  data-testid={`achievement-${a.id}`}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                      a.earned
                        ? "border-accent-border bg-accent-subtle text-accent"
                        : "border-border bg-surface-hover text-text-muted"
                    }`}
                  >
                    {a.earned ? <Award className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-text-primary">{a.title}</p>
                    <p className="truncate text-[11px] text-text-muted">{a.detail}</p>
                  </div>
                  {a.earned ? (
                    <Badge variant="success">Earned</Badge>
                  ) : (
                    <Badge variant="default">Locked</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Target className="h-3.5 w-3.5 text-accent" />
            <p className="text-[13px] font-medium text-text-primary">Quarter goals</p>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-3">
            {[
              { l: "Ship 3 OSS contributions", v: 66 },
              { l: "Reach 80% test coverage", v: 84 },
              { l: "Complete system design course", v: 88 },
            ].map((g) => (
              <div key={g.l}>
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="truncate text-text-secondary">{g.l}</span>
                  <span className="font-medium text-text-primary">{g.v}%</span>
                </div>
                <Progress value={g.v} />
              </div>
            ))}
          </div>
        </Card>
      </PageBody>
    </>
  );
}
