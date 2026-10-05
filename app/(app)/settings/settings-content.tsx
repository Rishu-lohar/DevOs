"use client";

import * as React from "react";
import Link from "next/link";
import type { AuthenticatedProfile } from "@/lib/auth";
import { Monitor, Moon, Sun } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { ConnectGitHubButton } from "@/components/github/connect-github-button";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

function ToggleRow({
  title,
  description,
  defaultOn = false,
  testId,
}: {
  title: string;
  description: string;
  defaultOn?: boolean;
  testId: string;
}) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text-primary">{title}</p>
        <p className="mt-0.5 text-[12px] text-text-muted">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={() => setOn((v) => !v)}
        data-testid={testId}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-[140ms]",
          on ? "border-accent bg-accent" : "border-border bg-surface-active",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform duration-[140ms]",
            on ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function SettingsContent({
  profile,
  githubAccount,
}: {
  profile: AuthenticatedProfile;
  githubAccount: { login: string; avatarUrl?: string } | null;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, appearance and integrations."
      />

      <PageBody>
        <Tabs defaultValue="profile">
          <TabsList data-testid="settings-tabs">
            <TabsTrigger value="profile" data-testid="settings-tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance" data-testid="settings-tab-appearance">Appearance</TabsTrigger>
            <TabsTrigger value="github" data-testid="settings-tab-github">GitHub</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="settings-tab-notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="max-w-2xl">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Profile</p>
                <p className="text-[11px] text-text-muted">
                  This information appears across your workspace.
                </p>
              </div>
              <div>
                <div className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={profile.name}
                      src={profile.avatarUrl}
                      size="xl"
                    />
                    <div>
                      <p className="mt-1.5 text-[11px] text-text-muted">
                        Profile photo provided by your sign-in account.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        className="mt-1.5 h-9"
                        data-testid="settings-name"
                        value={profile.name}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        className="mt-1.5 h-9"
                        data-testid="settings-email"
                        value={profile.email}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        className="mt-1.5 h-9"
                        data-testid="settings-role"
                        placeholder="Not set"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        className="mt-1.5 h-9"
                        data-testid="settings-location"
                        placeholder="Not set"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      className="mt-1.5"
                      data-testid="settings-bio"
                      placeholder="Not set"
                      disabled
                    />
                  </div>
                  <p className="text-[11px] text-text-muted">
                    Role, location, and bio are not saved yet. A profile record is
                    needed before these fields can be edited.
                  </p>
                </div>

                <div className="flex items-center justify-end border-t border-border px-4 py-3">
                  <span className="text-[11px] text-text-muted">
                    Name and email are managed by your sign-in account.
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="max-w-2xl">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Theme</p>
                <p className="text-[11px] text-text-muted">
                  Dark is the default. Both themes share the same token system.
                </p>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {[
                  { key: "dark" as const, label: "Dark", icon: Moon },
                  { key: "light" as const, label: "Light", icon: Sun },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setTheme(opt.key)}
                    data-testid={`theme-option-${opt.key}`}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors duration-[140ms]",
                      theme === opt.key
                        ? "border-accent bg-accent-subtle"
                        : "border-border bg-surface hover:border-border-strong",
                    )}
                  >
                    <opt.icon
                      className={cn(
                        "h-4 w-4",
                        theme === opt.key ? "text-accent" : "text-text-muted",
                      )}
                    />
                    <p className="mt-2 text-[13px] font-medium text-text-primary">{opt.label}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      {opt.key === "dark" ? "Low-light, high focus" : "Bright, high contrast"}
                    </p>
                  </button>
                ))}
                <div className="rounded-lg border border-border bg-surface p-3 opacity-60">
                  <Monitor className="h-4 w-4 text-text-muted" />
                  <p className="mt-2 text-[13px] font-medium text-text-primary">System</p>
                  <p className="mt-0.5 text-[11px] text-text-muted">Arrives in a later phase</p>
                </div>
              </div>
              <div className="divide-y divide-border border-t border-border">
                <ToggleRow
                  title="Compact density"
                  description="Reduce row heights across tables and lists."
                  defaultOn
                  testId="toggle-density"
                />
                <ToggleRow
                  title="Reduce motion"
                  description="Minimise transitions and animated surfaces."
                  testId="toggle-motion"
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="github">
            <Card className="max-w-2xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <GithubIcon className="h-3.5 w-3.5 text-text-muted" />
                  <p className="text-[13px] font-medium text-text-primary">GitHub connection</p>
                </div>
                <Badge variant={githubAccount ? "success" : "default"}>
                  {githubAccount ? "Connected" : "Not connected"}
                </Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  {githubAccount ? (
                    <Avatar
                      name={githubAccount.login}
                      src={githubAccount.avatarUrl}
                      size="lg"
                    />
                  ) : (
                    <GithubIcon className="ml-2 h-4 w-4 text-text-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-text-primary">
                      {githubAccount ? `@${githubAccount.login}` : "GitHub account"}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      Read-only repository, branch and commit access
                    </p>
                  </div>
                  <ConnectGitHubButton
                    linked={githubAccount !== null}
                    label={githubAccount ? "Reconnect" : "Connect"}
                  />
                </div>
              </div>
              <div className="border-t border-border px-4 py-3">
                <p className="text-[11px] text-text-muted">
                  Repository creation, code changes and background sync are not enabled.
                </p>
                <Link
                  href="/github"
                  className="mt-2 inline-block text-[11px] font-medium text-accent hover:underline"
                >
                  Open GitHub workspace
                </Link>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="max-w-2xl">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[13px] font-medium text-text-primary">Notifications</p>
                <p className="text-[11px] text-text-muted">
                  Choose what reaches you and where.
                </p>
              </div>
              <div className="divide-y divide-border">
                <ToggleRow
                  title="Review requests"
                  description="When someone requests your review on a pull request."
                  defaultOn
                  testId="toggle-notify-reviews"
                />
                <ToggleRow
                  title="Failed checks"
                  description="When CI fails on a branch you own."
                  defaultOn
                  testId="toggle-notify-checks"
                />
                <ToggleRow
                  title="Task assignments"
                  description="When a task is assigned to you in any project."
                  defaultOn
                  testId="toggle-notify-tasks"
                />
                <ToggleRow
                  title="AI Mentor insights"
                  description="When new suggestions are ready for your repositories."
                  testId="toggle-notify-ai"
                />
                <ToggleRow
                  title="Weekly digest email"
                  description="A Monday summary of velocity and open work."
                  testId="toggle-notify-digest"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}
