import type {
  Activity,
  Branch,
  Commit,
  Issue,
  Member,
  NewsItem,
  OssRepo,
  Project,
  PullRequest,
  Repo,
  Task,
} from "@/lib/types";

export const currentUser = {
  name: "Rishu Lohar",
  handle: "rishu-lohar",
  email: "rishu@devos.dev",
  role: "Full Stack Engineer",
  plan: "Pro",
  location: "Bengaluru, IN",
  bio: "MCA student · Full Stack Developer · Building developer tooling.",
};

export const members: Member[] = [
  { id: "m1", name: "Rishu Lohar", role: "Lead Engineer", email: "rishu@devos.dev" },
  { id: "m2", name: "Aryan Kapoor", role: "Frontend Engineer", email: "aryan@devos.dev" },
  { id: "m3", name: "Meera Shah", role: "Backend Engineer", email: "meera@devos.dev" },
  { id: "m4", name: "Jatin Thakur", role: "DevOps Engineer", email: "jatin@devos.dev" },
  { id: "m5", name: "Priya Menon", role: "Product Designer", email: "priya@devos.dev" },
  { id: "m6", name: "Karan Bose", role: "QA Engineer", email: "karan@devos.dev" },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "DevConnect Mobile",
    slug: "devconnect-mobile",
    description: "Cross-platform companion app for asynchronous code review.",
    progress: 62,
    health: "on-track",
    stack: ["React Native", "Expo", "Firebase"],
    members: ["Rishu Lohar", "Aryan Kapoor", "Meera Shah"],
    lead: "Rishu Lohar",
    due: "May 30",
    openTasks: 14,
    totalTasks: 38,
    updatedAt: "12m ago",
  },
  {
    id: "p2",
    name: "Repository Analyzer",
    slug: "repository-analyzer",
    description: "Static analysis engine that scores repo health and hotspots.",
    progress: 84,
    health: "on-track",
    stack: ["Next.js", "TypeScript", "Postgres"],
    members: ["Rishu Lohar", "Jatin Thakur"],
    lead: "Jatin Thakur",
    due: "Jun 04",
    openTasks: 6,
    totalTasks: 41,
    updatedAt: "1h ago",
  },
  {
    id: "p3",
    name: "Open Source Explorer",
    slug: "open-source-explorer",
    description: "Discovery surface for good-first-issues and maintainer bounties.",
    progress: 34,
    health: "at-risk",
    stack: ["Next.js", "Tailwind", "GitHub API"],
    members: ["Rishu Lohar", "Aryan Kapoor", "Priya Menon"],
    lead: "Aryan Kapoor",
    due: "Jun 18",
    openTasks: 22,
    totalTasks: 33,
    updatedAt: "3h ago",
  },
  {
    id: "p4",
    name: "Portfolio Platform",
    slug: "portfolio-platform",
    description: "Automated engineering portfolio generated from commit history.",
    progress: 96,
    health: "on-track",
    stack: ["Next.js", "MDX", "Vercel"],
    members: ["Rishu Lohar", "Priya Menon"],
    lead: "Rishu Lohar",
    due: "May 26",
    openTasks: 2,
    totalTasks: 27,
    updatedAt: "5h ago",
  },
  {
    id: "p5",
    name: "Telemetry Pipeline",
    slug: "telemetry-pipeline",
    description: "Event ingestion and rollups for engineering velocity metrics.",
    progress: 18,
    health: "off-track",
    stack: ["Go", "Kafka", "ClickHouse"],
    members: ["Jatin Thakur", "Meera Shah", "Karan Bose"],
    lead: "Meera Shah",
    due: "Jul 09",
    openTasks: 29,
    totalTasks: 35,
    updatedAt: "1d ago",
  },
  {
    id: "p6",
    name: "Design System Core",
    slug: "design-system-core",
    description: "Token-driven component library shared across all DevOS surfaces.",
    progress: 71,
    health: "on-track",
    stack: ["React", "Tailwind", "Storybook"],
    members: ["Priya Menon", "Aryan Kapoor"],
    lead: "Priya Menon",
    due: "Jun 12",
    openTasks: 9,
    totalTasks: 44,
    updatedAt: "2d ago",
  },
];

