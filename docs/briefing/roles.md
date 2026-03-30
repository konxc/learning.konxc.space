# Role Definitions & Permissions - Naik Kelas 2.0

> **Status:** PRODUCTION - All roles implemented and verified  
> **Last Updated:** 2026-03-30  
> **Version:** Naik Kelas 2.0

---

## Platform Overview

Naik Kelas 2.0 implements a **gotong royong education ecosystem** where:

1. Anyone can register as a user
2. Users with verified KTP can create organizations
3. Organizations can invite mentors and facilitators
4. Mentors/facilitators get auto-affiliate accounts
5. All users have access to the tracker/gamification system

---

## User Journey Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NAIK KELAS 2.0 USER JOURNEY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐                                                           │
│  │   REGISTER   │  ← New users get role 'user' by default                   │
│  └──────┬───────┘                                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌──────────────────┐                                                       │
│  │   ONBOARDING     │  ← Collect telemetry (goals, interests, experience)   │
│  │ (Student Path)   │  ← NO course selection at onboarding                  │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────┐     ┌──────────────────────┐                          │
│  │   DASHBOARD      │────▶│  KTP VERIFICATION    │  ← Optional but needed   │
│  │   (Student)      │     │  (for org creation)  │    to create org         │
│  └────────┬─────────┘     └──────────┬───────────┘                          │
│           │                          │                                       │
│           │                          ▼                                       │
│           │                 ┌──────────────────┐                            │
│           │                 │  CREATE ORG      │  ← Only if KTP verified    │
│           │                 └────────┬─────────┘                            │
│           │                          │                                       │
│           │                          ▼                                       │
│           │                 ┌──────────────────┐                            │
│           │                 │  ORG VERIFICATION│  ← Optional (Trusted badge) │
│           │                 └────────┬─────────┘                            │
│           │                          │                                       │
│           │                          ▼                                       │
│           │                 ┌──────────────────┐                            │
│           │                 │  INVITE M/F      │  ← Mentor or Facilitator   │
│           │                 └────────┬─────────┘                            │
│           │                          │                                       │
│           │                          ▼                                       │
│           │                 ┌──────────────────┐                            │
│           │                 │  AUTO-AFFILIATE  │  ← Account + links created  │
│           │                 └────────┬─────────┘                            │
│           │                          │                                       │
│           │                          ▼                                       │
│           │                 ┌──────────────────┐                            │
│           │                 │  DIFFERENT ONB   │  ← Not student onboarding   │
│           │                 └────────┬─────────┘                            │
│           │                          │                                       │
│           │                          ▼                                       │
│           │                 ┌──────────────────┐                            │
│           │                 │  ROLE SWITCHER   │  ← Switch student/mentor    │
│           │                 │  (in sidebar)    │    views                    │
│           └─────────────────┴──────────────────┴─────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────────────┐
│  │                          TRACKER SYSTEM                                 │
│  │  • Points for learning activities                                       │
│  │  • Streaks for daily engagement                                         │
│  │  • Tiers: Starter → Learner → Achiever → Champion → Legend              │
│  │  • Rewards: coupons, affiliate tier upgrades, revenue share             │
│  └─────────────────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Platform Roles

### 1. User (Student) - Default Role

| Attribute           | Value                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| **Role Key**        | `user`                                                                           |
| **Description**     | Default role for all new registrants. Learner who can become organization owner. |
| **Onboarding**      | Collects telemetry (goals, interests, experience, schedule)                      |
| **Track Selection** | Happens at course enrollment, not onboarding                                     |

**Permissions:**

- Enroll in courses
- Access learning materials
- Submit assignments & participate in discussions
- Earn XP, tracker points, badges, certificates
- **Can create Organization** (requires KTP verification)
- Can be invited as Mentor or Facilitator

**Entry Path:**

1. Register with email/password
2. Complete onboarding (telemetry questions)
3. Access dashboard
4. Optional: Verify KTP → Create organization

---

### 2. Admin

