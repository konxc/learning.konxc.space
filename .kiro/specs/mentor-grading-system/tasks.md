# Tasks: Mentor Grading System

## Task 1 — Submission Queue Route

- [x] Buat `src/routes/(dashboard)/app/mentor/grading/+page.server.ts`
- [x] Query submissions pending milik mentor (via course.mentorId)
- [x] Sort by oldest first, filter by course/cohort/track
- [x] Tambah nav item "Grading" di rbac.ts untuk role mentor
- [x] Jalankan `pnpm run check`

## Task 2 — Grading Interface UI

- [x] Buat `src/routes/(dashboard)/app/mentor/grading/[submissionId]/+page.svelte`
- [x] Tampilkan submission content + student info
- [x] Score input dengan quick-score buttons
- [x] Feedback textarea
- [x] Server action `grade` — update submissionGrade + kirim notifikasi
- [x] Jalankan `pnpm run check`

## Task 3 — Bulk Grade Action

- [x] Checkbox selection di submission queue
- [x] Server action `bulkGrade` — approve/reject dengan catatan singkat
- [x] Notifikasi batch ke semua student yang di-grade
- [x] Jalankan `pnpm run check`

## Task 4 — Student Submission History

- [x] Update `learning/checkpoints/+page.server.ts` — tambah submission history
- [x] Tampilkan score, feedback, dan status per attempt
- [x] Re-submit form jika attempts belum habis
- [x] Jalankan `pnpm run check`

## Task 5 — Grading Badge di Nav

- [x] Update `(dashboard)/+layout.server.ts` — query pending submission count untuk mentor
- [x] Tambah badge ke nav item "Grading" jika ada pending
- [x] Jalankan `pnpm run check`
