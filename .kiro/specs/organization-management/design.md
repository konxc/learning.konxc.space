# Design Document: Organization Management

## Overview

Dokumen ini mendeskripsikan desain teknis untuk fitur Organization Management di platform Naik Kelas 2.0. Fitur ini mencakup onboarding wizard, member management, invitation acceptance flow, org settings, analytics, dan workspace switcher.

Arsitektur mengikuti pola multi-tenant yang sudah ada: setiap org adalah silo data yang terisolasi, akses dikontrol via `hasOrgPermission()` dari `src/lib/server/rbac.ts`, dan `user.role` hanya dipakai untuk platform-level checks.

---

## Architecture

### Data Flow

```
Browser Request
    │
    ▼
(dashboard)/+layout.server.ts
    │  Loads: user, orgMemberships, activeOrg, effectiveRole, navItems
    ▼
Organization Route (+page.server.ts)
    │  Auth: requireAuth(event)
    │  Membership: query organizationMember WHERE orgId = params.id AND userId = user.id
    │  Permission: hasOrgPermission(membership.role, 'permission:name')
    ▼
Drizzle Query (always filtered by orgId)
    │
    ▼
Neon PostgreSQL
```

### Route Map

```
src/routes/
├── (dashboard)/app/organizations/
│   ├── +page.svelte                    # List orgs + pending invitations
│   ├── +page.server.ts                 # Load memberships, counts, invitations
│   ├── new/
│   │   ├── +page.svelte                # 3-step onboarding wizard
│   │   └── +page.server.ts             # action: create
│   └── [id]/
│       ├── +page.svelte                # Org overview dashboard
│       ├── +page.server.ts             # Load org + analytics summary
│       ├── members/
│       │   ├── +page.svelte            # Member table + pending invitations
│       │   └── +page.server.ts         # actions: changeRole, removeMember, cancelInvite
│       ├── invite/
│       │   ├── +page.svelte            # Invite form + pending invitations list
│       │   └── +page.server.ts         # action: sendInvite
│       ├── analytics/
│       │   ├── +page.svelte            # Analytics dashboard
│       │   └── +page.server.ts         # Load enrollment, activity, completion data
│       └── settings/
│           ├── +page.svelte            # Org settings form
│           └── +page.server.ts         # actions: updateSettings, updateLogo
└── org/
    └── invite/
        ├── +page.svelte                # Accept invitation UI
        └── +page.server.ts             # load: validate token, action: accept
```

---

## Component Design

### 1. Onboarding Wizard (`organizations/new/+page.svelte`)

Multi-step form menggunakan `$state` untuk step tracking. Tidak ada navigasi antar halaman — semua dalam satu page.

```typescript
// State shape
let step = $state(1); // 1 | 2 | 3
let formData = $state({
	name: '',
	description: '',
	logoBase64: '',
	inviteEmails: [] as string[],
	inviteRole: 'member' as OrgRole
});
let slugPreview = $derived(() => generateSlug(formData.name));
```

**Step 1 — Basic Info:**

- Input: nama org, deskripsi (opsional), logo upload
- Logo: `<input type="file" accept="image/*">` → FileReader → base64, validasi max 500KB client-side
- Slug preview: auto-generate dari nama, tampilkan sebagai read-only hint

**Step 2 — Invite Members:**

- Email input dengan "Add" button → push ke `inviteEmails[]`
- Role selector per email (default: `member`)
- Bisa skip (inviteEmails kosong)

**Step 3 — Confirmation:**

- Summary: nama, slug, jumlah invite
- Submit button → POST ke server action `create`

**Server action `create`:**

```typescript
// src/routes/(dashboard)/app/organizations/new/+page.server.ts
export const actions: Actions = {
  create: async (event) => {
    const user = await requireAuth(event);
    const formData = await event.request.formData();

    // 1. Validate & generate unique slug
    const name = formData.get('name') as string;
    const slug = await generateUniqueSlug(name);

    // 2. Create org
    const orgId = generateId();
    await db.insert(schema.organization).values({ id: orgId, name, slug, ... });

    // 3. Add creator as owner
    await db.insert(schema.organizationMember).values({
      id: generateId(), orgId, userId: user.id, role: 'owner'
    });

    // 4. Process invitations (if any)
    const inviteEmails = JSON.parse(formData.get('inviteEmails') as string) as string[];
    for (const email of inviteEmails) {
      await createInvitation(orgId, email, inviteRole, user.id);
    }

    throw redirect(303, `/app/organizations/${orgId}`);
  }
};
```

