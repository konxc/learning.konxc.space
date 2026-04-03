# Tasks: Core LMS Enhancement

## Phase 1 — MVP Critical (Week 1-2)

### Task 1 — Course Builder Enhancement (Mentor)

**Priority:** 🔥 Critical | **Estimasi:** 3-4 hari

#### 1.1 — Course Creation Wizard Component

- [ ] Buat `src/lib/components/app/mentor/CourseBuilder/CourseWizard.svelte`
- [ ] Implement 3-step wizard (Basic Info → Modules → Pricing)
- [ ] State management dengan `$state()` untuk track current step
- [ ] Navigation buttons (Previous, Next, Publish)
- [ ] Validation per step sebelum next
- [ ] Jalankan `pnpm run check`

#### 1.2 — Module & Lesson Editor

- [ ] Buat `src/lib/components/app/mentor/CourseBuilder/ModuleEditor.svelte`
- [ ] Buat `src/lib/components/app/mentor/CourseBuilder/LessonEditor.svelte`
- [ ] CRUD operations (Create, Read, Update, Delete)
- [ ] Drag-and-drop reordering dengan `@dnd-kit/core` atau native HTML5
- [ ] Jalankan `pnpm run check`

#### 1.3 — Rich Text Editor Integration

- [ ] Install Tiptap atau Quill (pilih salah satu)
- [ ] Buat `src/lib/components/ui/RichTextEditor.svelte`
- [ ] Support formatting (bold, italic, heading, list, link)
- [ ] Support image upload
- [ ] Support code blocks
- [ ] Integrate ke LessonEditor
- [ ] Jalankan `pnpm run check`

#### 1.4 — Video & Material Upload

- [ ] Buat `src/lib/components/app/mentor/CourseBuilder/MaterialUploader.svelte`
- [ ] Support YouTube/Vimeo URL embed
- [ ] Support direct video upload (optional, jika ada storage)
- [ ] Support PDF upload
- [ ] File validation (type, size)
- [ ] Preview uploaded materials
- [ ] Jalankan `pnpm run check`

#### 1.5 — Quiz & Assignment Builder

- [ ] Buat `src/lib/components/app/mentor/CourseBuilder/QuizBuilder.svelte`
- [ ] Multiple choice question builder
- [ ] Essay question builder
- [ ] Add/remove questions
- [ ] Set correct answers
- [ ] Buat `src/lib/components/app/mentor/CourseBuilder/AssignmentBuilder.svelte`
- [ ] Assignment description editor
- [ ] Rubric builder (criteria, max score)
- [ ] Deadline picker
- [ ] Jalankan `pnpm run check`

#### 1.6 — Course Preview Mode

- [ ] Buat route `/app/organizations/[id]/mentor/courses/[courseId]/preview`
- [ ] Display course sebagai student view
- [ ] Show all modules & lessons
- [ ] Test video player, PDF viewer
- [ ] "Back to Edit" button
- [ ] Jalankan `pnpm run check`

#### 1.7 — Course Publish Flow

- [ ] Update route `/app/organizations/[id]/mentor/courses/[courseId]/+page.server.ts`
- [ ] Add action `publish` untuk change `isDraft` to false
- [ ] Validation sebelum publish (minimal 1 module, 1 lesson)
- [ ] Success toast notification
- [ ] Redirect ke course list
- [ ] Jalankan `pnpm run check`

---

### Task 2 — Grading System Enhancement (Mentor)

**Priority:** 🔥 Critical | **Estimasi:** 2-3 hari

#### 2.1 — Grading Dashboard

- [ ] Buat route `/app/organizations/[id]/mentor/grading/+page.server.ts`
- [ ] Load pending submissions dengan pagination
- [ ] Filter by course, student, date
- [ ] Sort by submission date, student name
- [ ] Buat `src/lib/components/app/mentor/GradingDashboard.svelte`
- [ ] Display submission cards dengan status
- [ ] Quick stats (pending, graded, avg time)
- [ ] Jalankan `pnpm run check`

#### 2.2 — Submission Detail & Rubric Grading

- [ ] Buat route `/app/organizations/[id]/mentor/grading/[submissionId]/+page.server.ts`
- [ ] Load submission detail dengan student info
- [ ] Buat `src/lib/components/app/mentor/RubricGrader.svelte`
- [ ] Display rubric criteria dengan score input
- [ ] Calculate total score automatically
- [ ] Rich text feedback editor
- [ ] Save grade action
- [ ] Jalankan `pnpm run check`

#### 2.3 — Bulk Grading

- [ ] Add checkbox selection di grading dashboard
- [ ] "Select All" functionality
- [ ] Bulk grade modal (apply same score & feedback)
- [ ] Confirm before bulk grade
- [ ] Success notification dengan count
- [ ] Jalankan `pnpm run check`

