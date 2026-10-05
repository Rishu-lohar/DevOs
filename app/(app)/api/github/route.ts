import { NextResponse, type NextRequest } from "next/server";
import {
  getGitHubAnalytics,
  getGitHubRepositoryDetail,
  getGitHubWorkspace,
  GitHubIntegrationError,
} from "@/lib/github";

function errorResponse(error: unknown) {
  if (error instanceof GitHubIntegrationError) {
    const status =
      error.code === "unauthenticated"
        ? 401
        : error.code === "not_connected"
          ? 409
          : error.code === "missing_token" || error.code === "scope"
            ? 403
            : error.code === "rate_limit"
              ? 429
              : error.code === "not_found"
                ? 404
                  : error.upstream?.status && error.upstream.status >= 400
                    ? error.upstream.status
                    : 502;

    return NextResponse.json(
      {
        error: error.code,
        ...(error.upstream
          ? {
                details: {
                  status: error.upstream.status,
                  message: error.upstream.message,
                  endpoint: error.upstream.endpoint,
                  tokenExists: error.upstream.tokenExists,
                  login: error.upstream.login,
                },
            }
          : {}),
      },
      { status },
    );
  }

  console.error("GitHub integration request failed:", error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const repository = request.nextUrl.searchParams.get("repo");
  const analytics = request.nextUrl.searchParams.get("analytics");

  try {
    if (analytics === "1") {
      return NextResponse.json(await getGitHubAnalytics(), {
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    if (repository) {
      return NextResponse.json(
        await getGitHubRepositoryDetail(repository),
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }

    return NextResponse.json(await getGitHubWorkspace(), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
