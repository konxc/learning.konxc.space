# Feature Status Audit - Naik Kelas 2.0

> **Last Updated:** 2026-03-30  
> **Version:** Naik Kelas 2.0  
> **Status:** All core features implemented and verified

---

## Status Legend

| Status        | Icon | Description                          |
| ------------- | ---- | ------------------------------------ |
| `PRODUCTION`  | ✅   | Fully tested, live, production-ready |
| `BETA`        | 🟡   | Functional but needs more testing    |
| `STAGING`     | 🔵   | Deployed to staging, not production  |
| `SCHEMA-ONLY` | ⚪   | Database schema exists, no UI/logic  |
| `PLANNED`     | 📋   | Documented but not implemented       |
| `STALER`      | 🗑️   | Deprecated or abandoned              |

---

## Core Platform Features

### Authentication & Authorization

| Feature              | Status        | Location                                         | Notes                                                  |
| -------------------- | ------------- | ------------------------------------------------ | ------------------------------------------------------ |
| Email/Password Login | ✅ PRODUCTION | `src/lib/server/auth.ts`                         | Lucia v3 session management                            |
| Session Management   | ✅ PRODUCTION | `src/hooks.server.ts`                            | Cookie-based, 7-day expiry                             |
| Role-Based Access    | ✅ PRODUCTION | `src/lib/server/rbac.ts`                         | 5 platform roles: user, admin, bd, mentor, facilitator |
| Role Switching       | ✅ PRODUCTION | `src/lib/components/app/RoleSwitcher.svelte`     | Cookie-based active-role switching                     |
| Organization RBAC    | ✅ PRODUCTION | `src/lib/server/db/schema.ts:organizationMember` | owner, admin, creator, facilitator, member             |

### User Management

| Feature           | Status        | Location                      | Notes                    |
| ----------------- | ------------- | ----------------------------- | ------------------------ |
| User Registration | ✅ PRODUCTION | `src/routes/auth/register/`   | With default role 'user' |
| User Profiles     | ✅ PRODUCTION | `src/routes/app/settings/`    | Basic profile fields     |
| Profile Settings  | ✅ PRODUCTION | `src/routes/app/settings/`    | Full settings page       |
| User Search       | ✅ PRODUCTION | `src/routes/app/admin/users/` | Admin panel              |

### Onboarding System (CRITICAL: Different flows per role)

| Feature                | Status        | Location                                      | Notes                                                                 |
| ---------------------- | ------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| Student Onboarding     | ✅ PRODUCTION | `src/routes/onboarding/`                      | **Telemetry questions ONLY** (goals, interests, experience, schedule) |
| Mentor Onboarding      | ✅ PRODUCTION | `src/routes/onboarding/`                      | Profile setup + portfolio + payout                                    |
| Facilitator Onboarding | ✅ PRODUCTION | `src/routes/onboarding/`                      | Org context confirmation + payout                                     |
| Multi-Role Detection   | ✅ PRODUCTION | `src/routes/onboarding/+page.server.ts:14-15` | Query params `?org=xxx&role=mentor`                                   |

**IMPORTANT:** Track selection (Creator/Seller/Affiliate) happens at **course enrollment**, NOT at onboarding.

---

## Organization & Verification System

### KTP Verification (User)

| Feature                  | Status        | Location                                        | Notes                            |
| ------------------------ | ------------- | ----------------------------------------------- | -------------------------------- |
| KTP Submission Form      | ✅ PRODUCTION | `src/routes/app/verification/+page.svelte`      | Upload KTP photo + selfie        |
| KTP Server Logic         | ✅ PRODUCTION | `src/routes/app/verification/+page.server.ts`   | Save to `userVerification` table |
| Admin Verification Queue | ✅ PRODUCTION | `src/routes/app/admin/verification/`            | Approve/reject with reason       |
| "Can Create Org" Badge   | ✅ PRODUCTION | `src/routes/app/organizations/new/+page.svelte` | Shown after approval             |

**Business Rules:**

- User must have `userVerification.status = 'approved'` to create organization
- Verification is permanent (no expiry)
- Admin can reject with `rejectionReason`

### Organization Creation

