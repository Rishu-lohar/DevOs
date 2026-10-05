"use client";

import * as React from "react";
import {
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  RefreshCw,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { ConnectGitHubButton } from "@/components/github/connect-github-button";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState, Spinner } from "@/components/ui/feedback";
import { SearchField, FilterMenu } from "@/components/domain/filters";
import { LanguageDot, StatCard } from "@/components/domain/primitives";
import type {
  GitHubRepository,
  GitHubRepositoryDetail,
  GitHubWorkspaceState,
} from "@/lib/github";
import { formatNumber } from "@/lib/utils";

type ApiErrorCode =
  | "not_connected"
  | "missing_token"
  | "scope"
  | "rate_limit"
  | "permission"
  | "not_found"
  | "unavailable";

function errorMessage(code: ApiErrorCode) {
  switch (code) {
    case "not_connected":
      return "Connect a GitHub account to view its repositories.";
    case "missing_token":
      return "Your GitHub access has expired. Reconnect GitHub to continue.";
    case "scope":
      return "Repository access was not granted. Reconnect GitHub and approve repository access.";
    case "rate_limit":
      return "GitHub API rate limit reached. Please wait a while and try again.";
    case "permission":
      return "GitHub denied access. Check the granted permissions and try again.";
    case "not_found":
      return "This repository is unavailable or you no longer have access to it.";
    default:
      return "GitHub is temporarily unavailable. Please try again.";
  }
}

function stateForError(
  code: ApiErrorCode,
  linked: boolean,
): GitHubWorkspaceState {
  if (code === "not_connected") {
    return { status: "not_connected", linked: false };
  }
  if (code === "missing_token" || code === "scope") {
    return { status: "reauthorize", linked: true, reason: code };
  }
  return {
    status: "error",
    linked,
    code:
      code === "rate_limit"
        ? "rate_limit"
        : code === "permission"
          ? "permission"
          : "unavailable",
  };
}

function dateLabel(value: string | null) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString();
}

async function readApiError(response: Response): Promise<ApiErrorCode> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;
  const code = payload?.error;
  if (
    code === "not_connected" ||
    code === "missing_token" ||
    code === "scope" ||
    code === "rate_limit" ||
    code === "permission" ||
    code === "not_found"
  ) {
    return code;
  }
  return response.status === 429
    ? "rate_limit"
    : response.status === 403
      ? "permission"
      : "unavailable";
}

