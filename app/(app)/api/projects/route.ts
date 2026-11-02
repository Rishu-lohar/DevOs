import { NextResponse } from "next/server";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProjectSchema, projectRelations } from "@/lib/project-validation";

export async function GET() {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const projects = await db.project.findMany({
      where: {
        OR: [
          { userId: currentUser.id },
          { members: { some: { userId: currentUser.id } } },
        ],
      },
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
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
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
    const project = await db.project.create({
      data: {
        ...result.data,
        userId: currentUser.id,
        members: {
          create: { userId: currentUser.id, role: "OWNER" },
        },
      },
      include: projectRelations,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