| Feature               | Status        | Location                                                 | Notes                     |
| --------------------- | ------------- | -------------------------------------------------------- | ------------------------- |
| Org Creation Form     | ✅ PRODUCTION | `src/routes/app/organizations/new/`                      | Name, brand color, slug   |
| KTP Check             | ✅ PRODUCTION | `src/routes/app/organizations/new/+page.server.ts:26-33` | Redirects if not verified |
| Owner Auto-Assignment | ✅ PRODUCTION | `src/routes/app/organizations/new/+page.server.ts`       | Creator becomes `owner`   |
| Unique Slug           | ✅ PRODUCTION | `src/routes/app/organizations/new/+page.server.ts`       | Auto-generated from name  |

### Organization Verification (Legal Documents)

| Feature               | Status        | Location                                                      | Notes                      |
| --------------------- | ------------- | ------------------------------------------------------------- | -------------------------- |
| Legal Submission Form | ✅ PRODUCTION | `src/routes/app/organizations/[id]/verification/`             | Yayasan/PT/CV/Koperasi     |
| Legal Fields          | ✅ PRODUCTION | `src/routes/app/organizations/[id]/verification/+page.svelte` | NPWP, SK Pendirian, etc.   |
| Admin Review          | ✅ PRODUCTION | `src/routes/app/admin/verification/`                          | Approve/reject legal docs  |
| Trusted Badge         | ✅ PRODUCTION | `src/routes/app/explore/[id]/`                                | Displayed on course detail |

**Business Rules:**

- Organization can operate WITHOUT verification
- Verified organizations get "Trusted Organization" badge
- Higher marketplace visibility for verified orgs

---

## Auto-Affiliate System

| Feature                 | Status        | Location                                                       | Notes                                              |
| ----------------------- | ------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| Affiliate Account Table | ✅ PRODUCTION | `src/lib/server/db/schema.ts:affiliateAccount`                 | userId, orgId, commissionRate, earnings            |
| Auto-Account Creation   | ✅ PRODUCTION | `src/routes/org/invite/[token]/+page.server.ts:17-77`          | Created when mentor/facilitator accepts invitation |
| Auto-Link Generation    | ✅ PRODUCTION | `src/routes/org/invite/[token]/+page.server.ts:48-76`          | Links for all org courses + org landing page       |
| Commission Calculation  | ✅ PRODUCTION | `src/routes/(dashboard)/app/affiliate/+page.server.ts:137-155` | Auto-updates on sale                               |
| Earnings Tracking       | ✅ PRODUCTION | `affiliateAccount.totalEarnings`, `pendingPayout`, `paidOut`   | Real-time tracking                                 |

**Commission Structure:**

- Default: 25%
- Tier-based: Bronze (25%) → Silver (27%) → Gold (30%) → Platinum (35%)

---

## Tracker System (Differentiating Feature)

| Feature            | Status        | Location                                      | Notes                                            |
| ------------------ | ------------- | --------------------------------------------- | ------------------------------------------------ |
| User Tracker Table | ✅ PRODUCTION | `src/lib/server/db/schema.ts:userTracker`     | points, streaks, tiers                           |
| Activity Logging   | ✅ PRODUCTION | `src/lib/server/db/schema.ts:trackerActivity` | lesson, checkpoint, discussion, referral         |
| Dashboard UI       | ✅ PRODUCTION | `src/routes/app/tracker/+page.svelte`         | Points, tiers, activities display                |
| Tier Progression   | ✅ PRODUCTION | `src/routes/app/tracker/+page.svelte:10-19`   | Starter → Learner → Achiever → Champion → Legend |

**Points Sources:**
| Activity | Points | Description |
|----------|--------|-------------|
| Complete Lesson | 10 | Finish a lesson |
| Complete Module | 50 | Finish all lessons in module |
| Complete Checkpoint | 100 | Submit checkpoint task |
| Daily Streak | 5/day | Consecutive days |
| Discussion Post | 5 | Create discussion |
| Referral | 50 | Refer new user |

---

## Course & Enrollment System

### Course Management

| Feature            | Status        | Location                           | Notes                      |
| ------------------ | ------------- | ---------------------------------- | -------------------------- |
| Course Creation    | ✅ PRODUCTION | `src/routes/app/courses/new/`      | Full CRUD                  |
| Course Publishing  | ✅ PRODUCTION | `src/routes/app/courses/`          | Draft → Published workflow |
| Course Marketplace | ✅ PRODUCTION | `src/routes/(public)/marketplace/` | Public catalog             |
| Course Detail      | ✅ PRODUCTION | `src/routes/app/explore/[id]/`     | With trusted badge display |

### Track Selection (at Enrollment)