| Attribute            | Value                                                                             |
| -------------------- | --------------------------------------------------------------------------------- |
| **Role Key**         | `admin`                                                                           |
| **Description**      | Platform administrator with full system access                                    |
| **Responsibilities** | System configuration, user management, verification approval, financial oversight |

**Permissions:**

- Full CRUD on all entities
- Access to all dashboards
- Plugin management
- **Approve/reject KTP verifications**
- **Approve/reject Organization verifications**
- Organization management
- Financial reports & transactions

---

### 3. Business Development (BD)

| Attribute            | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| **Role Key**         | `bd`                                                         |
| **Description**      | Business Development - handles partnerships and waiting list |
| **Responsibilities** | Partner management, lead qualification, CRM                  |

**Permissions:**

- Read access to courses
- CRUD on waiting list entries
- Partner management
- View analytics (read-only)

---

### 4. Mentor (Content Creator/Owner)

| Attribute           | Value                                                             |
| ------------------- | ----------------------------------------------------------------- |
| **Role Key**        | `mentor`                                                          |
| **Description**     | Content creator and course owner. Creates curriculum and teaches. |
| **Commission Rate** | Default 25% (tier-based: Bronze→Platinum)                         |
| **Onboarding**      | Profile setup + expertise + portfolio + payout configuration      |

**Permissions:**

- CRUD on own courses
- Create modules, lessons, materials
- Grade submissions
- Broadcast messages to students
- View student analytics
- **Auto-generated affiliate links** for all org courses
- **Cannot be facilitator in same organization** (no double roles)

**Entry Path:**

1. Invited by Organization Owner/Admin
2. Accept invitation → Auto-create affiliate account
3. Complete Mentor Onboarding (different from student)
4. Can switch role via RoleSwitcher

---

### 5. Facilitator (Batch Manager/Guide)

| Attribute           | Value                                             |
| ------------------- | ------------------------------------------------- |
| **Role Key**        | `facilitator`                                     |
| **Description**     | Batch manager who guides students through cohorts |
| **Commission Rate** | Default 25% (tier-based: Bronze→Platinum)         |
| **Onboarding**      | Org context confirmation + payout configuration   |

**Permissions:**

- View assigned cohorts
- Track student progress
- Moderate discussions
- Send broadcast to cohort
- **Auto-generated affiliate links** for org courses
- **Cannot be mentor in same organization** (no double roles)

**Entry Path:**

1. Invited by Organization Owner/Admin
2. Accept invitation → Auto-create affiliate account
3. Complete Facilitator Onboarding (different from student)
4. Can switch role via RoleSwitcher

---

## Organization Roles (Multi-Tenant)

| Role          | Description                                   | Permissions                                     |
| ------------- | --------------------------------------------- | ----------------------------------------------- |
| `owner`       | Organization creator (must have KTP verified) | Full control - delete org, billing, all members |
| `admin`       | Organization administrator                    | Manage members, courses, cohorts, analytics     |
| `creator`     | Course creator                                | Create and manage own courses                   |
| `facilitator` | Batch facilitator                             | Manage assigned cohorts                         |
| `member`      | Basic member                                  | Read-only access                                |

---

## Critical Rules

### 1. KTP Verification Required for Organization Creation

```typescript
// src/routes/(dashboard)/app/organizations/new/+page.server.ts:26-33
const verification = await db.query.userVerification.findFirst({
	where: eq(schema.userVerification.userId, locals.user.id)
});

if (verification?.status !== 'approved') {
	throw redirect(303, '/app/verification');
}
```

**Rule:** Only users with `userVerification.status = 'approved'` can create organizations.

### 2. No Double Roles in Same Organization

```typescript
// src/routes/org/invite/[token]/+page.server.ts:119-129
const isMentorOrFacilitatorInvite =
	invitation.role === 'mentor' || invitation.role === 'facilitator';
const isExistingMentorOrFacilitator =
	existingMember.role === 'mentor' || existingMember.role === 'facilitator';

if (isMentorOrFacilitatorInvite && isExistingMentorOrFacilitator) {
	throw error(403, 'Anda sudah memiliki peran di organisasi ini...');
}
```

