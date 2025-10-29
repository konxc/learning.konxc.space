# Dashboard RBAC & Learning Management System - Naik Kelas by Koneksi

## Overview

Implementasi sistem dashboard dengan role-based access control (Admin/Mentor/User), manajemen course lengkap, sistem kupon kode untuk diskon atau kursus gratis, dan onboarding flow untuk user baru.

## Progress Status

### Completed ✅

- Phase 1: Database Schema Extension
- Phase 2: Authentication & Authorization Middleware
- Phase 3: Dashboard Layout & Structure
- Phase 5: Onboarding Flow

### Pending 📋

- Phase 4: Role-Based Routes (0/8 files)
- Phase 6: Coupon System (0/3 files)

---

## Phase 4: Role-Based Routes

### Admin Routes

#### Tasks:

- [ ] `src/routes/dashboard/admin/courses/+page.svelte` - Course management list
- [ ] `src/routes/dashboard/admin/courses/create/+page.svelte` - Create course form
- [ ] `src/routes/dashboard/admin/coupons/+page.svelte` - Coupon management
- [ ] `src/routes/dashboard/admin/users/+page.svelte` - User management

#### Required features:

- Admin can view all courses (draft, published, archived)
- Create new courses with form validation
- Edit/delete courses
- Manage coupon codes
- User management with role assignment

### Mentor Routes

#### Tasks:

- [ ] `src/routes/dashboard/mentor/courses/+page.svelte` - Mentor's assigned courses
- [ ] `src/routes/dashboard/mentor/students/+page.svelte` - Assigned students list

#### Required features:

- View courses assigned to mentor
- View students enrolled in their courses
- Track student progress

### User Routes

#### Tasks:

- [ ] `src/routes/dashboard/courses/+page.svelte` - Browse available courses
- [ ] `src/routes/dashboard/my-courses/+page.svelte` - User's enrolled courses
- [ ] `src/routes/dashboard/courses/[id]/enroll/+page.server.ts` - Enrollment action

#### Required features:

- Browse and filter courses
- View enrolled courses with progress
- Enrollment with coupon support

---

## Phase 6: Coupon System

### Tasks:

- [ ] `src/lib/server/coupon.ts` - Coupon validation & calculation logic
- [ ] `src/routes/dashboard/admin/coupons/create/+page.svelte` - Create coupon form
- [ ] `src/routes/api/coupons/validate/+server.ts` - Coupon validation API

### Required features:

- Generate discount coupons (percentage or fixed amount)
- Generate free course coupons
- Configure usage limits and validity period
- Track coupon usage history
- Apply coupon during enrollment/onboarding

---

## Implementation Priority

**High Priority:**

1. Admin: Course management (CRUD)
2. User: Browse courses
3. User: My enrolled courses

**Medium Priority:**

4. Coupon system logic
5. Admin: Coupon management
6. Enrollment with coupon

**Low Priority:**

7. Mentor: View assigned courses
8. Mentor: View students

---

## Estimated Remaining Work

- Total files to create: 11 files
- Estimated complexity: Medium-High
- Timeline: 2-3 hours
