# Spec: Student Learning Experience

## Overview

Tingkatkan pengalaman belajar student — video player yang lebih baik, note-taking inline, progress resume, dan checkpoint submission yang lebih intuitif.

## Requirements

### R1 — Video Player Enhancement

- **R1.1**: Resume playback dari posisi terakhir (simpan `videoPosition` di `lessonProgress`)
- **R1.2**: Playback speed control (0.75x, 1x, 1.25x, 1.5x, 2x)
- **R1.3**: Auto-mark lesson complete saat video mencapai 90% durasi
- **R1.4**: Keyboard shortcuts: Space (play/pause), Arrow keys (±10 detik), F (fullscreen)
- **R1.5**: Progress bar menampilkan posisi terakhir ditonton

### R2 — Inline Note-Taking

- **R2.1**: Panel notes yang bisa dibuka/tutup di samping konten lesson
- **R2.2**: Notes tersimpan otomatis (debounce 1 detik) ke `/api/notes`
- **R2.3**: Timestamp note — klik timestamp untuk jump ke posisi video tersebut
- **R2.4**: Export semua notes satu course ke format teks/markdown
- **R2.5**: Notes tetap tersimpan per lesson, bisa diakses kembali kapan saja

### R3 — Progress & Continuation

- **R3.1**: "Lanjutkan Belajar" button di overview langsung ke lesson terakhir yang dikunjungi
- **R3.2**: Progress bar per module di sidebar course navigation
- **R3.3**: Completion checklist per lesson (video watched + materials read)
- **R3.4**: Estimasi waktu tersisa untuk menyelesaikan course

### R4 — Checkpoint Submission

- **R4.1**: Form submission checkpoint dengan rich text editor (markdown support)
- **R4.2**: Upload bukti (gambar/link) untuk action-based checkpoints
- **R4.3**: Status submission: draft, submitted, graded
- **R4.4**: Tampilkan feedback mentor langsung di halaman checkpoint
- **R4.5**: Notifikasi saat checkpoint dinilai

### R5 — Course Navigation

- **R5.1**: Sidebar navigasi course dengan tree view (module → lessons)
- **R5.2**: Keyboard navigation antar lessons (Next/Prev)
- **R5.3**: Search dalam course — cari lesson berdasarkan judul
- **R5.4**: Breadcrumb: Course > Module > Lesson

## Technical Constraints

- Route: `src/routes/(dashboard)/app/learning/courses/[courseId]/[lessonId]/`
- Video player: native HTML5 `<video>` element — tidak ada library baru
- Notes sync: gunakan endpoint `/api/notes` yang sudah ada
- Progress tracking: update tabel `lessonProgress` via server action
- Checkpoint: tabel `checkpointSubmission` yang sudah ada

## Acceptance Criteria

- [ ] Video resume dari posisi terakhir saat halaman dibuka kembali
- [ ] Notes tersimpan otomatis tanpa user perlu klik save
- [ ] "Lanjutkan Belajar" mengarah ke lesson yang benar
- [ ] Checkpoint submission bisa upload gambar
- [ ] Keyboard shortcuts video berfungsi
- [ ] `pnpm run check` 0 errors
