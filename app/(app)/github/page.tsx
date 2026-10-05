import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { GitHubWorkspace } from "@/components/github/github-workspace";

export default async function GitHubPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const linked =
    user.app_metadata.provider === "github" ||
    user.identities?.some((identity) => identity.provider === "github") === true;

  return <GitHubWorkspace linked={linked} />;
}
