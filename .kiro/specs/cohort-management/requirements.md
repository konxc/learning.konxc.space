# Spec: Cohort Management (Admin + Facilitator)

## Overview

Manajemen batch/cohort yang lebih lengkap — admin bisa assign facilitator, monitor progress per cohort, dan facilitator punya dashboard khusus untuk memantau student di batch mereka.

## Requirements

### R1 — Admin Cohort Dashboard

- **R1.1**: Tabel cohort dengan filter status (upcoming, active, completed) dan search by name/course
- **R1.2**: Assign/ganti facilitator per cohort langsung dari tabel
- **R1.3**: Bulk action: activate, complete, atau archive multiple cohorts sekaligus
- **R1.4**: Detail cohort — lihat semua student, progress rata-rata, dan checkpoint completion rate
- **R1.5**: Export daftar student per cohort ke CSV

### R2 — Facilitator Cohort Dashboard

- **R2.1**: Overview semua cohort yang di-assign ke facilitator dengan stats (total student, active, completed)
- **R2.2**: Drill-down per cohort: lihat progress tiap student (% lessons completed)
- **R2.3**: At-risk students — highlight student dengan progress < 30% di minggu ke-3+
- **R2.4**: Checkpoint monitoring — lihat status submission checkpoint per student per minggu
- **R2.5**: Quick action: kirim reminder ke student yang belum submit checkpoint

### R3 — Cohort Timeline

- **R3.1**: Visual timeline per cohort — minggu ke berapa, checkpoint apa yang aktif
- **R3.2**: Countdown ke deadline checkpoint berikutnya
- **R3.3**: Progress bar keseluruhan cohort (% student yang on-track)

## Technical Constraints

- Admin route: `src/routes/(dashboard)/app/admin/cohorts/` (sudah ada, perlu enhancement)
- Facilitator route: `src/routes/(dashboard)/app/facilitator/cohorts/` (sudah ada, perlu enhancement)
- Tabel: `cohort`, `enrollment`, `lessonProgress`, `checkpoint`, `checkpointSubmission`
- RBAC: admin lihat semua, facilitator hanya cohort yang di-assign ke mereka
- Reminder via tabel `notification` yang sudah ada

## Acceptance Criteria

- [ ] Admin bisa assign facilitator ke cohort
- [ ] Facilitator bisa lihat at-risk students
- [ ] Checkpoint monitoring menampilkan status per student
- [ ] Export CSV berfungsi
- [ ] `pnpm run check` 0 errors