#### 2.4 — Auto-grading for Multiple Choice

- [ ] Update quiz submission handler
- [ ] Compare student answers dengan correct answers
- [ ] Calculate score automatically
- [ ] Save grade to database
- [ ] Show result to student immediately
- [ ] Jalankan `pnpm run check`

---

### Task 3 — Student Learning Experience Enhancement

**Priority:** 🔥 Critical | **Estimasi:** 3-4 hari

#### 3.1 — Learning Dashboard Enhancement

- [ ] Update route `/app/learning/+page.server.ts`
- [ ] Load enrolled courses dengan progress
- [ ] Load upcoming deadlines
- [ ] Load learning streak data
- [ ] Update `src/routes/(dashboard)/app/learning/+page.svelte`
- [ ] Display "Continue Learning" section
- [ ] Display achievements & badges
- [ ] Display learning streak
- [ ] Jalankan `pnpm run check`

#### 3.2 — Course Learning Page Layout

- [ ] Update route `/app/learning/courses/[courseId]/lessons/[lessonId]/+page.server.ts`
- [ ] Load lesson content dengan module navigation
- [ ] Load lesson progress
- [ ] Load lesson notes
- [ ] Buat `src/lib/components/app/learning/LessonSidebar.svelte`
- [ ] Display modules & lessons tree
- [ ] Highlight current lesson
- [ ] Show completion checkmarks
- [ ] Collapsible modules
- [ ] Jalankan `pnpm run check`

#### 3.3 — Lesson Content Display

- [ ] Buat `src/lib/components/app/learning/LessonContent.svelte`
- [ ] Display lesson title & description
- [ ] Conditional rendering based on content type
- [ ] Buat `src/lib/components/app/learning/VideoPlayer.svelte`
- [ ] YouTube embed support
- [ ] Vimeo embed support
- [ ] Buat `src/lib/components/app/learning/PDFViewer.svelte`
- [ ] PDF.js integration atau iframe
- [ ] Jalankan `pnpm run check`

#### 3.4 — Note-taking Enhancement

- [ ] Buat `src/lib/components/app/learning/NoteEditor.svelte`
- [ ] Rich text editor untuk notes
- [ ] Auto-save notes (debounce 1s)
- [ ] Timestamp notes dengan lesson position
- [ ] List all notes per lesson
- [ ] Edit & delete notes
- [ ] Jalankan `pnpm run check`

#### 3.5 — Quiz Taking Interface

- [ ] Buat `src/lib/components/app/learning/QuizTaker.svelte`
- [ ] Display questions one by one atau all at once
- [ ] Radio buttons untuk multiple choice
- [ ] Textarea untuk essay
- [ ] Submit quiz action
- [ ] Show result immediately (for auto-graded)
- [ ] Jalankan `pnpm run check`

#### 3.6 — Assignment Submission

- [ ] Buat `src/lib/components/app/learning/AssignmentSubmitter.svelte`
- [ ] Assignment description display
- [ ] Rubric display (criteria & max score)
- [ ] Deadline countdown
- [ ] File upload atau text editor
- [ ] Submit assignment action
- [ ] Show submission status
- [ ] Jalankan `pnpm run check`

#### 3.7 — Lesson Navigation & Progress

- [ ] Add "Previous" & "Next" buttons
- [ ] "Mark as Complete" button
- [ ] Update lesson progress via API
- [ ] Update progress bar in sidebar
- [ ] Redirect to next lesson after complete
- [ ] Jalankan `pnpm run check`

---

### Task 4 — Course Discovery & Enrollment

**Priority:** 🔥 Critical | **Estimasi:** 2-3 hari

#### 4.1 — Course Catalog Enhancement

- [ ] Update route `/app/explore/+page.server.ts`
- [ ] Load courses dengan filter & pagination
- [ ] Support filter by track, category, price
- [ ] Support search by title & description
- [ ] Update `src/routes/(dashboard)/app/explore/+page.svelte`
- [ ] Buat `src/lib/components/app/course/CourseGrid.svelte`
- [ ] Buat `src/lib/components/app/course/CourseCard.svelte`
- [ ] Display course thumbnail, title, price, rating
- [ ] Jalankan `pnpm run check`

#### 4.2 — Course Filter & Search

- [ ] Buat `src/lib/components/app/course/CourseFilter.svelte`
- [ ] Filter by track (Technical, Business, Hybrid)
- [ ] Filter by category
- [ ] Filter by price (Free, Paid, range)
- [ ] Buat `src/lib/components/app/course/CourseSearch.svelte`
- [ ] Search input dengan debounce
- [ ] Search by title & description
- [ ] Jalankan `pnpm run check`

#### 4.3 — Course Detail Page

