"use client";

import * as React from "react";
import { GithubIcon } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";
import { createClient } from "@/lib/supabase/client";

export function ConnectGitHubButton({
  linked,
  label,
}: {
  linked: boolean;
  label: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const connect = async () => {
    setPending(true);
    setError(null);

    try {
      const client = createClient();
      const options = {
        scopes: "read:user repo",
        redirectTo: `${window.location.origin}/auth/callback?next=/github&provider=github`,
      };
      const result = linked
        ? await client.auth.signInWithOAuth({ provider: "github", options })
        : await client.auth.linkIdentity({ provider: "github", options });

      if (result.error) {
        setError("Unable to connect GitHub. Please try again.");
        setPending(false);
      }
    } catch {
      setError("Unable to connect GitHub. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => void connect()}
        disabled={pending}
      >
        {pending ? <Spinner /> : <GithubIcon className="h-3 w-3" />}
        {pending ? "Connecting…" : label}
      </Button>
      {error && (
        <p role="alert" className="text-[11px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
