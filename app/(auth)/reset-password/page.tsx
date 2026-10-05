"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { AuthHeading } from "@/components/auth/auth-parts";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/feedback";
import { createClient } from "@/lib/supabase/client";
import {
  passwordResetSchema,
  type PasswordResetValues,
} from "@/lib/validations";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async ({ password }: PasswordResetValues) => {
    setAuthError(null);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        setAuthError("Unable to update your password. Request a new reset link and try again.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setAuthError("Unable to update your password. Request a new reset link and try again.");
    }
  };

  return (
    <div data-testid="reset-password-page">
      <AuthHeading
        title="Choose a new password"
        subtitle="Enter and confirm the new password for your DevOS account."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="mt-1.5 h-9"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            className="mt-1.5 h-9"
            {...register("confirm")}
          />
          <FieldError>{errors.confirm?.message}</FieldError>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Updating password…" : "Update password"}
          {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>

      {authError && (
        <p role="alert" className="mt-3 text-[12px] text-danger">
          {authError}
        </p>
      )}
    </div>
  );
}
