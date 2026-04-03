# Spec: Core LMS Enhancement

## Overview

Penyempurnaan dan penambahan fitur Core LMS untuk setiap role (Platform Admin, Org Owner/Admin, Mentor, Facilitator, Member/Student) dengan fokus pada workflow yang sudah ada dan enhancement yang diperlukan untuk MVP launch.

## Context

Berdasarkan audit codebase:

- ✅ Struktur route sudah ada untuk semua role
- ✅ Basic course management sudah ada
- ✅ Basic learning flow sudah ada
- ⚠️ Perlu enhancement untuk grading, cohort management, dan student experience
- 🔴 Belum ada: Course builder enhancement, mentor dashboard enhancement, student analytics

## Requirements

### R1 — Platform Admin Dashboard Enhancement

**Context:** Route `/app/admin/` sudah ada, perlu enhancement untuk monitoring LMS

- R1.1: Dashboard overview dengan key metrics (total courses, active students, completion rate)
- R1.2: Course approval workflow (jika org baru submit course untuk marketplace)
- R1.3: User activity monitoring (login, enrollment, completion)
- R1.4: System health monitoring (database, storage, API usage)
- R1.5: Bulk operations (bulk approve courses, bulk user management)

### R2 — Org Owner/Admin Dashboard Enhancement

**Context:** Route `/app/organizations/[id]/` sudah ada, perlu enhancement

- R2.1: Org dashboard overview dengan metrics (active courses, enrolled students, revenue)
- R2.2: Member management enhancement (bulk invite, role assignment, activity tracking)
- R2.3: Course management overview (all courses in org, status, enrollment count)
- R2.4: Billing & subscription management (jika ada tier system)
- R2.5: Org settings enhancement (branding, notification preferences, integrations)

### R3 — Mentor Dashboard & Course Builder Enhancement

**Context:** Route `/app/organizations/[id]/mentor/` sudah ada, perlu enhancement

#### R3.1 — Mentor Dashboard

- R3.1.1: Dashboard overview (my courses, pending submissions, student progress)
- R3.1.2: Quick actions (create course, grade submissions, broadcast message)
- R3.1.3: Analytics per course (enrollment, completion rate, avg score)

#### R3.2 — Course Builder Enhancement

- R3.2.1: Course creation wizard (step-by-step: basic info → modules → lessons → pricing)
- R3.2.2: Module & lesson drag-and-drop reordering
- R3.2.3: Rich text editor enhancement (formatting, image upload, code blocks)
- R3.2.4: Video embedding (YouTube, Vimeo, direct upload)
- R3.2.5: Material management (upload, organize, preview)
- R3.2.6: Quiz builder enhancement (multiple choice, essay, code submission)
- R3.2.7: Assignment builder (description, rubric, deadline, max score)
- R3.2.8: Course preview mode (view as student)
- R3.2.9: Course duplication/cloning
- R3.2.10: Bulk content import (CSV, JSON)

#### R3.3 — Grading System Enhancement

- R3.3.1: Grading dashboard (pending submissions, graded, overdue)
- R3.3.2: Submission detail view (student info, submission content, history)
- R3.3.3: Rubric-based grading (criteria, score per criteria, total score)
- R3.3.4: Feedback editor (rich text, file attachment)
- R3.3.5: Bulk grading (select multiple, apply same grade/feedback)
- R3.3.6: Grading analytics (avg time to grade, pending count, completion rate)
- R3.3.7: Auto-grading for multiple choice quiz

#### R3.4 — Student Management (Mentor View)

- R3.4.1: Student list per course (name, progress, last activity, grade)
- R3.4.2: Student detail view (all submissions, progress, notes)
- R3.4.3: Student progress tracking (lessons completed, quiz scores, assignment grades)
- R3.4.4: Student communication (send message, broadcast to cohort)

### R4 — Facilitator Dashboard Enhancement

**Context:** Route `/app/organizations/[id]/facilitator/` sudah ada, perlu enhancement

