# Tasks: Gamification & Tracker Enhancement

## Task 1 — Streak Calendar Component

- [ ] Buat `src/lib/components/app/tracker/StreakCalendar.svelte`
- [ ] Query `trackerActivity` grouped by date (30 hari terakhir)
- [ ] Render grid 30 kotak dengan warna berdasarkan activity count
- [ ] Tooltip on hover menampilkan tanggal dan jumlah aktivitas
- [ ] Jalankan `pnpm run check`

## Task 2 — Points Auto-Award Helper

- [ ] Buat `src/lib/server/gamification.ts`
- [ ] Fungsi `awardPoints(userId, activityType, points)`
- [ ] Fungsi `checkAndAwardBadges(userId)` — cek semua kondisi badge
- [ ] Fungsi `updateStreak(userId)` — update streak dan award streak badges
- [ ] Jalankan `pnpm run check`

## Task 3 — Integrate Auto-Award ke Lesson Completion

- [ ] Update server action lesson complete — panggil `awardPoints` dan `checkAndAwardBadges`
- [ ] Update checkpoint submit — panggil `awardPoints`
- [ ] Update quiz pass — panggil `awardPoints`
- [ ] Jalankan `pnpm run check`

## Task 4 — Leaderboard Enhancement

- [ ] Update `leaderboard/+page.server.ts` — tambah filter cohort/course
- [ ] Query rank movement (compare dengan snapshot minggu lalu dari trackerActivity)
- [ ] Update `+page.svelte` — tampilkan rank delta, badge showcase
- [ ] User's own rank sticky di bottom
- [ ] Jalankan `pnpm run check`

## Task 5 — Tracker Dashboard Enhancement

- [ ] Update `tracker/+page.svelte` — tier progress bar dengan animasi CSS
- [ ] Activity feed dari `trackerActivity` (20 terbaru)
- [ ] Points breakdown per kategori
- [ ] Integrate StreakCalendar component
- [ ] Jalankan `pnpm run check`
