import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [users, projects, tasks, activeProjects, completedTasks] = await Promise.all([
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
      db.task.count({ where: { status: "DONE" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        projects,
        tasks,
        stats: {
          activeProjects,
          completedTasks,
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