**Slug generation helper:**

```typescript
// src/lib/server/org-utils.ts
export async function generateUniqueSlug(name: string): Promise<string> {
	const base = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	let slug = base;
	let counter = 1;
	while (true) {
		const existing = await db
			.select()
			.from(schema.organization)
			.where(eq(schema.organization.slug, slug))
			.limit(1);
		if (!existing.length) return slug;
		slug = `${base}-${counter++}`;
	}
}
```

---

### 2. Member Management (`organizations/[id]/members/`)

**Load:**

```typescript
export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;

	// Auth: must be member
	const membership = await getMembership(user.id, orgId); // throws redirect if not found
	// Permission: must have member:read
	if (!hasOrgPermission(membership.role, 'member:read'))
		throw redirect(303, `/app/organizations/${orgId}`);

	const [members, pendingInvitations] = await Promise.all([
		db
			.select({ ...memberFields, user: userFields })
			.from(schema.organizationMember)
			.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
			.where(eq(schema.organizationMember.orgId, orgId)),
		db
			.select()
			.from(schema.organizationInvitation)
			.where(
				and(
					eq(schema.organizationInvitation.orgId, orgId),
					isNull(schema.organizationInvitation.acceptedAt)
				)
			)
	]);

	return { org, membership, members, pendingInvitations };
};
```

**Actions:**

```typescript
export const actions: Actions = {
	changeRole: async (event) => {
		const user = await requireAuth(event);
		const orgId = event.params.id;
		const membership = await getMembership(user.id, orgId);
		if (!hasOrgPermission(membership.role, 'member:update'))
			return actionFailure(403, 'Unauthorized');

		const targetUserId = formData.get('userId') as string;
		const newRole = formData.get('role') as string;
		if (!ORG_ROLES.includes(newRole as OrgRole)) return actionFailure(400, 'Invalid role');

		await db
			.update(schema.organizationMember)
			.set({ role: newRole })
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					eq(schema.organizationMember.userId, targetUserId)
				)
			);
		return actionSuccess('Role updated');
	},

	removeMember: async (event) => {
		// Similar pattern: auth → permission check (member:delete) → delete record
	},

	cancelInvite: async (event) => {
		// auth → permission check (member:create) → delete organizationInvitation record
	}
};
```

**UI — Member Table:**

```svelte
<!-- Role selector inline — only shown if user has member:update permission -->
{#if hasOrgPermission(membership.role, 'member:update')}
	<form method="POST" action="?/changeRole" use:enhance>
		<input type="hidden" name="userId" value={member.user.id} />
		<select name="role" onchange={(e) => e.currentTarget.form?.requestSubmit()}>
			{#each ORG_ROLES as role}
				<option value={role} selected={role === member.role}>{ROLE_ALIASES[role]}</option>
			{/each}
		</select>
	</form>
{:else}
	<span>{ROLE_ALIASES[member.role]}</span>
{/if}
```

---

### 3. Invitation System

**Send Invite (`organizations/[id]/invite/+page.server.ts`):**

```typescript
sendInvite: async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;
	const membership = await getMembership(user.id, orgId);
	if (!hasOrgPermission(membership.role, 'member:create'))
		return actionFailure(403, 'Unauthorized');

	const email = formData.get('email') as string;
	const role = formData.get('role') as string;

	// Check for existing active invitation
	const existing = await db
		.select()
		.from(schema.organizationInvitation)
		.where(
			and(
				eq(schema.organizationInvitation.orgId, orgId),
				eq(schema.organizationInvitation.email, email),
				isNull(schema.organizationInvitation.acceptedAt)
			)
		)
		.limit(1);
	if (existing.length) return actionFailure(409, 'Invitation already pending for this email');

	// Generate token (base32, 32 bytes)
	const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
	const token = encodeBase32LowerCase(tokenBytes);
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

	await db.insert(schema.organizationInvitation).values({
		id: generateId(),
		orgId,
		email,
		role,
		token,
		invitedBy: user.id,
		expiresAt
	});

	// In-app notification if user exists
	const invitedUser = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.email, email))
		.limit(1);
	if (invitedUser.length) {
		await createNotification(invitedUser[0].id, 'org_invitation', {
			orgId,
			orgName: org.name,
			token,
			inviteLink: `/org/invite?token=${token}`
		});
	}

	return actionSuccess('Invitation sent');
};
```

