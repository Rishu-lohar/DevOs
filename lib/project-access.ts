import { db } from "@/lib/db";

export type ProjectRole = "OWNER" | "MANAGER" | "DEVELOPER";

export async function getProjectAccess(projectId: string, userId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
      members: {
        where: { userId },
        select: { role: true },
      },
    },
  });

  if (!project) return null;

  const role: ProjectRole | null =
    project.userId === userId
      ? "OWNER"
      : (project.members[0]?.role ?? null);

  return { project, role };
}

export function canManageProject(role: ProjectRole | null) {
  return role === "OWNER" || role === "MANAGER";
}
