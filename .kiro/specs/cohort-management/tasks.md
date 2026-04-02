# Tasks: Cohort Management

## Task 1 — Admin: Assign Facilitator

- [x] Tambah kolom `facilitatorId` display di tabel cohort
- [x] Dropdown select facilitator — query dari `organization_member` dengan `role = 'facilitator'` (BUKAN dari `user.role`, karena facilitator adalah org-level role)
- [x] Server action `assignFacilitator` di `admin/cohorts/+page.server.ts`
- [x] Jalankan `pnpm run check`

## Task 2 — Admin: Cohort Detail Page

- [x] Buat `src/routes/(dashboard)/app/admin/cohorts/[id]/+page.server.ts`
- [x] Query semua enrollment + lessonProgress per student
- [x] Hitung % completion per student
- [x] Highlight at-risk (progress < 30% setelah 3 minggu)
- [x] Export CSV via server action
- [x] Jalankan `pnpm run check`

## Task 3 — Facilitator: Enhanced Dashboard

- [x] Update `facilitator/cohorts/+page.server.ts` — tambah progress stats per cohort
- [x] Update `+page.svelte` — tampilkan at-risk count per cohort
- [x] Jalankan `pnpm run check`

## Task 4 — Facilitator: Student Progress View

- [x] Buat `src/routes/(dashboard)/app/facilitator/cohorts/[id]/+page.server.ts`
- [x] Query lessonProgress + checkpointSubmission per student
- [x] Komponen progress table dengan color coding (green/yellow/red)
- [x] Quick action: kirim notifikasi reminder ke student
- [x] Jalankan `pnpm run check`

## Task 5 — Cohort Timeline Component

- [x] Buat `src/lib/components/app/cohort/CohortTimeline.svelte`
- [x] Hitung minggu aktif berdasarkan `startDate`
- [x] Tampilkan checkpoint per minggu dengan status
- [x] Countdown ke deadline berikutnya
- [x] Jalankan `pnpm run check`