export const tasks: Task[] = [
  { id: "t1", key: "DEV-412", title: "Implement authentication flow with refresh tokens", status: "in-progress", priority: "urgent", project: "DevConnect Mobile", assignee: "Rishu Lohar", due: "Today", labels: ["auth", "mobile"], estimate: 5 },
  { id: "t2", key: "DEV-418", title: "Render UI before state sync on cold start", status: "in-progress", priority: "high", project: "DevConnect Mobile", assignee: "Aryan Kapoor", due: "Tomorrow", labels: ["performance"], estimate: 3 },
  { id: "t3", key: "REP-207", title: "Review repository analyzer scoring PR", status: "review", priority: "high", project: "Repository Analyzer", assignee: "Jatin Thakur", due: "May 28", labels: ["review"], estimate: 2 },
  { id: "t4", key: "REP-211", title: "Cache AST parse results per commit", status: "todo", priority: "medium", project: "Repository Analyzer", assignee: "Meera Shah", due: "May 30", labels: ["backend", "cache"], estimate: 8 },
  { id: "t5", key: "OSE-103", title: "Good-first-issue relevance ranking", status: "todo", priority: "medium", project: "Open Source Explorer", assignee: "Aryan Kapoor", due: "Jun 02", labels: ["search"], estimate: 5 },
  { id: "t6", key: "OSE-108", title: "Bookmark sync across devices", status: "blocked", priority: "low", project: "Open Source Explorer", assignee: "Priya Menon", due: "Jun 06", labels: ["sync"], estimate: 3 },
  { id: "t7", key: "POR-091", title: "Generate OG images from commit stats", status: "done", priority: "low", project: "Portfolio Platform", assignee: "Rishu Lohar", due: "May 24", labels: ["content"], estimate: 2 },
  { id: "t8", key: "POR-094", title: "Ship MDX changelog renderer", status: "done", priority: "medium", project: "Portfolio Platform", assignee: "Priya Menon", due: "May 25", labels: ["mdx"], estimate: 3 },
  { id: "t9", key: "TEL-014", title: "Kafka consumer backpressure handling", status: "in-progress", priority: "urgent", project: "Telemetry Pipeline", assignee: "Jatin Thakur", due: "May 29", labels: ["infra"], estimate: 13 },
  { id: "t10", key: "TEL-019", title: "ClickHouse rollup materialized views", status: "todo", priority: "high", project: "Telemetry Pipeline", assignee: "Meera Shah", due: "Jun 03", labels: ["data"], estimate: 8 },
  { id: "t11", key: "DSC-052", title: "Audit token contrast for light theme", status: "review", priority: "medium", project: "Design System Core", assignee: "Priya Menon", due: "May 31", labels: ["a11y", "design"], estimate: 2 },
  { id: "t12", key: "DSC-057", title: "Replace legacy shadow utilities", status: "done", priority: "low", project: "Design System Core", assignee: "Aryan Kapoor", due: "May 23", labels: ["cleanup"], estimate: 1 },
  { id: "t13", key: "DEV-421", title: "Offline queue for review comments", status: "todo", priority: "high", project: "DevConnect Mobile", assignee: "Meera Shah", due: "Jun 01", labels: ["offline"], estimate: 5 },
  { id: "t14", key: "REP-215", title: "Flaky test detection heuristics", status: "blocked", priority: "medium", project: "Repository Analyzer", assignee: "Karan Bose", due: "Jun 05", labels: ["testing"], estimate: 5 },
];

