
import "server-only";

import { prisma } from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function ensurePrismaUser(user: SupabaseUser) {
  const email = user.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Authenticated user email is missing.");
  }

  const name =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()) ||
    email.split("@")[0];
  const jobTitleValue =
    user.user_metadata?.job_title ?? user.user_metadata?.jobTitle ?? user.user_metadata?.role;
  const jobTitle =
    typeof jobTitleValue === "string" && jobTitleValue.trim()
      ? jobTitleValue.trim().slice(0, 120)
      : undefined;
  const skillsValue = user.user_metadata?.skills;
  const skills = Array.isArray(skillsValue)
    ? [...new Set(
        skillsValue
          .filter((skill): skill is string => typeof skill === "string")
          .map((skill) => skill.trim().slice(0, 80))
          .filter(Boolean),
      )].slice(0, 40)
    : undefined;
  const profileData = {
    ...(jobTitle ? { jobTitle } : {}),
    ...(skills ? { skills } : {}),
  };
  const identityData = {
    supabaseId: user.id,
    email,
    name,
    ...profileData,
  };

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseId: user.id }, { email }],
    },
  });

  if (existing) {
    if (existing.supabaseId && existing.supabaseId !== user.id) {
      throw new Error("Authenticated Supabase identity conflicts with the existing Prisma user.");
    }

    return prisma.user.update({
      where: { id: existing.id },
      data: identityData,
    });
  }

  try {
    return await prisma.user.create({ data: identityData });
  } catch (error) {
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== "P2002"
    ) {
      throw error;
    }

    const duplicate = await prisma.user.findFirst({
      where: {
        OR: [{ supabaseId: user.id }, { email }],
      },
    });
    if (!duplicate) throw error;
    if (duplicate.supabaseId && duplicate.supabaseId !== user.id) {
      throw new Error("Authenticated Supabase identity conflicts with the existing Prisma user.");
    }

    return prisma.user.update({
      where: { id: duplicate.id },
      data: identityData,
    });
  }
}
