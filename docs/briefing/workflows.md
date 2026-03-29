# Organizational Workflows

> **Status:** PRODUCTION
> **Last Updated:** 2026-03-29

## Overview

This document outlines the organizational hierarchy and key workflows for multi-tenant operations in Naik Kelas 2.0.

---

## Hierarchy Structure

```
Organization (Tenant)
├── Workspaces (Departments/Teams)
│   └── Members
├── Courses (Organization-specific)
│   └── Cohorts (Batches)
│       ├── Facilitator
│       └── Students
└── Billing & Subscription
```

### Entity Relationships

| Entity       | Parent        | Children                     |
| ------------ | ------------- | ---------------------------- |
| Organization | -             | Workspaces, Courses, Members |
| Workspace    | Organization  | Members                      |
| Course       | Organization  | Modules, Lessons             |
| Cohort       | Course        | Enrollments, Checkpoints     |
| Enrollment   | Cohort/Course | Progress, Grades             |

---

## Workflow 1: Creating an Organization

### Actors

- **Admin** or any user can create an organization

### Steps

1. **Navigate** to Organization Settings
2. **Create Organization**
   - Name (required)
   - Slug (auto-generated, unique)
   - Brand Color (optional)
   - Plan Type (free/pro/enterprise)
3. **Auto-assignment**: Creator becomes `owner`

### API Flow

```
POST /api/organizations
Body: { name, slug, brandColor, planType }
→ Creates organization
→ Adds creator as owner
→ Returns organization object
```

### Code Reference

```
src/routes/(dashboard)/app/organizations/+page.server.ts
```

---

## Workflow 2: Adding Members to Organization

### Actors

- **Organization Owner/Admin** can invite members

### Roles Available

- `owner` - Full control (1 per org)
- `admin` - Manage members, courses
- `creator` - Create courses
- `facilitator` - Manage cohorts
- `member` - Read-only

### Steps

1. **Navigate** to Organization → Members
2. **Invite Member**
   - Enter email
   - Select role
   - Send invitation
3. **Accept Invitation**
   - Invitee receives email/notification
   - Clicks invitation link
   - Joins organization

### Code Reference

```
src/routes/(dashboard)/app/organizations/[id]/members/
src/lib/server/db/schema.ts (organizationInvitation table)
```

---

## Workflow 3: Assigning Facilitators to Batches

### Actors

- **Mentor** or **Organization Admin**

### Steps

1. **Create Cohort**

   ```
   POST /api/cohorts
   Body: {
     courseId,
     name,
     facilitatorId,
     startDate,
     endDate
   }
   ```

2. **Select Facilitator**
   - Must be organization member with `facilitator` role
   - One facilitator per cohort

3. **Enroll Students**
   - Bulk enroll from organization members
   - Individual enrollment

4. **Facilitator Access**
   - Facilitator can now see cohort in "My Batches"
   - Can track student progress
   - Can moderate discussions

### Code Reference

```
src/lib/server/db/schema.ts (cohort table)
src/routes/(dashboard)/app/mentor/students/
```

---

## Workflow 4: Course Creation & Publishing

### Actors

- **Mentor** or **Organization Creator**

### Steps

1. **Create Course** (Draft)

   ```
   POST /api/courses
   Body: { title, description, price, category }
   ```

2. **Add Content**
   - Create Modules
   - Add Lessons to modules
   - Add Materials to lessons

3. **Configure Features**

   ```json
   {
   	"tracks": true, // Enable track selection
   	"affiliate": true, // Enable affiliate program
   	"performance": true // Enable progress tracking
   }
   ```

4. **Publish Course**
   - Set status to `published`
   - Course appears in marketplace

5. **Assign to Organization** (optional)
   ```sql
   UPDATE course SET org_id = 'org-xxx' WHERE id = 'course-xxx';
   ```

### Code Reference

```
src/routes/(dashboard)/app/my-courses/
src/routes/(dashboard)/app/explore/[id]/
```

---

## Workflow 5: Student Enrollment Flow

### Actors

- **Student** (self-enrollment)
- **Admin/Facilitator** (bulk enrollment)

### Self-Enrollment Steps

1. **Browse Marketplace**
   - View available courses
   - See course details

2. **Select Track** (if course has tracks enabled)
   - Content Creator
   - E-Commerce Seller
   - Affiliate Pro

3. **Apply Coupon** (optional)
   - Enter coupon code
   - Validate and apply discount

4. **Checkout**
   - Review order
   - Make payment (Midtrans)
   - Or submit payment proof

5. **Activation**
   - Payment verified
   - Enrollment status → `active`
   - Access granted to course content

### Bulk Enrollment (Admin)

```
POST /api/enrollments/bulk
Body: {
  courseId,
  cohortId,
  studentIds: [...]
}
```

### Code Reference

