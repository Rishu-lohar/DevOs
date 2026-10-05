"use client";

import * as React from "react";
import { Flame, Target } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  BarChart,
  ContributionGrid,
  DonutChart,
  LineChart,
} from "@/components/charts";
import { StatCard } from "@/components/domain/primitives";
import { useGitHubAnalytics } from "@/components/github/use-github-analytics";

export default function GrowthPage() {
  const github = useGitHubAnalytics();
  const analytics = github.data;
  const contributionLevels = analytics?.contributionDays.map(({ count }) =>
    count === 0 ? 0 : count < 4 ? 1 : count < 7 ? 2 : count < 10 ? 3 : 4,
  );

  return (
    <>
      <PageHeader
        title="Growth Tracker"
        description="Your GitHub engineering activity over time."
        actions={
          <Button variant="secondary" size="sm" data-testid="growth-export">
            Export report
          </Button>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Current streak"
            value={
              analytics?.currentStreak === null
                ? "Unavailable"
                : analytics
                  ? `${analytics.currentStreak} days`
                  : "—"
            }
            hint={
              analytics
                ? "GitHub contributions"
                : github.status === "loading"
                  ? "Loading GitHub analytics…"
                  : github.message
            }
          />
          <StatCard
            label="Contributions"
            value={analytics ? String(analytics.contributionCount) : "—"}
            hint={analytics ? "last 12 months" : github.status === "loading" ? "Loading GitHub analytics…" : github.message}
          />
          <StatCard
            label="Commits"
            value={analytics ? String(analytics.commits) : "—"}
            hint={analytics ? "last 12 months" : github.status === "loading" ? "Loading GitHub analytics…" : github.message}
          />
          <StatCard
            label="Pull requests"
            value={analytics ? String(analytics.pullRequests) : "—"}
            hint={analytics ? "last 12 months" : github.status === "loading" ? "Loading GitHub analytics…" : github.message}
          />
        </div>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div>
              <p className="text-[13px] font-medium text-text-primary">Contribution heatmap</p>
              <p className="text-[11px] text-text-muted">
                {analytics
                  ? `${analytics.contributionCount.toLocaleString()} contributions for @${analytics.account.login} in the last year`
                  : github.status === "loading"
                    ? "Loading GitHub activity…"
                    : github.message}
              </p>
            </div>
            {analytics?.currentStreak !== null && analytics && (
              <Badge variant="success">
                <Flame className="h-3 w-3" />
                {analytics.currentStreak}-day streak
              </Badge>
            )}
          </div>
          <div className="p-4">
            {analytics && contributionLevels ? (
              <ContributionGrid
                data={contributionLevels}
                counts={analytics.contributionDays.map(({ count }) => count)}
              />
            ) : (
              <p className="py-8 text-center text-[12px] text-text-muted">
                {github.status === "loading" ? "Loading GitHub activity…" : github.message}
              </p>
            )}
          </div>
        </Card>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Velocity trend</p>
              <p className="text-[11px] text-text-muted">
                {analytics
                  ? `${analytics.commits} commits · ${analytics.pullRequests} PRs · ${analytics.reviews} reviews in the last year`
                  : "Monthly commits, pull requests and reviews"}
              </p>
            </div>
            <div className="p-3">
              {analytics ? (
                <AreaChart
                  data={analytics.monthlyActivity}
                  xKey="month"
                  series={[
                    { key: "commits" },
                    { key: "prs", color: "var(--success)" },
                    { key: "reviews", color: "var(--warning)" },
                  ]}
                  height={200}
                />
              ) : (
                <p className="py-16 text-center text-[12px] text-text-muted">
                  {github.status === "loading" ? "Loading GitHub activity…" : github.message}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Language mix</p>
            </div>
            <div className="p-4">
              {analytics?.languagesAvailable && analytics.languages.length > 0 ? (
                <>
                  <DonutChart data={analytics.languages} height={150} />
                  <p className="mt-2 text-center text-[10px] text-text-muted">
                    Primary language by repository
                  </p>
                </>
              ) : (
                <p className="py-16 text-center text-[12px] text-text-muted">
                  {analytics
                    ? analytics.languagesAvailable
                      ? "No language data available."
                      : "Repository language data unavailable."
                    : github.status === "loading"
                      ? "Loading GitHub activity…"
                      : github.message}
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Weekly commits</p>
            </div>
            <div className="p-3">
              {analytics ? (
                <BarChart
                  data={analytics.weeklyActivity}
                  xKey="week"
                  yKey="commits"
                  height={186}
                />
              ) : (
                <p className="py-16 text-center text-[12px] text-text-muted">
                  {github.status === "loading" ? "Loading GitHub activity…" : github.message}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Review throughput</p>
            </div>
            <div className="p-3">
              {analytics ? (
                <LineChart
                  data={analytics.monthlyActivity}
                  xKey="month"
                  series={[{ key: "reviews", color: "var(--accent)" }]}
                  height={186}
                />
              ) : (
                <p className="py-16 text-center text-[12px] text-text-muted">
                  {github.status === "loading" ? "Loading GitHub activity…" : github.message}
                </p>
              )}
            </div>
          </Card>
        </div>

        <Card>
          <div className="border-b border-border px-4 py-2.5">
            <p className="text-[13px] font-medium text-text-primary">Repository activity</p>
            <p className="text-[11px] text-text-muted">
              Commits, pull requests and reviews in the last 12 months
            </p>
          </div>
          {analytics ? (
            analytics.repositories.length > 0 ? (
              <div className="divide-y divide-border">
                {analytics.repositories.map((repository) => (
                  <div
                    key={repository.name}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="min-w-0 flex-1 truncate text-[12px] text-text-primary">
                      {repository.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-text-muted">
                      {repository.commits} commits · {repository.prs} PRs · {repository.reviews} reviews
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-center text-[12px] text-text-muted">
                No repository contributions found in the last year.
              </p>
            )
          ) : (
            <p className="px-4 py-6 text-center text-[12px] text-text-muted">
              {github.status === "loading" ? "Loading GitHub activity…" : github.message}
            </p>
          )}
        </Card>

        <div className="grid gap-3 xl:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Learning progress</p>
            </div>
            <div className="p-4">
              <p className="py-6 text-center text-[12px] text-text-muted">
                Learning activity is not tracked in GitHub analytics.
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-[13px] font-medium text-text-primary">Pull request reviews</p>
              <Badge variant="accent">{analytics ? analytics.reviews : "—"}</Badge>
            </div>
            <p className="px-4 py-6 text-center text-[12px] text-text-muted">
              {analytics
                ? `Reviews authored by @${analytics.account.login} in the last 12 months.`
                : github.status === "loading"
                  ? "Loading GitHub activity…"
                  : github.message}
            </p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Target className="h-3.5 w-3.5 text-accent" />
            <p className="text-[13px] font-medium text-text-primary">Quarter goals</p>
          </div>
          <div className="p-4">
            <p className="py-6 text-center text-[12px] text-text-muted">
              Quarter goals are not tracked in GitHub analytics.
            </p>
          </div>
        </Card>
      </PageBody>
    </>
  );
}
