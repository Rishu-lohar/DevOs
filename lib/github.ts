import "server-only";

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isMissingAuthSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { GitHubAnalytics } from "@/lib/github-analytics-types";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_TOKEN_COOKIE = "devos_github_provider_token";
const GITHUB_TOKEN_USER_COOKIE = "devos_github_provider_user";
const GITHUB_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;
const PAGE_SIZE = 100;

export type GitHubRepository = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  visibility: "public" | "private";
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  pushedAt: string | null;
  defaultBranch: string;
  htmlUrl: string;
};

export type GitHubOverview = {
  profile: {
    login: string;
    name: string | null;
    avatarUrl: string;
    htmlUrl: string;
    publicRepos: number;
    privateRepos: number;
  };
  repositories: GitHubRepository[];
};

export type GitHubRepositoryDetail = {
  branches: {
    name: string;
    lastCommitSha: string;
  }[];
  commits: {
    sha: string;
    message: string;
    author: string;
    date: string | null;
    htmlUrl: string;
  }[];
};

export type GitHubWorkspaceState =
  | { status: "connected"; data: GitHubOverview }
  | { status: "not_connected"; linked: false }
  | { status: "reauthorize"; linked: true; reason: "missing_token" | "scope" }
  | {
      status: "error";
      linked: boolean;
      code: "rate_limit" | "permission" | "unavailable";
    };

export class GitHubIntegrationError extends Error {
  constructor(
    readonly code:
      | "unauthenticated"
      | "not_connected"
      | "missing_token"
      | "scope"
      | "rate_limit"
      | "permission"
      | "not_found"
      | "unavailable",
    readonly upstream?: {
      status: number | null;
      message: string;
      endpoint: string;
      tokenExists: boolean;
      login: string | null;
    },
  ) {
    super(code);
    this.name = "GitHubIntegrationError";
  }
}

function logGitHubFailure(upstream: NonNullable<GitHubIntegrationError["upstream"]>) {
  console.error("GitHub API request failed", upstream);
}

type GitHubProfileResponse = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  total_private_repos?: number;
};

type GitHubRepositoryResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string | null;
  default_branch: string;
  html_url: string;
};

type GitHubBranchResponse = {
  name: string;
  commit: { sha: string };
};

type GitHubCommitResponse = {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string | null } | null;
  };
  author: { login: string } | null;
  html_url: string;
};

type GitHubGraphQLResponse<T> = {
  data?: T;
  errors?: {
    message: string;
    type?: string;
    extensions?: { type?: string; code?: string };
  }[];
};

type GitHubContributionPage<T> = {
  nodes: T[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
};

type GitHubCommitRepositoryContributions = {
  repository: { nameWithOwner: string };
  contributions: GitHubContributionPage<GitHubCommitContribution>;
};

type GitHubCommitContribution = {
  occurredAt: string;
  commitCount: number;
  repository: { nameWithOwner: string };
};

type GitHubPullRequestContribution = {
  occurredAt: string;
  pullRequest: {
    number: number;
    title: string;
    url: string;
    repository: { nameWithOwner: string };
  } | null;
};

type GitHubReviewContribution = {
  occurredAt: string;
  pullRequestReview: {
    pullRequest: {
      number: number;
      title: string;
      url: string;
      repository: { nameWithOwner: string };
    };
  } | null;
};

type GitHubAnalyticsGraphQL = {
  viewer: {
    login: string;
    name: string | null;
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalPullRequestReviewContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: { date: string; contributionCount: number }[];
        }[];
      };
      commitContributionsByRepository: GitHubCommitRepositoryContributions[];
      pullRequestContributions: GitHubContributionPage<GitHubPullRequestContribution>;
      pullRequestReviewContributions: GitHubContributionPage<GitHubReviewContribution>;
    };
  };
};

type GitHubSearchIssuesResponse = {
  total_count: number;
  items: {
    number: number;
    title: string;
    html_url: string;
    updated_at: string;
    repository_url: string;
  }[];
};

function isLinkedToGitHub(user: User) {
  return (
    user.app_metadata.provider === "github" ||
    user.identities?.some((identity) => identity.provider === "github") === true
  );
}

