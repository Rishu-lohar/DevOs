"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { PageBody, PageHeader } from "@/components/layout/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { Spinner } from "@/components/ui/feedback";
import { useTheme } from "@/components/providers/theme-provider";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import { currentUser, repos } from "@/lib/data";
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      location: currentUser.location,
      bio: currentUser.bio,
    },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 450));
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

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
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={currentUser.name} size="xl" />
                    <div>
                      <Button type="button" variant="secondary" size="sm" data-testid="settings-upload-avatar">
                        Upload new photo
                      </Button>
                      <p className="mt-1.5 text-[11px] text-text-muted">
                        PNG or JPG, up to 2 MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" className="mt-1.5 h-9" data-testid="settings-name" {...register("name")} />
                      <FieldError>{errors.name?.message}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" className="mt-1.5 h-9" data-testid="settings-email" {...register("email")} />
                      <FieldError>{errors.email?.message}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" className="mt-1.5 h-9" data-testid="settings-role" {...register("role")} />
                      <FieldError>{errors.role?.message}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" className="mt-1.5 h-9" data-testid="settings-location" {...register("location")} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" className="mt-1.5" data-testid="settings-bio" {...register("bio")} />
                    <FieldError>{errors.bio?.message}</FieldError>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
                  {saved && (
                    <span className="flex items-center gap-1 text-[12px] text-success" data-testid="settings-saved">
                      <Check className="h-3 w-3" />
                      Saved
                    </span>
                  )}
                  <Button type="button" variant="ghost" size="md">Cancel</Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                    data-testid="settings-save"
                  >
                    {isSubmitting && <Spinner />}
                    {isSubmitting ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
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
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <Avatar name={currentUser.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-text-primary">
                      @{currentUser.handle}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      {repos.length} repositories synced · last sync 18m ago
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" data-testid="github-disconnect">
                    Disconnect
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-border border-t border-border">
                <ToggleRow
                  title="Sync commits automatically"
                  description="Pull new commits every 15 minutes."
                  defaultOn
                  testId="toggle-sync-commits"
                />
                <ToggleRow
                  title="Include private repositories"
                  description="Index private repos for analytics and AI context."
                  defaultOn
                  testId="toggle-private-repos"
                />
                <ToggleRow
                  title="AI pre-review on new PRs"
                  description="Post automated review notes when a PR opens."
                  testId="toggle-ai-review"
                />
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
