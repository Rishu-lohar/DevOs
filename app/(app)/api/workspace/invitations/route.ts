import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canManageProject, getProjectAccess } from "@/lib/project-access";

const invitationRequestSchema = z.object({
  projectId: z.string().trim().min(1),
  email: z.string().trim().email().max(320),
  role: z.enum(["MANAGER", "DEVELOPER"]),
});

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedPrismaUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => undefined);
  const parsed = invitationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid invitation" },
      { status: 400 },
    );
  }

  const { projectId, role } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const access = await getProjectAccess(projectId, currentUser.id);
  if (!access) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (!canManageProject(access.role)) {
    return NextResponse.json({ error: "Owner or Manager role is required to invite members" }, { status: 403 });
  }
  if (access.role === "MANAGER" && role !== "DEVELOPER") {
    return NextResponse.json({ error: "Managers can invite Developers only" }, { status: 403 });
  }

  try {
    const invitedUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    const invitation = await db.invitation.create({
      data: {
        projectId,
        email,
        role,
        invitedById: currentUser.id,
        invitedUserId: invitedUser?.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      select: { id: true, email: true, role: true, status: true, expiresAt: true },
    });

    return NextResponse.json(
      { invitation, delivery: "not_configured" },
      { status: 201 },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An invitation already exists for this email and project" },
        { status: 409 },
      );
    }

    console.error("Project invitation error:", error);
    return NextResponse.json({ error: "Failed to save invitation" }, { status: 500 });
  }
}
