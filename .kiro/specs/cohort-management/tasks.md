# Tasks: Cohort Management

## Task 1 — Admin: Assign Facilitator

- [ ] Tambah kolom `facilitatorId` display di tabel cohort
- [ ] Dropdown select facilitator (query users dengan role facilitator)
- [ ] Server action `assignFacilitator` di `admin/cohorts/+page.server.ts`
- [ ] Jalankan `pnpm run check`

## Task 2 — Admin: Cohort Detail Page

- [ ] Buat `src/routes/(dashboard)/app/admin/cohorts/[id]/+page.server.ts`
- [ ] Query semua enrollment + lessonProgress per student
- [ ] Hitung % completion per student
- [ ] Highlight at-risk (progress < 30% setelah 3 minggu)
- [ ] Export CSV via server action
- [ ] Jalankan `pnpm run check`

## Task 3 — Facilitator: Enhanced Dashboard

- [ ] Update `facilitator/cohorts/+page.server.ts` — tambah progress stats per cohort
- [ ] Update `+page.svelte` — tampilkan at-risk count per cohort
- [ ] Jalankan `pnpm run check`

## Task 4 — Facilitator: Student Progress View

- [ ] Buat `src/routes/(dashboard)/app/facilitator/cohorts/[id]/+page.server.ts`
- [ ] Query lessonProgress + checkpointSubmission per student
- [ ] Komponen progress table dengan color coding (green/yellow/red)
- [ ] Quick action: kirim notifikasi reminder ke student
- [ ] Jalankan `pnpm run check`

## Task 5 — Cohort Timeline Component

- [ ] Buat `src/lib/components/app/cohort/CohortTimeline.svelte`
- [ ] Hitung minggu aktif berdasarkan `startDate`
- [ ] Tampilkan checkpoint per minggu dengan status
- [ ] Countdown ke deadline berikutnya
- [ ] Jalankan `pnpm run check`
