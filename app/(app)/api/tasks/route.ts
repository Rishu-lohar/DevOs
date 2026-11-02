import { NextResponse } from "next/server";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTaskSchema, taskRelations } from "@/lib/task-validation";
import { getProjectAccess } from "@/lib/project-access";

export async function GET() {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const tasks = await db.task.findMany({
      where: {
        OR: [
          { userId: currentUser.id },
          { project: { userId: currentUser.id } },
          { project: { members: { some: { userId: currentUser.id } } } },
        ],
      },
      include: taskRelations,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const result = createTaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid task data" },
      { status: 400 },
    );
  }

  try {
    const access = await getProjectAccess(result.data.projectId, currentUser.id);
    if (!access) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (!access.role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const status = result.data.status ?? "TODO";
    const { dueDate, ...taskData } = result.data;
    const task = await db.task.create({
      data: {
        ...taskData,
        userId: currentUser.id,
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null,
        status,
        completed: status === "DONE",
      },
      include: taskRelations,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Task create error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
