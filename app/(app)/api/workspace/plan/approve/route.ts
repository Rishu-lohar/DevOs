import { NextResponse } from "next/server";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  approveWorkspacePlanRequestSchema,
  validatePlanReferences,
} from "@/lib/workspace-validation";

function toDueDate(value: string | null) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const parsed = approveWorkspacePlanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid plan approval" },
      { status: 400 },
    );
  }

  const { projectId, newProject, mode, requirements, plan, assigneeIds } = parsed.data;
  if (Boolean(projectId) === Boolean(newProject)) {
    return NextResponse.json(
      { error: "Choose an existing project or provide a new project, not both" },
      { status: 400 },
    );
  }
  if (assigneeIds.length !== plan.tasks.length) {
    return NextResponse.json({ error: "Assignment list does not match the plan tasks" }, { status: 400 });
  }
  const referenceError = validatePlanReferences(plan);
  if (referenceError) {
    return NextResponse.json({ error: referenceError }, { status: 400 });
  }
  if (mode === "manager" && !projectId) {
    return NextResponse.json({ error: "Manager plans require an existing team project" }, { status: 400 });
  }
  if (mode === "individual" && assigneeIds.some(Boolean)) {
    return NextResponse.json(
      { error: "Individual plans cannot create team assignments" },
      { status: 400 },
    );
  }

  try {
    const result = await db.$transaction(async (transaction) => {
      let targetProjectId = projectId;

      if (projectId) {
        const project = await transaction.project.findUnique({
          where: { id: projectId },
          select: {
            id: true,
            userId: true,
            members: {
              where: { userId: currentUser.id },
              select: { role: true },
            },
          },
        });
        if (!project) {
          return { error: "Project not found", status: 404 } as const;
        }

        const role =
          project.userId === currentUser.id
            ? "OWNER"
            : project.members[0]?.role ?? null;
        if (!role) {
          return { error: "Forbidden", status: 403 } as const;
        }
        if (mode === "manager" && role !== "OWNER" && role !== "MANAGER") {
          return { error: "Manager role is required to approve team assignments", status: 403 } as const;
        }
      } else if (newProject) {
        const createdProject = await transaction.project.create({
          data: {
            name: newProject.name,
            description: newProject.description,
            userId: currentUser.id,
            members: {
              create: { userId: currentUser.id, role: "OWNER" },
            },
          },
          select: { id: true },
        });
        targetProjectId = createdProject.id;
        await transaction.activityLog.create({
          data: {
            projectId: targetProjectId,
            userId: currentUser.id,
            type: "PROJECT_CREATED",
            message: `Created project ${newProject.name}`,
          },
        });
      }

      if (!targetProjectId) {
        return { error: "Project could not be resolved", status: 400 } as const;
      }

      const uniqueAssigneeIds = [...new Set(assigneeIds.filter((id): id is string => id !== null))];
      if (mode === "manager" && uniqueAssigneeIds.length) {
        const eligibleMembers = await transaction.projectMember.findMany({
          where: {
            projectId: targetProjectId,
            userId: { in: uniqueAssigneeIds },
            role: "DEVELOPER",
          },
          select: { userId: true },
        });
        if (eligibleMembers.length !== uniqueAssigneeIds.length) {
          return { error: "Every assignee must be a Developer in this project", status: 400 } as const;
        }
      }

      const milestoneIds: string[] = [];
      for (const milestone of plan.milestones) {
        const created = await transaction.milestone.create({
          data: {
            projectId: targetProjectId,
            createdById: currentUser.id,
            title: milestone.title,
            description: milestone.description || null,
            dueDate: toDueDate(milestone.dueDate),
          },
          select: { id: true },
        });
        milestoneIds.push(created.id);
      }

      const taskIds: string[] = [];
      for (const [index, task] of plan.tasks.entries()) {
        const created = await transaction.task.create({
          data: {
            title: task.title,
            description: task.description || null,
            status: "TODO",
            priority: task.priority.toUpperCase(),
            estimate: task.estimate,
            dueDate: toDueDate(task.dueDate),
            completed: false,
            projectId: targetProjectId,
            userId: currentUser.id,
            assigneeId: mode === "manager" ? assigneeIds[index] : null,
            milestoneId:
              task.milestoneIndex === null ? null : milestoneIds[task.milestoneIndex],
          },
          select: { id: true },
        });
        taskIds.push(created.id);
      }

      for (const [index, task] of plan.tasks.entries()) {
        for (const dependencyIndex of task.dependencies) {
          await transaction.taskDependency.create({
            data: {
              taskId: taskIds[index],
              dependsOnTaskId: taskIds[dependencyIndex],
              type: "DEPENDS_ON",
            },
          });
        }

        const assigneeId = mode === "manager" ? assigneeIds[index] : null;
        if (assigneeId) {
          await transaction.notification.create({
            data: {
              userId: assigneeId,
              projectId: targetProjectId,
              taskId: taskIds[index],
              type: "TASK",
              title: "Task assigned",
              message: `You were assigned "${task.title}" in ${plan.title}.`,
            },
          });
        }
      }

      const approvedPlan = {
        ...plan,
        tasks: plan.tasks.map((task, index) => ({
          ...task,
          assigneeId: mode === "manager" ? assigneeIds[index] : null,
        })),
      };
      await transaction.aIExecution.create({
        data: {
          userId: currentUser.id,
          projectId: targetProjectId,
          type: "workspace-plan",
          prompt: requirements,
          response: JSON.stringify(approvedPlan),
          status: "COMPLETED",
          metadata: {
            source: plan.source,
            fallbackReason: plan.fallbackReason,
            mode,
            taskCount: taskIds.length,
            milestoneCount: milestoneIds.length,
          },
          finishedAt: new Date(),
        },
      });
      await transaction.activityLog.create({
        data: {
          projectId: targetProjectId,
          userId: currentUser.id,
          type: "AI_GENERATED",
          message: `Approved ${mode} AI plan with ${taskIds.length} tasks and ${milestoneIds.length} milestones`,
          metadata: { source: plan.source, taskCount: taskIds.length, milestoneCount: milestoneIds.length },
        },
      });

      return {
        projectId: targetProjectId,
        taskIds,
        milestoneIds,
        source: plan.source,
      };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Plan approval transaction failed:", error);
    return NextResponse.json({ error: "Unable to save the approved plan" }, { status: 500 });
  }
}