- R4.1: Facilitator dashboard overview (assigned cohorts, pending checkpoints, student issues)
- R4.2: Cohort monitoring (student list, progress heatmap, at-risk students)
- R4.3: Checkpoint review (submission list, approve/reject, feedback)
- R4.4: Student support (answer questions, escalate to mentor)
- R4.5: Cohort communication (announcements, reminders)

### R5 — Student Learning Experience Enhancement

**Context:** Route `/app/learning/` sudah ada, perlu enhancement

#### R5.1 — Learning Dashboard

- R5.1.1: Dashboard overview (enrolled courses, progress, upcoming deadlines)
- R5.1.2: Continue learning (last lesson, next lesson suggestion)
- R5.1.3: Achievements & badges (completed courses, milestones)
- R5.1.4: Learning streak tracking (days in a row)

#### R5.2 — Course Learning Page Enhancement

- R5.2.1: Course sidebar (module/lesson navigation, progress indicator)
- R5.2.2: Lesson content display (video player, PDF viewer, rich text)
- R5.2.3: Lesson navigation (previous, next, mark as complete)
- R5.2.4: Note-taking enhancement (inline notes, highlight, bookmark)
- R5.2.5: Quiz taking (multiple choice, essay, code submission)
- R5.2.6: Assignment submission (file upload, text editor, deadline countdown)
- R5.2.7: Discussion per lesson (ask question, reply, upvote)

#### R5.3 — Progress Tracking

- R5.3.1: Progress page (all courses, completion %, time spent)
- R5.3.2: Certificate page (completed courses, download certificate)
- R5.3.3: Checkpoint page (submitted checkpoints, feedback, status)

#### R5.4 — Student Analytics (Personal)

- R5.4.1: Learning velocity (lessons per week, time spent per day)
- R5.4.2: Performance analytics (quiz scores, assignment grades, avg score)
- R5.4.3: Estimated completion date (based on current pace)
- R5.4.4: Personalized recommendations (next course, related topics)

### R6 — Cohort Management Enhancement

**Context:** Cohort table sudah ada di schema, perlu UI & workflow

- R6.1: Cohort creation wizard (name, course, start date, end date, facilitator)
- R6.2: Cohort enrollment (bulk add students, invite link)
- R6.3: Cohort calendar (schedule, deadlines, events)
- R6.4: Cohort progress dashboard (completion rate, at-risk students, avg score)
- R6.5: Cohort communication (announcements, reminders, discussion board)
- R6.6: Cohort comparison (compare multiple cohorts, identify best practices)

### R7 — Course Discovery & Enrollment Enhancement

**Context:** Route `/app/explore/` sudah ada, perlu enhancement

- R7.1: Course catalog (grid view, list view, filter by track/category/price)
- R7.2: Course detail page (description, syllabus, instructor, reviews, enroll button)
- R7.3: Course search (by title, description, tags)
- R7.4: Course recommendation (based on completed courses, track)
- R7.5: Enrollment flow (select payment method, apply coupon, confirm)
- R7.6: Free trial (if applicable, 7 days trial for paid courses)

### R8 — Discussion & Community Enhancement

**Context:** Route `/app/discussion/` sudah ada, perlu enhancement

- R8.1: Discussion board (all discussions, filter by course/topic)
- R8.2: Create discussion (title, content, tags, attach file)
- R8.3: Reply & comment (nested replies, upvote, mark as solution)
- R8.4: Discussion per lesson (context-aware, linked to lesson)
- R8.5: Mentor/facilitator moderation (pin, close, delete)

## Technical Constraints

### Database Schema

- Semua tabel sudah ada di `src/lib/server/db/schema.ts`
- Tidak perlu tambah tabel baru untuk R1-R8
- Jika perlu kolom baru, tambahkan via migration

### RBAC

- Semua route sudah terdaftar di `src/lib/server/rbac.ts`
- Pastikan setiap enhancement respect RBAC (platform vs org roles)
- Gunakan `requireOrgMembership()` untuk org-level access