**Accept Invite (`src/routes/org/invite/+page.server.ts`):**

```typescript
export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token');
	if (!token) throw redirect(303, '/app');

	// Validate token
	const invitation = await db
		.select()
		.from(schema.organizationInvitation)
		.where(eq(schema.organizationInvitation.token, token))
		.limit(1);

	if (!invitation.length) return { error: 'invalid_token' };
	if (invitation[0].acceptedAt) return { error: 'already_used' };
	if (invitation[0].expiresAt < new Date()) return { error: 'expired' };

	// Unauthenticated → redirect to login with token preserved
	if (!event.locals.user) {
		throw redirect(303, `/auth/signin?redirect=/org/invite?token=${token}`);
	}

	const org = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.id, invitation[0].orgId))
		.limit(1);

	return { invitation: invitation[0], org: org[0] };
};

export const actions: Actions = {
	accept: async (event) => {
		const user = await requireAuth(event);
		const token = event.url.searchParams.get('token');

		// Re-validate (idempotency guard)
		const invitation = await db
			.select()
			.from(schema.organizationInvitation)
			.where(eq(schema.organizationInvitation.token, token!))
			.limit(1);
		if (!invitation.length || invitation[0].acceptedAt || invitation[0].expiresAt < new Date()) {
			return actionFailure(400, 'Invalid or expired invitation');
		}

		// Check not already a member
		const existing = await db
			.select()
			.from(schema.organizationMember)
			.where(
				and(
					eq(schema.organizationMember.orgId, invitation[0].orgId),
					eq(schema.organizationMember.userId, user.id)
				)
			)
			.limit(1);
		if (existing.length) {
			// Already a member — just redirect
			throw redirect(303, `/app/organizations/${invitation[0].orgId}`);
		}

		// Create membership + mark invitation accepted (in transaction)
		await db.transaction(async (tx) => {
			await tx.insert(schema.organizationMember).values({
				id: generateId(),
				orgId: invitation[0].orgId,
				userId: user.id,
				role: invitation[0].role
			});
			await tx
				.update(schema.organizationInvitation)
				.set({ acceptedAt: new Date() })
				.where(eq(schema.organizationInvitation.token, token!));
		});

		throw redirect(303, `/app/organizations/${invitation[0].orgId}`);
	}
};
```

---

### 4. Organization Settings (`organizations/[id]/settings/`)

**Actions:**

```typescript
updateSettings: async (event) => {
  const user = await requireAuth(event);
  const orgId = event.params.id;
  const membership = await getMembership(user.id, orgId);
  if (!hasOrgPermission(membership.role, 'org:update')) return actionFailure(403, 'Unauthorized');

  const name = formData.get('name') as string;
  const newSlug = formData.get('slug') as string;

  // Slug conflict check (exclude current org)
  if (newSlug) {
    const conflict = await db.select().from(schema.organization)
      .where(and(eq(schema.organization.slug, newSlug), ne(schema.organization.id, orgId)))
      .limit(1);
    if (conflict.length) return actionFailure(409, 'Slug already taken');
  }

  await db.update(schema.organization)
    .set({ name, slug: newSlug, updatedAt: new Date() })
    .where(eq(schema.organization.id, orgId));

  return actionSuccess('Settings updated');
},

updateLogo: async (event) => {
  // auth → permission check (org:update) → validate base64 size → update logoUrl
}
```

---

### 5. Organization Analytics (`organizations/[id]/analytics/`)

**Load queries (all filtered by orgId):**

