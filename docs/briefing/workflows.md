# Organizational Workflows - Naik Kelas 2.0

> **Status:** PRODUCTION - All workflows implemented and verified  
> **Last Updated:** 2026-03-30  
> **Version:** Naik Kelas 2.0

---

## Overview

This document outlines the complete organizational hierarchy and key workflows for the Naik Kelas 2.0 gotong royong education ecosystem.

---

## Hierarchy Structure

```
Platform
├── User (Student)
│   ├── [KTP Verified] → Can create Organization
│   └── [Invited] → Can become Mentor/Facilitator (with auto-affiliate)
│
├── Organization (Tenant)
│   ├── [Unverified] → Can operate normally
│   └── [Verified] → Courses get "Trusted" badge
│   │
│   ├── Workspaces (Departments/Teams)
│   │   └── Members
│   ├── Courses (Organization-specific)
│   │   └── Cohorts (Batches)
│   │       ├── Facilitator
│   │       └── Students
│   └── Affiliate Accounts (Mentors & Facilitators)
│       └── Auto-generated links
│
└── Tracker System (Gamification)
    ├── Points
    ├── Streaks
    ├── Tiers
    └── Rewards
```

### Entity Relationships

| Entity                    | Parent              | Children                                                   |
| ------------------------- | ------------------- | ---------------------------------------------------------- |
| User                      | -                   | Verifications, Organizations, Enrollments, UserPreferences |
| User Verification         | User                | -                                                          |
| User Preferences          | User                | -                                                          |
| Organization              | User (owner)        | Workspaces, Courses, Members                               |
| Organization Verification | Organization        | -                                                          |
| Affiliate Account         | User + Organization | Links, Earnings                                            |
| Workspace                 | Organization        | Members                                                    |
| Course                    | Organization        | Modules, Lessons                                           |
| Cohort                    | Course              | Enrollments, Checkpoints                                   |
| Enrollment                | Cohort/Course       | Progress, Grades                                           |
| UserTracker               | User                | Activities                                                 |
| TrackerActivity           | User                | Point sources                                              |

---

## Workflow 0: User Registration & KTP Verification

### Actors

- **New User** (registers with email/password)
- **Admin** (verifies KTP)

### Steps

#### 1. User Registration

```
POST /auth/register
Body: { email, password, fullName }
```

**Database:** User created with `role = 'user'`

#### 2. Onboarding (Student Path)

**IMPORTANT:** Student onboarding collects TELEMETERI only - NO course selection!

```
GET /onboarding
```

Form collects:

- Goals (career, business, skill, hobby)
- Interests (creator, affiliate, seller, smm, seo)
- Experience (beginner, intermediate, advanced)
- Schedule (morning, afternoon, evening, flexible)
- Notification preferences

**Action:** `savePreferences` saves to `userPreferences` table and sets `onboardingCompleted = true`

#### 3. KTP Verification (Optional but Required for Org Creation)

```
POST /app/verification
Body: {
  ktpNumber,
  ktpName,
  ktpAddress,
  ktpDob,
  ktpPhoto (base64),
  selfieWithKtp (base64)
}
```

**Database:** Creates/updates `userVerification` record with status 'pending'

#### 4. Admin Review

- Admin reviews KTP submission in `/app/admin/verification`
- Approves or rejects with reason
- Updates `userVerification.status`

#### 5. Result

| Status     | Permission                       |
| ---------- | -------------------------------- |
| `pending`  | Cannot create organization       |
| `approved` | Can create organization          |
| `rejected` | Can resubmit with corrected docs |

**Business Rules:**

- Only verified users can create organizations
- KTP verification is permanent (no expiry)
- Each user can only have one verification record

---

## Workflow 1: Creating an Organization

### Prerequisites

- User must have `userVerification.status = 'approved'`

### Actors

- **Verified User** (creates organization, becomes owner)

### Steps

#### 1. Check Verification Status

```typescript
// src/routes/(dashboard)/app/organizations/new/+page.server.ts:26-33
const verification = await db.query.userVerification.findFirst({
	where: eq(schema.userVerification.userId, locals.user.id)
});

if (verification?.status !== 'approved') {
	throw redirect(303, '/app/verification');
}
```

#### 2. Create Organization

```
POST /app/organizations/new
Body: {
  name: "Koneksi Digital",
  brandColor: "#4f46e5"
}
```