export async function storeGitHubProviderToken(
  supabase: SupabaseClient,
  session: Session,
  isGitHubProvider: boolean,
) {
  const cookieStore = await cookies();
  const providerToken = session.provider_token;

  if (isGitHubProvider && providerToken) {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: GITHUB_TOKEN_MAX_AGE,
    };
    cookieStore.set(GITHUB_TOKEN_COOKIE, providerToken, options);
    cookieStore.set(GITHUB_TOKEN_USER_COOKIE, session.user.id, options);
  } else if (isGitHubProvider) {
    cookieStore.delete(GITHUB_TOKEN_COOKIE);
    cookieStore.delete(GITHUB_TOKEN_USER_COOKIE);
  }

  if (providerToken) {
    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    if (error) throw new GitHubIntegrationError("unavailable");
  }
}

async function getGitHubAccess() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw new GitHubIntegrationError("unauthenticated");

  let user: User | null;
  try {
    const {
      data: { user: authenticatedUser },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    user = authenticatedUser;
  } catch (error) {
    if (isMissingAuthSession(error)) {
      throw new GitHubIntegrationError("unauthenticated");
    }
    throw error;
  }

  if (!user) throw new GitHubIntegrationError("unauthenticated");
  if (!isLinkedToGitHub(user)) {
    throw new GitHubIntegrationError("not_connected");
  }

  const cookieUserId = cookieStore.get(GITHUB_TOKEN_USER_COOKIE)?.value;
  let accessToken =
    cookieUserId === user.id
      ? cookieStore.get(GITHUB_TOKEN_COOKIE)?.value
      : undefined;

  if (
    !accessToken &&
    session?.provider_token &&
    session.user.id === user.id &&
    session.user.app_metadata.provider === "github"
  ) {
    accessToken = session.provider_token;
    await storeGitHubProviderToken(supabase, session, true);
  } else if (session?.provider_token) {
    await storeGitHubProviderToken(supabase, session, false);
  }

  if (!accessToken) throw new GitHubIntegrationError("missing_token");
  return { user, accessToken };
}

function apiErrorCode(response: Response) {
  if (response.status === 403 || response.status === 429) {
    if (
      response.status === 429 ||
      response.headers.get("x-ratelimit-remaining") === "0"
    ) {
      return new GitHubIntegrationError("rate_limit");
    }

    return new GitHubIntegrationError("permission");
  }
  if (response.status === 401) {
    return new GitHubIntegrationError("missing_token");
  }
  if (response.status === 404) {
    return new GitHubIntegrationError("not_found");
  }
  return new GitHubIntegrationError("unavailable");
}

async function githubResponse(
  accessToken: string,
  path: string,
  login: string | null = null,
) {
  const endpoint = `${GITHUB_API}${path}`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      cache: "no-store",
    });
  } catch (error) {
    const upstream = {
      status: null,
      message: error instanceof Error ? error.message : "Network request failed",
      endpoint,
      tokenExists: Boolean(accessToken),
      login,
    };
    logGitHubFailure(upstream);
    throw new GitHubIntegrationError("unavailable", upstream);
  }

  if (!response.ok) {
    const body = await response.clone().text().catch(() => "");
    let message = body || response.statusText || "GitHub returned an error";
    try {
      const payload: unknown = JSON.parse(body);
      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
      ) {
        message = payload.message;
      }
    } catch {
      // Preserve the original response body when it is not JSON.
    }
    message = message.replaceAll(accessToken, "[REDACTED]");
    const upstream = {
      status: response.status,
      message,
      endpoint,
      tokenExists: Boolean(accessToken),
      login,
    };
    logGitHubFailure(upstream);
    const error = apiErrorCode(response);
    throw new GitHubIntegrationError(error.code, upstream);
  }
  return response;
}

async function githubGet<T>(
  accessToken: string,
  path: string,
  login: string | null = null,
): Promise<T> {
  const response = await githubResponse(accessToken, path, login);
  return (await response.json()) as T;
}