- [ ] Buat route `/app/explore/courses/[courseId]/+page.server.ts`
- [ ] Load course detail dengan modules & lessons
- [ ] Load instructor info
- [ ] Load reviews (jika ada)
- [ ] Buat `src/routes/(dashboard)/app/explore/courses/[courseId]/+page.svelte`
- [ ] Display course description
- [ ] Display syllabus (modules & lessons)
- [ ] Display instructor info
- [ ] Display reviews
- [ ] Enroll button
- [ ] Jalankan `pnpm run check`

#### 4.4 — Enrollment Flow

- [ ] Buat `src/lib/components/app/course/CourseEnrollButton.svelte`
- [ ] Check if already enrolled
- [ ] If free course → enroll directly
- [ ] If paid course → redirect to payment
- [ ] Apply coupon (optional)
- [ ] Success notification
- [ ] Redirect to learning page
- [ ] Jalankan `pnpm run check`

---

## Phase 2 — Important (Week 3-4)

### Task 5 — Mentor Dashboard

- [ ] Buat route `/app/organizations/[id]/mentor/+page.server.ts`
- [ ] Load mentor overview data
- [ ] Buat dashboard dengan metrics cards
- [ ] Quick actions section
- [ ] Recent activity feed
- [ ] Jalankan `pnpm run check`

### Task 6 — Student Management (Mentor View)

- [ ] Buat route `/app/organizations/[id]/mentor/students/+page.server.ts`
- [ ] Load students per course
- [ ] Student detail page
- [ ] Progress tracking per student
- [ ] Communication tools
- [ ] Jalankan `pnpm run check`

### Task 7 — Org Owner/Admin Dashboard

- [ ] Enhance `/app/organizations/[id]/+page.server.ts`
- [ ] Add org metrics
- [ ] Member management enhancement
- [ ] Course management overview
- [ ] Jalankan `pnpm run check`

### Task 8 — Cohort Management

- [ ] Buat cohort creation wizard
- [ ] Cohort enrollment tools
- [ ] Cohort calendar
- [ ] Cohort progress dashboard
- [ ] Jalankan `pnpm run check`

---

## Phase 3 — Enhancement (Week 5-6)

### Task 9 — Platform Admin Dashboard

- [ ] Enhance `/app/admin/+page.server.ts`
- [ ] Platform-wide metrics
- [ ] Course approval workflow
- [ ] User activity monitoring
- [ ] Jalankan `pnpm run check`

### Task 10 — Facilitator Dashboard

- [ ] Enhance `/app/organizations/[id]/facilitator/+page.server.ts`
- [ ] Cohort monitoring
- [ ] Checkpoint review
- [ ] Student support tools
- [ ] Jalankan `pnpm run check`

### Task 11 — Student Analytics

- [ ] Buat route `/app/learning/analytics/+page.server.ts`
- [ ] Learning velocity chart
- [ ] Performance analytics
- [ ] Estimated completion
- [ ] Personalized recommendations
- [ ] Jalankan `pnpm run check`

### Task 12 — Discussion Enhancement

- [ ] Enhance `/app/discussion/+page.server.ts`
- [ ] Discussion per lesson
- [ ] Reply & comment
- [ ] Upvote & mark as solution
- [ ] Moderation tools
- [ ] Jalankan `pnpm run check`

---

## Testing Tasks

### Task 13 — Unit Tests

- [ ] Test utility functions (calculateProgress, formatDate, dll)
- [ ] Test validation schemas
- [ ] Jalankan `pnpm run test`

### Task 14 — Integration Tests

- [ ] Test API endpoints (courses, grading, learning)
- [ ] Test database queries
- [ ] Jalankan `pnpm run test`

### Task 15 — E2E Tests (Playwright)

- [ ] Test mentor create course flow
- [ ] Test student enroll & learn flow
- [ ] Test grading flow
- [ ] Jalankan `pnpm run test:e2e`

---

## Final Checklist

- [ ] Semua tasks Phase 1 selesai
- [ ] `pnpm run check` 0 errors
- [ ] `pnpm run build` success
- [ ] Manual testing di browser
- [ ] Test dengan data dummy
- [ ] Update seed data jika perlu
- [ ] Documentation update (jika ada API baru)
- [ ] Deploy ke staging
- [ ] QA testing
- [ ] Deploy ke production

---

**Spec selesai! Anda bisa mulai implementasi dengan membuka file ini dan mengerjakan tasks secara bertahap.**

**Prioritas:** Mulai dari Task 1 (Course Builder), lalu Task 2 (Grading), Task 3 (Learning Experience), Task 4 (Course Discovery).

**Estimasi Total:** 10-12 hari untuk Phase 1 (MVP Critical) dengan 2-3 developer.