**Database:** Creates organization record, auto-generates slug

#### 3. Auto-assign Owner

- Creator automatically becomes `owner` role in `organizationMember` table
- Owner gets full permissions

#### 4. Fill Organization Details (Optional)

- Legal name
- Description
- Logo upload
- Contact information

#### 5. Organization Verification (Optional)

- Submit legal documents for "Trusted" badge
- See Workflow 1.1

### Result

```
Organization Created:
├── Owner: User who created (KTP verified)
├── Status: Unverified (can operate)
├── Courses: Can create
└── Invite: Can invite mentors/facilitators
```

---

## Workflow 1.1: Organization Verification (Trusted Badge)

### Prerequisites

- Organization must exist
- Organization owner must have legal documents

### Actors

- **Organization Owner/Admin** (submits verification)
- **Admin** (approves verification)

### Steps

#### 1. Submit Verification

```
POST /app/organizations/{orgId}/verification
Body: {
  legalName: "Yayasan Koneksi Digital",
  legalType: "yayasan",
  npwp: "12.345.678.9-000.000",
  skPendirian: "<document_url>",
  siup: "<optional_document_url>",
  representativeName: "Sandikodev",
  representativePosition: "ketua",
  legalAddress: "Jl. Teknologi No. 123, Jakarta",
  city: "Jakarta",
  province: "DKI Jakarta",
  postalCode: "12345"
}
```

**Database:** Creates/updates `organizationVerification` record

#### 2. Admin Review

- Admin checks submitted documents
- Verifies legal entity existence
- Approves or rejects

#### 3. Result

| Status     | Result                                         |
| ---------- | ---------------------------------------------- |
| `approved` | `isTrusted = true`, badge displayed on courses |
| `rejected` | Reason provided, can resubmit                  |

### Benefits of Verification

| Feature                 | Unverified | Verified    |
| ----------------------- | ---------- | ----------- |
| Create courses          | ✅         | ✅          |
| Invite mentors          | ✅         | ✅          |
| Trusted badge           | ❌         | ✅          |
| Marketplace priority    | Standard   | Higher      |
| Enterprise partnerships | Limited    | Full access |

---

## Workflow 2: Inviting Mentor/Facilitator (Auto-Affiliate)

### Actors

- **Organization Owner/Admin** (sends invitation)
- **Invited User** (accepts invitation, becomes mentor/facilitator)

### Steps

#### 1. Send Invitation

```
POST /app/organizations/{orgId}/invite
Body: {
  email: "mentor@example.com",
  role: "mentor" // or "facilitator"
}
```

#### 2. Validation Rules (No Double Roles)

```typescript
// src/routes/org/invite/[token]/+page.server.ts:111-129
const existingMember = await db.query.organizationMember.findFirst({
	where: and(
		eq(schema.organizationMember.orgId, invitation.orgId),
		eq(schema.organizationMember.userId, user.id)
	)
});

if (existingMember) {
	const isMentorOrFacilitatorInvite =
		invitation.role === 'mentor' || invitation.role === 'facilitator';
	const isExistingMentorOrFacilitator =
		existingMember.role === 'mentor' || existingMember.role === 'facilitator';

	if (isMentorOrFacilitatorInvite && isExistingMentorOrFacilitator) {
		throw error(403, 'Anda sudah memiliki peran di organisasi ini...');
	}
}
```

**Rule:** A user can only have ONE mentor/facilitator role per organization.

#### 3. User Accepts Invitation

```
GET /org/invite/{token}
```

#### 4. Auto-Affiliate Creation (Automatic)