async function githubGraphql<T>(
  accessToken: string,
  query: string,
  variables: Record<string, string | null>,
  login: string | null,
): Promise<T> {
  const endpoint = `${GITHUB_API}/graphql`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (error) {
    const upstream = {
      status: null,
      message: error instanceof Error ? error.message : "Network request failed",
      endpoint,
      tokenExists: Boolean(accessToken),
      login,
    };
    logGitHubFailure(upstream);
    throw new GitHubIntegrationError("unavailable", upstream);
  }

  if (!response.ok) {
    const body = await response.clone().text().catch(() => "");
    let message = body || response.statusText || "GitHub returned an error";
    try {
      const payload: unknown = JSON.parse(body);
      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
      ) {
        message = payload.message;
      }
    } catch {
      // Preserve the original response body when it is not JSON.
    }
    message = message.replaceAll(accessToken, "[REDACTED]");
    const upstream = {
      status: response.status,
      message,
      endpoint,
      tokenExists: Boolean(accessToken),
      login,
    };
    logGitHubFailure(upstream);
    const error = apiErrorCode(response);
    throw new GitHubIntegrationError(error.code, upstream);
  }
  const payload = (await response.json()) as GitHubGraphQLResponse<T>;
  if (payload.errors?.length) {
    const message = payload.errors.map((error) => error.message).join("; ");
    const upstream = {
      status: response.status,
      message: message.replaceAll(accessToken, "[REDACTED]"),
      endpoint,
      tokenExists: Boolean(accessToken),
      login,
    };
    logGitHubFailure(upstream);
    if (
      payload.errors.some(
        (error) =>
          error.type === "RATE_LIMITED" ||
          error.extensions?.type === "RATE_LIMITED" ||
          error.extensions?.code === "RATE_LIMITED" ||
          /rate limit/i.test(error.message),
      )
    ) {
      throw new GitHubIntegrationError("rate_limit", upstream);
    }
    if (
      payload.errors.some(
        (error) =>
          error.type === "FORBIDDEN" ||
          error.type === "UNAUTHORIZED" ||
          error.extensions?.type === "FORBIDDEN" ||
          error.extensions?.type === "UNAUTHORIZED" ||
          error.extensions?.code === "FORBIDDEN" ||
          error.extensions?.code === "UNAUTHORIZED" ||
          /resource not accessible|requires authentication|not authorized/i.test(
            error.message,
          ),
      )
    ) {
      throw new GitHubIntegrationError("permission", upstream);
    }
    throw new GitHubIntegrationError("unavailable", upstream);
  }
  if (!payload.data) {
    const upstream = {
      status: response.status,
      message: "GitHub GraphQL response did not contain data.",
      endpoint,
      tokenExists: Boolean(accessToken),
      login,
    };
    logGitHubFailure(upstream);
    throw new GitHubIntegrationError("unavailable", upstream);
  }
  return payload.data;
}

const GITHUB_ANALYTICS_QUERY = `
  query GitHubAnalytics($from: DateTime!, $to: DateTime!) {
    viewer {
      login
      name
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 25) {
          repository { nameWithOwner }
          contributions(first: 100) {
            nodes { occurredAt commitCount repository { nameWithOwner } }
            pageInfo { hasNextPage endCursor }
          }
        }
        pullRequestContributions(first: 100) {
          nodes {
            occurredAt
            pullRequest {
              number title url repository { nameWithOwner }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
        pullRequestReviewContributions(first: 100) {
          nodes {
            occurredAt
            pullRequestReview {
              pullRequest {
                number title url repository { nameWithOwner }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  }
`;

async function getAllContributionNodes<T>(
  accessToken: string,
  from: string,
  to: string,
  login: string,
  connection:
    | "commitContributions"
    | "pullRequestContributions"
    | "pullRequestReviewContributions",
  initial: GitHubContributionPage<T>,
) {
  const nodes = [...initial.nodes];
  let pageInfo = initial.pageInfo;

  while (pageInfo.hasNextPage && pageInfo.endCursor) {
    const data = await githubGraphql<{
      viewer: {
        contributionsCollection: Record<string, GitHubContributionPage<T>>;
      };
    }>(
      accessToken,
      `query GitHubContributionPage($from: DateTime!, $to: DateTime!, $cursor: String!) {
        viewer {
          contributionsCollection(from: $from, to: $to) {
            ${connection}(first: 100, after: $cursor) {
              nodes {
                ${
                  connection === "commitContributions"
                    ? "occurredAt commitCount repository { nameWithOwner }"
                    : connection === "pullRequestContributions"
                      ? "occurredAt pullRequest { number title url repository { nameWithOwner } }"
                      : "occurredAt pullRequestReview { pullRequest { number title url repository { nameWithOwner } } }"
                }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      }`,
      { from, to, cursor: pageInfo.endCursor },
      login,
    );
    const nextPage = data.viewer.contributionsCollection[connection];
    nodes.push(...nextPage.nodes);
    pageInfo = nextPage.pageInfo;
  }

  return nodes;
}

