# Spec: Advanced Analytics Dashboard

## Overview

Dashboard analytics terpusat untuk Admin dan Mentor yang menampilkan metrik platform secara real-time — revenue, enrollment trends, student progress, dan cohort performance.

## Requirements

### R1 — Admin Revenue Analytics

- **R1.1**: Tampilkan total revenue (harian, mingguan, bulanan, tahunan) dengan perbandingan periode sebelumnya
- **R1.2**: Breakdown revenue per course, per cohort, dan per payment method (Midtrans vs manual transfer)
- **R1.3**: Grafik tren enrollment baru vs churn per bulan
- **R1.4**: Tabel top-performing courses berdasarkan revenue dan enrollment count
- **R1.5**: Export data ke CSV

### R2 — Mentor Course Analytics

- **R2.1**: Completion rate per lesson dan per module untuk setiap course milik mentor
- **R2.2**: Average quiz score per quiz dan distribusi nilai (histogram)
- **R2.3**: Student engagement heatmap — hari/jam paling aktif belajar
- **R2.4**: Submission grading backlog — jumlah submission yang belum dinilai
- **R2.5**: Student progress overview — berapa persen students yang on-track vs behind

### R3 — Cohort Performance

- **R3.1**: Progress rata-rata per cohort dibandingkan antar cohort
- **R3.2**: Checkpoint completion rate per cohort
- **R3.3**: Facilitator activity log — berapa banyak interaksi per facilitator
- **R3.4**: At-risk students — students dengan progress < 30% di minggu ke-3+

### R4 — Gamification Analytics

- **R4.1**: XP distribution across all users (histogram)
- **R4.2**: Streak statistics — average streak, longest streak, streak distribution
- **R4.3**: Badge achievement rates — persentase users yang unlock setiap badge
- **R4.4**: Leaderboard movement — perubahan ranking minggu ini vs minggu lalu

## Technical Constraints

- Route: `src/routes/(dashboard)/app/admin/analytics/` (admin) dan `src/routes/(dashboard)/app/mentor/analytics/` (mentor)
- Data diambil via `+page.server.ts` loader — tidak ada client-side fetch untuk data sensitif
- Gunakan Drizzle ORM queries dengan aggregation (count, sum, avg)
- Charts menggunakan library yang sudah ada atau native SVG — tidak boleh tambah dependency baru
- RBAC: admin melihat semua data, mentor hanya data course miliknya sendiri
- Semua angka currency dalam format Rupiah (IDR)

## Acceptance Criteria

- [ ] Admin dapat melihat revenue breakdown per periode
- [ ] Mentor dapat melihat completion rate per lesson
- [ ] Data di-cache di server (tidak query ulang setiap page load dalam 5 menit)
- [ ] Halaman load < 2 detik untuk dataset 1000 students
- [ ] Responsive di mobile (min 375px)
- [ ] `pnpm run check` 0 errors
