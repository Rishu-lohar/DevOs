import { NextResponse } from "next/server";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canManageProject, getProjectAccess } from "@/lib/project-access";
import {
  createWorkspacePlanRequestSchema,
  validatePlanReferences,
  workspacePlanSchema,
} from "@/lib/workspace-validation";

const AI_BACKEND_URL = process.env.DevHub_AI_BACKEND_URL || "http://127.0.0.1:8001";

function terms(value: string) {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .filter((term) => term.length > 1),
  );
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const parsedRequest = createWorkspacePlanRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.issues[0]?.message ?? "Invalid planning request" },
      { status: 400 },
    );
  }

  const { projectId, projectName, requirements, mode } = parsedRequest.data;
  const access = projectId ? await getProjectAccess(projectId, currentUser.id) : null;
  if (projectId && !access) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (projectId && !access?.role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (mode === "manager" && (!access || !canManageProject(access.role))) {
    return NextResponse.json(
      { error: "Manager planning requires an owned project or Manager membership" },
      { status: 403 },
    );
  }

  try {
    const [existingTasks, team] = await Promise.all([
      access
        ? db.task.findMany({
            where: { projectId: access.project.id },
            select: { title: true },
            orderBy: { createdAt: "asc" },
            take: 200,
          })
        : Promise.resolve([]),
      mode === "manager" && access
        ? db.projectMember.findMany({
            where: { projectId: access.project.id, role: "DEVELOPER" },
            select: {
              user: {
                select: { id: true, name: true, jobTitle: true, skills: true },
              },
            },
            orderBy: { createdAt: "asc" },
          })
        : Promise.resolve([]),
    ]);

    const response = await fetch(`${AI_BACKEND_URL}/plan-project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_name: access?.project.name || projectName || "Personal project",
        requirements,
        mode,
        existing_tasks: existingTasks.map((task) => task.title),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      console.error("Planning backend returned an error:", response.status);
      return NextResponse.json({ error: "Local AI planning backend is unavailable" }, { status: 502 });
    }

    const rawPlan: unknown = await response.json();
    const parsedPlan = workspacePlanSchema.safeParse(rawPlan);
    if (!parsedPlan.success) {
      console.error("Planning backend returned invalid structured output:", parsedPlan.error.issues);
      return NextResponse.json({ error: "Local AI returned an invalid plan" }, { status: 502 });
    }

    const referenceError = validatePlanReferences(parsedPlan.data);
    if (referenceError) {
      console.error("Planning backend returned invalid references:", referenceError);
      return NextResponse.json({ error: "Local AI returned invalid task references" }, { status: 502 });
    }

    const assignments: Array<{ assigneeId: string | null; explanation: string }> = [];
    if (mode === "manager") {
      const workloadTasks = team.length
        ? await db.task.findMany({
            where: {
              projectId: access!.project.id,
              assigneeId: { in: team.map((member) => member.user.id) },
              completed: false,
            },
            select: { assigneeId: true, estimate: true },
          })
        : [];
      const workload = new Map(
        team.map((member) => {
          const assigned = workloadTasks.filter((task) => task.assigneeId === member.user.id);
          return [
            member.user.id,
            {
              openTasks: assigned.length,
              estimateHours: assigned.reduce((sum, task) => sum + (task.estimate ?? 0), 0),
            },
          ];
        }),
      );
      const assignedByTaskIndex = new Map<number, string>();
      const maximumLoad = Math.max(
        1,
        ...[...workload.values()].map((item) => item.estimateHours),
      );

      for (const [index, task] of parsedPlan.data.tasks.entries()) {
        if (team.length === 0) {
          assignments.push({
            assigneeId: null,
            explanation: "No project members with the Developer role are available for assignment.",
          });
          continue;
        }

        const taskTerms = terms(`${task.title} ${task.description}`);
        const dependencyAssignees = task.dependencies
          .map((dependency) => assignedByTaskIndex.get(dependency))
          .filter((id): id is string => Boolean(id));
        const ranked = team
          .map(({ user }) => {
            const profileSkills = user.skills.map((skill) => skill.trim()).filter(Boolean);
            const matchingSkills = profileSkills.filter((skill) =>
              [...terms(skill)].some((term) => taskTerms.has(term)),
            );
            const currentLoad = workload.get(user.id)!;
            const normalizedLoad = currentLoad.estimateHours / maximumLoad;
            const dependencyBonus = dependencyAssignees.includes(user.id) ? 0.15 : 0;
            const skillScore = profileSkills.length
              ? matchingSkills.length / profileSkills.length
              : 0;
            return {
              user,
              profileSkills,
              matchingSkills,
              currentLoad,
              score: skillScore * 0.7 + (1 - normalizedLoad) * 0.3 + dependencyBonus,
              continuesDependency: dependencyAssignees.includes(user.id),
            };
          })
          .sort(
            (left, right) =>
              right.score - left.score ||
              left.currentLoad.estimateHours - right.currentLoad.estimateHours ||
              left.user.name.localeCompare(right.user.name),
          );
        const chosen = ranked[0];
        const reasons = chosen.matchingSkills.length
          ? [`matching skills: ${chosen.matchingSkills.join(", ")}`]
          : chosen.profileSkills.length
            ? ["no direct skill-tag match; workload was used"]
            : ["no skill tags are recorded; workload was used"];
        reasons.push(
          `${chosen.currentLoad.estimateHours} estimated open hours across ${chosen.currentLoad.openTasks} open tasks`,
        );
        if (chosen.continuesDependency) {
          reasons.push("keeps a dependency with the same developer");
        }

        assignments.push({
          assigneeId: chosen.user.id,
          explanation: `${chosen.user.name} recommended based on ${reasons.join("; ")}.`,
        });
        assignedByTaskIndex.set(index, chosen.user.id);
        const currentLoad = workload.get(chosen.user.id)!;
        currentLoad.openTasks += 1;
        currentLoad.estimateHours += task.estimate;
      }
    } else {
      assignments.push(
        ...parsedPlan.data.tasks.map(() => ({
          assigneeId: null,
          explanation: "No assignment is made in Individual Developer mode.",
        })),
      );
    }

    return NextResponse.json({
      projectId: access?.project.id ?? null,
      mode,
      plan: parsedPlan.data,
      assignments,
      members: team.map(({ user }) => user),
      allocationNote:
        mode === "manager" && team.some(({ user }) => user.skills.length === 0)
          ? "Some developer profiles have no recorded skills; workload is used where skill data is missing."
          : null,
    });
  } catch (error) {
    console.error("Project planning error:", error);
    return NextResponse.json({ error: "Unable to generate a project plan" }, { status: 502 });
  }
}