```typescript
// src/routes/org/invite/[token]/+page.server.ts:17-77
async function createAutoAffiliateAccount(userId, orgId, role) {
	// Check if already has affiliate account
	const existing = await db.query.affiliateAccount.findFirst({
		where: and(eq(schema.affiliateAccount.userId, userId), eq(schema.affiliateAccount.orgId, orgId))
	});

	if (existing) return;

	// Create affiliate account
	const accountId = generateId();
	await db.insert(schema.affiliateAccount).values({
		id: accountId,
		userId,
		orgId,
		role,
		commissionRate: 25, // Default 25%
		tier: 'bronze',
		isActive: true
	});

	// Auto-generate affiliate links for all org courses
	const orgCourses = await db.query.course.findMany({
		where: eq(schema.course.orgId, orgId)
	});

	for (const course of orgCourses) {
		const linkCode = `${role}-${userId.substring(0, 6)}-${course.id.substring(0, 6)}`;
		await db.insert(schema.autoAffiliateLink).values({
			id: generateId(),
			accountId,
			courseId: course.id,
			orgId,
			code: linkCode,
			url: `https://naikkelas.id/c/${linkCode}`,
			isActive: true
		});
	}
}
```

#### 5. Role-Specific Onboarding (Required)

**Different from student onboarding!**

- **For Mentor:** Complete profile, expertise, portfolio, payout setup
- **For Facilitator:** Confirm org context, payout setup

#### 6. Role Switcher Enabled

- User can now switch between Student view and Mentor/Facilitator view
- Via RoleSwitcher in sidebar (under logo)

### Auto-Affiliate Features

| Feature              | Description                       |
| -------------------- | --------------------------------- |
| Auto-generated links | Links for all org courses         |
| Unique referral code | e.g., `mentor-budi-abc123`        |
| Default commission   | 25%                               |
| Tier system          | Bronze → Silver → Gold → Platinum |
| Payout tracking      | Earnings tracked automatically    |

### Important Rules

1. **No Double Roles**: A user can only be mentor OR facilitator in one organization
2. **Different Onboarding**: Invited mentors/facilitators have different onboarding than students
3. **Auto-Affiliate**: Affiliate account created automatically on invitation accept

---

## Workflow 3: Creating Courses

### Actors

- **Organization Owner/Admin** or **Mentor** (course creator)

### Steps

#### 1. Create Course (Draft)

```
POST /app/courses/new
Body: {
  title: "Akselerasi Bisnis Digital",
  description: "...",
  price: 1500000,
  category: "marketing",
  featuresConfig: {
    tracks: true,      // Enable track selection
    affiliate: true,   // Enable affiliate program
    performance: true  // Enable progress tracking
  }
}
```

**Database:** Creates course record with status 'draft'

#### 2. Add Content

- Create Modules
- Add Lessons to modules
- Add Materials to lessons

#### 3. Publish Course

- Set status to `published`
- Course appears in marketplace
- Affiliate links auto-generated for mentors/facilitators

#### 4. Verified Organization Badge

```
IF org.verification.isTrusted === true:
  Course shows "Verified Organization" badge
```

---

## Workflow 4: Student Enrollment (with Track Selection)

### Actors

- **Student** (self-enrollment)
- **Admin/Facilitator** (bulk enrollment)

### Steps

#### 1. Browse Marketplace

- View available courses
- See course details
- Note "Verified Organization" badge if applicable

#### 2. Select Track (if course has tracks enabled)

**IMPORTANT:** Track selection happens at ENROLLMENT, not onboarding!

```
GET /app/explore/{courseId}
```

Available tracks:

- **Content Creator** - Build audience and create content
- **E-Commerce Seller** - Sell products online
- **Affiliate Pro** - Passive income through referrals

#### 3. Apply Coupon (Optional)

- Enter coupon code
- Validate and apply discount

#### 4. Checkout

- Payment via Midtrans
- Or submit payment proof

#### 5. Activation

- Enrollment status → `active`
- Access granted to course content
- Tracker system activated

**Database:** `enrollment.track` stores selected track

---

## Workflow 5: Earning Income

### Income Sources

#### 1. Course Creator Revenue

```
Course Price: Rp 1,500,000
├── Creator Share: 70% = Rp 1,050,000
└── Platform Fee: 30% = Rp 450,000
```

#### 2. Affiliate Commission (Mentors/Facilitators)

```
Via auto-generated links:
Course Price: Rp 1,500,000
Commission (Bronze 25%): Rp 375,000

Tier-based rates:
├── Bronze (0-1000 pts): 25%
├── Silver (1001-5000 pts): 27%
├── Gold (5001-10000 pts): 30%
└── Platinum (10001+ pts): 35%
```

**Auto-Calculation:** When sale is recorded, `affiliateAccount` totals are automatically updated:

```typescript
await db
	.update(schema.affiliateAccount)
	.set({
		totalEarnings: sql`${schema.affiliateAccount.totalEarnings} + ${commission}`,
		pendingPayout: sql`${schema.affiliateAccount.pendingPayout} + ${commission}`,
		updatedAt: new Date()
	})
	.where(eq(schema.affiliateAccount.userId, userId));
