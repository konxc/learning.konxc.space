# Tasks: Gamification & Tracker Enhancement

## Task 1 — Streak Calendar Component

- [x] Buat `src/lib/components/app/tracker/StreakCalendar.svelte`
- [x] Query `trackerActivity` grouped by date (30 hari terakhir)
- [x] Render grid 30 kotak dengan warna berdasarkan activity count
- [x] Tooltip on hover menampilkan tanggal dan jumlah aktivitas
- [x] Jalankan `pnpm run check`

## Task 2 — Points Auto-Award Helper

- [x] Buat `src/lib/server/gamification.ts`
- [x] Fungsi `awardPoints(userId, activityType, points)`
- [x] Fungsi `checkAndAwardBadges(userId)` — cek semua kondisi badge
- [x] Fungsi `updateStreak(userId)` — update streak dan award streak badges
- [x] Jalankan `pnpm run check`

## Task 3 — Integrate Auto-Award ke Lesson Completion

- [x] Update server action lesson complete — panggil `awardPoints` dan `checkAndAwardBadges`
- [x] Update checkpoint submit — panggil `awardPoints`
- [x] Update quiz pass — panggil `awardPoints`
- [x] Jalankan `pnpm run check`

## Task 4 — Leaderboard Enhancement

- [x] Update `leaderboard/+page.server.ts` — tambah filter cohort/course
- [x] Query rank movement (compare dengan snapshot minggu lalu dari trackerActivity)
- [x] Update `+page.svelte` — tampilkan rank delta, badge showcase
- [x] User's own rank sticky di bottom
- [x] Jalankan `pnpm run check`

## Task 5 — Tracker Dashboard Enhancement

- [x] Update `tracker/+page.svelte` — tier progress bar dengan animasi CSS
- [x] Activity feed dari `trackerActivity` (20 terbaru)
- [x] Points breakdown per kategori
- [x] Integrate StreakCalendar component
- [x] Jalankan `pnpm run check`
