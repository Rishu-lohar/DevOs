import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectRelations, updateProjectSchema } from "@/lib/project-validation";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { projectId } = await params;
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: projectRelations,
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { projectId } = await params;
  const body: unknown = await request.json().catch(() => undefined);
  const result = updateProjectSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid project data" },
      { status: 400 },
    );
  }

  try {
    const existing = await db.project.findUnique({ where: { id: projectId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    if (result.data.userId) {
      const user = await db.user.findUnique({ where: { id: result.data.userId }, select: { id: true } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await db.project.update({
      where: { id: projectId },
      data: result.data,
      include: projectRelations,
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { projectId } = await params;
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, _count: { select: { tasks: true } } },
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project._count.tasks > 0) {
      return NextResponse.json(
        { error: "Delete or move this project's tasks before deleting the project" },
        { status: 409 },
      );
    }

    await db.project.delete({ where: { id: projectId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
