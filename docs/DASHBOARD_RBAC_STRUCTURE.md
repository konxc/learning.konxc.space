# Dashboard RBAC Structure

## Overview

Dashboard dengan role-based access control untuk Admin, Mentor, dan User biasa dengan struktur group yang jelas.

## Route Structure

### Base Layout
- `/dashboard` - Dashboard overview
- `/dashboard/+layout.svelte` - Group layout dengan sidebar navigation
- `/dashboard/+layout.server.ts` - Auth check & role-based navigation

### User Routes (Role: user)
- `/dashboard/courses` - Browse available courses (marketplace)
- `/dashboard/courses/[id]` - Course detail page dengan enroll button
- `/dashboard/my-courses` - Enrolled courses (enrollments)
- `/dashboard/apply-mentor` - Apply to become mentor
- `/dashboard/my-mentor-application` - View application status

### Mentor Routes (Role: mentor)
- `/dashboard/courses` - Browse available courses
- `/dashboard/my-courses` - Enrolled courses sebagai user
- `/dashboard/mentor/courses` - Manage assigned courses
- `/dashboard/mentor/students` - View assigned students

### Admin Routes (Role: admin)
- `/dashboard/admin/courses` - Manage all courses (CRUD)
- `/dashboard/admin/courses/create` - Create course form
- `/dashboard/admin/courses/edit/[id]` - Edit course form
- `/dashboard/admin/courses/delete/[id]` - Delete course API
- `/dashboard/admin/coupons` - Manage coupons
- `/dashboard/admin/coupons/create` - Create coupon form
- `/dashboard/admin/users` - Manage users
- `/dashboard/admin/mentor-applications` - Review mentor applications
- `/dashboard/admin/mentor-applications/review/[id]` - Review/approve/reject

## Features per Role

### Admin
- Full course management (create, edit, delete, publish)
- Coupon management (create, view, edit, toggle)
- User management (view, role assignment)
- Mentor application review (approve/reject)
- Can assign mentors to courses

### Mentor
- Browse and enroll courses (as regular user)
- View assigned courses
- View students in assigned courses
- Can see all courses they teach

### User
- Browse available courses
- Enroll in courses (with coupon support)
- View enrolled courses
- Apply to become mentor
- Track application status

## Navigation Structure

### Admin Navigation
1. Dashboard
2. Manage Courses
3. Coupons
4. Users
5. Mentor Applications

### Mentor Navigation
1. Dashboard
2. Browse Courses
3. My Enrollments
4. My Mentor Courses
5. Students

### User Navigation
1. Dashboard
2. Browse Courses
3. My Enrollments
4. Apply as Mentor
5. My Application

## Course Enrollment Flow

1. Browse courses at `/dashboard/courses`
2. View course detail at `/dashboard/courses/[id]`
3. Click "Enroll Now" button
4. If has coupon, apply coupon code
5. Complete enrollment
6. Redirect to `/dashboard/my-courses`

## Database Integration

- Uses Drizzle ORM with LibSQL (Turso)
- All tables: user, session, course, enrollment, coupon, couponUsage, mentorApplication
- Proper foreign key relationships
- Timestamps and audit trails

## Security

- Authentication required untuk semua dashboard routes
- Role-based authorization
- Admin only routes protected by requireAdmin middleware
- Mentor routes protected by requireMentor middleware
- Session management dengan Lucia v3
