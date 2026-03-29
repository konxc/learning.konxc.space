# Role Definitions & Permissions

> **Status:** PRODUCTION
> **Last Updated:** 2026-03-29

## Overview

Naik Kelas 2.0 uses a multi-tiered role system designed for a **gotong royong education ecosystem**. Anyone can create digital learning spaces, monetize knowledge, and earn income through teaching and affiliate programs.

---

## User Journey Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NAIK KELAS 2.0 USER JOURNEY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. REGISTER                                                               │
│     └──▶ User Baru (role: 'user')                                          │
│                                                                             │
│  2. ONBOARDING - Student Path                                              │
│     └──▶ Pilih course, pilih track (creator/seller/affiliate)              │
│                                                                             │
│  3. LEARN & EARN TRACKER POINTS                                            │
│     └──▶ Complete lessons, checkpoints → earn tracker points               │
│                                                                             │
│  4. KTP VERIFICATION (Optional, Required for Org Creation)                 │
│     └──▶ Upload KTP + selfie → Admin approves                             │
│                                                                             │
│  5. CREATE ORGANIZATION (Only if KTP Verified)                             │
│     └──▶ Buat org → Isi legalitas → Org beroperasi                        │
│                                                                             │
│  6. ORGANIZATION VERIFICATION (Optional, for Trusted Badge)                │
│     └──▶ Submit legal docs → Org dapat badge "Verified"                   │
│                                                                             │
│  7. INVITE MENTOR/FACILITATOR                                              │
│     └──▶ User di-invite → Auto-create affiliate account                   │
│                                                                             │
│  8. ROLE SWITCHING                                                          │
│     └──▶ Mentor/Facilitator dapat switch role via RoleSwitcher            │
│                                                                             │
│  9. EARN INCOME                                                             │
│     ├── Course sales revenue                                               │
│     ├── Affiliate commission (from shareable links)                        │
│     └── Tracker bonus rewards                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Platform Roles

### 1. User (Student) - Default Role

| Attribute            | Value                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Role Key**         | `user`                                                                                |
| **Description**      | Default role for all new registrants. Learner who can also become organization owner. |
| **Responsibilities** | Learn courses, earn tracker points, can create organization                           |

**Permissions:**

- Enroll in courses
- Access learning materials
- Submit assignments & participate in discussions
- Earn XP, tracker points, badges, certificates
- Affiliate program (auto-enabled for track selection)
- **Create Organization** (requires KTP verification)
- Get invited as Mentor or Facilitator

---

### 2. Admin

| Attribute            | Value                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Role Key**         | `admin`                                                                                     |
| **Description**      | Platform administrator with full system access                                              |
| **Responsibilities** | System configuration, user management, analytics, payments, verification approval           |
| **Default Nav**      | Dashboard, Courses, Cohorts, Users, Reports, Coupons, Payments, Plugins, Verification Queue |

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
| **Default Nav**      | Dashboard, Waiting List, Partners                            |

**Permissions:**

- Read access to courses
- CRUD on waiting list entries
- Partner management
- View analytics (read-only)

---

### 4. Mentor (Content Creator/Owner)

| Attribute            | Value                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Role Key**         | `mentor`                                                                                              |
| **Description**      | Content creator and course owner. Creates curriculum and teaches. Auto-enrolled in affiliate program. |
| **Responsibilities** | Course creation, curriculum design, student assessment, affiliate promotion                           |
| **Default Nav**      | Dashboard, My Courses, Students, Broadcast, Affiliate Dashboard                                       |

**Permissions:**

- CRUD on own courses
- Create modules, lessons, materials
- Grade submissions
- Broadcast messages to students
- View student analytics
- **Auto-generated affiliate links** for all org courses
- Earn affiliate commission (default 25%)
- **Cannot be facilitator in same organization** (no double roles)

**Entry Path:**

1. Invited by Organization Owner/Admin
2. Accept invitation → Auto-create affiliate account
3. Complete Mentor Onboarding (profile, expertise, payout setup)
4. Can switch role via RoleSwitcher

