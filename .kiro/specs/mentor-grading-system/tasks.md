# Tasks: Mentor Grading System

## Task 1 — Submission Queue Route

- [ ] Buat `src/routes/(dashboard)/app/mentor/grading/+page.server.ts`
- [ ] Query submissions pending milik mentor (via course.mentorId)
- [ ] Sort by oldest first, filter by course/cohort/track
- [ ] Tambah nav item "Grading" di rbac.ts untuk role mentor
- [ ] Jalankan `pnpm run check`

## Task 2 — Grading Interface UI

- [ ] Buat `src/routes/(dashboard)/app/mentor/grading/[submissionId]/+page.svelte`
- [ ] Tampilkan submission content + student info
- [ ] Score input dengan quick-score buttons
- [ ] Feedback textarea
- [ ] Server action `grade` — update submissionGrade + kirim notifikasi
- [ ] Jalankan `pnpm run check`

## Task 3 — Bulk Grade Action

- [ ] Checkbox selection di submission queue
- [ ] Server action `bulkGrade` — approve/reject dengan catatan singkat
- [ ] Notifikasi batch ke semua student yang di-grade
- [ ] Jalankan `pnpm run check`

## Task 4 — Student Submission History

- [ ] Update `learning/checkpoints/+page.server.ts` — tambah submission history
- [ ] Tampilkan score, feedback, dan status per attempt
- [ ] Re-submit form jika attempts belum habis
- [ ] Jalankan `pnpm run check`

## Task 5 — Grading Badge di Nav

- [ ] Update `(dashboard)/+layout.server.ts` — query pending submission count untuk mentor
- [ ] Tambah badge ke nav item "Grading" jika ada pending
- [ ] Jalankan `pnpm run check`