export const repos: Repo[] = [
  { id: "r1", name: "rishu-lohar/devos-platform", description: "Developer operating system — web client and shell.", language: "TypeScript", stars: 1364, forks: 128, issues: 24, prs: 6, updatedAt: "2d ago", visibility: "public", health: 92 },
  { id: "r2", name: "rishu-lohar/ai-mentor", description: "Lightweight code-reasoning assistant service.", language: "Python", stars: 962, forks: 84, issues: 11, prs: 3, updatedAt: "4d ago", visibility: "public", health: 78 },
  { id: "r3", name: "rishu-lohar/open-source-explorer", description: "Discovery engine for first-time contributors.", language: "TypeScript", stars: 641, forks: 52, issues: 18, prs: 4, updatedAt: "1w ago", visibility: "public", health: 71 },
  { id: "r4", name: "rishu-lohar/telemetry-pipeline", description: "Event ingestion, rollups, and velocity metrics.", language: "Go", stars: 428, forks: 31, issues: 9, prs: 2, updatedAt: "3d ago", visibility: "private", health: 64 },
  { id: "r5", name: "rishu-lohar/design-system-core", description: "Token-driven component primitives.", language: "TypeScript", stars: 302, forks: 22, issues: 5, prs: 7, updatedAt: "6h ago", visibility: "public", health: 88 },
  { id: "r6", name: "rishu-lohar/portfolio", description: "Engineering portfolio generated from git history.", language: "MDX", stars: 187, forks: 14, issues: 2, prs: 1, updatedAt: "2w ago", visibility: "public", health: 95 },
];

export const commits: Commit[] = [
  { id: "c1", sha: "8f3a91c", message: "feat(auth): rotate refresh tokens on reuse detection", author: "Rishu Lohar", repo: "devos-platform", branch: "main", time: "18m ago", additions: 142, deletions: 38 },
  { id: "c2", sha: "1b7de40", message: "perf(shell): defer non-critical hydration", author: "Aryan Kapoor", repo: "devos-platform", branch: "perf/hydration", time: "1h ago", additions: 64, deletions: 91 },
  { id: "c3", sha: "c02ff8a", message: "fix(analyzer): guard against empty AST nodes", author: "Jatin Thakur", repo: "repository-analyzer", branch: "main", time: "3h ago", additions: 21, deletions: 6 },
  { id: "c4", sha: "77ab125", message: "chore(ds): drop shadow tokens from primitives", author: "Priya Menon", repo: "design-system-core", branch: "main", time: "5h ago", additions: 12, deletions: 210 },
  { id: "c5", sha: "e419b3d", message: "feat(oss): rank good-first-issues by language match", author: "Aryan Kapoor", repo: "open-source-explorer", branch: "feat/ranking", time: "8h ago", additions: 188, deletions: 24 },
  { id: "c6", sha: "3d5c8fa", message: "feat(pipeline): add consumer lag metrics", author: "Meera Shah", repo: "telemetry-pipeline", branch: "main", time: "1d ago", additions: 96, deletions: 12 },
  { id: "c7", sha: "b8e2049", message: "test(analyzer): cover flaky-detection heuristics", author: "Karan Bose", repo: "repository-analyzer", branch: "test/flaky", time: "1d ago", additions: 240, deletions: 4 },
  { id: "c8", sha: "a51fd77", message: "docs: document token override strategy", author: "Rishu Lohar", repo: "design-system-core", branch: "main", time: "2d ago", additions: 78, deletions: 9 },
];

