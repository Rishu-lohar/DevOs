import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTaskSchema, taskRelations } from "@/lib/task-validation";

export async function GET() {
  try {
    const tasks = await db.task.findMany({
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
  const body: unknown = await request.json().catch(() => undefined);
  const result = createTaskSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid task data" },
      { status: 400 },
    );
  }

  try {
    const [project, user] = await Promise.all([
      db.project.findUnique({ where: { id: result.data.projectId }, select: { id: true } }),
      db.user.findUnique({ where: { id: result.data.userId }, select: { id: true } }),
    ]);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const status = result.data.status ?? "TODO";
    const task = await db.task.create({
      data: {
        ...result.data,
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
