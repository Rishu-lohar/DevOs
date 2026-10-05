export type GitHubAnalytics = {
  account: { login: string; name: string | null };
  contributionCount: number;
  contributionDays: { date: string; count: number }[];
  currentStreak: number | null;
  commits: number;
  pullRequests: number;
  reviews: number;
  openPullRequestsCount: number | null;
  openPullRequestsAvailable: boolean;
  openPullRequests: {
    number: number;
    title: string;
    url: string;
    updatedAt: string;
    repository: string;
  }[];
  weeklyActivity: {
    week: string;
    commits: number;
    prs: number;
    reviews: number;
  }[];
  monthlyActivity: {
    month: string;
    commits: number;
    prs: number;
    reviews: number;
  }[];
  languages: { name: string; value: number }[];
  languagesAvailable: boolean;
  repositories: {
    name: string;
    commits: number;
    prs: number;
    reviews: number;
    activity: number;
  }[];
  recentActivity: {
    id: string;
    type: "commit" | "pr" | "review";
    title: string;
    detail: string;
    occurredAt: string;
    url: string;
  }[];
};
