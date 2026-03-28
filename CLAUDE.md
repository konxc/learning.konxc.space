# CLAUDE.md — AI Agent Context for Naik Kelas 2.0

> This file provides context for Claude and other LLM-based coding assistants working on this codebase.

## Project Identity

**Naik Kelas 2.0** is a production LMS (Learning Management System) built with SvelteKit for **Koneksi**, an Indonesian digital education company. It serves learners, mentors, admins, and facilitators through a multi-tenant, cohort-based learning platform.

- **Language**: The codebase is in English. UI strings are in **Indonesian (Bahasa Indonesia)**. The developer (user) communicates in Indonesian.
- **Package name**: `learning.konxc.space`

## Tech Stack (Exact Versions Matter)

| Technology | Version | Notes |
|-----------|---------|-------|
| Svelte | **5.x** | Uses **Runes** (`$props()`, `$state()`, `$derived()`, `$effect()`) — NOT legacy `export let` |
| SvelteKit | **2.x** | File-based routing, SSR with `adapter-node` |
| Tailwind CSS | **4.x** | CSS-first configuration (no `tailwind.config.js`). Uses `@theme` in `app.css` |
| Drizzle ORM | **0.44.x** | SQLite dialect via Turso. Schema in `src/lib/server/db/schema.ts` |
| TypeScript | **5.9.x** | Strict mode. Use `lang="ts"` in all script blocks |

### Critical Svelte 5 Patterns

```svelte
<!-- CORRECT: Svelte 5 Runes -->
<script lang="ts">
  let { data, children }: { data: PageData; children: Snippet } = $props();
  let count = $state(0);
  const doubled = $derived(count * 2);
</script>

<!-- WRONG: Legacy Svelte 4 -->
<script>
  export let data;  // ❌ Never use this
</script>
```

### Critical Tailwind 4 Patterns

```css
/* CORRECT: Tailwind 4 */
.foo { @apply bg-linear-to-r from-blue-600 to-indigo-500; }

/* WRONG: Tailwind 3 */
.foo { @apply bg-gradient-to-r from-blue-600 to-indigo-500; }  /* ❌ deprecated */
```

## Architecture Overview

### Route Groups

| Group | Purpose | Auth Required |
|-------|---------|---------------|
| `(public)` | Landing pages, marketplace, docs | No |
| `(auth)` | Login, registration, waiting list | No |
| `(dashboard)` | All dashboard pages under `/app/*` | Yes (Lucia session) |
| `(prototype)` | Legacy prototype pages for reference | No |
| `api/` | REST endpoints (payments, webhooks, notes) | Varies |

### RBAC System

The core RBAC logic is in `src/lib/server/rbac.ts`. It defines navigation items and permissions per role:

- **admin** — Full system access. Can manage users, courses, coupons, partners, payments, reports.
- **mentor** — Can manage assigned courses, grade submissions, broadcast messages, track student progress.
- **learner** (default) — Can browse courses, enroll, submit work, view progress.
- **facilitator** — Can monitor cohorts and support students.

Role switching is handled via `/app/switch-role` and persisted in the user session.

### Multi-Tenancy Model

```
Organization → OrganizationMember (role: owner/admin/member)
     ↓
Workspace → WorkspaceMember
     ↓
PluginRegistry → CoursePlugin (feature toggles per workspace)
```

### Design System

All design tokens are centralized in `src/lib/config/design.ts`:

- `COLOR` — Background, text, accent, status colors with dark mode variants
- `GRADIENT` — Brand gradients
- `RADIUS` — Border radius tokens (`card`, `button`, `input`, `badge`, `small`)
- `ELEVATION` — Layered shadow system with hover states
- `SPACING` — Page, section, card padding tokens
- `TEXT` — Typography scale (h1–h4, body, muted, small, button)
- `TRANSITION` — Timing curves including `spring` for physics-based motion

**Never hardcode colors or shadows.** Always import from `$lib/config/design`.

### Navigation Shell

The dashboard uses a fixed sidebar + sticky header layout:

- `AppShell.svelte` — Root layout with sidebar + header + page transitions
- `Sidebar.svelte` — Fixed navigation with collapsible state + workspace switcher
- `DashboardHeader.svelte` — Glassmorphic header: Toggle → Breadcrumb → Search → Notifications → ProfileMenu
- `CommandPalette.svelte` — `Ctrl+K` global search overlay

### Database (44 Tables)

Schema is in `src/lib/server/db/schema.ts`. Key entity groups:

- **Auth**: `user`, `session`
- **LMS Core**: `course`, `enrollment`, `module`, `lesson`, `material`, `quiz`, `quizQuestion`, `quizChoice`
- **Progress**: `lessonProgress`, `lessonNote`, `submission`, `submissionGrade`, `checkpoint`, `checkpointSubmission`
- **Commerce**: `transaction`, `paymentProof`, `coupon`, `couponUsage`, `affiliateSale`, `affiliateLink`
- **Multi-tenant**: `organization`, `organizationMember`, `organizationInvitation`, `workspace`, `workspaceMember`, `pluginRegistry`, `coursePlugin`
- **Social**: `discussion`, `notification`, `broadcastMessage`, `courseReview`
- **Gamification**: `certificate`, `badge`, `userBadge`, `userXP`

## Coding Conventions

### File Naming
- Components: `PascalCase.svelte` (e.g., `DashboardHeader.svelte`)
- Routes: `kebab-case` directories (e.g., `my-courses/+page.svelte`)
- Server code: `camelCase.ts` (e.g., `rbac.ts`)

### Component Organization
- Reusable UI primitives → `src/lib/components/ui/`
- Layout shells → `src/lib/components/layouts/`
- Feature components → `src/lib/components/app/`
- Admin-specific → `src/lib/components/admin/`
- Landing page sections → `src/lib/sections/`

### Server-Side Patterns
- All DB queries go through Drizzle ORM typed queries
- Auth checks use `event.locals.user` and `event.locals.session` (set in `hooks.server.ts`)
- Form actions use SvelteKit's `+page.server.ts` pattern with `enhance`

### Validation Commands (Run After Every Change)

```bash
pnpm run check    # TypeScript + Svelte type checking (MUST pass with 0 errors)
pnpm run build    # Full production build (MUST succeed)
```

## Common Pitfalls

1. **Don't use `export let`** — This is Svelte 4. Use `$props()` with typed destructuring.
2. **Don't use `bg-gradient-to-*`** — Tailwind 4 uses `bg-linear-to-*`.
3. **Don't import from `$lib/server/` in client code** — Server modules cannot be imported in `.svelte` files.
4. **Always close HTML elements explicitly** — Svelte 5 warns on implicitly closed elements.
5. **Use `$lib/config/design` tokens** — Don't hardcode `shadow-lg` or `rounded-xl`. Use `ELEVATION.card` and `RADIUS.card`.
6. **The sidebar is `position: fixed`** — The header and main content must account for sidebar width via `pl-16`/`pl-64` and `ml-16`/`ml-64`.

## Environment Variables

```env
DATABASE_URL="file:local.db"             # Local dev (or Turso URL for production)
DATABASE_AUTH_TOKEN=""                    # Turso auth token (production only)
MIDTRANS_SERVER_KEY=""                   # Payment gateway
MIDTRANS_CLIENT_KEY=""
MIDTRANS_IS_PRODUCTION="false"
```
