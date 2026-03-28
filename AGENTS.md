# AGENTS.md — Multi-Agent Coding Guidelines for Naik Kelas 2.0

> Context file for AI coding agents (Antigravity, Cursor, Copilot, Cline, etc.) working on this repository.

## Quick Reference

| Item | Value |
|------|-------|
| **Framework** | SvelteKit 2 + Svelte 5 Runes |
| **Styling** | Tailwind CSS 4 (CSS-first, no config file) |
| **Database** | Turso (LibSQL) via Drizzle ORM |
| **Auth** | Lucia v3 (session cookies) |
| **Adapter** | `@sveltejs/adapter-node` |
| **Package Manager** | pnpm |
| **Type Check** | `pnpm run check` |
| **Build** | `pnpm run build` |

## Rules of Engagement

### MUST DO

1. **Validate after every code change**: Run `pnpm run check` — must return 0 errors and 0 warnings.
2. **Use Svelte 5 Runes**: `$props()`, `$state()`, `$derived()`, `$effect()`, `$bindable()`.
3. **Use design tokens**: Import from `$lib/config/design` (`COLOR`, `TEXT`, `RADIUS`, `ELEVATION`, `TRANSITION`, `SPACING`, `GRADIENT`).
4. **Type everything**: All component props must have explicit TypeScript interfaces.
5. **Respect RBAC**: Check `src/lib/server/rbac.ts` before adding new routes or navigation items.
6. **Close all HTML elements explicitly**: Svelte 5 warns on implicitly closed tags.

### MUST NOT

1. **Never use `export let`** — This is legacy Svelte 4 syntax.
2. **Never use `bg-gradient-to-*`** — Tailwind 4 uses `bg-linear-to-*`.
3. **Never hardcode colors, shadows, or radii** — Use design tokens.
4. **Never import `$lib/server/*` in client-side `.svelte` files** — Server-only modules.
5. **Never introduce new dependencies** without explicit user instruction.
6. **Never modify business logic or remove security checks** during refactoring.
7. **Never suppress TypeScript errors** with `@ts-ignore` or `any` casts.

## Architecture Map

```
src/
├── hooks.server.ts          # Auth middleware (Lucia session → event.locals)
├── lib/
│   ├── config/design.ts     # 🎨 ALL design tokens (import from here)
│   ├── server/
│   │   ├── db/schema.ts     # 📦 44 Drizzle tables (SQLite)
│   │   ├── rbac.ts          # 🔐 Role-based nav & permissions
│   │   ├── auth.ts          # 🔒 Lucia auth setup
│   │   └── payments/        # 💰 Midtrans integration
│   ├── components/
│   │   ├── layouts/         # Shell: AppShell, Sidebar, DashboardHeader
│   │   ├── app/roles/       # Role-specific dashboards
│   │   └── ui/              # Primitives: Skeleton, etc.
│   ├── stores/              # Svelte stores (theme, toast, metadata)
│   └── plugins/             # Feature toggle system
├── routes/
│   ├── (dashboard)/app/     # 🏠 Protected. 16 route groups.
│   ├── (public)/            # 🌐 Landing, marketplace, docs
│   ├── (auth)/              # 🔑 Login, register, waiting list
│   └── api/                 # 📡 REST: payments, webhooks, notes
```

## Design System Cheat Sheet

```ts
import { COLOR, TEXT, RADIUS, ELEVATION, TRANSITION, SPACING, GRADIENT } from '$lib/config/design';

// Cards
class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card} ${ELEVATION.cardHover}`}

// Buttons
class={`${COLOR.accentBg} ${COLOR.accentHover} ${RADIUS.button} ${TEXT.button} ${SPACING.button}`}

// Headings
class={`${TEXT.h1} ${COLOR.textPrimary}`}

// Page wrappers
class={`${SPACING.page} ${SPACING.section}`}

// Transitions
class={`${TRANSITION.all}`}      // Smooth cubic-bezier
class={`${TRANSITION.spring}`}   // Bouncy spring physics
```

## Layout System

The dashboard uses a **fixed sidebar + sticky header** pattern:

```
┌────────────────────────────────────────────────┐
│ [Toggle] [Breadcrumb]     [Search] [🔔] [👤]  │  ← DashboardHeader (sticky, glassmorphic)
├────────┬───────────────────────────────────────┤
│        │                                       │
│  NAV   │          MAIN CONTENT                 │
│ ITEMS  │    (page transitions: fly + fade)     │
│        │                                       │
│        │                                       │
├────────┤                                       │
│ SELECT │                                       │
│ WKSP   │                                       │
└────────┴───────────────────────────────────────┘
  Sidebar (fixed, collapsible: 64px ↔ 256px)
```

- Header dynamically adjusts `padding-left` based on `sidebarCollapsed` state.
- Main content uses `margin-left` with spring transition.
- Page navigation triggers `{#key $page.url.pathname}` fly/fade transition.

## Database Entities (Key Groups)

| Group | Tables | Notes |
|-------|--------|-------|
| Auth | `user`, `session` | Lucia-managed |
| LMS | `course`, `module`, `lesson`, `material`, `enrollment`, `cohort` | Core learning flow |
| Assessment | `quiz`, `quizQuestion`, `quizChoice`, `submission`, `submissionGrade` | Mentor grading |
| Progress | `lessonProgress`, `lessonNote`, `checkpoint`, `checkpointSubmission` | Student tracking |
| Commerce | `transaction`, `paymentProof`, `coupon`, `couponUsage` | Midtrans + manual |
| Affiliate | `affiliateSale`, `affiliateLink` | Commission tracking |
| Multi-Tenant | `organization`, `organizationMember`, `organizationInvitation`, `workspace`, `workspaceMember` | B2B support |
| Plugins | `pluginRegistry`, `coursePlugin` | Feature toggles |
| Social | `discussion`, `notification`, `broadcastMessage`, `courseReview` | Community |
| Gamification | `certificate`, `badge`, `userBadge`, `userXP` | Engagement |

## Common Tasks

### Adding a New Dashboard Page

1. Create route: `src/routes/(dashboard)/app/your-page/+page.svelte`
2. Create server loader: `+page.server.ts` with auth check (`if (!event.locals.user) redirect(302, '/login')`)
3. Register nav item in `src/lib/server/rbac.ts` under the appropriate role
4. Use design tokens for consistent styling
5. Run `pnpm run check`

### Adding a New Database Table

1. Add table definition to `src/lib/server/db/schema.ts`
2. Add relations if needed in `src/lib/server/db/relations.ts`
3. Run `pnpm run db:push` to apply schema
4. Update seed file if needed: `scripts/seed/`
5. Run `pnpm run check`

### Creating a Reusable Component

1. Create in `src/lib/components/ui/YourComponent.svelte`
2. Use `$props()` with explicit TypeScript interface
3. Import design tokens from `$lib/config/design`
4. Support dark mode via `dark:` variants
5. Add `aria-label` for interactive elements

## Commit Message Convention

```
feat: add new feature
fix: resolve bug  
style: UI/UX changes (no logic change)
refactor: code restructure
docs: documentation updates
chore: tooling, config, dependencies
```

## Testing

```bash
pnpm run check      # Type safety (mandatory)
pnpm run build      # Production build (mandatory)
pnpm run lint       # Code style (recommended)
pnpm run test:e2e   # Playwright E2E tests (when available)
```