export const pullRequests: PullRequest[] = [
  { id: "pr1", number: 145, title: "Refresh token rotation + reuse detection", repo: "devos-platform", author: "Rishu Lohar", state: "open", reviewers: ["Meera Shah", "Jatin Thakur"], time: "18m ago", additions: 142, deletions: 38, checks: "passing" },
  { id: "pr2", number: 143, title: "Defer non-critical hydration on app shell", repo: "devos-platform", author: "Aryan Kapoor", state: "open", reviewers: ["Rishu Lohar"], time: "1h ago", additions: 64, deletions: 91, checks: "pending" },
  { id: "pr3", number: 88, title: "Repo health scoring v2", repo: "repository-analyzer", author: "Jatin Thakur", state: "draft", reviewers: ["Rishu Lohar", "Karan Bose"], time: "6h ago", additions: 412, deletions: 120, checks: "failing" },
  { id: "pr4", number: 51, title: "Remove shadow utilities from primitives", repo: "design-system-core", author: "Priya Menon", state: "merged", reviewers: ["Aryan Kapoor"], time: "5h ago", additions: 12, deletions: 210, checks: "passing" },
  { id: "pr5", number: 34, title: "Good-first-issue relevance ranking", repo: "open-source-explorer", author: "Aryan Kapoor", state: "open", reviewers: ["Priya Menon"], time: "8h ago", additions: 188, deletions: 24, checks: "passing" },
  { id: "pr6", number: 22, title: "Consumer lag metrics + alerts", repo: "telemetry-pipeline", author: "Meera Shah", state: "merged", reviewers: ["Jatin Thakur"], time: "1d ago", additions: 96, deletions: 12, checks: "passing" },
];

export const issues: Issue[] = [
  { id: "i1", number: 312, title: "Sidebar collapses unexpectedly on narrow viewports", repo: "devos-platform", author: "Karan Bose", state: "open", labels: ["bug", "ui"], comments: 6, time: "2h ago" },
  { id: "i2", number: 309, title: "Light theme contrast fails on muted text", repo: "design-system-core", author: "Priya Menon", state: "open", labels: ["a11y"], comments: 3, time: "7h ago" },
  { id: "i3", number: 298, title: "Analyzer times out on monorepos > 40k files", repo: "repository-analyzer", author: "Jatin Thakur", state: "open", labels: ["performance"], comments: 12, time: "1d ago" },
  { id: "i4", number: 287, title: "Add keyboard shortcut palette", repo: "devos-platform", author: "Rishu Lohar", state: "open", labels: ["enhancement", "good first issue"], comments: 9, time: "2d ago" },
  { id: "i5", number: 271, title: "Document token override strategy", repo: "design-system-core", author: "Aryan Kapoor", state: "closed", labels: ["docs"], comments: 2, time: "4d ago" },
  { id: "i6", number: 266, title: "Kafka rebalance storms under load", repo: "telemetry-pipeline", author: "Meera Shah", state: "open", labels: ["infra", "bug"], comments: 15, time: "5d ago" },
];

export const branches: Branch[] = [
  { id: "b1", name: "main", repo: "devos-platform", author: "Rishu Lohar", ahead: 0, behind: 0, time: "18m ago", isDefault: true },
  { id: "b2", name: "perf/hydration", repo: "devos-platform", author: "Aryan Kapoor", ahead: 4, behind: 1, time: "1h ago", isDefault: false },
  { id: "b3", name: "feat/ranking", repo: "open-source-explorer", author: "Aryan Kapoor", ahead: 7, behind: 0, time: "8h ago", isDefault: false },
  { id: "b4", name: "test/flaky", repo: "repository-analyzer", author: "Karan Bose", ahead: 2, behind: 6, time: "1d ago", isDefault: false },
  { id: "b5", name: "feat/health-v2", repo: "repository-analyzer", author: "Jatin Thakur", ahead: 11, behind: 2, time: "6h ago", isDefault: false },
  { id: "b6", name: "chore/tokens", repo: "design-system-core", author: "Priya Menon", ahead: 0, behind: 0, time: "5h ago", isDefault: false },
];