**Rule:** A user can only be **mentor OR facilitator** in one organization, never both.

### 3. Organization Verification is Optional

**Unverified Organization:**

- Can operate normally
- Can create courses
- Can invite mentors/facilitators
- No "Trusted" badge

**Verified Organization:**

- Gets "Trusted Organization" badge
- Higher marketplace visibility
- Potential for enterprise partnerships
- All courses show trusted badge

---

## Verification Systems

### User Verification (KTP)

| Field              | Required | Description               |
| ------------------ | -------- | ------------------------- |
| `ktpNumber`        | Yes      | 16-digit NIK              |
| `ktpName`          | Yes      | Full name as per KTP      |
| `ktpAddress`       | Yes      | Address as per KTP        |
| `ktpDob`           | Yes      | Date of birth             |
| `ktpPhotoUrl`      | Yes      | Photo of KTP              |
| `selfieWithKtpUrl` | Yes      | Selfie holding KTP        |
| `status`           | -        | pending/approved/rejected |

### Organization Verification (Legal)

| Field                    | Required | Description                       |
| ------------------------ | -------- | --------------------------------- |
| `legalName`              | Yes      | Full legal name                   |
| `legalType`              | Yes      | yayasan/pt/cv/koperasi/perorangan |
| `npwp`                   | Yes      | Tax ID                            |
| `skPendirian`            | Yes      | Founding decree                   |
| `representativeName`     | Yes      | Person in charge                  |
| `representativePosition` | Yes      | ketua/direktur/pemilik            |
| `legalAddress`           | Yes      | Registered address                |

---

## Auto-Affiliate System

When a user accepts invitation as Mentor or Facilitator:

### 1. Auto-Create Affiliate Account

```typescript
// src/routes/org/invite/[token]/+page.server.ts:37-46
await db.insert(schema.affiliateAccount).values({
	id: accountId,
	userId,
	orgId,
	role,
	commissionRate: 25, // Default 25%
	tier: 'bronze',
	isActive: true
});
```

### 2. Auto-Generate Affiliate Links

- Per-course links for all org courses
- Organization landing page link
- Unique referral code (e.g., `mentor-budi-abc123`)

### 3. Commission Structure

```
Course Price: Rp 1,500,000
Affiliate Commission (25%): Rp 375,000

Tier Bonuses:
- Bronze (0-1000 points): 25%
- Silver (1001-5000 points): 27%
- Gold (5001-10000 points): 30%
- Platinum (10001+ points): 35%
```

---

## Tracker System (Differentiating Feature)

The Tracker is Naik Kelas's **unique gamification system**.

### Points Sources

| Activity            | Points | Description                  |
| ------------------- | ------ | ---------------------------- |
| Complete Lesson     | 10     | Finish a lesson              |
| Complete Module     | 50     | Finish all lessons in module |
| Complete Checkpoint | 100    | Submit checkpoint task       |
| Daily Streak        | 5/day  | Consecutive days of activity |
| Discussion Post     | 5      | Create discussion thread     |
| Referral            | 50     | Refer new user               |
| Course Completion   | 200    | Complete entire course       |

### Tracker Tiers

| Tier     | Points Range | Benefits                      |
| -------- | ------------ | ----------------------------- |
| Starter  | 0-100        | Basic access                  |
| Learner  | 101-500      | Unlock coupons                |
| Achiever | 501-2000     | Higher affiliate tier         |
| Champion | 2001-5000    | Priority support              |
| Legend   | 5001+        | Revenue share, mentor network |

---

## Onboarding Flows

### Flow 1: New Student Registration (Multi-Domain Onboarding)

