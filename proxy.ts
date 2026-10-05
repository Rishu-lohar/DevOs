import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isMissingAuthSession } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase/config";

const protectedPageRoots = [
  "/ai-mentor",
  "/dashboard",
  "/github",
  "/growth",
  "/industry",
  "/open-source",
  "/projects",
  "/settings",
  "/tasks",
  "/workspace",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  let isAuthenticated = false;
  try {
    const {
      data: { user: authenticatedUser },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    isAuthenticated = authenticatedUser !== null;
  } catch (error) {
    if (!isMissingAuthSession(error)) throw error;
  }

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPage = protectedPageRoots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );

  if ((isAuthenticated && isAuthPage) || (!isAuthenticated && isProtectedPage)) {
    const redirectResponse = NextResponse.redirect(
      new URL(isAuthenticated ? "/dashboard" : "/login", request.url),
    );
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\..*).*)",
  ],
};