---

### 5. Facilitator (Batch Manager/Guide)

| Attribute            | Value                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Role Key**         | `facilitator`                                                                          |
| **Description**      | Batch manager who guides students through cohorts. Auto-enrolled in affiliate program. |
| **Responsibilities** | Cohort management, student guidance, progress tracking, affiliate promotion            |
| **Default Nav**      | Dashboard, My Batches, Students, Affiliate Dashboard                                   |

**Permissions:**

- View assigned cohorts
- Track student progress
- Moderate discussions
- Send broadcast to cohort
- **Auto-generated affiliate links** for org courses
- Earn affiliate commission (default 25%)
- **Cannot be mentor in same organization** (no double roles)

**Entry Path:**

1. Invited by Organization Owner/Admin
2. Accept invitation → Auto-create affiliate account
3. Complete Facilitator Onboarding (org context confirmation, payout setup)
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

### Important Rules

1. **KTP Verification Required**: Only users with verified KTP can create organizations
2. **No Double Roles in Same Org**: A user can only be mentor OR facilitator in one organization
3. **Organization Verification**: Optional, gives "Trusted" badge for courses

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

**Business Rules:**

- `userVerification.status = 'approved'` → Can create organization
- Verified status is permanent (no expiry)
- Admin can reject with reason

### Organization Verification (Legal)

| Field                    | Required | Description                            |
| ------------------------ | -------- | -------------------------------------- |
| `legalName`              | Yes      | Full legal name (e.g., "Yayasan ASIB") |
| `legalType`              | Yes      | yayasan/pt/cv/koperasi/perorangan      |
| `npwp`                   | Yes      | Tax ID                                 |
| `skPendirian`            | Yes      | Founding decree document               |
| `representativeName`     | Yes      | Person in charge                       |
| `representativePosition` | Yes      | ketua/direktur/pemilik                 |
| `legalAddress`           | Yes      | Registered address                     |
| `status`                 | -        | pending/verified/rejected              |

**Business Rules:**

- Organization can operate without verification
- **Verified Organization** courses get "Trusted" badge
- Higher visibility in marketplace
- Potential for enterprise partnerships

---

## Auto-Affiliate System

When a user is invited and accepts as **Mentor** or **Facilitator**:

1. **Auto-create Affiliate Account**
   - Commission rate: 25% (default)
   - Tier: bronze (upgradeable based on tracker points)
   - Links auto-generated for all org courses

2. **Auto-generate Affiliate Links**
   - Per-course links
   - Organization landing page link
   - Unique referral code

3. **Commission Structure**

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

The Tracker is Naik Kelas's **unique gamification system** that rewards learning progress and community contribution.

### Tracker Points Sources

| Activity            | Points | Description                  |
| ------------------- | ------ | ---------------------------- |
| Complete Lesson     | 10     | Finish a lesson              |
| Complete Module     | 50     | Finish all lessons in module |
| Complete Checkpoint | 100    | Submit checkpoint task       |
| Daily Streak        | 5/day  | Consecutive days of activity |
| Discussion Post     | 5      | Create discussion thread     |
| Discussion Reply    | 2      | Reply to discussion          |
| Referral            | 50     | Refer new user               |
| Course Completion   | 200    | Complete entire course       |
| Certificate Earned  | 100    | Earn course certificate      |

### Tracker Tiers

| Tier     | Points Range | Benefits                        |
| -------- | ------------ | ------------------------------- |
| Starter  | 0-100        | Basic access                    |
| Learner  | 101-500      | Unlock coupons                  |
| Achiever | 501-2000     | Higher affiliate tier           |
| Champion | 2001-5000    | Priority support, beta features |
| Legend   | 5001+        | Revenue share, mentor network   |

### Tracker vs Other Platforms