export const ossRepos: OssRepo[] = [
  { id: "o1", fullName: "vercel/next.js", description: "The React framework for the web.", language: "JavaScript", stars: 118000, match: 96, topics: ["react", "ssr", "framework"], goodFirstIssues: 24 },
  { id: "o2", fullName: "facebook/react", description: "The library for web and native user interfaces.", language: "JavaScript", stars: 226000, match: 91, topics: ["ui", "library"], goodFirstIssues: 12 },
  { id: "o3", fullName: "tailwindlabs/tailwindcss", description: "A utility-first CSS framework.", language: "CSS", stars: 78000, match: 89, topics: ["css", "design"], goodFirstIssues: 18 },
  { id: "o4", fullName: "microsoft/vscode", description: "Visual Studio Code editor source.", language: "TypeScript", stars: 162000, match: 84, topics: ["editor", "tooling"], goodFirstIssues: 41 },
  { id: "o5", fullName: "denoland/deno", description: "A modern runtime for JavaScript and TypeScript.", language: "Rust", stars: 94000, match: 72, topics: ["runtime", "rust"], goodFirstIssues: 9 },
  { id: "o6", fullName: "prisma/prisma", description: "Next-generation Node.js and TypeScript ORM.", language: "TypeScript", stars: 39000, match: 81, topics: ["orm", "database"], goodFirstIssues: 15 },
];

export const bookmarkedRepos: OssRepo[] = [ossRepos[0], ossRepos[2], ossRepos[5]];

export const goodFirstIssues = [
  { id: "g1", repo: "vercel/next.js", title: "Improve error overlay copy for hydration mismatches", language: "TypeScript", labels: ["good first issue", "docs"], comments: 4, time: "3h ago" },
  { id: "g2", repo: "tailwindlabs/tailwindcss", title: "Add container query examples to docs", language: "MDX", labels: ["good first issue"], comments: 2, time: "9h ago" },
  { id: "g3", repo: "prisma/prisma", title: "Better validation message for invalid schema enum", language: "TypeScript", labels: ["good first issue", "dx"], comments: 7, time: "1d ago" },
  { id: "g4", repo: "microsoft/vscode", title: "Keyboard navigation for settings search results", language: "TypeScript", labels: ["good first issue", "a11y"], comments: 11, time: "2d ago" },
  { id: "g5", repo: "denoland/deno", title: "Document permissions flags in CLI help output", language: "Rust", labels: ["good first issue"], comments: 3, time: "4d ago" },
];

export const contributionSuggestions = [
  { id: "s1", title: "Ship a Tailwind plugin for design tokens", reason: "Matches your design-system work in the last 30 days", impact: "High" },
  { id: "s2", title: "Triage 5 hydration issues in Next.js", reason: "You resolved 3 similar issues in devos-platform", impact: "Medium" },
  { id: "s3", title: "Improve Prisma enum validation errors", reason: "Overlaps with your Postgres schema experience", impact: "Medium" },
  { id: "s4", title: "Write a Go consumer-lag recipe", reason: "Derived from your telemetry-pipeline commits", impact: "High" },
];

export const news: NewsItem[] = [
  { id: "n1", source: "Netflix Tech Blog", title: "How Netflix scales microservices to 200M+ members", summary: "Event-driven boundaries, chaos engineering, and a global CDN strategy that keeps playback latency flat under load.", category: "Architecture", time: "2h ago", readTime: "8 min" },
  { id: "n2", source: "Google Engineering", title: "Large-scale infrastructure lessons from a decade of Borg", summary: "Scheduling, bin-packing and the operational cost of multi-tenancy at planetary scale.", category: "Infrastructure", time: "6h ago", readTime: "11 min" },
  { id: "n3", source: "Meta Engineering", title: "High-performance rendering pipelines on the web", summary: "Incremental hydration, concurrent scheduling, and measuring interaction latency in production.", category: "Frontend", time: "1d ago", readTime: "6 min" },
  { id: "n4", source: "Microsoft DevBlogs", title: "Building developer tools people actually keep open", summary: "Latency budgets, keyboard-first interfaces, and why density beats decoration.", category: "Tooling", time: "2d ago", readTime: "5 min" },
  { id: "n5", source: "Stripe Engineering", title: "Idempotency keys as a product primitive", summary: "Designing APIs that stay correct across retries, partial failures and network partitions.", category: "Backend", time: "3d ago", readTime: "9 min" },
  { id: "n6", source: "Cloudflare Blog", title: "Edge runtimes and the death of the cold start", summary: "Isolate-based execution, V8 snapshots, and practical limits of edge compute.", category: "Edge", time: "4d ago", readTime: "7 min" },
];

