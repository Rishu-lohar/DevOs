import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProjectSchema, projectRelations } from "@/lib/project-validation";

export async function GET() {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const projects = await db.project.findMany({
      include: projectRelations,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const result = createProjectSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid project data" },
      { status: 400 },
    );
  }

  try {
    const user = await db.user.findUnique({ where: { id: result.data.userId }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await db.project.create({
      data: result.data,
      include: projectRelations,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
