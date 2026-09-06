/** Shared domain types for DevOS Phase-1 (frontend-only, dummy data). */

export type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
export type Priority = "urgent" | "high" | "medium" | "low";
export type ProjectHealth = "on-track" | "at-risk" | "off-track";

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  project: string;
  assignee: string;
  due: string;
  labels: string[];
  estimate: number;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  progress: number;
  health: ProjectHealth;
  stack: string[];
  members: string[];
  lead: string;
  due: string;
  openTasks: number;
  totalTasks: number;
  updatedAt: string;
}

export interface Repo {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  prs: number;
  updatedAt: string;
  visibility: "public" | "private";
  health: number;
}

export interface Commit {
  id: string;
  sha: string;
  message: string;
  author: string;
  repo: string;
  branch: string;
  time: string;
  additions: number;
  deletions: number;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repo: string;
  author: string;
  state: "open" | "merged" | "draft" | "closed";
  reviewers: string[];
  time: string;
  additions: number;
  deletions: number;
  checks: "passing" | "failing" | "pending";
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  repo: string;
  author: string;
  state: "open" | "closed";
  labels: string[];
  comments: number;
  time: string;
}

export interface Branch {
  id: string;
  name: string;
  repo: string;
  author: string;
  ahead: number;
  behind: number;
  time: string;
  isDefault: boolean;
}

export interface OssRepo {
  id: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  match: number;
  topics: string[];
  goodFirstIssues: number;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  category: string;
  time: string;
  readTime: string;
}

export interface Activity {
  id: string;
  type: "commit" | "pr" | "issue" | "task" | "member" | "ai" | "release";
  title: string;
  detail: string;
  time: string;
  actor: string;
}
