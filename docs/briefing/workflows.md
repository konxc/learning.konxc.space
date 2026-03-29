# Organizational Workflows

> **Status:** PRODUCTION
> **Last Updated:** 2026-03-29

## Overview

This document outlines the organizational hierarchy and key workflows for the Naik Kelas 2.0 gotong royong education ecosystem.

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

| Entity                    | Parent              | Children                                  |
| ------------------------- | ------------------- | ----------------------------------------- |
| User                      | -                   | Verifications, Organizations, Enrollments |
| User Verification         | User                | -                                         |
| Organization              | User (owner)        | Workspaces, Courses, Members              |
| Organization Verification | Organization        | -                                         |
| Affiliate Account         | User + Organization | Links, Earnings                           |
| Workspace                 | Organization        | Members                                   |
| Course                    | Organization        | Modules, Lessons                          |
| Cohort                    | Course              | Enrollments, Checkpoints                  |
| Enrollment                | Cohort/Course       | Progress, Grades                          |
| UserTracker               | User                | Activities                                |

---

## Workflow 0: User Registration & KTP Verification

### Actors

- **New User** (registers with email/password)
- **Admin** (verifies KTP)

### Steps

1. **User Registration**

   ```
   POST /auth/register
   Body: { email, password, fullName }
   ```

2. **Onboarding (Student Path)**
   - Select first course
   - Select track: `creator` | `seller` | `affiliate`
   - Dashboard access granted

3. **Optional: KTP Verification**

   ```
   POST /api/verification/ktp
   Body: {
     ktpNumber,
     ktpName,
     ktpAddress,
     ktpDob,
     ktpPhoto (base64),
     selfieWithKtp (base64)
   }
   ```

4. **Admin Review**
   - Admin reviews KTP submission
   - Approves or rejects with reason

5. **Result**
   - If approved: User can now create Organization
   - Status stored in `userVerification` table

### Business Rules

- Only verified users can create organizations
- KTP verification is permanent (no expiry)
- Each user can only have one verification record

---

## Workflow 1: Creating an Organization (KTP Required)

### Prerequisites

- User must have `userVerification.status = 'approved'`

### Actors

- **Verified User** (creates organization, becomes owner)

### Steps

1. **Check Verification Status**

   ```typescript
   const verification = await db.query.userVerification.findFirst({
   	where: eq(userVerification.userId, user.id)
   });

   if (verification?.status !== 'approved') {
   	return fail(403, { error: 'KTP verification required' });
   }
   ```

2. **Create Organization**

   ```
   POST /api/organizations
   Body: {
     name: "Koneksi Digital",
     slug: "koneksi-digital",
     brandColor: "#4f46e5",
     planType: "free"
   }
   ```

3. **Auto-assign Owner**
   - Creator automatically becomes `owner` role
   - Owner gets full permissions

4. **Fill Organization Details** (Optional)
   - Legal name
   - Description
   - Logo upload
   - Contact information

5. **Organization Verification** (Optional)
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