export const companyInsights = [
  { id: "ci1", company: "Netflix", focus: "Large-scale infrastructure", stack: ["Java", "Kafka", "Cassandra"], openRoles: 42, hiring: true },
  { id: "ci2", company: "Google", focus: "Developer tools ecosystem", stack: ["Go", "C++", "Kubernetes"], openRoles: 128, hiring: true },
  { id: "ci3", company: "Meta", focus: "High-performance systems", stack: ["React", "Hack", "PyTorch"], openRoles: 76, hiring: true },
  { id: "ci4", company: "Vercel", focus: "Frontend cloud", stack: ["Next.js", "Rust", "TypeScript"], openRoles: 18, hiring: true },
  { id: "ci5", company: "Stripe", focus: "Payments infrastructure", stack: ["Ruby", "Scala", "Go"], openRoles: 54, hiring: false },
];

export const architectureTrends = [
  { id: "a1", name: "Event-driven microservices", adoption: 78, delta: "+12%", note: "Dominant in payments and streaming workloads" },
  { id: "a2", name: "Edge-first rendering", adoption: 64, delta: "+21%", note: "Driven by isolate runtimes and regional data" },
  { id: "a3", name: "Modular monoliths", adoption: 58, delta: "+9%", note: "Teams consolidating after microservice sprawl" },
  { id: "a4", name: "CQRS + read models", adoption: 41, delta: "+4%", note: "Common in analytics-heavy dashboards" },
  { id: "a5", name: "Service mesh", adoption: 33, delta: "-6%", note: "Cost and complexity pushing teams to simpler L7" },
];

export const bestPractices = [
  { id: "bp1", title: "Budget latency, not features", detail: "Set a hard interaction budget per surface and fail the build when regressed.", category: "Performance" },
  { id: "bp2", title: "One design token source", detail: "Ship every colour, radius and duration from a single config to avoid drift.", category: "Design Systems" },
  { id: "bp3", title: "Make retries safe by default", detail: "Idempotency keys on every mutating endpoint before you scale traffic.", category: "Backend" },
  { id: "bp4", title: "Review diffs, not branches", detail: "Keep PRs under 400 lines so reviewers stay accurate past the first file.", category: "Process" },
  { id: "bp5", title: "Instrument before optimising", detail: "No performance work without a baseline trace in production.", category: "Observability" },
];

export const activities: Activity[] = [
  { id: "ac1", type: "pr", title: "Opened PR #145", detail: "Refresh token rotation + reuse detection", time: "18m ago", actor: "Rishu Lohar" },
  { id: "ac2", type: "commit", title: "Pushed 4 commits", detail: "devos-platform · perf/hydration", time: "1h ago", actor: "Aryan Kapoor" },
  { id: "ac3", type: "task", title: "Moved DEV-412 to In Progress", detail: "DevConnect Mobile", time: "2h ago", actor: "Rishu Lohar" },
  { id: "ac4", type: "ai", title: "AI review completed", detail: "3 suggestions on repository-analyzer", time: "3h ago", actor: "DevOS Mentor" },
  { id: "ac5", type: "release", title: "Released v2.4.0", detail: "design-system-core", time: "5h ago", actor: "Priya Menon" },
  { id: "ac6", type: "issue", title: "Closed issue #271", detail: "Document token override strategy", time: "1d ago", actor: "Aryan Kapoor" },
  { id: "ac7", type: "member", title: "Karan Bose joined", detail: "Telemetry Pipeline", time: "2d ago", actor: "Meera Shah" },
];