```

#### 3. Tracker Rewards

```
High tracker score → Unlock benefits:
├── Coupon rewards
├── Certificate priority
├── Affiliate tier upgrade
└── Revenue share (Legend tier)
```

---

## Workflow 6: Tracker System

### Points Sources

| Activity            | Points | Frequency       |
| ------------------- | ------ | --------------- |
| Complete Lesson     | 10     | Per lesson      |
| Complete Module     | 50     | Per module      |
| Complete Checkpoint | 100    | Per checkpoint  |
| Daily Streak        | 5/day  | Daily           |
| Discussion Post     | 5      | Per post        |
| Discussion Reply    | 2      | Per reply       |
| Referral            | 50     | Per referral    |
| Course Completion   | 200    | Per course      |
| Certificate         | 100    | Per certificate |

### Tier Progression

```
Starter (0-100)
    └── Basic access
        │
        ▼
Learner (101-500)
    └── Unlock coupons
        │
        ▼
Achiever (501-2000)
    └── Higher affiliate tier
        │
        ▼
Champion (2001-5000)
    └── Priority support, beta features
        │
        ▼
Legend (5001+)
    └── Revenue share, mentor network
```

---

## Complete User Journey Diagram

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│ Register│────▶│ Onboard  │────▶│ Learn   │────▶│ Earn     │
│ (Email) │     │ (Track)  │     │         │     │ Tracker  │
└─────────┘     └──────────┘     └─────────┘     └────┬─────┘
                                                       │
                    ┌──────────────────────────────────┘
                    │
                    ▼
            ┌──────────────┐     ┌──────────────┐     ┌──────────┐
            │ KTP Verify   │────▶│ Create Org   │────▶│ Invite   │
            │ (Optional)   │     │ (Required)   │     │ M/F      │
            └──────────────┘     └──────┬───────┘     └────┬─────┘
                                        │                   │
                                        ▼                   ▼
                               ┌──────────────┐    ┌──────────────┐
                               │ Org Verify   │    │ Auto-Affiliate│
                               │ (Optional)   │    │ Links Created │
                               └──────────────┘    └──────────────┘
```

### Invitation & Auto-Affiliate Flow

```
Org Owner
    │
    ▼
Invite "mentor@example.com" as "mentor"
    │
    ▼
User Accepts Invitation
    │
    ├──▶ Add to OrganizationMember (role: 'mentor')
    │
    ├──▶ Create AffiliateAccount (25% commission)
    │
    ├──▶ Generate AutoAffiliateLinks for all org courses
    │
    └──▶ Trigger Mentor Onboarding (different from student)
            │
            ▼
        Complete Profile + Payout Setup
            │
            ▼
        Dashboard with RoleSwitcher enabled
```

---

## Quick Reference: Key File Locations

### User & Verification

| Action                   | Location                                      |
| ------------------------ | --------------------------------------------- |
| Register                 | `src/routes/auth/register/`                   |
| Submit KTP               | `src/routes/app/verification/`                |
| KTP Server Logic         | `src/routes/app/verification/+page.server.ts` |
| Admin Verification Queue | `src/routes/app/admin/verification/`          |

### Organization

| Action           | Location                                          |
| ---------------- | ------------------------------------------------- |
| Create Org       | `src/routes/app/organizations/new/`               |
| Org Verification | `src/routes/app/organizations/[id]/verification/` |
| Invite Member    | `src/routes/app/organizations/[id]/invite/`       |

### Courses & Enrollment

| Action                          | Location                                                    |
| ------------------------------- | ----------------------------------------------------------- |
| Create Course                   | `src/routes/app/courses/new/`                               |
| Course Detail & Track Selection | `src/routes/app/explore/[id]/`                              |
| Enroll                          | `src/routes/app/explore/[id]/+page.server.ts:enroll action` |

### Affiliate

| Action                | Location                                        |
| --------------------- | ----------------------------------------------- |
| Affiliate Dashboard   | `src/routes/app/affiliate/`                     |
| Auto-Account Creation | `src/routes/org/invite/[token]/+page.server.ts` |

### Tracker

| Action             | Location                                      |
| ------------------ | --------------------------------------------- |
| Tracker Dashboard  | `src/routes/app/tracker/`                     |
| Points Calculation | `src/lib/server/db/schema.ts:trackerActivity` |