function startOfUtcWeek(date: Date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  return start;
}

function calculateCurrentStreak(days: { date: string; count: number }[]) {
  const sortedDays = [...days].sort((a, b) => b.date.localeCompare(a.date));
  if (sortedDays.length === 0) return null;

  const countsByDate = new Map(sortedDays.map((day) => [day.date, day.count]));
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const startDate =
    (countsByDate.get(today) ?? 0) > 0
      ? today
      : (countsByDate.get(yesterday) ?? 0) > 0
        ? yesterday
        : null;
  if (!startDate) return 0;

  let streak = 0;
  const cursor = new Date(`${startDate}T00:00:00.000Z`);
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    const day = sortedDays.find((entry) => entry.date === key);
    if (!day) return null;
    if (day.count === 0) return streak;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
}

function makeActivitySeries(
  commits: GitHubCommitContribution[],
  pullRequests: GitHubPullRequestContribution[],
  reviews: GitHubReviewContribution[],
) {
  const now = new Date();
  const weeklyActivity = Array.from({ length: 12 }, (_, index) => {
    const weekStart = startOfUtcWeek(now);
    weekStart.setUTCDate(weekStart.getUTCDate() - (11 - index) * 7);
    return {
      start: weekStart,
      week: weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      commits: 0,
      prs: 0,
      reviews: 0,
    };
  });
  const monthlyActivity = Array.from({ length: 12 }, (_, index) => {
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    monthStart.setUTCMonth(monthStart.getUTCMonth() - (11 - index));
    return {
      start: monthStart,
      month: monthStart.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      commits: 0,
      prs: 0,
      reviews: 0,
    };
  });

  function addActivity(occurredAt: string, kind: "commits" | "prs" | "reviews", count = 1) {
    const date = new Date(occurredAt);
    if (Number.isNaN(date.getTime())) return;
    const weekStart = startOfUtcWeek(date).getTime();
    const week = weeklyActivity.find((entry) => entry.start.getTime() === weekStart);
    if (week) week[kind] += count;
    const month = monthlyActivity.find(
      (entry) =>
        entry.start.getUTCFullYear() === date.getUTCFullYear() &&
        entry.start.getUTCMonth() === date.getUTCMonth(),
    );
    if (month) month[kind] += count;
  }

  for (const contribution of commits) {
    addActivity(contribution.occurredAt, "commits", contribution.commitCount);
  }
  for (const contribution of pullRequests) {
    addActivity(contribution.occurredAt, "prs");
  }
  for (const contribution of reviews) {
    addActivity(contribution.occurredAt, "reviews");
  }

  return {
    weeklyActivity: weeklyActivity.map(({ week, commits, prs, reviews }) => ({
      week,
      commits,
      prs,
      reviews,
    })),
    monthlyActivity: monthlyActivity.map(({ month, commits, prs, reviews }) => ({
      month,
      commits,
      prs,
      reviews,
    })),
  };
}

