import { redirect } from "next/navigation";
import { SettingsContent } from "./settings-content";
import { getAuthenticatedProfile, getAuthenticatedUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const identity = user.identities?.find(
    (candidate) => candidate.provider === "github",
  );
  const githubLinked =
    user.app_metadata.provider === "github" || identity !== undefined;
  const identityData = identity?.identity_data;
  const login =
    typeof identityData?.user_name === "string"
      ? identityData.user_name
      : typeof identityData?.preferred_username === "string"
        ? identityData.preferred_username
        : typeof identityData?.login === "string"
          ? identityData.login
          : null;
  const avatarUrl =
    typeof identityData?.avatar_url === "string"
      ? identityData.avatar_url
      : undefined;

  return (
    <SettingsContent
      profile={getAuthenticatedProfile(user)}
      githubAccount={
        githubLinked
          ? { login: login ?? "Connected account", avatarUrl }
          : null
      }
    />
  );
}