| Feature               | Naik Kelas           | Other Platforms |
| --------------------- | -------------------- | --------------- |
| Learning Points       | ✅ Tracker           | ❌ Basic XP     |
| Streak System         | ✅ Daily tracking    | ⚠️ Sometimes    |
| Affiliate Integration | ✅ Tier-based        | ❌ No           |
| Community Rewards     | ✅ Discussion points | ❌ No           |
| Revenue Share         | ✅ Legend tier       | ❌ No           |

---

## Revenue & Monetization Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      REVENUE FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Student Pays                                                   │
│       │                                                         │
│       ├──▶ Course Price                                         │
│       │        │                                                │
│       │        ├──▶ Course Creator (70%)                        │
│       │        │        │                                       │
│       │        │        └──▶ If via affiliate: share commission │
│       │        │                                                │
│       │        └──▶ Platform Fee (30%)                          │
│       │                                                         │
│       └──▶ Affiliate Commission                                 │
│                │                                                │
│                └──▶ Mentor/Facilitator (25-35% based on tier)  │
│                                                                 │
│  Organization Revenue (Course Sales)                            │
│       │                                                         │
│       └──▶ Based on org plan and agreements                     │
│                                                                 │
│  Mentor/Facilitator Earnings                                    │
│       ├── Teaching fee from org                                 │
│       ├── Affiliate commission (auto-generated links)           │
│       └── Tracker bonus rewards                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Role Switching

Users with multiple roles can switch via **RoleSwitcher** (below Naik Kelas logo):

| Base Role              | Can Switch To                                  |
| ---------------------- | ---------------------------------------------- |
| `user`                 | (none - no switcher visible)                   |
| `user` + org owner     | org admin view                                 |
| `mentor` (in org)      | `user`, `mentor`                               |
| `facilitator` (in org) | `user`, `facilitator`                          |
| `admin`                | `admin`, `bd`, `mentor`, `user`, `facilitator` |
| `bd`                   | `bd`, `user`                                   |

**Note:** A user can only be mentor OR facilitator in the same organization. If they want to switch, they need to leave one role first.

---

## Onboarding Flows

### Flow 1: New User Registration

```
Register
    │
    ▼
Email/Password
    │
    ▼
[Onboarding: Pilih Course + Track]
    │
    ├──▶ Track: Creator (build audience)
    ├──▶ Track: Seller (e-commerce)
    └──▶ Track: Affiliate (passive income)
    │
    ▼
Dashboard (Student View)
    │
    ▼
Optional: KTP Verification → Can create Organization
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
    │
    ├──▶ Can operate normally
    ├──▶ Create courses
    ├──▶ Invite mentors/facilitators
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
    │
    └──▶ Courses get "Verified Organization" badge
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
User Accepts
    │
    ▼
Auto-Create Affiliate Account
    │
    ├──▶ Generate affiliate links for org courses
    └──▶ Set commission rate (25% default)
    │
    ▼
[Onboarding: Complete Profile] ← DIFFERENT from student onboarding
    │
    ├──▶ For Mentor: Bio, Expertise, Portfolio, Payout Setup
    └──▶ For Facilitator: Org Context, Payout Setup
    │
    ▼
Dashboard (Mentor/Facilitator View)
    │
    └──▶ Can use RoleSwitcher to switch views
```

---

## Code References

| Concept                  | File                                                         |
| ------------------------ | ------------------------------------------------------------ |
| Role constants           | `src/lib/constants/roles.ts`                                 |
| RBAC logic               | `src/lib/server/rbac.ts`                                     |
| User verification schema | `src/lib/server/db/schema.ts` (userVerification)             |
| Org verification schema  | `src/lib/server/db/schema.ts` (organizationVerification)     |
| Affiliate account schema | `src/lib/server/db/schema.ts` (affiliateAccount)             |
| Tracker schema           | `src/lib/server/db/schema.ts` (userTracker, trackerActivity) |
| Role switcher UI         | `src/lib/components/app/RoleSwitcher.svelte`                 |
| Onboarding               | `src/routes/onboarding/+page.svelte`                         |
| Auth hooks               | `src/hooks.server.ts`                                        |