```
src/routes/(dashboard)/app/explore/[id]/enroll/
src/routes/(public)/marketplace/[id]/checkout/
```

---

## Workflow 6: Learning Progress Flow

### Student Journey

```
1. Start Lesson
   ↓
2. Watch Video / Read Material
   ↓
3. Mark as Complete
   ↓
4. Take Quiz (if exists)
   ↓
5. Submit Assignment (if exists)
   ↓
6. Next Lesson
   ↓
7. Complete Module
   ↓
8. Complete Course
   ↓
9. Earn Certificate
```

### Checkpoint System

| Week | Checkpoint    | Submission  |
| ---- | ------------- | ----------- |
| 1-2  | Weekly Task   | Text/File   |
| 3-4  | Milestone 1   | Quiz + Task |
| 5-6  | Weekly Task   | Text/File   |
| 7-8  | Final Project | Portfolio   |

### Code Reference

```
src/routes/(dashboard)/app/learning/
src/routes/(dashboard)/app/checkpoints/
```

---

## Workflow 7: Grading & Certification

### Assessment Flow

1. **Student Submits**
   - Quiz answer or assignment file
   - Timestamp recorded

2. **Auto-Grading** (MCQ)
   - Immediate result
   - Grade recorded

3. **Manual Grading** (Assignments)
   - Mentor reviews submission
   - Adds grade and feedback
   - Student notified

4. **Certificate Generation**
   - Course completed
   - All checkpoints passed
   - Certificate PDF generated
   - Unique serial number

### Code Reference

```
src/routes/(dashboard)/app/explore/[courseId]/learn/quiz/
src/routes/(dashboard)/app/learning/certificates/
```

---

## Workflow 8: Affiliate Program

### How It Works

1. **Generate Link**
   - Student/Affiliate creates link for a course
   - Gets unique tracking URL

2. **Share Link**
   - Social media, blog, etc.

3. **Track Clicks**
   - Link clicked → recorded
   - Unique visitor tracked

4. **Conversion**
   - Visitor enrolls via link
   - Sale recorded
   - Commission calculated

5. **Payout**
   - Commission accumulated
   - Manual payout by admin

### Commission Example

```
Course Price: Rp 1,500,000
Commission Rate: 25%
Commission: Rp 375,000
```

### Code Reference

```
src/routes/(dashboard)/app/affiliate/
src/lib/server/db/schema.ts (affiliateLink, affiliateSale)
```

---

## Workflow 9: Organization Billing

### Plan Types

| Plan       | Price  | Features                 |
| ---------- | ------ | ------------------------ |
| Free       | -      | 1 course, 10 students    |
| Pro        | Custom | 10 courses, 100 students |
| Enterprise | Custom | Unlimited                |

### Billing Flow

1. **Organization Created**
   - Default: Free plan
   - Limited features

2. **Upgrade Request**
   - Contact admin/BD
   - Select plan
   - Generate invoice

3. **Activation**
   - Payment received
   - Plan upgraded
   - Features unlocked

### Code Reference

```
src/lib/server/db/schema.ts (organization.planType)
```

---

## Quick Reference: Key API Endpoints

| Action                | Method | Endpoint                          |
| --------------------- | ------ | --------------------------------- |
| Create Org            | POST   | `/api/organizations`              |
| Invite Member         | POST   | `/api/organizations/[id]/invite`  |
| Create Course         | POST   | `/api/courses`                    |
| Create Cohort         | POST   | `/api/cohorts`                    |
| Enroll Student        | POST   | `/api/enrollments`                |
| Generate Certificate  | POST   | `/api/certificates/[id]/generate` |
| Create Affiliate Link | POST   | `/api/affiliate/links`            |

---

## Diagrams

### Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    NAIK KELAS 2.0                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Organization│  │ Organization│  │ Organization│     │
│  │  (Yayasan)  │  │  (Sekolah)  │  │   (Bisnis)  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐     │
│  │  Workspace  │  │  Workspace  │  │  Workspace  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐     │
│  │   Courses   │  │   Courses   │  │   Courses   │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┴──────┘     │
│         │                │                             │
│  ┌──────┴──────┐  ┌──────┴──────┐                      │
│  │   Cohorts   │  │   Cohorts   │                      │
│  └──────┬──────┘  └──────┴──────┘                      │
│         │                                              │
│  ┌──────┴──────┐                                       │
│  │  Students   │                                       │
│  └─────────────┘                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Student Enrollment Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│ Browse  │────▶│ Select   │────▶│ Apply   │────▶│ Checkout │
│ Course  │     │ Track    │     │ Coupon  │     │ Payment  │
└─────────┘     └──────────┘     └─────────┘     └────┬─────┘
                                                       │
                                                       ▼
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│ Earn    │◀────│ Complete │◀────│ Submit  │◀────│ Access   │
│ Cert    │     │ Course   │     │ Tasks   │     │ Content  │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
```
