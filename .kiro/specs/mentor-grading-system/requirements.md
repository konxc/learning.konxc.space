# Spec: Mentor Grading System

## Overview

Sistem penilaian submission yang lebih terstruktur — mentor bisa grade submission dengan rubrik, student bisa lihat feedback detail, dan ada tracking backlog grading yang belum selesai.

## Requirements

### R1 — Submission Queue (Mentor)

- **R1.1**: Dashboard grading dengan antrian submission yang belum dinilai, diurutkan by oldest first
- **R1.2**: Filter antrian berdasarkan course, cohort, dan track
- **R1.3**: Badge count di nav "My Courses" menampilkan jumlah submission pending
- **R1.4**: Bulk grade — mentor bisa approve/reject multiple submission sekaligus dengan catatan singkat

### R2 — Grading Interface

- **R2.1**: Tampilkan submission content lengkap (text + attachment link)
- **R2.2**: Score input (0-100) dengan preset quick-score buttons (60, 70, 80, 90, 100)
- **R2.3**: Feedback textarea dengan markdown support (preview sebelum submit)
- **R2.4**: Status: pending → graded (pass/fail berdasarkan passing score quiz)
- **R2.5**: Notifikasi otomatis ke student saat submission dinilai

### R3 — Student Submission View

- **R3.1**: Student bisa lihat semua submission mereka dengan status dan score
- **R3.2**: Feedback mentor ditampilkan dengan formatting markdown
- **R3.3**: Jika fail, student bisa re-submit (jika max attempts belum tercapai)
- **R3.4**: History semua attempt per submission

### R4 — Grading Analytics (Mentor)

- **R4.1**: Average score per course dan per cohort
- **R4.2**: Distribution score (berapa student dapat 60-70, 70-80, 80-90, 90-100)
- **R4.3**: Grading velocity — rata-rata waktu dari submit ke graded

## Technical Constraints

- Route mentor: `src/routes/(dashboard)/app/mentor/` (perlu tambah sub-route `grading/`)
- Tabel: `submission`, `submissionGrade`, `quiz`, `quizQuestion`
- Notifikasi via `createNotification()` helper yang sudah ada
- Markdown render: gunakan native `<pre>` atau simple regex — tidak boleh tambah library
- RBAC: mentor hanya bisa grade submission dari course miliknya

## Acceptance Criteria

- [ ] Antrian submission tampil dengan urutan oldest first
- [ ] Score tersimpan dan notifikasi terkirim ke student
- [ ] Student bisa lihat feedback dengan formatting
- [ ] Re-submit berfungsi jika attempts belum habis
- [ ] `pnpm run check` 0 errors