export function GitHubWorkspace({
  linked,
}: {
  linked: boolean;
}) {
  const [workspace, setWorkspace] =
    React.useState<GitHubWorkspaceState | null>(null);
  const [query, setQuery] = React.useState("");
  const [visibility, setVisibility] = React.useState("all");
  const [selected, setSelected] = React.useState<GitHubRepository | null>(null);
  const [detail, setDetail] = React.useState<GitHubRepositoryDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detailError, setDetailError] = React.useState<ApiErrorCode | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshError, setRefreshError] = React.useState<ApiErrorCode | null>(null);

  const overview =
    workspace?.status === "connected" ? workspace.data : null;

  React.useEffect(() => {
    let active = true;

    const loadInitialOverview = async () => {
      try {
        const response = await fetch("/api/github", { cache: "no-store" });
        if (!response.ok) {
          const code = await readApiError(response);
          if (active) setWorkspace(stateForError(code, linked));
          return;
        }

        const state = (await response.json()) as GitHubWorkspaceState;
        if (active) setWorkspace(state);
      } catch {
        if (active) setWorkspace(stateForError("unavailable", linked));
      }
    };

    void loadInitialOverview();
    return () => {
      active = false;
    };
  }, [linked]);

  const loadOverview = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const response = await fetch("/api/github", { cache: "no-store" });
      if (!response.ok) {
        setRefreshError(await readApiError(response));
        return;
      }
      const state = (await response.json()) as GitHubWorkspaceState;
      setWorkspace(state);
    } catch {
      setRefreshError("unavailable");
    } finally {
      setRefreshing(false);
    }
  };

  const loadRepository = async (repository: GitHubRepository) => {
    setSelected(repository);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const response = await fetch(
        `/api/github?repo=${encodeURIComponent(repository.fullName)}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        setDetailError(await readApiError(response));
        return;
      }
      setDetail((await response.json()) as GitHubRepositoryDetail);
    } catch {
      setDetailError("unavailable");
    } finally {
      setDetailLoading(false);
    }
  };

  const repositories = overview?.repositories.filter((repository) => {
    const matchesQuery = `${repository.fullName} ${repository.description ?? ""} ${repository.language ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesVisibility =
      visibility === "all" || repository.visibility === visibility;
    return matchesQuery && matchesVisibility;
  }) ?? [];

  if (!workspace) {
    return (
      <>
        <PageHeader title="GitHub" description="Loading your GitHub workspace…" />
        <PageBody>
          <Card className="flex items-center gap-2 p-4 text-[12px] text-text-muted">
            <Spinner /> Loading your GitHub profile and repositories…
          </Card>
        </PageBody>
      </>
    );
  }

  if (workspace.status === "not_connected") {
    return (
      <>
        <PageHeader
          title="GitHub"
          description="Connect GitHub to browse your repositories, branches and commits."
        />
        <PageBody>
          <Card className="max-w-xl p-5">
            <EmptyState
              icon={<GithubIcon className="h-4 w-4" />}
              title="GitHub is not connected"
              description="Authorize read access to your profile and repositories. DevOS will not write to GitHub."
              action={
                <ConnectGitHubButton
                  linked={false}
                  label="Connect GitHub"
                />
              }
            />
          </Card>
        </PageBody>
      </>
    );
  }

  if (workspace.status === "reauthorize") {
    return (
      <>
        <PageHeader title="GitHub" description="GitHub authorization needs attention." />
        <PageBody>
          <Card className="max-w-xl p-5">
            <EmptyState
              icon={<GithubIcon className="h-4 w-4" />}
              title="Reconnect GitHub"
              description={errorMessage(workspace.reason)}
              action={
                <ConnectGitHubButton
                  linked={linked}
                  label="Reconnect GitHub"
                />
              }
            />
          </Card>
        </PageBody>
      </>
    );
  }

  if (workspace.status === "error") {
    return (
      <>
        <PageHeader title="GitHub" description="Unable to load GitHub data." />
        <PageBody>
          <Card className="max-w-xl p-5">
            <EmptyState
              icon={<GithubIcon className="h-4 w-4" />}
              title="GitHub data could not be loaded"
              description={errorMessage(workspace.code)}
              action={
                workspace.code === "permission" ? (
                  <ConnectGitHubButton
                    linked={linked}
                    label="Reconnect GitHub"
                  />
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void loadOverview()}
                    disabled={refreshing}
                  >
                    {refreshing ? <Spinner /> : <RefreshCw className="h-3 w-3" />}
                    Try again
                  </Button>
                )
              }
            />
          </Card>
        </PageBody>
      </>
    );
  }

  const profile = workspace.data.profile;

  return (
    <>
      <PageHeader
        title="GitHub"
        description={`Connected as @${profile.login} · ${overview?.repositories.length ?? 0} repositories available`}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void loadOverview()}
            disabled={refreshing}
            data-testid="github-sync"
          >
            {refreshing ? <Spinner /> : <RefreshCw className="h-3 w-3" />}
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        }
      />

      <PageBody className="space-y-4">
        <Card className="flex items-center gap-3 p-3">
          <Avatar
            name={profile.name || profile.login}
            src={profile.avatarUrl}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-text-primary">
              {profile.name || profile.login}
            </p>
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-text-muted hover:text-accent"
            >
              @{profile.login} <ExternalLink className="inline h-3 w-3" />
            </a>
          </div>
          <Badge variant="success">Connected</Badge>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Repositories"
            value={formatNumber(overview?.repositories.length ?? 0)}
            hint="available to this account"
          />
          <StatCard
            label="Public repositories"
            value={formatNumber(profile.publicRepos)}
          />
          <StatCard
            label="Private repositories"
            value={formatNumber(profile.privateRepos)}
          />
        </div>

        {refreshError && (
          <p role="alert" className="text-[12px] text-danger">
            {errorMessage(refreshError)}
          </p>
        )}

        <section aria-label="Repositories">
          <div className="mb-3 flex flex-wrap gap-2">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search your repositories…"
              className="w-full sm:w-72"
              testId="github-repository-search"
            />
            <FilterMenu
              label="Visibility"
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: "all", label: "All repositories" },
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
              testId="github-visibility-filter"
            />
          </div>

          {repositories.length === 0 ? (
            <Card>
              <EmptyState
                title={
                  overview?.repositories.length
                    ? "No repositories found"
                    : "No repositories available"
                }
                description={
                  overview?.repositories.length
                    ? "Try changing the search or visibility filter."
                    : "This GitHub account does not have repositories available to DevOS."
                }
              />
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {repositories.map((repository) => (
                <Card
                  key={repository.id}
                  data-testid={`github-repository-${repository.id}`}
                  className={`p-4 hover:border-border-strong ${selected?.id === repository.id ? "border-accent" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={repository.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 truncate font-mono text-[12px] text-text-primary hover:text-accent"
                    >
                      {repository.fullName}
                    </a>
                    <Badge
                      variant={
                        repository.visibility === "public" ? "outline" : "accent"
                      }
                    >
                      {repository.visibility}
                    </Badge>
                  </div>
                  <p className="mt-1.5 line-clamp-2 min-h-9 text-[12px] leading-relaxed text-text-muted">
                    {repository.description || "No description"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                    {repository.language ? (
                      <LanguageDot language={repository.language} />
                    ) : (
                      <span>Language not specified</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {formatNumber(repository.stars)}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {formatNumber(repository.forks)}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-text-muted">
                    Pushed {dateLabel(repository.pushedAt ?? repository.updatedAt)}
                  </p>
                  <div className="mt-3 border-t border-border pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void loadRepository(repository)}
                    >
                      <GitBranch className="h-3 w-3" />
                      View branches & commits
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {selected && (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-mono text-[13px] font-medium text-text-primary">
                  {selected.fullName}
                </p>
                <p className="text-[11px] text-text-muted">
                  Default branch: {selected.defaultBranch}
                </p>
              </div>
              <a
                href={selected.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent hover:underline"
              >
                Open on GitHub <ExternalLink className="inline h-3 w-3" />
              </a>
            </div>
            {detailLoading ? (
              <div className="flex items-center gap-2 p-4 text-[12px] text-text-muted">
                <Spinner /> Loading branches and commits…
              </div>
            ) : detailError ? (
              <div className="space-y-2 p-4">
                <p role="alert" className="text-[12px] text-danger">
                  {errorMessage(detailError)}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void loadRepository(selected)}
                >
                  Try again
                </Button>
              </div>
            ) : detail ? (
              <div className="grid gap-4 p-4 xl:grid-cols-2">
                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-[12px] font-medium text-text-primary">
                    <GitBranch className="h-3.5 w-3.5 text-text-muted" />
                    Branches ({detail.branches.length})
                  </h2>
                  {detail.branches.length ? (
                    <ul className="divide-y divide-border rounded-lg border border-border">
                      {detail.branches.map((branch) => (
                        <li
                          key={branch.name}
                          className="flex items-center justify-between gap-2 px-3 py-2"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate font-mono text-[11px] text-text-primary">
                              {branch.name}
                            </span>
                            {branch.name === selected.defaultBranch && (
                              <Badge variant="accent">default</Badge>
                            )}
                          </span>
                          <span className="font-mono text-[10px] text-text-muted">
                            {branch.lastCommitSha.slice(0, 7)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-text-muted">No branches found.</p>
                  )}
                </div>

                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-[12px] font-medium text-text-primary">
                    <GitCommitHorizontal className="h-3.5 w-3.5 text-text-muted" />
                    Latest commits
                  </h2>
                  {detail.commits.length ? (
                    <ul className="divide-y divide-border rounded-lg border border-border">
                      {detail.commits.map((commit) => (
                        <li
                          key={commit.sha}
                          className="flex items-start gap-2 px-3 py-2"
                        >
                          <GitCommitHorizontal className="mt-0.5 h-3 w-3 shrink-0 text-text-muted" />
                          <div className="min-w-0 flex-1">
                            <a
                              href={commit.htmlUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block truncate text-[11px] text-text-primary hover:text-accent"
                            >
                              {commit.message}
                            </a>
                            <p className="mt-0.5 truncate text-[10px] text-text-muted">
                              {commit.author} · {dateLabel(commit.date)}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] text-text-muted">
                            {commit.sha.slice(0, 7)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-text-muted">No commits found.</p>
                  )}
                </div>
              </div>
            ) : null}
          </Card>
        )}
      </PageBody>
    </>
  );
}
