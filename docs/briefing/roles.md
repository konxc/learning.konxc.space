# Role Definitions & Permissions

> **Status:** PRODUCTION
> **Last Updated:** 2026-03-29

## Overview

Naik Kelas 2.0 uses a multi-tiered role system with platform-wide roles and organization-specific roles.

---

## Platform Roles

### 1. Admin

| Attribute            | Value                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| **Role Key**         | `admin`                                                                 |
| **Description**      | Platform administrator with full system access                          |
| **Responsibilities** | System configuration, user management, analytics, payments              |
| **Default Nav**      | Dashboard, Courses, Cohorts, Users, Reports, Coupons, Payments, Plugins |

**Permissions:**

- Full CRUD on all entities
- Access to all dashboards (Admin, Mentor, Facilitator, Student)
- Plugin management
- Organization management
- Financial reports & transactions

---

### 2. Business Development (BD)

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

### 3. Mentor (Content Creator/Owner)

| Attribute            | Value                                                             |
| -------------------- | ----------------------------------------------------------------- |
| **Role Key**         | `mentor`                                                          |
| **Description**      | Content creator and course owner. Creates curriculum and teaches. |
| **Responsibilities** | Course creation, curriculum design, student assessment            |
| **Default Nav**      | Dashboard, My Courses, Students, Broadcast                        |

**Permissions:**

- CRUD on own courses
- Create modules, lessons, materials
- Grade submissions
- Broadcast messages to students
- View student analytics

**Mentor vs Facilitator:**

- **Mentor** = Creates content, owns the course
- **Facilitator** = Manages cohort batches, guides students through existing content

---

### 4. Facilitator (Batch Manager/Guide)

| Attribute            | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| **Role Key**         | `facilitator`                                          |
| **Description**      | Batch manager who guides students through cohorts      |
| **Responsibilities** | Cohort management, student guidance, progress tracking |
| **Default Nav**      | Dashboard, My Batches, Students                        |

**Permissions:**

- View assigned cohorts
- Track student progress
- Moderate discussions
- Send broadcast to cohort
- Cannot create courses (only mentors can)

---

### 5. Student (User)

| Attribute            | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| **Role Key**         | `user`                                                  |
| **Description**      | Learner enrolled in courses                             |
| **Responsibilities** | Complete courses, submit assignments, earn certificates |
| **Default Nav**      | Dashboard, Explore, My Learning, Leaderboard, Affiliate |

**Permissions:**

- Enroll in courses
- Access learning materials
- Submit assignments
- Participate in discussions
- Earn XP and badges
- Affiliate program (if enabled)

---

## Organization Roles (Multi-Tenant)

| Role          | Permissions                                     |
| ------------- | ----------------------------------------------- |
| `owner`       | Full control - delete org, billing, all members |
| `admin`       | Manage members, courses, cohorts, analytics     |
| `creator`     | Create and manage own courses                   |
| `facilitator` | Manage assigned cohorts                         |
| `member`      | Read-only access                                |

---

## Workspace Roles (Sub-division)

| Role     | Permissions                        |
| -------- | ---------------------------------- |
| `admin`  | Manage workspace, invite members   |
| `member` | Full access to workspace resources |
| `viewer` | Read-only access                   |

---

## Enrollment Tracks

Students can specialize in one of three tracks when enrolling in track-enabled courses:

| Track       | Icon | Description       | Focus                               |
| ----------- | ---- | ----------------- | ----------------------------------- |
| `creator`   | 🎬   | Content Creator   | Build audience, create content      |
| `seller`    | 🛒   | E-Commerce Seller | Marketplace, sales optimization     |
| `affiliate` | 🔗   | Affiliate Pro     | Passive income from recommendations |

---

## Scenarios

### Scenario 1: Corporate Training

```
Organization: "PT Maju Jaya"
├── Admin: HR Manager
├── Mentors: Internal trainers
├── Facilitators: Department heads
└── Students: Employees
```

**Workflow:**

1. HR creates organization
2. Trainers create courses
3. Department heads manage batches
4. Employees enroll and learn

---

### Scenario 2: Independent Mentor

```
User: "Budi Santoso" (Mentor)
├── Creates: Python Programming Course
├── Publishes: To marketplace
├── Earns: From enrollments
└── Manages: Own cohorts
```

**Workflow:**

1. Mentor creates course content
2. Publishes to marketplace
3. Students enroll directly
4. Mentor can optionally assign facilitators

---

### Scenario 3: School Partnership

```
Partner: "SMA Negeri 1 Jakarta"
├── Organization: School's own space
├── Courses: Subscribed from Naik Kelas
├── Facilitators: Teachers
└── Students: Students
```

**Workflow:**

1. School signs partnership
2. Gets organization space
3. Teachers become facilitators
4. Students access subscribed courses

---

## Role Switching

Users with multiple roles (e.g., Admin who is also a Mentor) can switch roles via:

- **UI:** Role Switcher dropdown in header
- **Cookie:** `active-role` (7 days persistence)
- **Server:** `hooks.server.ts` validates role access

**Switch Map:**

| Base Role     | Can Switch To                        |
| ------------- | ------------------------------------ |
| `admin`       | admin, bd, mentor, user, facilitator |
| `bd`          | bd, user                             |
| `mentor`      | mentor, user                         |
| `facilitator` | facilitator, user                    |
| `user`        | (none - no switcher)                 |

---

## Code References

| Concept          | File                                         |
| ---------------- | -------------------------------------------- |
| Role constants   | `src/lib/constants/roles.ts`                 |
| RBAC logic       | `src/lib/server/rbac.ts`                     |
| Role switcher UI | `src/lib/components/app/RoleSwitcher.svelte` |
| Onboarding       | `src/routes/onboarding/+page.svelte`         |
| Auth hooks       | `src/hooks.server.ts`                        |