```
Register (role: 'user')
    │
    ▼
Onboarding: Collect Telemetry (Multi-Domain Support)
    ├─ Goals (Bidang Karir)
    │   ├─ Developer (Teknologi)
    │   ├─ Akademik (Pendidikan)
    │   ├─ Bisnis & UMKM
    │   ├─ UI/UX Design
    │   └─ Outdoor Adventure
    ├─ Goals (Monetisasi & Kolaborasi)
    │   ├─ Monetisasi Pengetahuan
    │   ├─ Membangun Organisasi/Institusi
    │   ├─ Kolaborasi & Bermitra
    │   └─ Menjadi Mentor/Facilitator
    ├─ Interests (Multi-Domain)
    │   ├─ Developer: Web Dev, Mobile, AI/ML, Blockchain
    │   ├─ Akademik: Tutoring, Course Creation, Research
    │   ├─ Bisnis & UMKM: Marketing, E-Commerce, Operations
    │   ├─ Design: UI/UX, Graphic, Motion, Design Systems
    │   └─ Outdoor: Leadership, Expedition, Team Building
    ├─ Experience (Pemula, Menengah, Lanjutan)
    └─ Schedule (Pagi, Siang, Malam, Fleksibel)
    │
    ▼
Dashboard (Student View)
```

### Flow 2: Create Organization

```
User (KTP Verified)
    │
    ▼
"Buat Organization"
    │
    ▼
[Form: Nama Org, Legalitas]
    │
    ▼
Organization Created (Unverified)
    ├─ Can operate normally
    ├─ Create courses
    └─ Invite mentors/facilitators
    │
    ▼
Optional: Organization Verification
    │
    ▼
[Form: NPWP, SK Pendirian, Legal docs]
    │
    ▼
Admin Approves
    │
    ▼
Organization Verified (Trusted Badge)
    └─ Courses get "Verified Organization" badge
```

### Flow 3: Invite Mentor/Facilitator

```
Org Owner/Admin
    │
    ▼
"Invite Mentor" or "Invite Facilitator"
    │
    ▼
User Receives Invitation
    │
    ▼
User Accepts (org/invite/[token])
    │
    ▼
Auto-Create Affiliate Account
    ├─ Generate affiliate links for org courses
    └─ Set commission rate (25% default)
    │
    ▼
[Onboarding: Different from Student!]
    ├─ For Mentor: Bio, Expertise, Portfolio, Payout Setup
    └─ For Facilitator: Org Context, Payout Setup
    │
    ▼
Dashboard (Mentor/Facilitator View)
    │
    └─ Can use RoleSwitcher to switch views
```

---

## Role Switcher

**Location:** Sidebar, under Naik Kelas logo

```
┌─────────────────────────────┐
│ [Logo]                      │
│ [RoleSwitcher] ← HERE       │
│                             │
│ Dashboard                   │
│ My Courses                  │
│ Certificates                │
│ ...                         │
└─────────────────────────────┘
```

**Available Switches:**

| Current Role | Can Switch To                        |
| ------------ | ------------------------------------ |
| user         | (no switcher visible)                |
| mentor       | user, mentor                         |
| facilitator  | user, facilitator                    |
| admin        | admin, bd, mentor, facilitator, user |
| bd           | bd, user                             |

---

## Code References

| Concept                  | File                                            |
| ------------------------ | ----------------------------------------------- |
| Role constants           | `src/lib/constants/roles.ts`                    |
| RBAC logic               | `src/lib/server/rbac.ts`                        |
| User verification schema | `src/lib/server/db/schema.ts:788-814`           |
| Org verification schema  | `src/lib/server/db/schema.ts:817-853`           |
| Affiliate account schema | `src/lib/server/db/schema.ts:860-888`           |
| Tracker schema           | `src/lib/server/db/schema.ts:916-965`           |
| Role switcher UI         | `src/lib/components/app/RoleSwitcher.svelte`    |
| Onboarding page          | `src/routes/onboarding/+page.svelte`            |
| Invitation flow          | `src/routes/org/invite/[token]/+page.server.ts` |
| Auth hooks               | `src/hooks.server.ts`                           |
