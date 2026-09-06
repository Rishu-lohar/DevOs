"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { signupSchema, type SignupValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/feedback";
import { AuthDivider, AuthHeading, OAuthButtons } from "@/components/auth/auth-parts";

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 450));
    router.push("/verify-otp");
  };

  return (
    <div data-testid="signup-page">
      <AuthHeading
        title="Create your account"
        subtitle="Join the DevOS developer community."
      />

      <OAuthButtons verb="Sign up" />
      <div className="my-5">
        <AuthDivider label="or" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Rishu Lohar"
            data-testid="signup-name"
            className="mt-1.5 h-9"
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            data-testid="signup-email"
            className="mt-1.5 h-9"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            data-testid="signup-password"
            className="mt-1.5 h-9"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Re-enter password"
            data-testid="signup-confirm"
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
          data-testid="signup-submit"
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Creating account…" : "Create account"}
          {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12px] text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          data-testid="signup-login-link"
          className="font-medium text-accent hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
