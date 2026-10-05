import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getAuthenticatedProfile, getAuthenticatedUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  return <AppShell profile={getAuthenticatedProfile(user)}>{children}</AppShell>;
}
