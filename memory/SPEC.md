# DevOS - Developer Operating System Specification

## Overview
DevOS is an enterprise developer operating system and engineering intelligence platform designed with the visual philosophy of Fireflies.ai, Linear, Vercel, and Raycast.

## Design Language & Theme
- **Aesthetic**: Flat matte dark enterprise SaaS.
- **Background**: Completely matte black `#09090B`. No gradients, ambient lights, or glow.
- **Cards**: Surface `#111113`, Border `1px solid #232326`, Radius `16px`. NO shadows, NO glow, NO glassmorphism, NO backdrop blur.
- **Navbar & Sidebar**: Flat, bordered `#232326`, sticky top navbar and minimal sidebar with crisp active indicators.
- **Buttons**:
  - Primary: Purple `#7C5CFC` (hover `#6B46F7`)
  - Secondary: Dark `#18181B` (border `#232326`)
  - Ghost: Transparent (hover `#18181B`)
- **Typography**: Clean hierarchy with high legibility (`#FAFAFA` primary text, `#A1A1AA` secondary, `#71717A` muted).
- **Centralized Design System**: `src/config/theme.ts` exposing CSS variables in `globals.css` and `variables.css`.

## Core Navigation & Modules
- `/dashboard`: High-level summary of engineering velocity, active AI tasks, and team momentum.
- `/workspace`: Autonomous context and state streaming.
- `/projects`: Project list and velocity progress.
- `/tasks`: Sprint task management with priority indicators.
- `/collaboration`: Asynchronous peer discussions.
- `/github`: Repository sync and pull request tracking.
- `/open-source`: Discovery and bounties.
- `/industry`: Industry intelligence and stack insights.
- `/growth`: Developer career analytics and metrics.
- `/ai-mentor`: Autonomous architectural advice.
- `/reports`: Exportable engineering telemetry reports.
- `/settings`: Platform preferences and workspace configurations.
- `/login` & `/signup`: Auth shell with Fireflies.ai layout and Google/Outlook SSO buttons.

## Testing & Automation
All interactive components and containers have `data-testid` attributes.
