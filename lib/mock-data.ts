export const projects = [
  { name: "DevConnect Mobile App", description: "React Native, Firebase", progress: 60, status: "In Progress", due: "May 30, 2025", members: ["RL", "AK", "MS"], color: "from-violet-500/30 to-indigo-500/10" },
  { name: "Repository Analyzer", description: "Next.js, TypeScript", progress: 82, status: "In Progress", due: "Jun 04, 2025", members: ["RL", "JT"], color: "from-emerald-500/30 to-teal-500/10" },
  { name: "Open Source Explorer", description: "Discovery platform", progress: 34, status: "Planning", due: "Jun 18, 2025", members: ["RL", "AK", "PM"], color: "from-amber-500/30 to-orange-500/10" },
];

export const tasks = [
  { title: "Implement authentication flow", project: "DevConnect Mobile App", priority: "High", due: "Today", status: "In Progress" },
  { title: "Review repository analyzer PR", project: "Repository Analyzer", priority: "Medium", due: "Tomorrow", status: "To Do" },
  { title: "Update project README", project: "Open Source Explorer", priority: "Low", due: "May 28", status: "Completed" },
  { title: "Design mobile navigation", project: "DevConnect Mobile App", priority: "Medium", due: "May 29", status: "In Review" },
];

export const activities = [
  { title: "New pull request opened", detail: "rishu-lohar/devos #145", time: "2 minutes ago", type: "commit" },
  { title: "Project milestone completed", detail: "Repository Analyzer", time: "18 minutes ago", type: "project" },
  { title: "AI suggestion ready", detail: "Improve your project structure", time: "1 hour ago", type: "ai" },
  { title: "New team member joined", detail: "@aryan24 joined DevConnect", time: "3 hours ago", type: "team" },
];

export const chartData = [22, 34, 28, 45, 40, 58, 52, 71, 64, 83, 77, 92];
export const contributionData = Array.from({ length: 84 }, (_, index) => ((index * 7 + 3) % 5));
export const notifications = ["Your PR was reviewed", "AI Mentor has a new suggestion", "Weekly growth report is ready"];
