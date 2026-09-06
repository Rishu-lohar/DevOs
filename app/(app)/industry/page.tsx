"use client";

import * as React from "react";
import { ArrowUpRight, Building2, Clock, Newspaper } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { MetricRow, StatCard } from "@/components/domain/primitives";
import { SearchField } from "@/components/domain/filters";
import {
  architectureTrends,
  bestPractices,
  companyInsights,
  news,
} from "@/lib/data";

export default function IndustryPage() {
  const [query, setQuery] = React.useState("");

  const filteredNews = news.filter((n) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <PageHeader
        title="Industry Intelligence"
        description="Technology news, company insights and architecture trends for builders."
        actions={
          <Button variant="secondary" size="sm" data-testid="industry-refresh">
            <Newspaper className="h-3 w-3" />
            Refresh feed
          </Button>
        }
      />

      <PageBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Articles today" value={String(news.length)} hint="curated for you" />
          <StatCard label="Companies tracked" value={String(companyInsights.length)} hint="hiring signals" />
          <StatCard label="Trends monitored" value={String(architectureTrends.length)} hint="architecture" />
          <StatCard label="Practices" value={String(bestPractices.length)} hint="engineering playbook" />
        </div>

        <Tabs defaultValue="news">
          <TabsList data-testid="industry-tabs">
            <TabsTrigger value="news" data-testid="industry-tab-news">Technology News</TabsTrigger>
            <TabsTrigger value="companies" data-testid="industry-tab-companies">Company Insights</TabsTrigger>
            <TabsTrigger value="trends" data-testid="industry-tab-trends">Architecture Trends</TabsTrigger>
            <TabsTrigger value="practices" data-testid="industry-tab-practices">Best Practices</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search articles, categories…"
              className="mb-3 w-full sm:w-72"
              testId="industry-search"
            />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredNews.map((n) => (
                <Card
                  key={n.id}
                  data-testid={`news-card-${n.id}`}
                  className="flex flex-col p-4 hover:border-border-strong"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="accent">{n.category}</Badge>
                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock className="h-3 w-3" />
                      {n.readTime}
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-[13px] font-medium leading-snug text-text-primary">
                    {n.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-text-muted">
                    {n.summary}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-[11px] text-text-muted">
                      {n.source} · {n.time}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-text-muted" />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <Table>
                <THead>
                  <TR>
                    <TH>Company</TH>
                    <TH>Engineering focus</TH>
                    <TH>Primary stack</TH>
                    <TH className="text-right">Open roles</TH>
                    <TH className="text-right">Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {companyInsights.map((c) => (
                    <TR key={c.id} data-testid={`company-row-${c.id}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-text-muted" />
                          <span className="font-medium text-text-primary">{c.company}</span>
                        </span>
                      </TD>
                      <TD>{c.focus}</TD>
                      <TD>
                        <span className="flex flex-wrap gap-1">
                          {c.stack.map((s) => (
                            <Badge key={s} variant="outline">{s}</Badge>
                          ))}
                        </span>
                      </TD>
                      <TD className="text-right text-text-primary">{c.openRoles}</TD>
                      <TD className="text-right">
                        <Badge variant={c.hiring ? "success" : "default"}>
                          {c.hiring ? "Hiring" : "Paused"}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Adoption across teams</p>
                <p className="text-[11px] text-text-muted">
                  Share of surveyed engineering organisations
                </p>
              </div>
              <div className="space-y-4 p-4">
                {architectureTrends.map((t) => (
                  <div key={t.id} data-testid={`trend-${t.id}`}>
                    <MetricRow label={t.name} value={t.adoption} />
                    <p className="ml-[144px] mt-1 text-[11px] text-text-muted">
                      <span
                        className={
                          t.delta.startsWith("-") ? "text-danger" : "text-success"
                        }
                      >
                        {t.delta}
                      </span>{" "}
                      · {t.note}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="practices">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {bestPractices.map((p) => (
                <Card key={p.id} data-testid={`practice-${p.id}`} className="p-4">
                  <Badge variant="outline">{p.category}</Badge>
                  <h3 className="mt-2.5 text-[13px] font-medium text-text-primary">{p.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{p.detail}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}
