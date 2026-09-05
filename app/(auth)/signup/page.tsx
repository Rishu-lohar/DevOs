"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Input } from "@/components/ui";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Create your DevOS account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Build, collaborate, and grow with one calm, intelligent developer operating system.
        </p>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        By creating an account, you agree to our{" "}
        <Link href="#" className="text-slate-300 underline underline-offset-2 hover:text-white">
          Terms of Service
        </Link>{" "}
        and acknowledge our{" "}
        <Link href="#" className="text-slate-300 underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Primary Continue Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          className="group relative flex h-12 w-full items-center justify-between rounded-xl border border-white/[0.1] bg-[#121620]/90 px-4 text-xs sm:text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-[#181e2b] hover:shadow-[0_4px_25px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-3">
            <GoogleIcon />
            <span>Sign up with Google Calendar</span>
          </div>
          <ArrowRight size={15} className="text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
        </button>

        <button
          type="button"
          className="group relative flex h-12 w-full items-center justify-between rounded-xl border border-white/[0.1] bg-[#121620]/90 px-4 text-xs sm:text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-[#181e2b] hover:shadow-[0_4px_25px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-3">
            <MicrosoftIcon />
            <span>Sign up with Outlook Calendar</span>
          </div>
          <ArrowRight size={15} className="text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-600">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span>or sign up with email</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {/* Sign Up Form */}
      <div className="space-y-4">
        <Input placeholder="Full name" type="text" />
        <Input placeholder="Email address" type="email" />
        <Input placeholder="Create a strong password" type="password" />
        <Button className="w-full" size="md">
          Create Account
        </Button>
      </div>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link className="font-medium text-violet-400 hover:text-violet-300 transition-colors" href="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}