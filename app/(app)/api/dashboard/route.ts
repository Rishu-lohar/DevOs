import { NextResponse } from "next/server";
import { getAuthenticatedProfile, getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const [users, projects, tasks, activeProjects] = await Promise.all([
      db.user.findMany(),
      db.project.findMany({
        include: {
          user: { select: { id: true, name: true } },
          tasks: { select: { id: true, status: true } },
        },
      }),
      db.task.findMany({
        include: {
          project: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      db.project.count({ where: { status: "ACTIVE" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profile: getAuthenticatedProfile(user),
        users,
        projects,
        tasks,
        stats: {
          activeProjects,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}