export async function getGitHubAnalytics(): Promise<GitHubAnalytics> {
  const { accessToken, user } = await getGitHubAccess();
  const metadataLogin = user.user_metadata.user_name;
  const profile = await githubGet<GitHubProfileResponse>(
    accessToken,
    "/user",
    typeof metadataLogin === "string" ? metadataLogin : null,
  );
  const login = profile.login;
  const to = new Date();
  const from = new Date(to.getTime() - 365 * 24 * 60 * 60 * 1000);
  const fromIso = from.toISOString();
  const toIso = to.toISOString();
  const [analytics, repositories] = await Promise.all([
    githubGraphql<GitHubAnalyticsGraphQL>(
      accessToken,
      GITHUB_ANALYTICS_QUERY,
      { from: fromIso, to: toIso },
      login,
    ),
    getAllRepositories(accessToken, login),
  ]);
  const { viewer } = analytics;
  const collection = viewer.contributionsCollection;
  const commits = collection.commitContributionsByRepository.flatMap(
    (repository) => repository.contributions.nodes,
  );
  const pullRequests = await getAllContributionNodes(
    accessToken,
    fromIso,
    toIso,
    profile.login,
    "pullRequestContributions",
    collection.pullRequestContributions,
  );
  const reviews = await getAllContributionNodes(
    accessToken,
    fromIso,
    toIso,
    profile.login,
    "pullRequestReviewContributions",
    collection.pullRequestReviewContributions,
  );
  const openPullRequests = await githubGet<GitHubSearchIssuesResponse>(
    accessToken,
    `/search/issues?q=${encodeURIComponent(`is:pr is:open author:${viewer.login}`)}&sort=updated&order=desc&per_page=10`,
    login,
  );

  const repositoryActivity = new Map<
    string,
    { commits: number; prs: number; reviews: number }
  >();
  function addRepositoryActivity(
    name: string,
    kind: "commits" | "prs" | "reviews",
    count = 1,
  ) {
    const activity = repositoryActivity.get(name) ?? {
      commits: 0,
      prs: 0,
      reviews: 0,
    };
    activity[kind] += count;
    repositoryActivity.set(name, activity);
  }

  for (const contribution of commits) {
    addRepositoryActivity(
      contribution.repository.nameWithOwner,
      "commits",
      contribution.commitCount,
    );
  }
  for (const contribution of pullRequests) {
    if (contribution.pullRequest) {
      addRepositoryActivity(
        contribution.pullRequest.repository.nameWithOwner,
        "prs",
      );
    }
  }
  for (const contribution of reviews) {
    const pullRequest = contribution.pullRequestReview?.pullRequest;
    if (pullRequest) {
      addRepositoryActivity(pullRequest.repository.nameWithOwner, "reviews");
    }
  }

  const languageCounts = new Map<string, number>();
  for (const repository of repositories) {
    if (repository.language) {
      languageCounts.set(
        repository.language,
        (languageCounts.get(repository.language) ?? 0) + 1,
      );
    }
  }

  const contributionDays = collection.contributionCalendar.weeks.flatMap(
    (week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
  );
  const activitySeries = makeActivitySeries(commits, pullRequests, reviews);
  const recentActivity = [
    ...commits.map((contribution) => ({
      id: `commit-${contribution.occurredAt}-${contribution.repository.nameWithOwner}`,
      type: "commit" as const,
      title: `Pushed ${contribution.commitCount} ${contribution.commitCount === 1 ? "commit" : "commits"}`,
      detail: contribution.repository.nameWithOwner,
      occurredAt: contribution.occurredAt,
      url: `https://github.com/${contribution.repository.nameWithOwner}`,
    })),
    ...pullRequests.flatMap((contribution) =>
      contribution.pullRequest
        ? [{
            id: `pr-${contribution.pullRequest.url}`,
            type: "pr" as const,
            title: `Opened PR #${contribution.pullRequest.number}`,
            detail: `${contribution.pullRequest.repository.nameWithOwner} · ${contribution.pullRequest.title}`,
            occurredAt: contribution.occurredAt,
            url: contribution.pullRequest.url,
          }]
        : [],
    ),
    ...reviews.flatMap((contribution) => {
      const pullRequest = contribution.pullRequestReview?.pullRequest;
      return pullRequest
        ? [{
            id: `review-${pullRequest.url}-${contribution.occurredAt}`,
            type: "review" as const,
            title: `Reviewed PR #${pullRequest.number}`,
            detail: `${pullRequest.repository.nameWithOwner} · ${pullRequest.title}`,
            occurredAt: contribution.occurredAt,
            url: pullRequest.url,
          }]
        : [];
    }),
  ]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 10);

  return {
    account: { login: profile.login, name: profile.name },
    contributionCount: collection.contributionCalendar.totalContributions,
    contributionDays,
    currentStreak: calculateCurrentStreak(contributionDays),
    commits: collection.totalCommitContributions,
    pullRequests: collection.totalPullRequestContributions,
    reviews: collection.totalPullRequestReviewContributions,
    openPullRequestsCount: openPullRequests.total_count,
    openPullRequestsAvailable: true,
    openPullRequests: openPullRequests.items.map((pullRequest) => ({
      number: pullRequest.number,
      title: pullRequest.title,
      url: pullRequest.html_url,
      updatedAt: pullRequest.updated_at,
      repository: pullRequest.repository_url.split("/repos/")[1] ?? "",
    })),
    ...activitySeries,
    languages: [...languageCounts].map(([name, value]) => ({ name, value })),
    languagesAvailable: true,
    repositories: [...repositoryActivity]
      .map(([name, counts]) => ({
        name,
        ...counts,
        activity: counts.commits + counts.prs + counts.reviews,
      }))
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 10),
    recentActivity,
  };
}