export const workspaceFiles = [
  { id: "f1", name: "App.tsx", path: "src/App.tsx", size: "12.4 KB", author: "Rishu Lohar", time: "2h ago" },
  { id: "f2", name: "firebase.ts", path: "src/lib/firebase.ts", size: "3.1 KB", author: "Meera Shah", time: "4h ago" },
  { id: "f3", name: "auth.ts", path: "src/services/auth.ts", size: "8.7 KB", author: "Rishu Lohar", time: "1d ago" },
  { id: "f4", name: "README.md", path: "README.md", size: "5.2 KB", author: "Aryan Kapoor", time: "1d ago" },
  { id: "f5", name: "review-queue.tsx", path: "src/screens/review-queue.tsx", size: "16.8 KB", author: "Aryan Kapoor", time: "2d ago" },
  { id: "f6", name: "tokens.json", path: "design/tokens.json", size: "2.4 KB", author: "Priya Menon", time: "3d ago" },
];

export const timeline = [
  { id: "tl1", title: "Sprint 14 kickoff", detail: "Scope locked: auth, offline queue, review latency", date: "May 12", state: "done" as const },
  { id: "tl2", title: "Auth flow implementation", detail: "Refresh rotation + reuse detection landed", date: "May 20", state: "done" as const },
  { id: "tl3", title: "Offline review queue", detail: "Local mutation log with conflict resolution", date: "May 27", state: "active" as const },
  { id: "tl4", title: "Beta release to internal testers", detail: "TestFlight + internal Play track", date: "Jun 04", state: "upcoming" as const },
  { id: "tl5", title: "Public beta", detail: "Open sign-ups with rate limits", date: "Jun 18", state: "upcoming" as const },
];

/* ---------- Chart series ---------- */

export const velocitySeries = [
  { week: "W1", commits: 22, prs: 4, reviews: 6 },
  { week: "W2", commits: 34, prs: 6, reviews: 9 },
  { week: "W3", commits: 28, prs: 5, reviews: 7 },
  { week: "W4", commits: 45, prs: 9, reviews: 12 },
  { week: "W5", commits: 40, prs: 7, reviews: 10 },
  { week: "W6", commits: 58, prs: 11, reviews: 15 },
  { week: "W7", commits: 52, prs: 10, reviews: 13 },
  { week: "W8", commits: 71, prs: 14, reviews: 18 },
  { week: "W9", commits: 64, prs: 12, reviews: 16 },
  { week: "W10", commits: 83, prs: 17, reviews: 21 },
  { week: "W11", commits: 77, prs: 15, reviews: 19 },
  { week: "W12", commits: 92, prs: 19, reviews: 24 },
];

export const weeklyCommits = [
  { day: "Mon", commits: 12 },
  { day: "Tue", commits: 19 },
  { day: "Wed", commits: 9 },
  { day: "Thu", commits: 24 },
  { day: "Fri", commits: 17 },
  { day: "Sat", commits: 6 },
  { day: "Sun", commits: 4 },
];

export const taskDistribution = [
  { name: "Done", value: 23, key: "done" },
  { name: "In Progress", value: 8, key: "in-progress" },
  { name: "To Do", value: 5, key: "todo" },
  { name: "Blocked", value: 2, key: "blocked" },
];

export const languageBreakdown = [
  { name: "TypeScript", value: 54 },
  { name: "Go", value: 18 },
  { name: "Python", value: 14 },
  { name: "CSS", value: 9 },
  { name: "Other", value: 5 },
];

export const learningProgress = [
  { id: "lp1", topic: "Distributed Systems", progress: 72, hours: 18 },
  { id: "lp2", topic: "Rust Fundamentals", progress: 41, hours: 9 },
  { id: "lp3", topic: "System Design Interviews", progress: 88, hours: 24 },
  { id: "lp4", topic: "Kubernetes Operators", progress: 26, hours: 6 },
];

