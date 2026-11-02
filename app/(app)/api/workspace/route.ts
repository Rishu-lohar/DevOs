import { NextResponse } from "next/server";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProjectAccess } from "@/lib/project-access";
import { workspacePlanSchema } from "@/lib/workspace-validation";

type WorkspaceProject = {
  id: string;
  name: string;
  description: string | null;
  role: string;
};

export async function GET(request: Request) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const requestedProjectId = new URL(request.url).searchParams.get("projectId");

  try {
    const accessibleProjects = await db.project.findMany({
      where: {
        OR: [
          { userId: currentUser.id },
          { members: { some: { userId: currentUser.id } } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        members: {
          where: { userId: currentUser.id },
          select: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projects: WorkspaceProject[] = accessibleProjects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      role: project.userId === currentUser.id ? "OWNER" : project.members[0]?.role ?? "DEVELOPER",
    }));

    const selectedProjectId = requestedProjectId || projects[0]?.id;
    if (!selectedProjectId) {
      return NextResponse.json({
        projects,
        project: null,
        members: [],
        tasks: [],
        milestones: [],
        activities: [],
        documents: [],
        insights: {
          completion: 0,
          distribution: [],
          upcomingDeadlines: [],
          blockedTasks: [],
          workload: [],
          risks: [],
          recommendations: [],
          aiRisks: [],
          recommendationSource: null,
          latestPlanAt: null,
        },
      });
    }

    const access = await getProjectAccess(selectedProjectId, currentUser.id);
    if (!access) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!access.role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [project, tasks, milestones, activities, documents, latestPlan] = await Promise.all([
      db.project.findUnique({
        where: { id: selectedProjectId },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          createdAt: true,
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true, jobTitle: true, skills: true },
          },
          members: {
            select: {
              role: true,
              user: {
                select: { id: true, name: true, email: true, avatarUrl: true, jobTitle: true, skills: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      db.task.findMany({
        where: { projectId: selectedProjectId },
        include: {
          assignee: { select: { id: true, name: true, email: true, avatarUrl: true, jobTitle: true, skills: true } },
          user: { select: { id: true, name: true } },
          milestone: { select: { id: true, title: true } },
          dependsOn: {
            include: { dependsOnTask: { select: { id: true, title: true } } },
          },
          dependents: {
            include: { task: { select: { id: true, title: true } } },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      db.milestone.findMany({
        where: { projectId: selectedProjectId },
        include: { _count: { select: { tasks: true } } },
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
      }),
      db.activityLog.findMany({
        where: { projectId: selectedProjectId },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          task: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      db.projectDocument.findMany({
        where: { projectId: selectedProjectId },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.aIExecution.findFirst({
        where: {
          projectId: selectedProjectId,
          type: "workspace-plan",
          status: "COMPLETED",
        },
        select: { response: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const memberMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
      jobTitle: string | null;
      skills: string[];
      role: string;
    }>();
    memberMap.set(project.user.id, { ...project.user, role: "OWNER" });
    for (const membership of project.members) {
      const current = memberMap.get(membership.user.id);
      memberMap.set(membership.user.id, {
        ...membership.user,
        role: current?.role === "OWNER" ? "OWNER" : membership.role,
      });
    }

    const members = [...memberMap.values()].map((member) => {
      const assigned = tasks.filter((task) => task.assigneeId === member.id && !task.completed);
      return {
        ...member,
        workload: {
          openTasks: assigned.length,
          estimateHours: assigned.reduce((total, task) => total + (task.estimate ?? 0), 0),
        },
      };
    });

    const completedCount = tasks.filter((task) => task.completed || task.status === "DONE").length;
    const statusNames: Record<string, string> = {
      TODO: "To do",
      IN_PROGRESS: "In progress",
      DONE: "Done",
      BLOCKED: "Blocked",
    };
    const statusCounts = new Map<string, number>();
    for (const task of tasks) {
      const name = statusNames[task.status] ?? "Other";
      statusCounts.set(name, (statusCounts.get(name) ?? 0) + 1);
    }

    const now = new Date();
    const blockedTasks = tasks
      .filter((task) => task.status === "BLOCKED" && !task.completed)
      .map((task) => ({ id: task.id, title: task.title, dueDate: task.dueDate }));
    const overdueTasks = tasks.filter(
      (task) => task.dueDate && task.dueDate < now && !task.completed,
    );
    const overdueMilestones = milestones.filter(
      (milestone) => milestone.dueDate && milestone.dueDate < now && milestone.status !== "COMPLETED",
    );
    const upcomingDeadlines = [
      ...tasks
        .filter((task) => task.dueDate && task.dueDate >= now && !task.completed)
        .map((task) => ({ id: task.id, title: task.title, kind: "Task", dueDate: task.dueDate })),
      ...milestones
        .filter((milestone) => milestone.dueDate && milestone.dueDate >= now && milestone.status !== "COMPLETED")
        .map((milestone) => ({ id: milestone.id, title: milestone.title, kind: "Milestone", dueDate: milestone.dueDate })),
    ]
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
      .slice(0, 10);

    const risks = [
      ...(blockedTasks.length
        ? [`${blockedTasks.length} task${blockedTasks.length === 1 ? " is" : "s are"} blocked.`]
        : []),
      ...(overdueTasks.length
        ? [`${overdueTasks.length} incomplete task${overdueTasks.length === 1 ? " is" : "s are"} past due.`]
        : []),
      ...(overdueMilestones.length
        ? [`${overdueMilestones.length} milestone${overdueMilestones.length === 1 ? " is" : "s are"} past due.`]
        : []),
    ];

    let aiRecommendations: string[] = [];
    let aiRisks: string[] = [];
    let recommendationSource: "ollama" | "fallback" | null = null;
    if (latestPlan?.response) {
      try {
        const savedPlan: unknown = JSON.parse(latestPlan.response);
        const validatedPlan = workspacePlanSchema.safeParse(savedPlan);
        if (validatedPlan.success) {
          aiRecommendations = validatedPlan.data.recommendations;
          aiRisks = validatedPlan.data.risks;
          recommendationSource = validatedPlan.data.source;
        } else {
          console.error("Stored workspace plan is invalid:", validatedPlan.error.issues);
        }
      } catch (error) {
        console.error("Stored workspace plan could not be decoded:", error);
      }
    }

    return NextResponse.json({
      projects,
      project: { ...project, role: access.role },
      members,
      tasks,
      milestones,
      activities,
      documents,
      insights: {
        completion: tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100),
        distribution: [...statusCounts].map(([name, value]) => ({ name, value })),
        upcomingDeadlines,
        blockedTasks,
        workload: members.map((member) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          openTasks: member.workload.openTasks,
          estimateHours: member.workload.estimateHours,
        })),
        risks,
        recommendations: aiRecommendations,
        aiRisks,
        recommendationSource,
        latestPlanAt: latestPlan?.createdAt ?? null,
      },
    });
  } catch (error) {
    console.error("Workspace data fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch workspace data" }, { status: 500 });
  }
}
