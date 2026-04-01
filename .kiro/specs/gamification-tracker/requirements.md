# Spec: Gamification & Tracker Enhancement

## Overview

Perkuat sistem gamification — tracker points yang lebih engaging, leaderboard yang lebih informatif, dan badge system yang terintegrasi dengan aktivitas nyata di platform.

## Requirements

### R1 — Tracker Dashboard Enhancement

- **R1.1**: Visualisasi tier progress dengan animasi (progress bar dari tier saat ini ke tier berikutnya)
- **R1.2**: Weekly challenge — task mingguan yang bisa diselesaikan untuk bonus points
- **R1.3**: Activity feed — log aktivitas terbaru (lesson selesai, checkpoint submit, dll)
- **R1.4**: Streak calendar — visualisasi hari-hari aktif dalam 30 hari terakhir (seperti GitHub contribution graph)
- **R1.5**: Points breakdown — berapa points dari tiap kategori aktivitas

### R2 — Leaderboard Enhancement

- **R2.1**: Filter leaderboard: global, per cohort, per course
- **R2.2**: Tampilkan rank movement (naik/turun berapa posisi vs minggu lalu)
- **R2.3**: User's own rank selalu visible di bottom jika tidak masuk top 50
- **R2.4**: Badge showcase — tampilkan 3 badge terbaru user di leaderboard row

### R3 — Badge System Integration

- **R3.1**: Auto-award badge saat kondisi terpenuhi:
  - `first_lesson` — selesaikan lesson pertama
  - `streak_7` — 7 hari streak
  - `streak_30` — 30 hari streak
  - `course_complete` — selesaikan satu course
  - `top_10` — masuk top 10 leaderboard
- **R3.2**: Badge notification — toast + notifikasi saat badge baru di-unlock
- **R3.3**: Badge gallery di achievements page — semua badge dengan progress unlock

### R4 — Points Auto-Award

- **R4.1**: Award points otomatis saat:
  - Lesson selesai: +10 points
  - Checkpoint submit: +25 points
  - Quiz pass: +15 points
  - Daily login: +5 points
  - Streak milestone (7, 30, 100 hari): +50/100/200 points
- **R4.2**: Points history di tracker page

## Technical Constraints

- Routes: `tracker/` dan `leaderboard/` (sudah ada, perlu enhancement)
- Tabel: `userTracker`, `trackerActivity`, `userXP`, `badge`, `userBadge`
- Auto-award: trigger dari server actions yang sudah ada (lesson complete, checkpoint submit)
- Tidak ada cron job — award saat event terjadi
- Streak calendar: generate dari `trackerActivity` grouped by date

## Acceptance Criteria

- [ ] Streak calendar menampilkan 30 hari terakhir dengan benar
- [ ] Badge auto-award berfungsi saat kondisi terpenuhi
- [ ] Leaderboard filter per cohort berfungsi
- [ ] Points auto-award terintegrasi dengan lesson completion
- [ ] `pnpm run check` 0 errors