export const achievements = [
  { id: "ah1", title: "35-day streak", detail: "Longest contribution streak this year", earned: true },
  { id: "ah2", title: "500 commits", detail: "Across 6 active repositories", earned: true },
  { id: "ah3", title: "First OSS merge", detail: "Merged into tailwindlabs/tailwindcss", earned: true },
  { id: "ah4", title: "Review champion", detail: "50 reviews in a single sprint", earned: false },
  { id: "ah5", title: "Zero-regression release", detail: "Ship 5 releases with no rollback", earned: false },
];

/** Deterministic 52x7 heatmap so server and client render identically. */
export const contributionHeatmap: number[] = Array.from(
  { length: 364 },
  (_, i) => (i * 7 + Math.floor(i / 11)) % 5,
);

export const mentorConversations = [
  { id: "mc1", title: "How to use vector databases", time: "2h ago" },
  { id: "mc2", title: "Explain my CI/CD pipeline", time: "1d ago" },
  { id: "mc3", title: "Best practices for React state", time: "3d ago" },
  { id: "mc4", title: "System design for small teams", time: "1w ago" },
  { id: "mc5", title: "Refactoring a modular monolith", time: "2w ago" },
];

export const mentorSuggestedPrompts = [
  "Explain my project structure",
  "Review my authentication flow",
  "Suggest performance improvements",
  "Help me with deployment",
  "Create a learning roadmap for me",
  "Draft a PR description from my diff",
];

export const mentorSeedThread = [
  {
    id: "msg1",
    role: "assistant" as const,
    content:
      "Hi Rishu — I have indexed 6 repositories and your last 30 days of activity. Ask me about architecture, reviews, or your roadmap.",
    time: "just now",
  },
];

export const notifications = [
  { id: "nt1", title: "PR #145 needs your review", detail: "devos-platform · Meera Shah requested review", time: "12m ago", unread: true },
  { id: "nt2", title: "Checks failed on #88", detail: "repository-analyzer · 2 failing jobs", time: "1h ago", unread: true },
  { id: "nt3", title: "AI Mentor finished analysis", detail: "3 suggestions ready", time: "3h ago", unread: true },
  { id: "nt4", title: "Sprint 14 ends tomorrow", detail: "6 open tasks remaining", time: "1d ago", unread: false },
];

export const dashboardStats = [
  { id: "ds1", label: "Active projects", value: "6", delta: "+2", trend: "up" as const, hint: "vs last sprint" },
  { id: "ds2", label: "Tasks completed", value: "23", delta: "+15%", trend: "up" as const, hint: "velocity" },
  { id: "ds3", label: "Contributions", value: "156", delta: "+28%", trend: "up" as const, hint: "this sprint" },
  { id: "ds4", label: "Open PRs", value: "7", delta: "-3", trend: "down" as const, hint: "awaiting review" },
];

export const githubActions = [
  { id: "ga1", name: "CI · build & test", repo: "devos-platform", status: "passing" as const, duration: "3m 12s", time: "18m ago" },
  { id: "ga2", name: "Preview deploy", repo: "devos-platform", status: "passing" as const, duration: "1m 44s", time: "18m ago" },
  { id: "ga3", name: "Analyzer benchmark", repo: "repository-analyzer", status: "failing" as const, duration: "6m 08s", time: "6h ago" },
  { id: "ga4", name: "Publish package", repo: "design-system-core", status: "passing" as const, duration: "58s", time: "5h ago" },
  { id: "ga5", name: "Integration suite", repo: "telemetry-pipeline", status: "running" as const, duration: "—", time: "now" },
];

export const repoHealth = [
  { id: "rh1", metric: "Test coverage", value: 84, target: 80, status: "good" as const },
  { id: "rh2", metric: "Build success rate", value: 96, target: 95, status: "good" as const },
  { id: "rh3", metric: "Median review time", value: 62, target: 75, status: "warn" as const },
  { id: "rh4", metric: "Stale branches", value: 38, target: 20, status: "bad" as const },
  { id: "rh5", metric: "Dependency freshness", value: 71, target: 70, status: "good" as const },
];