| Feature                | Status        | Location                                           | Notes                       |
| ---------------------- | ------------- | -------------------------------------------------- | --------------------------- |
| Track Options          | ✅ PRODUCTION | `src/routes/app/explore/[id]/+page.svelte:496-540` | Creator, Seller, Affiliate  |
| Track Storage          | ✅ PRODUCTION | `src/routes/app/explore/[id]/+page.server.ts`      | Saved in `enrollment.track` |
| Course Features Config | ✅ PRODUCTION | `course.featuresConfig` JSON                       | Controls if tracks enabled  |

**Important:** Track selection happens at **course enrollment page** (`/app/explore/[id]`), NOT at onboarding.

---

## Role Switcher

| Feature             | Status        | Location                                            | Notes                                      |
| ------------------- | ------------- | --------------------------------------------------- | ------------------------------------------ |
| RoleSwitcher UI     | ✅ PRODUCTION | `src/lib/components/app/RoleSwitcher.svelte`        | Dropdown component                         |
| Position            | ✅ PRODUCTION | `src/lib/components/layouts/Sidebar.svelte:179-184` | **Under logo in sidebar**                  |
| Role Constants      | ✅ PRODUCTION | `src/lib/constants/roles.ts`                        | ROLE_SWITCH_MAP defines available switches |
| Cookie-based Switch | ✅ PRODUCTION | `src/lib/components/app/RoleSwitcher.svelte:20-27`  | Sets `active-role` cookie                  |

**Available Switches:**
| Current Role | Can Switch To |
|--------------|---------------|
| user | (none - no switcher visible) |
| mentor | user, mentor |
| facilitator | user, facilitator |
| admin | admin, bd, mentor, facilitator, user |

---

## No Double Roles Enforcement

| Feature             | Status        | Location                                                | Notes                                         |
| ------------------- | ------------- | ------------------------------------------------------- | --------------------------------------------- |
| Invitation Check    | ✅ PRODUCTION | `src/routes/org/invite/[token]/+page.server.ts:111-129` | Blocks if already has role                    |
| Error Message       | ✅ PRODUCTION | `src/routes/org/invite/[token]/+page.server.ts:124-128` | "Anda sudah memiliki peran di organisasi ini" |
| Database Constraint | ✅ PRODUCTION | `organizationMember` table                              | Unique constraint on (orgId, userId)          |

**Rule:** A user can only have ONE mentor/facilitator role per organization.

---

## Infrastructure & Technical

| Feature                | Status        | Notes                      |
| ---------------------- | ------------- | -------------------------- |
| SvelteKit 2 + Svelte 5 | ✅ PRODUCTION | With Runes syntax          |
| Tailwind CSS 4         | ✅ PRODUCTION | Design token system        |
| Turso/LibSQL           | ✅ PRODUCTION | SQLite-compatible database |
| Drizzle ORM            | ✅ PRODUCTION | Type-safe queries          |
| Lucia v3 Auth          | ✅ PRODUCTION | Session management         |
| Midtrans Payment       | ✅ PRODUCTION | Production keys configured |

---

## Code References

| Module                   | Path                                              |
| ------------------------ | ------------------------------------------------- |
| User Schema              | `src/lib/server/db/schema.ts:3-16`                |
| Organization Schema      | `src/lib/server/db/schema.ts:395-412`             |
| OrganizationMember       | `src/lib/server/db/schema.ts:415-432`             |
| UserVerification         | `src/lib/server/db/schema.ts:788-814`             |
| OrganizationVerification | `src/lib/server/db/schema.ts:817-853`             |
| AffiliateAccount         | `src/lib/server/db/schema.ts:860-888`             |
| AutoAffiliateLink        | `src/lib/server/db/schema.ts:891-913`             |
| UserTracker              | `src/lib/server/db/schema.ts:916-945`             |
| TrackerActivity          | `src/lib/server/db/schema.ts:952-965`             |
| UserPreferences          | `src/lib/server/db/schema.ts:967-988`             |
| Onboarding Server        | `src/routes/onboarding/+page.server.ts`           |
| Onboarding UI            | `src/routes/onboarding/+page.svelte`              |
| Role Switcher            | `src/lib/components/app/RoleSwitcher.svelte`      |
| Invitation Flow          | `src/routes/org/invite/[token]/+page.server.ts`   |
| KTP Verification         | `src/routes/app/verification/`                    |
| Org Verification         | `src/routes/app/organizations/[id]/verification/` |
| Tracker Dashboard        | `src/routes/app/tracker/`                         |
| Affiliate Dashboard      | `src/routes/app/affiliate/`                       |
