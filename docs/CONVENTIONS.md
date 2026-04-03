# Naik Kelas Platform Conventions

> Comprehensive guidelines for AI agents working on Naik Kelas 2.0 platform
> Last Updated: April 3, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Role System Architecture](#3-role-system-architecture)
4. [Route Structure](#4-route-structure)
5. [Database Conventions](#5-database-conventions)
6. [Design System](#6-design-system)
7. [RBAC & Permissions](#7-rbac--permissions)
8. [Code Conventions](#8-code-conventions)
9. [Common Patterns](#9-common-patterns)
10. [What NOT to Do](#10-what-not-to-do)
11. [File Reference](#11-file-reference)

---

## 1. Project Overview

### Platform Type
**Multi-tenant LMS (Learning Management System)** - Platform that allows organizations to create and manage their own courses, students, and learning content.

### Business Model
- **Platform**: Naik Kelas manages infrastructure and business operations
- **Organizations (Tenants)**: Independent orgs with their own courses, mentors, and students
- **Users**: Learners who can be in multiple orgs with different roles

### Project Location
```
/home/dev/web/instances/clients/services/naikkelas.id
```

---

## 2. Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | SvelteKit 2 + Svelte 5 Runes |
| Language | TypeScript |
| Database | Neon PostgreSQL (via Drizzle ORM) |
| Auth | Lucia v3 (session-based) |
| Styling | Tailwind CSS 4 (design tokens) |
| i18n | Paraglide (Indonesian, English, Japanese) |
| Package Manager | pnpm |
| Adapter | @sveltejs/adapter-node |

### Commands
```bash
# Type check (MUST run after every change)
pnpm run check

# Build for production
pnpm run build

# Database push to Neon
pnpm run db:push

# Seed remote database
pnpm run db:seed:remote
```

---

## 3. Role System Architecture

### CRITICAL: Two-Layer Role System

The platform uses **two separate role systems** that must NEVER be confused:

#### Layer 1: Platform Roles (user.role)

Location: `user` table in database  
Values: **ONLY 3 values allowed**
```typescript
// CORRECT - Only these 3 values
PLATFORM_ROLES = ['admin', 'bd', 'user'] as const
type UserRole = 'admin' | 'bd' | 'user'

// WRONG - These are NOT platform roles
// ❌ 'mentor' - NOT a platform role
// ❌ 'facilitator' - NOT a platform role
```

| Platform Role | Description | Dashboard |
|---------------|-------------|-----------|
| `admin` | Platform operations team | `/app/admin/*` |
| `bd` | Business Development / CRM | `/app/crm/*` |
| `user` | Everyone else (including mentors!) | `/app/overview` |

#### Layer 2: Organization Roles (organization_member.role)

Location: `organization_member` table in database  
Values: **5 values allowed**
```typescript
ORG_ROLES = ['owner', 'admin', 'mentor', 'facilitator', 'member'] as const
type OrgRole = 'owner' | 'admin' | 'mentor' | 'facilitator' | 'member'
```

| Org Role | Description | Access |
|----------|-------------|--------|
| `owner` | Org founder, billing, can delete org | Full |
| `admin` | Manage members, invites, settings | Management |
| `mentor` | Create courses, grade submissions | Course builder |
| `facilitator` | Monitor cohorts, review checkpoints | Cohort monitor |
| `member` | Student in org | Learning only |

### Key Rule

> **A mentor does NOT have `user.role = 'mentor'`.** They have:
> - `user.role = 'user'` (platform level)
> - `organization_member.role = 'mentor'` (org level)

This allows one person to be a mentor in Org A and a student in Org B.

---

## 4. Route Structure

### Route Groups

All routes are organized into groups with specific layouts:

```
src/routes/
├── (auth)/              # Auth pages - NO custom layout (uses root)
│   ├── auth/
│   │   ├── signin/
│   │   ├── signup/
│   │   └── signout/
│   └── waiting-list/
│
├── (dashboard)/         # Protected app - AppShell layout
│   ├── app/
│   │   ├── overview/    # Dashboard entry
│   │   ├── admin/        # Platform admin routes
│   │   ├── crm/          # Platform BD routes
│   │   ├── explore/      # Marketplace
│   │   ├── learning/     # User learning
│   │   ├── organizations/
│   │   │   └── [id]/    # Org context (REQUIRED for org features)
│   │   │       ├── mentor/        # ✅ CORRECT: org-scoped
│   │   │       ├── facilitator/    # ✅ CORRECT: org-scoped
│   │   │       ├── members/
│   │   │       ├── billing/
│   │   │       └── settings/
│   │   ├── settings/     # User settings
│   │   └── payments/    # User payments
│   └── +layout.svelte   # AppShell layout
│
├── (public)/            # Public pages - PublicShell layout
│   ├── marketplace/
│   ├── docs/
│   ├── jobs/
│   └── +layout.svelte  # PublicShell layout
│
├── (prototype)/        # Dev testing - Custom layout (KEPT)
├── onboarding/         # Onboarding flow - Custom layout
├── org/                 # Public org pages - Root layout
│   ├── invite/
│   └── [slug]/
├── login/               # ✅ Alias for /auth/signin (conventional)
├── register/           # ✅ Alias for /auth/signup (conventional)
├── health/             # Health check endpoint
└── +layout.svelte      # Root layout (Google Analytics, Toaster)
```

### Org-Scoped Routes (MANDATORY for org features)

When building features that belong to an organization, you **MUST** use org-scoped paths:

```typescript
// ✅ CORRECT - Org-scoped paths
/app/organizations/{orgId}/mentor/courses
/app/organizations/{orgId}/mentor/students
/app/organizations/{orgId}/mentor/grading
/app/organizations/{orgId}/facilitator/cohorts
/app/organizations/{orgId}/members

// ❌ WRONG - Legacy flat paths (deprecated, will redirect)
/app/mentor/courses
/app/mentor/students
/app/facilitator/cohorts
```

### Route Naming Conventions

| Pattern | Usage | Example |
|---------|-------|---------|
| `[id]/` | Single resource by ID | `organizations/[id]/` |
| `[courseId]/` | Explicit naming for clarity | `explore/[courseId]/learn/` |
| `+page.svelte` | Page component | |
| `+page.server.ts` | Server loader + actions | |
| `+page.ts` | Client loader | |
| `+layout.server.ts` | Group-level data loading | |
| `+layout.svelte` | Group-level layout | |

---

## 5. Database Conventions

### Database Provider
**Neon PostgreSQL** (NOT SQLite)

### Schema Location
`src/lib/server/db/schema.ts`

### Key Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user` | Platform users | `id`, `username`, `role` (admin/bd/user) |
| `organization` | Tenants | `id`, `slug`, `name`, `plan_type` |
| `organization_member` | Org roles | `user_id`, `org_id`, `role` (owner/admin/mentor/facilitator/member) |
| `course` | Courses | `id`, `org_id`, `title`, `visibility` |
| `enrollment` | User enrollments | `user_id`, `course_id`, `org_id`, `status` |
| `cohort` | Batch groups | `course_id`, `facilitator_id` |

### Multi-Tenant Isolation Rule

**EVERY query touching org data MUST filter by orgId:**

```typescript
// ✅ CORRECT - Always filter by orgId
const courses = await db
  .select()
  .from(course)
  .where(eq(course.orgId, orgId));

// ❌ WRONG - No org filter (data leak!)
const courses = await db.select().from(course);
```

### Adding New Tables

1. Add to `src/lib/server/db/schema.ts` using Drizzle syntax
2. Run `pnpm run db:push` to sync to Neon
3. Update seed files if needed

### Migrations

- Use `scripts/migrations/` for SQL migrations
- Use `scripts/migrate-*.ts` for JS/TS migration scripts

---

## 6. Design System

### Design Tokens

**ALWAYS import from `$lib/config/design`:**

```typescript
import { COLOR, TEXT, RADIUS, ELEVATION, TRANSITION, SPACING, GRADIENT } from '$lib/config/design';
```

### Token Categories

| Token | Usage |
|-------|-------|
| `COLOR.bg` | Background color |
| `COLOR.textPrimary` | Main text |
| `COLOR.textSecondary` | Secondary text |
| `COLOR.card` | Card background |
| `COLOR.cardBorder` | Card border |
| `COLOR.accentBg` | Primary button bg |
| `TEXT.h1` - `TEXT.caption` | Typography sizes |
| `RADIUS.card` - `RADIUS.small` | Border radius |
| `ELEVATION.card` - `ELEVATION.base` | Shadow depth |
| `SPACING.page` - `SPACING.section` | Spacing scale |

### Usage Examples

```svelte
<!-- Card component -->
<div class="{COLOR.card} {COLOR.cardBorder} {RADIUS.card} {ELEVATION.card}">
  ...
</div>

<!-- Button component -->
<button class="{COLOR.accentBg} {COLOR.accentHover} {RADIUS.button} {TEXT.button}">
  Click Me
</button>

<!-- Page wrapper -->
<div class="{SPACING.page} {SPACING.section}">
  ...
</div>
```

### Tailwind CSS 4 Note

- Use `linear-gradient()` NOT `bg-gradient-to-*`
- Use Tailwind v4 syntax

---

## 7. RBAC & Permissions

### Platform-Level Checks

Location: `src/lib/server/rbac.ts`

```typescript
import { isPlatformAdmin, isBD } from '$lib/server/rbac';

// Example in loader
export const load = async (event) => {
  if (!event.locals.user) throw redirect(302, '/auth/signin');
  
  if (!isPlatformAdmin(event.locals.user)) {
    throw error(403, 'Platform admin access required');
  }
};
```

### Org-Level Checks

Location: `src/lib/server/org-context.ts`

```typescript
import { requireOrgMembership } from '$lib/server/org-context';

// Example in loader - requires owner, admin, or mentor role
export const load = async (event) => {
  const membership = await requireOrgMembership(
    event.locals.user.id,
    params.id,
    'mentor'  // minimum role required
  );
  
  // Now you have membership.orgId and membership.role
};
```

### Navigation Items

Generated in `src/lib/server/rbac.ts`:
- `getPlatformNavItems(role)` - For platform admin/BD
- `getOrgNavItems(orgRole, context)` - For org members

---

## 8. Code Conventions

### Svelte 5 Runes (MANDATORY)

```svelte
<script lang="ts">
  // ✅ CORRECT - Svelte 5 syntax
  let { data, title = 'Default' }: { data: any; title?: string } = $props();
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  function increment() {
    count += 1;
  }
</script>

<!-- ❌ WRONG - Legacy Svelte 4 syntax -->
<script>
  export let data;
  export let title = 'Default';
</script>
```

### Component Props

Always use explicit TypeScript interfaces:

```typescript
interface Props {
  userId: string;
  courseId?: string;
  onSubmit?: (data: any) => void;
}

let { userId, courseId, onSubmit }: Props = $props();
```

### Server-Client Separation

```typescript
// ✅ CORRECT - Server-only imports in .server.ts or <script context="module">
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

// ❌ WRONG - Server import in client .svelte
<script>
  import { db } from '$lib/server/db'; // Will fail!
</script>
```

---

## 9. Common Patterns

### Creating a New Dashboard Page

1. **Determine location**: Is it platform-level or org-level?
   - Platform: `/app/admin/*`, `/app/crm/*`
   - Org: `/app/organizations/[id]/mentor/*`, etc.

2. **Create route**:
   ```
   src/routes/(dashboard)/app/organizations/[id]/mentor/courses/+page.svelte
   src/routes/(dashboard)/app/organizations/[id]/mentor/courses/+page.server.ts
   ```

3. **Add server loader**:
   ```typescript
   import { requireOrgMembership } from '$lib/server/org-context';
   
   export const load = async ({ params, locals }) => {
     const membership = await requireOrgMembership(locals.user.id, params.id, 'mentor');
     return { orgId: params.id, membership };
   };
   ```

4. **Register in RBAC** (if needed):
   Add to `getOrgNavItems()` in `rbac.ts`

5. **Run type check**:
   ```bash
   pnpm run check
   ```

### Creating a New API Endpoint

1. **Location**: `src/routes/api/`

2. **Format**:
   ```
   src/routes/api/endpoint-name/+server.ts
   ```

3. **Example**:
   ```typescript
   import { json } from '@sveltejs/kit';
   
   export const GET = async ({ locals }) => {
     if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
     // ... logic
     return json({ data: ... });
   };
   ```

### Using Parent Data

```typescript
// +page.server.ts
export const load = async (event) => {
  const { membership, organization } = await event.parent();
  return { ... };
};

// +page.svelte
<script lang="ts">
  let { data } = $props();
  // data.membership, data.organization available
</script>
```

---

## 10. What NOT to Do

| ❌ Never Do | ✅ Instead |
|------------|-----------|
| Use `export let` | Use `$props()` |
| Hardcode colors | Use design tokens |
| Add mentor/facilitator to platform roles | Use org_member table |
| Skip `pnpm run check` | Always pass before commit |
| Query org data without orgId filter | Always filter by orgId |
| Use SQLite | Use Neon PostgreSQL |
| Import server code in .svelte | Keep server/client separate |
| Use `bg-gradient-to-*` | Use `linear-gradient()` |

---

## 11. File Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/server/rbac.ts` | Navigation & permissions |
| `src/lib/constants/roles.ts` | Role type definitions |
| `src/lib/server/db/schema.ts` | Database schema |
| `src/lib/config/design.ts` | Design tokens |
| `src/routes/(dashboard)/+layout.server.ts` | Auth & nav loading |
| `src/routes/(dashboard)/app/organizations/[id]/+layout.server.ts` | Org context loader |
| `src/lib/server/org-context.ts` | Org permission helpers |
| `src/lib/server/middleware.ts` | Auth middleware |
| `drizzle.config.ts` | Database config |
| `AGENTS.md` | Agent-specific guidelines |

---

## Summary

When working on Naik Kelas platform:

1. **Understand the two-layer role system** - Platform vs Organization roles are SEPARATE
2. **Use org-scoped routes** - `/app/organizations/[id]/mentor/*` not `/app/mentor/*`
3. **Filter all org queries by orgId** - Never leak data between tenants
4. **Use design tokens** - Never hardcode colors
5. **Use Svelte 5 Runes** - Never use legacy `export let`
6. **Run type check** - Always pass `pnpm run check` before commit

---

*This document is the source of truth for AI agents working on the Naik Kelas platform. Update this file when new patterns or conventions are established.*