async function getAllRepositories(
  accessToken: string,
  login: string | null = null,
) {
  const repositories: GitHubRepositoryResponse[] = [];
  for (let page = 1; ; page += 1) {
    const result = await githubGet<GitHubRepositoryResponse[]>(
      accessToken,
      `/user/repos?visibility=all&affiliation=owner%2Ccollaborator%2Corganization_member&sort=updated&per_page=${PAGE_SIZE}&page=${page}`,
      login,
    );
    repositories.push(...result);
    if (result.length < PAGE_SIZE) return repositories;
  }
}

async function getAllBranches(accessToken: string, path: string) {
  const branches: GitHubBranchResponse[] = [];
  for (let page = 1; ; page += 1) {
    const result = await githubGet<GitHubBranchResponse[]>(
      accessToken,
      `${path}/branches?per_page=${PAGE_SIZE}&page=${page}`,
    );
    branches.push(...result);
    if (result.length < PAGE_SIZE) return branches;
  }
}

async function fetchOverview(accessToken: string): Promise<GitHubOverview> {
  const profileResponse = await githubResponse(accessToken, "/user");
  const profile =
    (await profileResponse.json()) as GitHubProfileResponse;
  const oauthScopes = new Set(
    (profileResponse.headers.get("x-oauth-scopes") ?? "")
      .split(/[,\s]+/)
      .filter(Boolean),
  );

  if (!oauthScopes.has("repo")) {
    throw new GitHubIntegrationError("scope");
  }

  const remoteRepositories = await getAllRepositories(accessToken, profile.login);
  const repositories = remoteRepositories.map(
    (repository): GitHubRepository => ({
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      visibility: repository.private ? "private" : "public",
      language: repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      updatedAt: repository.updated_at,
      pushedAt: repository.pushed_at,
      defaultBranch: repository.default_branch,
      htmlUrl: repository.html_url,
    }),
  );

  return {
    profile: {
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      htmlUrl: profile.html_url,
      publicRepos: profile.public_repos,
      privateRepos:
        profile.total_private_repos ??
        repositories.filter((repository) => repository.visibility === "private").length,
    },
    repositories,
  };
}

export async function getGitHubWorkspace(): Promise<GitHubWorkspaceState> {
  try {
    const { accessToken } = await getGitHubAccess();
    return { status: "connected", data: await fetchOverview(accessToken) };
  } catch (error) {
    if (!(error instanceof GitHubIntegrationError)) throw error;

    if (error.code === "not_connected") {
      return { status: "not_connected", linked: false };
    }
    if (error.code === "missing_token") {
      return { status: "reauthorize", linked: true, reason: "missing_token" };
    }
    if (error.code === "scope") {
      return { status: "reauthorize", linked: true, reason: "scope" };
    }
    if (error.code === "unauthenticated") throw error;

    return {
      status: "error",
      linked: true,
      code:
        error.code === "rate_limit"
          ? "rate_limit"
          : error.code === "permission"
            ? "permission"
            : "unavailable",
    };
  }
}

export async function getGitHubRepositoryDetail(
  fullName: string,
): Promise<GitHubRepositoryDetail> {
  const [owner, repository, extra] = fullName.split("/");
  if (
    !owner ||
    !repository ||
    extra ||
    !/^[A-Za-z0-9_.-]+$/.test(owner) ||
    !/^[A-Za-z0-9_.-]+$/.test(repository) ||
    owner === "." ||
    owner === ".." ||
    repository === "." ||
    repository === ".."
  ) {
    throw new GitHubIntegrationError("not_found");
  }

  const { accessToken } = await getGitHubAccess();
  const basePath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
  const [branches, commits] = await Promise.all([
    getAllBranches(accessToken, basePath),
    githubGet<GitHubCommitResponse[]>(
      accessToken,
      `${basePath}/commits?per_page=10`,
    ),
  ]);

  return {
    branches: branches.map((branch) => ({
      name: branch.name,
      lastCommitSha: branch.commit.sha,
    })),
    commits: commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message.split("\n", 1)[0] ?? "",
      author: commit.author?.login ?? commit.commit.author?.name ?? "Unknown",
      date: commit.commit.author?.date ?? null,
      htmlUrl: commit.html_url,
    })),
  };
}
