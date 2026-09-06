# DevOS — Phase-1 Frontend Specification

## What the app is
DevOS is a developer operating system: a dense, keyboard-first workspace where engineers plan
projects, track tasks, review GitHub activity, discover open source work, read industry
intelligence, track personal growth and consult an AI mentor.

**Phase-1 is frontend-only.** No backend, no database, no auth logic, no API calls, no LLM.
Every screen is driven by realistic dummy data in `lib/data.ts`.

## Stack (locked — do not migrate)
Next.js 16 App Router · TypeScript · Tailwind CSS v4 · Framer Motion · Radix/shadcn primitives ·
Lucide React · Recharts · React Hook Form · Zod. Dev server on port 3000 (supervisor: `frontend`).
No Vite. No React SPA.

## Design system (single source of truth)
| Concern | Location |
|---|---|
| Token values (TS) | `lib/design-tokens.ts` |
| Semantic CSS variables + both themes | `app/globals.css` |

- **Colors** are semantic only: `--background`, `--sidebar`, `--surface`, `--card`, `--border`,
  `--border-strong`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`,
  `--success`, `--warning`, `--danger`. Exposed to Tailwind via `@theme inline`
  (`bg-surface`, `text-text-muted`, `border-border`, `text-accent`, …).
- **Dark is default** (`.dark` on `<html>`); **light** is a full token override (`.light`).
  Theme lives in `components/providers/theme-provider.tsx`, persisted to `localStorage`
  under `devos-theme`. Components never hardcode a colour, so no component changes are
  needed to add a theme.
- **Density**: body 13px, page title 18px, card title 13px, meta 11–12px. Controls are
  h-7/h-8/h-9. Radii 4–16px. Depth comes from spacing + 1px borders — **no heavy shadows**.
- **Motion**: app UI 140–200ms token-driven transitions; the landing page is the only surface
  with expressive motion (aurora, animated grid, mouse gradient, parallax, scroll reveal,
  marquee). Keyframes live in `app/globals.css`; `prefers-reduced-motion` is honoured.

## Layout contract
`components/layout/app-shell.tsx` — `h-screen overflow-hidden` shell.
- Sidebar fixed at `--sidebar-width` (232px), `overflow-hidden`. **Only the nav list scrolls**
  (`scrollbar-none`); brand, subscription card and user profile are pinned via `shrink-0`.
- Navbar fixed at `--navbar-height` (48px), flat with a bottom border.
- `<main>` is the only vertically scrolling region. Verified: zero horizontal overflow at 390px.

## Routes
| Route | Purpose |
|---|---|
| `/` | Marketing landing page (hero, features, workflow, AI, GitHub/OSS, testimonials, FAQ, CTA, footer) |
| `/login` `/signup` `/forgot-password` `/verify-otp` | Auth group — RHF + Zod validation, GitHub/Google OAuth buttons (UI only), 6-box OTP with paste support |
| `/dashboard` | Stats, velocity area chart, task donut, project overview, today's focus, contribution grid, open PRs, activity, AI overview, growth summary |
| `/workspace` | Tabs: Overview · Timeline · Members · Files · Branches · Activity |
| `/projects` | Grid/list toggle, search, health filter, progress, members |
| `/tasks` | Grouped by status; search + priority + project filters |
| `/github` | Tabs: Overview · Repositories · Commits · Pull Requests · Issues · Branches · Repository Health · Actions |
| `/open-source` | Tabs: Trending · Bookmarks (stateful) · Good First Issues · Suggestions |
| `/industry` | Tabs: Technology News · Company Insights · Architecture Trends · Best Practices |
| `/growth` | Heatmap, velocity, language mix, weekly commits, review throughput, learning progress, achievements, quarter goals |
| `/ai-mentor` | Chat workspace: conversation history rail, suggested prompts, streaming-style canned replies |
| `/settings` | Tabs: Profile (RHF+Zod) · Appearance (theme switch) · GitHub · Notifications |

No placeholder or "coming soon" pages exist.

## Data model (dummy)
`lib/types.ts` defines `Task`, `Project`, `Repo`, `Commit`, `PullRequest`, `Issue`, `Branch`,
`OssRepo`, `NewsItem`, `Activity`, `Member`, plus `TaskStatus`, `Priority`, `ProjectHealth`.
`lib/data.ts` holds all fixtures and chart series. The contribution heatmap is generated
deterministically so server and client markup match (no hydration drift).

## Shared components
- `components/ui/*` — button, card, badge, input/textarea/label, tabs, dialog, dropdown-menu,
  avatar, table, feedback (progress/separator/skeleton/spinner/empty-state).
- `components/domain/primitives.tsx` — StatCard, StatusBadge, PriorityIndicator, HealthBadge,
  LanguageDot, MetricRow.
- `components/domain/filters.tsx` — SearchField, FilterMenu.
- `components/charts/index.tsx` — AreaChart, BarChart, LineChart, DonutChart, ContributionGrid
  (all Recharts, all reading semantic tokens).
- `components/layout/page.tsx` — PageHeader / PageBody / SectionTitle used by every page.

## Auth behaviour (UI only)
No real authentication. `/login` and `/verify-otp` route to `/dashboard`; `/signup` routes to
`/verify-otp`. Any credentials satisfying Zod validation pass. See `memory/test_credentials.md`.

## Verification status
`npx tsc --noEmit` clean · `yarn build` clean (16 static routes) · all 15 routes HTTP 200 ·
full browser pass through every module with **0 console errors** · light and dark verified ·
mobile 390px verified with 0px horizontal overflow · sidebar confirmed non-scrolling with
pinned profile and subscription.
