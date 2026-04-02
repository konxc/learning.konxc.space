---
inclusion: always
---

# Coding Patterns — Naik Kelas 2.0

Panduan pattern kode yang wajib diikuti. Ini adalah aturan teknis yang sering dilanggar.

## Database Queries

### WAJIB: Explicit Joins (BUKAN relational queries)

```typescript
// ✅ BENAR — explicit join
const courses = await db
	.select({ id: schema.course.id, title: schema.course.title })
	.from(schema.course)
	.innerJoin(schema.organization, eq(schema.course.orgId, schema.organization.id))
	.where(eq(schema.course.orgId, orgId));

// ❌ SALAH — db.query.* dengan with: tidak ada relations.ts
const courses = await db.query.course.findMany({
	with: { organization: true }
});
```

### WAJIB: Filter orgId untuk data tenant

```typescript
// ✅ BENAR — selalu filter by orgId dalam org context
const courses = await db.select().from(schema.course).where(eq(schema.course.orgId, orgId));

// ❌ SALAH — bisa bocor data antar tenant
const courses = await db.select().from(schema.course);
```

## Role Checks

### Platform-level (user.role)

```typescript
// ✅ BENAR
if (user.role !== 'admin') throw redirect(302, '/app');
if (user.role !== 'bd') throw redirect(302, '/app');

// ❌ SALAH — mentor/facilitator bukan platform role
if (user.role !== 'mentor') throw redirect(302, '/app');
```

### Org-level (organization_member.role)

```typescript
// ✅ BENAR — gunakan requireOrgMembership dari org-context.ts
import { requireOrgMembership } from '$lib/server/org-context';
const membership = await requireOrgMembership(user.id, orgId, 'mentor');

// ✅ BENAR — atau gunakan getMembership dari org-utils.ts
import { getMembership } from '$lib/server/org-utils';
const membership = await getMembership(user.id, orgId);
if (!['mentor', 'admin', 'owner'].includes(membership.role)) throw redirect(302, '/app');

// ❌ SALAH — mentor tidak ada di user.role
if (user.role !== 'mentor') throw redirect(302, '/app');
```

### Query facilitator untuk dropdown

```typescript
// ✅ BENAR — facilitator adalah org-level role
const facilitators = await db
	.select({ userId: schema.organizationMember.userId, fullName: schema.user.fullName })
	.from(schema.organizationMember)
	.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
	.where(
		and(
			eq(schema.organizationMember.orgId, orgId),
			eq(schema.organizationMember.role, 'facilitator')
		)
	);

// ❌ SALAH — tidak ada user dengan role facilitator
const facilitators = await db.select().from(schema.user).where(eq(schema.user.role, 'facilitator'));
```

## Auth & Redirect

```typescript
// ✅ BENAR — auth route adalah /auth/signin
if (!event.locals.user) throw redirect(302, '/auth/signin');

// ❌ SALAH
if (!event.locals.user) throw redirect(302, '/login');
```

## Course Visibility

```typescript
// Nilai valid untuk course.visibility:
// 'public'      — siapapun bisa beli di marketplace
// 'internal'    — hanya member org (via enrollment org)
// 'draft'       — hanya mentor/admin org
// 'invite_only' — hanya yang punya link khusus

// ❌ SALAH — 'preview' dan 'published' bukan nilai valid
course.visibility = 'published'; // SALAH
```

## Svelte 5 Runes

```svelte
<!-- ✅ BENAR -->
<script lang="ts">
  interface Props { title: string; count?: number; }
  const { title, count = 0 }: Props = $props();
  let value = $state('');
  const doubled = $derived(count * 2);
</script>

<!-- ❌ SALAH -->
<script lang="ts">
  export let title: string; // export let = Svelte 4
</script>
```

## Design Tokens

```typescript
// ✅ BENAR
import { COLOR, TEXT, RADIUS, ELEVATION } from '$lib/config/design';
// class={`${COLOR.card} ${RADIUS.card}`}

// ❌ SALAH — hardcode
// class="bg-white rounded-lg shadow-md text-gray-900"
```
