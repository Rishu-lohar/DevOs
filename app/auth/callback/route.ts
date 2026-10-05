import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { storeGitHubProviderToken } from "@/lib/github";

const allowedDestinations = new Set([
  "/dashboard",
  "/github",
  "/reset-password",
]);

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedDestination = requestUrl.searchParams.get("next");
  const destination =
    requestedDestination && allowedDestinations.has(requestedDestination)
      ? requestedDestination
      : "/dashboard";

  if (!code) {
    const fallback =
      destination === "/reset-password"
        ? "/forgot-password?error=reset_link"
        : "/login?error=auth_callback";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const fallback =
      destination === "/reset-password"
        ? "/forgot-password?error=reset_link"
        : "/login?error=auth_callback";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  if (data.session) {
    const isGitHubProvider =
      requestUrl.searchParams.get("provider") === "github" ||
      (requestUrl.searchParams.get("provider") === null &&
        data.session.user.app_metadata.provider === "github");
    await storeGitHubProviderToken(supabase, data.session, isGitHubProvider);
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
