export const navGroups = [
  {
    label: null,
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutGrid" },
      { label: "AI Workspace", href: "/workspace", icon: "Boxes" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Projects", href: "/projects", icon: "FolderKanban" },
      { label: "Tasks", href: "/tasks", icon: "CircleCheck" },
      { label: "GitHub", href: "/github", icon: "GitBranch" },
    ],
  },
  {
    label: "Discover",
    items: [
      { label: "Open Source", href: "/open-source", icon: "Lightbulb" },
      { label: "Industry", href: "/industry", icon: "Newspaper" },
    ],
  },
  {
    label: "Grow",
    items: [
      { label: "Growth Tracker", href: "/growth", icon: "TrendingUp" },
      { label: "AI Mentor", href: "/ai-mentor", icon: "Sparkles" },
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
] as const;

export type NavIcon = (typeof navGroups)[number]["items"][number]["icon"];