### Design Tokens

- Gunakan design tokens dari `$lib/config/design`
- Jangan hardcode warna, shadow, radius
- Konsisten dengan dashboard layout yang sudah ada

### Performance

- Pagination untuk list (courses, students, submissions) — max 20 per page
- Lazy loading untuk video & PDF
- Debounce untuk search & filter

## Acceptance Criteria

### R1 — Platform Admin

- [ ] Admin dashboard menampilkan key metrics dengan data real
- [ ] Course approval workflow berfungsi
- [ ] User activity monitoring berfungsi
- [ ] Bulk operations berfungsi

### R2 — Org Owner/Admin

- [ ] Org dashboard menampilkan metrics dengan data real
- [ ] Member management enhancement berfungsi
- [ ] Course management overview berfungsi
- [ ] Org settings enhancement berfungsi

### R3 — Mentor

- [ ] Mentor dashboard menampilkan overview dengan data real
- [ ] Course builder wizard berfungsi
- [ ] Drag-and-drop reordering berfungsi
- [ ] Rich text editor berfungsi
- [ ] Video embedding berfungsi
- [ ] Quiz & assignment builder berfungsi
- [ ] Course preview mode berfungsi
- [ ] Grading dashboard berfungsi
- [ ] Rubric-based grading berfungsi
- [ ] Bulk grading berfungsi
- [ ] Student management berfungsi

### R4 — Facilitator

- [ ] Facilitator dashboard menampilkan overview dengan data real
- [ ] Cohort monitoring berfungsi
- [ ] Checkpoint review berfungsi
- [ ] Student support berfungsi

### R5 — Student

- [ ] Learning dashboard menampilkan overview dengan data real
- [ ] Course learning page enhancement berfungsi
- [ ] Note-taking enhancement berfungsi
- [ ] Quiz & assignment submission berfungsi
- [ ] Progress tracking berfungsi
- [ ] Student analytics berfungsi

### R6 — Cohort Management

- [ ] Cohort creation wizard berfungsi
- [ ] Cohort enrollment berfungsi
- [ ] Cohort calendar berfungsi
- [ ] Cohort progress dashboard berfungsi

### R7 — Course Discovery

- [ ] Course catalog dengan filter berfungsi
- [ ] Course detail page berfungsi
- [ ] Course search berfungsi
- [ ] Enrollment flow berfungsi

### R8 — Discussion

- [ ] Discussion board berfungsi
- [ ] Create & reply discussion berfungsi
- [ ] Discussion per lesson berfungsi
- [ ] Moderation berfungsi

### General

- [ ] pnpm run check 0 errors
- [ ] Semua fitur respect RBAC
- [ ] Semua fitur menggunakan design tokens
- [ ] Pagination & lazy loading berfungsi
- [ ] Responsive design (mobile, tablet, desktop)

## Priority

**Phase 1 — MVP Critical (Week 1-2):**

- R3.2: Course Builder Enhancement (mentor harus bisa buat course dengan mudah)
- R3.3: Grading System Enhancement (mentor harus bisa grade submission)
- R5.2: Course Learning Page Enhancement (student harus bisa belajar dengan nyaman)
- R7: Course Discovery & Enrollment (student harus bisa discover & enroll course)

**Phase 2 — Important (Week 3-4):**

- R2: Org Owner/Admin Dashboard Enhancement
- R3.1: Mentor Dashboard
- R3.4: Student Management (Mentor View)
- R5.1: Learning Dashboard
- R5.3: Progress Tracking
- R6: Cohort Management Enhancement

**Phase 3 — Enhancement (Week 5-6):**

- R1: Platform Admin Dashboard Enhancement
- R4: Facilitator Dashboard Enhancement
- R5.4: Student Analytics
- R8: Discussion & Community Enhancement

## Notes

- Semua fitur harus backward compatible (jangan hapus fitur yang sudah ada)
- Jika ada breaking change, buat migration script
- Test setiap fitur dengan data dummy sebelum push
- Update seed data jika perlu
