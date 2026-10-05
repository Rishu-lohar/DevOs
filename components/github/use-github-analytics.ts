"use client";

import * as React from "react";
import { apiRequest } from "@/lib/client-api";
import type { GitHubAnalytics } from "@/lib/github-analytics-types";

type GitHubAnalyticsState =
  | { status: "loading"; data: null; message: null }
  | { status: "ready"; data: GitHubAnalytics; message: null }
  | { status: "error"; data: null; message: string };

function getErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "not_connected" || code === "missing_token") {
    return "Connect GitHub to unlock engineering analytics.";
  }
  if (code === "scope") {
    return "Reconnect GitHub with repository access to load analytics.";
  }
  if (code === "rate_limit") {
    return "GitHub API rate limit reached. Please try again later.";
  }
  if (code === "permission") {
    return "GitHub denied access to contribution data. Reconnect your account to restore analytics.";
  }
  return "GitHub analytics are temporarily unavailable.";
}

export function useGitHubAnalytics() {
  const [state, setState] = React.useState<GitHubAnalyticsState>({
    status: "loading",
    data: null,
    message: null,
  });

  React.useEffect(() => {
    let active = true;
    apiRequest<GitHubAnalytics>("/api/github?analytics=1")
      .then((data) => {
        if (active) setState({ status: "ready", data, message: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            data: null,
            message: getErrorMessage(error),
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