```typescript
export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const orgId = event.params.id;
	const membership = await getMembership(user.id, orgId);
	if (!hasOrgPermission(membership.role, 'analytics:view')) {
		throw redirect(303, `/app/organizations/${orgId}`);
	}

	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

	const [enrollmentsByCoure, memberActivity, completionRates] = await Promise.all([
		// Enrollment count per course
		db
			.select({ courseId: schema.enrollment.courseId, count: count() })
			.from(schema.enrollment)
			.innerJoin(schema.course, eq(schema.enrollment.courseId, schema.course.id))
			.where(eq(schema.course.orgId, orgId))
			.groupBy(schema.enrollment.courseId),

		// Active members in last 30 days (via session table)
		db
			.select({ count: countDistinct(schema.session.userId) })
			.from(schema.session)
			.innerJoin(
				schema.organizationMember,
				eq(schema.session.userId, schema.organizationMember.userId)
			)
			.where(
				and(
					eq(schema.organizationMember.orgId, orgId),
					gte(schema.session.expiresAt, thirtyDaysAgo)
				)
			),

		// Completion rate: lessonProgress completed / total lessons per course
		db
			.select({
				courseId: schema.course.id,
				totalLessons: count(schema.lesson.id),
				completedCount: count(schema.lessonProgress.id)
			})
			.from(schema.course)
			.leftJoin(schema.module, eq(schema.module.courseId, schema.course.id))
			.leftJoin(schema.lesson, eq(schema.lesson.moduleId, schema.module.id))
			.leftJoin(
				schema.lessonProgress,
				and(
					eq(schema.lessonProgress.lessonId, schema.lesson.id),
					eq(schema.lessonProgress.isCompleted, true)
				)
			)
			.where(eq(schema.course.orgId, orgId))
			.groupBy(schema.course.id)
	]);

	return { enrollmentsByCourse, memberActivity: memberActivity[0]?.count ?? 0, completionRates };
};
```

**Component `OrgAnalyticsCard.svelte`:**

```
src/lib/components/app/organizations/OrgAnalyticsCard.svelte
```

Props: `{ title: string, value: string | number, subtitle?: string, icon?: string }`

---

### 6. Workspace Switcher

Sudah ada `WorkspaceSwitcher.svelte` dan `WorkspaceDropdown.svelte`. Yang perlu diupdate:

**`WorkspaceDropdown.svelte` — tampilkan org logo:**

```svelte
<!-- Untuk setiap org di workspaces.organizations -->
{#if org.logoUrl}
	<img src={org.logoUrl} alt={org.name} class="h-8 w-8 rounded-lg object-cover" />
{:else}
	<!-- Fallback: initial letter dengan brandColor -->
	<div
		class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
		style="background-color: {org.brandColor ?? '#4f46e5'}"
	>
		{org.name[0].toUpperCase()}
	</div>
{/if}
```

**Visual indicator di sidebar saat di org context:**

- `WorkspaceSwitcher.svelte` sudah menampilkan nama org aktif
- Tambahkan colored dot atau border dengan `brandColor` org saat `activeId !== 'personal'`

---

## Shared Helper: `getMembership()`

Untuk menghindari duplikasi auth check di setiap route, buat helper di `src/lib/server/org-utils.ts`:

```typescript
// src/lib/server/org-utils.ts
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function getMembership(
	userId: string,
	orgId: string,
	fallbackRedirect = '/app/organizations'
) {
	const result = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.userId, userId), eq(schema.organizationMember.orgId, orgId))
		)
		.limit(1);

	if (!result.length) throw redirect(303, fallbackRedirect);
	return result[0];
}

export async function generateUniqueSlug(name: string): Promise<string> {
	const base = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	let slug = base;
	let counter = 1;
	while (true) {
		const existing = await db
			.select({ id: schema.organization.id })
			.from(schema.organization)
			.where(eq(schema.organization.slug, slug))
			.limit(1);
		if (!existing.length) return slug;
		slug = `${base}-${counter++}`;
	}
}
```

---

## Data Models (Existing Schema)

Semua tabel sudah ada di `src/lib/server/db/schema.ts`. Tidak ada perubahan schema yang diperlukan.

