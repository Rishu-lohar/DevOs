import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AuthenticatedProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

export function isMissingAuthSession(error: unknown) {
  return error instanceof Error && error.name === "AuthSessionMissingError";
}

function metadataString(user: User, ...keys: string[]) {
  for (const key of keys) {
    const value = user.user_metadata[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function getAuthenticatedProfile(user: User): AuthenticatedProfile {
  const email = user.email ?? "";

  return {
    email,
    name: metadataString(user, "full_name", "name") ?? (email || "User"),
    avatarUrl: metadataString(user, "avatar_url", "picture"),
  };
}

export async function getAuthenticatedUser() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    if (isMissingAuthSession(error)) return null;
    throw error;
  }
}