1. **Submit Verification**

   ```
   POST /api/organizations/{orgId}/verification
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

2. **Admin Review**
   - Admin checks submitted documents
   - Verifies legal entity existence
   - Approves or rejects

3. **Result**
   - If approved:
     - `organizationVerification.isTrusted = true`
     - Courses get "Verified Organization" badge
     - Higher visibility in marketplace
   - If rejected:
     - Reason provided
     - Can resubmit with corrected docs

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

1. **Send Invitation**

   ```
   POST /api/organizations/{orgId}/invite
   Body: {
     email: "mentor@example.com",
     role: "mentor" // or "facilitator"
   }
   ```

2. **Validation Rules**

   ```typescript
   // Check if user already has role in this org
   const existingRole = await db.query.organizationMember.findFirst({
   	where: and(eq(organizationMember.orgId, orgId), eq(organizationMember.userId, invitee.id))
   });

   if (existingRole) {
   	// NO DOUBLE ROLES in same organization
   	return fail(400, {
   		error: 'User already has a role in this organization'
   	});
   }
   ```

3. **User Accepts Invitation**

   ```
   POST /api/invitations/{inviteId}/accept
   ```

4. **Auto-Affiliate Creation** (Automatic)

   ```typescript
   // Auto-create affiliate account
   const affiliateAccount = await db.insert(affiliateAccount).values({
   	id: generateId(),
   	userId: invitee.id,
   	orgId: orgId,
   	role: invitedRole, // 'mentor' or 'facilitator'
   	commissionRate: 25, // Default 25%
   	tier: 'bronze',
   	isActive: true
   });

   // Auto-generate affiliate links for all org courses
   const orgCourses = await getCoursesByOrg(orgId);
   for (const course of orgCourses) {
   	await createAutoAffiliateLink(affiliateAccount.id, course.id);
   }
   ```

5. **Role-Specific Onboarding** (Required)
   - **For Mentor**: Complete profile, expertise, portfolio, payout setup
   - **For Facilitator**: Confirm org context, payout setup
   - **Different from student onboarding!**

6. **Role Switcher Enabled**
   - User can now switch between Student view and Mentor/Facilitator view
   - Via RoleSwitcher in sidebar

### Auto-Affiliate Features

| Feature              | Description                       |
| -------------------- | --------------------------------- |
| Auto-generated links | Links for all org courses         |
| Unique referral code | e.g., "mentor-budi-abc123"        |
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

1. **Create Course** (Draft)

   ```
   POST /api/courses
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

2. **Add Content**
   - Create Modules
   - Add Lessons to modules
   - Add Materials to lessons

3. **Publish Course**
   - Set status to `published`
   - Course appears in marketplace
   - Affiliate links auto-generated for mentors/facilitators

4. **Verified Organization Badge**
   ```
   IF org.isTrusted === true:
     Course shows "Verified Organization" badge
   ```

---

## Workflow 4: Student Enrollment

### Actors

- **Student** (self-enrollment)
- **Admin/Facilitator** (bulk enrollment)

### Steps

1. **Browse Marketplace**
   - View available courses
   - See course details
   - Note "Verified Organization" badge if applicable

2. **Select Track** (if course has tracks enabled)
   - Content Creator
   - E-Commerce Seller
   - Affiliate Pro

3. **Apply Coupon** (optional)
   - Enter coupon code
   - Validate and apply discount

4. **Checkout**
   - Payment via Midtrans
   - Or submit payment proof

5. **Activation**
   - Enrollment status → `active`
   - Access granted to course content
   - Tracker system activated

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

## Quick Reference: Key API Endpoints

### User & Verification

| Action             | Method | Endpoint                |
| ------------------ | ------ | ----------------------- |
| Register           | POST   | `/auth/register`        |
| Submit KTP         | POST   | `/api/verification/ktp` |
| Check Verification | GET    | `/api/verification/ktp` |

### Organization

| Action                  | Method | Endpoint                               |
| ----------------------- | ------ | -------------------------------------- |
| Create Org              | POST   | `/api/organizations`                   |
| Submit Org Verification | POST   | `/api/organizations/{id}/verification` |
| Invite Member           | POST   | `/api/organizations/{id}/invite`       |

### Courses & Enrollment

| Action        | Method | Endpoint           |
| ------------- | ------ | ------------------ |
| Create Course | POST   | `/api/courses`     |
| Enroll        | POST   | `/api/enrollments` |

### Affiliate

| Action                   | Method | Endpoint               |
| ------------------------ | ------ | ---------------------- |
| View Affiliate Dashboard | GET    | `/api/affiliate`       |
| Generate Link            | POST   | `/api/affiliate/links` |

### Tracker

| Action          | Method | Endpoint                  |
| --------------- | ------ | ------------------------- |
| View Tracker    | GET    | `/api/tracker`            |
| View Activities | GET    | `/api/tracker/activities` |

---

## Diagrams

### Complete User Journey

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
