"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck, ExternalLink, Lightbulb, Star, TrendingUp } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { LanguageDot, MetricRow, StatCard } from "@/components/domain/primitives";
import { SearchField } from "@/components/domain/filters";
import {
  contributionSuggestions,
  goodFirstIssues,
  ossRepos,
} from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default function OpenSourcePage() {
  const [query, setQuery] = React.useState("");
  const [bookmarks, setBookmarks] = React.useState<string[]>(["o1", "o3", "o6"]);

  const toggle = (id: string) =>
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const filtered = ossRepos.filter((r) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      r.fullName.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.topics.some((t) => t.includes(q))
    );
  });

  const bookmarked = ossRepos.filter((r) => bookmarks.includes(r.id));

  const RepoCard = ({ repo }: { repo: (typeof ossRepos)[number] }) => {
    const saved = bookmarks.includes(repo.id);
    return (
      <Card data-testid={`oss-card-${repo.id}`} className="p-4 hover:border-border-strong">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate font-mono text-[12px] text-text-primary">
            {repo.fullName}
          </p>
          <button
            onClick={() => toggle(repo.id)}
            aria-label={saved ? "Remove bookmark" : "Add bookmark"}
            data-testid={`oss-bookmark-${repo.id}`}
            className="shrink-0 rounded-md p-1 text-text-muted transition-colors duration-[140ms] hover:bg-surface-hover hover:text-accent"
          >
            {saved ? (
              <BookmarkCheck className="h-3.5 w-3.5 text-accent" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-text-muted">
          {repo.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-text-muted">
          <LanguageDot language={repo.language} />
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {formatNumber(repo.stars)}
          </span>
          <span className="flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            {repo.goodFirstIssues} good first
          </span>
        </div>
        <div className="mt-3 border-t border-border pt-3">
          <MetricRow label="Match score" value={repo.match} />
        </div>
      </Card>
    );
  };

  return (
    <>
      <PageHeader
        title="Open Source"
        description="Discover repositories and issues matched to your skill profile."
        actions={
          <Button variant="primary" size="sm" data-testid="oss-refresh">
            <TrendingUp className="h-3 w-3" />
            Refresh matches
          </Button>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Trending repos" value={String(ossRepos.length)} hint="matched to you" />
          <StatCard label="Bookmarked" value={String(bookmarks.length)} hint="saved for later" />
          <StatCard label="Good first issues" value={String(goodFirstIssues.length)} hint="ready to claim" />
          <StatCard label="Merged PRs" value="8" delta="+3" trend="up" hint="lifetime OSS" />
        </div>

        <Tabs defaultValue="trending">
          <TabsList data-testid="oss-tabs">
            <TabsTrigger value="trending" data-testid="oss-tab-trending">Trending</TabsTrigger>
            <TabsTrigger value="bookmarks" data-testid="oss-tab-bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="issues" data-testid="oss-tab-issues">Good First Issues</TabsTrigger>
            <TabsTrigger value="suggestions" data-testid="oss-tab-suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search repositories, topics…"
              className="mb-3 w-full sm:w-72"
              testId="oss-search"
            />
            {filtered.length === 0 ? (
              <Card>
                <EmptyState title="No repositories found" description="Try a broader search term." />
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((r) => (
                  <RepoCard key={r.id} repo={r} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks">
            {bookmarked.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<Bookmark className="h-4 w-4" />}
                  title="No bookmarks yet"
                  description="Bookmark repositories from the trending tab to track them here."
                />
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {bookmarked.map((r) => (
                  <RepoCard key={r.id} repo={r} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <div className="divide-y divide-border">
                {goodFirstIssues.map((g) => (
                  <div
                    key={g.id}
                    data-testid={`gfi-row-${g.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-[140ms] hover:bg-surface-hover"
                  >
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 text-warning" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-text-primary">{g.title}</p>
                      <p className="truncate font-mono text-[11px] text-text-muted">
                        {g.repo} · {g.comments} comments · {g.time}
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                      <LanguageDot language={g.language} />
                      {g.labels.map((l) => (
                        <Badge key={l} variant="outline">{l}</Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon-sm" aria-label="Open issue">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="grid gap-3 md:grid-cols-2">
              {contributionSuggestions.map((s) => (
                <Card key={s.id} data-testid={`oss-suggestion-${s.id}`} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium text-text-primary">{s.title}</p>
                    <Badge variant={s.impact === "High" ? "success" : "warning"}>
                      {s.impact} impact
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{s.reason}</p>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Start contributing
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}
