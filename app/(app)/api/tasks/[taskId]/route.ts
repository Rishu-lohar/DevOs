import { NextResponse } from "next/server";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskRelations, updateTaskSchema } from "@/lib/task-validation";
import { canManageProject, getProjectAccess } from "@/lib/project-access";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { taskId } = await params;
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: taskRelations,
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    const access = await getProjectAccess(task.projectId, currentUser.id);
    if (!access?.role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { taskId } = await params;
  const body: unknown = await request.json().catch(() => undefined);
  const result = updateTaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid task data" },
      { status: 400 },
    );
  }

  try {
    const existing = await db.task.findUnique({
      where: { id: taskId },
      select: { id: true, userId: true, projectId: true, assigneeId: true },
    });
    if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    const access = await getProjectAccess(existing.projectId, currentUser.id);
    if (!access?.role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      !canManageProject(access.role) &&
      existing.userId !== currentUser.id &&
      existing.assigneeId !== currentUser.id
    ) {
      return NextResponse.json({ error: "Only the assigned Developer can update this task" }, { status: 403 });
    }
    if (
      !canManageProject(access.role) &&
      Object.keys(result.data).some((field) => !["status", "completed"].includes(field))
    ) {
      return NextResponse.json({ error: "Developers can update task status only" }, { status: 403 });
    }

    if (result.data.projectId) {
      const targetAccess = await getProjectAccess(result.data.projectId, currentUser.id);
      if (!targetAccess) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      if (!canManageProject(targetAccess.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const { completed, status, dueDate, ...fields } = result.data;
    const task = await db.task.update({
      where: { id: taskId },
      data: {
        ...fields,
        ...(dueDate !== undefined
          ? { dueDate: dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null }
          : {}),
        ...(status
          ? { status, completed: status === "DONE" }
          : completed !== undefined
            ? { completed, status: completed ? "DONE" : "TODO" }
            : {}),
      },
      include: taskRelations,
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Task update error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { taskId } = await params;
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: { id: true, projectId: true },
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    const access = await getProjectAccess(task.projectId, currentUser.id);
    if (!access?.role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!canManageProject(access.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await db.task.delete({ where: { id: taskId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task delete error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
