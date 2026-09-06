"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  GitBranch,
  GitPullRequest,

  Layers,
  LineChart,
  Lightbulb,
  Menu,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/* ---------------------------------- Nav ---------------------------------- */

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "AI", href: "#ai" },
  { label: "Open Source", href: "#open-source" },
  { label: "FAQ", href: "#faq" },
];

function LandingNav() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="landing-nav"
      className={cn(
        "sticky top-0 z-50 border-b bg-background/95 transition-colors duration-[200ms]",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-5">
        <Link href="/" className="flex items-center gap-2" data-testid="landing-brand">
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent text-accent-foreground">
            <Terminal className="h-3 w-3" />
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.015em]">DevOS</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-1.5 text-[13px] text-text-secondary transition-colors duration-[140ms] hover:bg-surface-hover hover:text-text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login" data-testid="landing-login">Log in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/signup" data-testid="landing-signup">Sign up</Link>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2, ease }}
          className="overflow-hidden border-t border-border md:hidden"
        >
          <nav className="mx-auto flex max-w-[1200px] flex-col p-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2.5 py-2 text-[13px] text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}

/* --------------------------------- Hero ---------------------------------- */

function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.2);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 500], [0, 60]);
  const fade = useTransform(scrollY, [0, 400], [1, 0.35]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const gradientX = useTransform(sx, (v) => `${v * 100}%`);
  const gradientY = useTransform(sy, (v) => `${v * 100}%`);

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      data-testid="landing-hero"
      className="relative overflow-hidden border-b border-border"
    >
      {/* Animated grid + aurora — landing only */}
      <motion.div style={{ opacity: fade }} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 landing-grid opacity-60" />
        <div className="absolute inset-0 landing-aurora animate-aurora" />
        <motion.div
          className="absolute -inset-40 opacity-70"
          style={{
            background: `radial-gradient(420px circle at ${gradientX} ${gradientY}, rgba(94,106,210,0.10), transparent 65%)`,
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[1200px] px-5 pb-20 pt-16 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
            <Sparkles className="h-3 w-3 text-accent" />
            AI powered · For developers · Open source friendly
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="mx-auto mt-6 max-w-3xl text-center text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] text-text-primary sm:text-[52px]"
        >
          Build better. Together.
          <br />
          <span className="text-text-muted">Learn deeper. Grow faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease }}
          className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed text-text-secondary"
        >
          An intelligent operating system for engineers — plan projects, review code
          with teams, analyse repositories and track your growth in one dense,
          keyboard-first workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          <Button asChild variant="primary" size="xl">
            <Link href="/signup" data-testid="hero-get-started">
              Get started for free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="xl">
            <Link href="/dashboard" data-testid="hero-view-demo">View demo</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-2 divide-x divide-border rounded-xl border border-border bg-card sm:grid-cols-4"
        >
          {[
            { v: "10K+", l: "Developers" },
            { v: "4.9", l: "User rating" },
            { v: "500+", l: "Teams" },
            { v: "99.9%", l: "Uptime" },
          ].map((s) => (
            <div key={s.l} className="px-4 py-3 text-center">
              <p className="text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
                {s.v}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">{s.l}</p>
            </div>
          ))}
        </motion.div>

        {/* Floating product preview with parallax */}
        <motion.div
          style={{ y: parallax }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="ml-2 font-mono text-[10px] text-text-muted">
                devos.dev/dashboard
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] divide-x divide-border">
              <div className="hidden space-y-1 p-3 sm:block">
                {["Dashboard", "Projects", "Tasks", "GitHub", "AI Mentor"].map((n, i) => (
                  <div
                    key={n}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px]",
                      i === 0
                        ? "bg-surface-active text-text-primary"
                        : "text-text-muted",
                    )}
                  >
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-border-strong" />
                    {n}
                  </div>
                ))}
              </div>
              <div className="space-y-3 p-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["6", "23", "156", "7"].map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.05 * i, ease }}
                      className="rounded-lg border border-border bg-surface px-2.5 py-2"
                    >
                      <p className="text-[14px] font-semibold text-text-primary">{v}</p>
                      <p className="text-[9px] text-text-muted">metric</p>
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-end gap-1.5">
                    {[30, 48, 36, 62, 52, 78, 66, 92, 74, 88].map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h * 0.6}px` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.04 * i, ease }}
                        className="flex-1 rounded-t-[2px] bg-accent/60"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {["Refresh token rotation", "Defer hydration on shell", "Repo health scoring v2"].map(
                    (t, i) => (
                      <div
                        key={t}
                        className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5"
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            ["bg-accent", "bg-warning", "bg-success"][i],
                          )}
                        />
                        <span className="truncate text-[11px] text-text-secondary">{t}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trusted-by marquee */}
        <div className="mt-14">
          <p className="text-center text-[11px] uppercase tracking-[0.08em] text-text-muted">
            Trusted by developers & teams
          </p>
          <div className="relative mt-4 overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-10">
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex items-center gap-10">
                  {["Next.js", "TypeScript", "MongoDB", "Firebase", "Vercel", "Prisma", "Tailwind"].map(
                    (b) => (
                      <span
                        key={`${dup}-${b}`}
                        className="whitespace-nowrap text-[13px] font-medium text-text-muted"
                      >
                        {b}
                      </span>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Features -------------------------------- */

const features = [
  { icon: Layers, title: "Unified workspace", body: "Projects, tasks, repositories and docs in one dense surface — no tab juggling." },
  { icon: GitPullRequest, title: "Review without friction", body: "Diff-first review queues with checks, reviewers and merge state inline." },
  { icon: Bot, title: "AI engineering mentor", body: "Context-aware guidance grounded in your repositories and commit history." },
  { icon: LineChart, title: "Velocity analytics", body: "Commits, PRs and review latency tracked as first-class product metrics." },
  { icon: Lightbulb, title: "Open source discovery", body: "Ranked good-first-issues matched to the languages you actually write." },
  { icon: Newspaper, title: "Industry intelligence", body: "Architecture trends and engineering practices summarised for builders." },
];

function Features() {
  return (
    <section id="features" className="border-b border-border py-20">
      <div className="mx-auto max-w-[1200px] px-5">
        <motion.div {...reveal} transition={{ duration: 0.6, ease }} className="max-w-2xl">
          <Badge variant="accent">Platform</Badge>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary">
            Everything an engineering team opens every morning
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Twelve modules built on one design system — consistent density,
            consistent shortcuts, zero visual noise.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease }}
              className="group rounded-xl border border-border bg-card p-4 transition-colors duration-[140ms] hover:border-border-strong"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface-hover text-accent">
                <f.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-3 text-[14px] font-medium text-text-primary">{f.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Workflow -------------------------------- */

const workflowSteps = [
  { n: "01", title: "Plan", body: "Break work into tasks with priority, estimates and owners. Everything keyboard-driven." },
  { n: "02", title: "Build", body: "Branch, commit and open PRs without leaving the workspace. Checks stream inline." },
  { n: "03", title: "Review", body: "Diff-first review queue with AI pre-review comments on risky changes." },
  { n: "04", title: "Grow", body: "Velocity, streaks and skill progress compound into a living engineering profile." },
];

function Workflow() {
  return (
    <section id="workflow" className="border-b border-border py-20">
      <div className="mx-auto max-w-[1200px] px-5">
        <motion.div {...reveal} transition={{ duration: 0.6, ease }} className="max-w-2xl">
          <Badge variant="accent">Workflow</Badge>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary">
            The developer workflow, end to end
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="relative rounded-xl border border-border bg-card p-4"
            >
              <span className="font-mono text-[11px] text-accent">{s.n}</span>
              <h3 className="mt-2 text-[15px] font-medium text-text-primary">{s.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{s.body}</p>
              <span className="absolute inset-x-4 bottom-0 h-px animate-shimmer-line bg-accent/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- AI ----------------------------------- */

function AiSection() {
  return (
    <section id="ai" className="border-b border-border py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-2">
        <motion.div {...reveal} transition={{ duration: 0.6, ease }}>
          <Badge variant="accent">AI capabilities</Badge>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary">
            An assistant that has actually read your codebase
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            DevOS indexes repositories, commits and review history so guidance is
            grounded in your architecture — not generic advice.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              "Explains unfamiliar modules in your own naming conventions",
              "Flags risky diffs before a human reviewer opens them",
              "Drafts PR descriptions and changelogs from real diffs",
              "Builds a learning roadmap from the gaps in your commits",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13px] text-text-secondary">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>
          <Button asChild variant="secondary" size="lg" className="mt-7">
            <Link href="/ai-mentor" data-testid="ai-explore">
              Explore AI Mentor
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="animate-float-slow rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[12px] font-medium">DevOS Mentor</span>
            <Badge variant="outline" className="ml-auto">indexed 6 repos</Badge>
          </div>
          <div className="space-y-3 p-4">
            <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm border border-accent-border bg-accent-subtle px-3 py-2 text-[12px] text-text-primary">
              Why is our cold start slow on the mobile shell?
            </div>
            <div className="w-fit max-w-[92%] rounded-lg rounded-bl-sm border border-border bg-surface px-3 py-2 text-[12px] leading-relaxed text-text-secondary">
              <p>
                <span className="font-mono text-accent">App.tsx</span> blocks the first
                paint on a full <span className="font-mono">vehicle_state</span> sync.
                Render once minimum required state is present, then reconcile.
              </p>
              <div className="mt-2 rounded-md border border-border bg-card px-2 py-1.5 font-mono text-[11px] text-text-muted">
                + render before sync · 2 files · +22 −10
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Open a draft PR", "Show the diff", "Add a test"].map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-text-secondary"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------- GitHub + OSS ------------------------------ */

function GithubSection() {
  return (
    <section id="open-source" className="border-b border-border py-20">
      <div className="mx-auto max-w-[1200px] px-5">
        <motion.div {...reveal} transition={{ duration: 0.6, ease }} className="max-w-2xl">
          <Badge variant="accent">GitHub & Open source</Badge>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary">
            Connect a repository, get an operating system
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="rounded-xl border border-border bg-card lg:col-span-2"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <GithubIcon className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-[12px] font-medium">Recent activity</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { i: GitPullRequest, t: "Refresh token rotation + reuse detection", m: "devos-platform #145 · passing", c: "text-success" },
                { i: GitBranch, t: "Defer non-critical hydration", m: "perf/hydration · 4 commits ahead", c: "text-accent" },
                { i: Zap, t: "Repo health scoring v2", m: "repository-analyzer #88 · 2 checks failing", c: "text-danger" },
                { i: ShieldCheck, t: "Removed shadow utilities from primitives", m: "design-system-core #51 · merged", c: "text-text-muted" },
              ].map((r) => (
                <div key={r.t} className="flex items-center gap-3 px-4 py-2.5">
                  <r.i className={cn("h-3.5 w-3.5 shrink-0", r.c)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-text-primary">{r.t}</p>
                    <p className="truncate text-[11px] text-text-muted">{r.m}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <h3 className="text-[13px] font-medium text-text-primary">
              Good first issues, ranked
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-text-muted">
              Matched against the languages and frameworks in your own commits.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { r: "vercel/next.js", m: 96 },
                { r: "tailwindlabs/tailwindcss", m: 89 },
                { r: "prisma/prisma", m: 81 },
              ].map((x) => (
                <div key={x.r} className="rounded-lg border border-border bg-surface px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[11px] text-text-secondary">
                      {x.r}
                    </span>
                    <span className="text-[11px] font-medium text-success">{x.m}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-active">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${x.m}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Testimonials ------------------------------ */

const testimonials = [
  { q: "DevOS replaced four tabs and a spreadsheet. Our review latency dropped by half in one sprint.", n: "Sarup Banskota", r: "Head of Growth" },
  { q: "The density is the feature. Everything I need is one keystroke away and nothing is decorative.", n: "Meera Shah", r: "Backend Engineer" },
  { q: "The AI actually understands our module boundaries, so its suggestions land instead of annoying us.", n: "Jatin Thakur", r: "DevOps Engineer" },
];

function Testimonials() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-[1200px] px-5">
        <motion.h2
          {...reveal}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary"
        >
          Teams that ship every day
        </motion.h2>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              className="flex flex-col rounded-xl border border-border bg-card p-4"
            >
              <blockquote className="flex-1 text-[13px] leading-relaxed text-text-secondary">
                “{t.q}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 border-t border-border pt-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-active text-[10px] font-medium text-text-secondary">
                  {t.n.split(" ").map((p) => p[0]).join("")}
                </span>
                <span>
                  <span className="block text-[12px] font-medium text-text-primary">{t.n}</span>
                  <span className="block text-[11px] text-text-muted">{t.r}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */

const faqs = [
  { q: "Is DevOS free to start?", a: "Yes. The free tier includes unlimited personal projects, three connected repositories and the full task workspace." },
  { q: "Do I need to connect GitHub?", a: "No. You can plan projects and tasks without connecting anything. Connecting a repository unlocks commits, PRs, branches and health scoring." },
  { q: "How does the AI mentor get context?", a: "It indexes repository structure, commit history and review threads you explicitly connect. Nothing is indexed without your action." },
  { q: "Does DevOS support light mode?", a: "Both themes ship from the same token system, so every surface adapts instantly without any component changes." },
  { q: "Can I use DevOS with my team?", a: "Yes. Projects support shared members, review queues and activity streams across the whole workspace." },
];

function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="border-b border-border py-20">
      <div className="mx-auto max-w-[760px] px-5">
        <motion.h2
          {...reveal}
          transition={{ duration: 0.6, ease }}
          className="text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary"
        >
          Frequently asked questions
        </motion.h2>
        <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                data-testid={`faq-toggle-${i}`}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-[140ms] hover:bg-surface-hover"
              >
                <span className="text-[13px] font-medium text-text-primary">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-[200ms]",
                    open === i && "rotate-180",
                  )}
                />
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.22, ease }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-3.5 text-[12px] leading-relaxed text-text-muted">
                    {f.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CTA + Footer --------------------------- */

function Cta() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      <div className="pointer-events-none absolute inset-0 landing-aurora animate-aurora opacity-70" />
      <motion.div
        {...reveal}
        transition={{ duration: 0.6, ease }}
        className="relative mx-auto max-w-[720px] px-5 text-center"
      >
        <h2 className="text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] text-text-primary">
          Start building with DevOS today
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-text-secondary">
          Free forever for personal projects. No credit card, no setup call, no
          onboarding sequence.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Button asChild variant="primary" size="xl">
            <Link href="/signup" data-testid="cta-signup">
              Create your workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="xl">
            <Link href="/dashboard">Browse the demo</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  const cols = [
    { t: "Product", l: ["Dashboard", "Projects", "Tasks", "GitHub"] },
    { t: "Discover", l: ["Open Source", "Industry", "Growth", "AI Mentor"] },
    { t: "Company", l: ["About", "Blog", "Careers", "Contact"] },
    { t: "Legal", l: ["Privacy", "Terms", "Security", "Status"] },
  ];
  return (
    <footer className="py-12">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent text-accent-foreground">
                <Terminal className="h-3 w-3" />
              </span>
              <span className="text-[14px] font-semibold tracking-[-0.015em]">DevOS</span>
            </Link>
            <p className="mt-3 max-w-[200px] text-[12px] leading-relaxed text-text-muted">
              Empowering the next generation of developers.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.t}>
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-muted">
                {c.t}
              </p>
              <ul className="mt-3 space-y-2">
                {c.l.map((x) => (
                  <li key={x}>
                    <span className="cursor-default text-[12px] text-text-secondary transition-colors duration-[140ms] hover:text-text-primary">
                      {x}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-[11px] text-text-muted">
            © {new Date().getFullYear()} DevOS. Build · Collaborate · Grow.
          </p>
          <p className="text-[11px] text-text-muted">Made for developers, by developers.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div data-testid="landing-page" className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <Features />
      <Workflow />
      <AiSection />
      <GithubSection />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}