```
organization
  id          text PK
  slug        text UNIQUE NOT NULL
  name        text NOT NULL
  logoUrl     text
  brandColor  text DEFAULT '#4f46e5'
  planType    text DEFAULT 'free'
  createdAt   timestamp
  updatedAt   timestamp

organizationMember
  id          text PK
  orgId       text FK → organization.id
  userId      text FK → user.id
  role        text  -- 'owner' | 'admin' | 'mentor' | 'facilitator' | 'member'
  createdAt   timestamp
  updatedAt   timestamp

organizationInvitation
  id          text PK
  orgId       text FK → organization.id
  email       text NOT NULL
  role        text NOT NULL
  token       text UNIQUE NOT NULL
  invitedBy   text FK → user.id
  expiresAt   timestamp NOT NULL
  acceptedAt  timestamp  -- NULL = pending, non-NULL = accepted
  createdAt   timestamp
```

---

## RBAC Permission Matrix (Reference)

| Action           | owner | admin | mentor | facilitator | member |
| ---------------- | :---: | :---: | :----: | :---------: | :----: |
| `org:read`       |  ✅   |  ✅   |   ✅   |     ✅      |   ✅   |
| `org:update`     |  ✅   |  ✅   |        |             |        |
| `org:delete`     |  ✅   |       |        |             |        |
| `member:read`    |  ✅   |  ✅   |   ✅   |     ✅      |   ✅   |
| `member:create`  |  ✅   |  ✅   |        |             |        |
| `member:update`  |  ✅   |  ✅   |        |             |        |
| `member:delete`  |  ✅   |  ✅   |        |             |        |
| `course:create`  |  ✅   |  ✅   |   ✅   |             |        |
| `analytics:view` |  ✅   |  ✅   |   ✅   |     ✅      |        |
| `billing:manage` |  ✅   |       |        |             |        |

Semua permission check menggunakan `hasOrgPermission(membership.role, 'permission:name')` dari `src/lib/server/rbac.ts`.

---

## Error Handling Patterns

Semua server actions menggunakan helper yang sudah ada:

```typescript
import { actionFailure, actionSuccess } from '$lib/server/actions';

// Success
return actionSuccess('Member role updated');

// Failure
return actionFailure(403, 'You do not have permission to perform this action');
return actionFailure(400, 'Invalid role value');
return actionFailure(409, 'Slug already taken');
```

---

## File Checklist

File yang perlu dibuat atau diupdate:

| File                                                                      | Status                                                      |
| ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src/lib/server/org-utils.ts`                                             | 🆕 Buat baru                                                |
| `src/routes/(dashboard)/app/organizations/new/+page.svelte`               | ✏️ Update (wizard)                                          |
| `src/routes/(dashboard)/app/organizations/new/+page.server.ts`            | ✏️ Update (action: create)                                  |
| `src/routes/(dashboard)/app/organizations/[id]/members/+page.svelte`      | ✏️ Update (role selector, pending invites)                  |
| `src/routes/(dashboard)/app/organizations/[id]/members/+page.server.ts`   | ✏️ Update (actions: changeRole, removeMember, cancelInvite) |
| `src/routes/(dashboard)/app/organizations/[id]/invite/+page.server.ts`    | ✏️ Update (duplicate check, notification)                   |
| `src/routes/(dashboard)/app/organizations/[id]/analytics/+page.server.ts` | ✏️ Update (full analytics queries)                          |
| `src/routes/(dashboard)/app/organizations/[id]/analytics/+page.svelte`    | ✏️ Update (analytics UI)                                    |
| `src/routes/(dashboard)/app/organizations/[id]/settings/+page.server.ts`  | ✏️ Update (actions: updateSettings, updateLogo)             |
| `src/routes/org/invite/+page.svelte`                                      | 🆕 Buat baru                                                |
| `src/routes/org/invite/+page.server.ts`                                   | 🆕 Buat baru                                                |
| `src/lib/components/app/organizations/OrgAnalyticsCard.svelte`            | 🆕 Buat baru                                                |
| `src/lib/components/layouts/WorkspaceDropdown.svelte`                     | ✏️ Update (org logo)                                        |
