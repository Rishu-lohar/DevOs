import "server-only";

import { getAuthenticatedPrismaUser } from "@/lib/auth";
import { ensurePrismaUser } from "@/lib/ensure-prisma-user";
import { createClient } from "@/lib/supabase/server";

const MAX_BEARER_TOKEN_LENGTH = 8192;

export async function getMcpAuthenticatedUser(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) return getAuthenticatedPrismaUser();

  const match = /^Bearer ([^\s]+)$/i.exec(authorization);
  if (!match || match[1].length > MAX_BEARER_TOKEN_LENGTH) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser(match[1]);
  if (error || !data.user) return null;
  return ensurePrismaUser(data.user);
}
