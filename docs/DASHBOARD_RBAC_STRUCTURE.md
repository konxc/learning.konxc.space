# Dashboard RBAC Structure

## Overview

Dashboard dengan role-based access control menggunakan dua lapisan role: **platform-level** (`user.role`) dan **org-level** (`organization_member.role`).

### Role Architecture

**Platform roles** (`user.role`) — hanya 3 nilai:

| Role    | Akses                                        |
| ------- | -------------------------------------------- |
| `admin` | Full platform management                     |
| `bd`    | CRM, waiting list, akuisisi org              |
| `user`  | Default untuk semua orang (termasuk mentor!) |

**Org roles** (`organization_member.role`) — menentukan akses dalam konteks org:

| Role          | Akses                                  |
| ------------- | -------------------------------------- |
| `owner`       | Pemilik org, billing, hapus org        |
| `admin`       | Kelola member, invite, setting org     |
| `mentor`      | Buat & kelola kursus, nilai submission |
| `facilitator` | Dampingi cohort, monitor progress      |
| `member`      | Student dalam org, ikut kursus         |

> `mentor` dan `facilitator` **tidak ada** di `user.role`. Mereka tetap `user` di platform, dengan role org di `organization_member.role`.

## Route Structure

### Base Layout

- `/app` - Dashboard overview
- `(dashboard)/+layout.svelte` - Group layout dengan sidebar navigation
- `(dashboard)/+layout.server.ts` - Auth check & role-based navigation

### User Routes (Platform role: user)

- `/app/explore` - Browse available courses (marketplace)
- `/app/learning/courses` - Enrolled courses
- `/app/organizations` - Lihat & join org
- `/app/affiliate` - Affiliate dashboard

### Org Member Routes (Org role: mentor/facilitator/admin/owner)

- `/app/mentor/courses` - Manage courses (org mentor)
- `/app/mentor/students` - View students
- `/app/facilitator/cohorts` - Manage cohorts (org facilitator)
- `/app/organizations/[id]/members` - Manage org members (org admin/owner)
- `/app/organizations/[id]/billing` - Org billing (org owner)

### Platform Admin Routes (Platform role: admin)

- `/app/admin/courses` - Manage all courses
- `/app/admin/users` - Manage users & platform roles
- `/app/admin/mentor-applications` - Review mentor applications
- `/app/admin/payments` - Payment management
- `/app/admin/payouts` - Payout management
- `/app/crm/waiting-list` - Waiting list (also accessible by `bd`)

## Features per Role

### Platform Admin (`user.role = 'admin'`)

- Full platform management
- User management — update `user.role` (hanya `admin`, `bd`, `user`)
- Mentor application review (approve/reject → creates org + org_member record)
- Coupon, payment, payout management

### BD (`user.role = 'bd'`)

- CRM dashboard
- Waiting list management

### Regular User (`user.role = 'user'`)

- Browse & enroll courses
- Apply to become mentor
- Join/switch organizations

### Org Mentor (`organization_member.role = 'mentor'`)

- Create & manage courses dalam org
- Grade submissions
- View students

### Org Facilitator (`organization_member.role = 'facilitator'`)

- Monitor cohorts
- View student progress

### Org Admin/Owner (`organization_member.role = 'admin' | 'owner'`)

- Manage org members & invitations
- Org settings & billing
- Full course management dalam org

## Navigation Structure

Navigation ditentukan oleh `getNavItemsForRole()` di `src/lib/server/rbac.ts`:

- Tanpa org context → gunakan `user.role` (platform nav)
- Dalam org context → gunakan `organization_member.role` (org nav)

## Course Enrollment Flow

1. Browse courses at `/app/explore`
2. View course detail
3. Click "Enroll Now"
4. If has coupon, apply coupon code
5. Complete enrollment
6. Redirect to `/app/learning/courses`

## Database Integration

- Uses Drizzle ORM with Neon (PostgreSQL)
- Key tables: `user`, `session`, `course`, `enrollment`, `organization`, `organizationMember`, `coupon`, `couponUsage`
- `user.role` → platform roles only: `admin | bd | user`
- `organization_member.role` → org roles: `owner | admin | mentor | facilitator | member`

## Org Server Utilities (`src/lib/server/org-utils.ts`)

Helper functions untuk operasi org yang digunakan di server-side routes.

### `getMembership(userId, orgId, fallbackRedirect?)`

Query `organizationMember` untuk kombinasi `userId` + `orgId`. Jika tidak ditemukan, otomatis `redirect(303, fallbackRedirect)` (default: `/app/organizations`).

```ts
import { getMembership } from '$lib/server/org-utils';

// Dalam +page.server.ts
const membership = await getMembership(user.id, params.id);
// membership.role → 'owner' | 'admin' | 'mentor' | 'facilitator' | 'member'
```

### `generateUniqueSlug(name)`

Slugify nama org menjadi URL-safe string, lalu cek keunikan di tabel `organization`. Jika slug sudah ada, tambahkan numeric suffix (`-1`, `-2`, dst.) hingga unik.

```ts
import { generateUniqueSlug } from '$lib/server/org-utils';

const slug = await generateUniqueSlug('Koneksi Digital'); // → 'koneksi-digital' (atau 'koneksi-digital-1' jika sudah ada)
```

## Security

- Authentication required untuk semua dashboard routes
- Platform role checks via `isPlatformAdmin()`, `isBD()` di `rbac.ts`
- Org role checks via `hasOrgPermission()` di `rbac.ts`
- Org membership lookup via `getMembership()` di `org-utils.ts`
- **Tidak ada** `requireMentor()` / `requireFacilitator()` di platform level — gunakan org membership check
- Session management dengan Lucia v3
