"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/feedback";
import { AuthDivider, AuthHeading, OAuthButtons } from "@/components/auth/auth-parts";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "rishu@devos.dev", password: "devos12345" },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 450));
    router.push("/dashboard");
  };

  return (
    <div data-testid="login-page">
      <AuthHeading title="Welcome back" subtitle="Log in to your DevOS workspace." />

      <OAuthButtons />
      <div className="my-5">
        <AuthDivider label="or" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            data-testid="login-email"
            className="mt-1.5 h-9"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              data-testid="login-forgot-link"
              className="text-[11px] text-accent transition-colors hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            data-testid="login-password"
            className="mt-1.5 h-9"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          data-testid="login-submit"
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Signing in…" : "Log in"}
          {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12px] text-text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          data-testid="login-signup-link"
          className="font-medium text-accent hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
