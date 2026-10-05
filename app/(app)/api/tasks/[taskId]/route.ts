import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskRelations, updateTaskSchema } from "@/lib/task-validation";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { taskId } = await params;
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: taskRelations,
    });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await getAuthenticatedUser())) {
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
    const existing = await db.task.findUnique({ where: { id: taskId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    if (result.data.projectId) {
      const project = await db.project.findUnique({
        where: { id: result.data.projectId },
        select: { id: true },
      });
      if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (result.data.userId) {
      const user = await db.user.findUnique({ where: { id: result.data.userId }, select: { id: true } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { completed, status, ...fields } = result.data;
    const task = await db.task.update({
      where: { id: taskId },
      data: {
        ...fields,
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
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { taskId } = await params;
  try {
    const task = await db.task.findUnique({ where: { id: taskId }, select: { id: true } });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    await db.task.delete({ where: { id: taskId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task delete error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
