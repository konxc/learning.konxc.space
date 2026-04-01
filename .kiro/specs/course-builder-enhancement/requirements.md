# Spec: Course Builder Enhancement

## Overview

Tingkatkan pengalaman mentor dalam membuat dan mengelola course — drag-and-drop reordering, bulk material upload, preview mode, dan drip content scheduling yang lebih intuitif.

## Requirements

### R1 — Curriculum Builder

- **R1.1**: Drag-and-drop reordering untuk modules dan lessons (tanpa library baru — gunakan HTML5 Drag API)
- **R1.2**: Inline editing nama module/lesson tanpa modal
- **R1.3**: Duplicate module atau lesson dengan satu klik
- **R1.4**: Bulk delete modules/lessons dengan checkbox selection

### R2 — Material Management

- **R2.1**: Upload multiple files sekaligus untuk satu lesson
- **R2.2**: Preview material sebelum publish (video player, PDF viewer, markdown renderer)
- **R2.3**: Reorder materials dalam satu lesson via drag-and-drop
- **R2.4**: Material types: video (URL/upload), PDF, markdown, link eksternal

### R3 — Drip Content Scheduling

- **R3.1**: Set unlock date per lesson (absolute date atau relative "X hari setelah enrollment")
- **R3.2**: Visual timeline menampilkan jadwal unlock semua lessons
- **R3.3**: Preview "student view" — tampilkan apa yang student lihat pada hari tertentu
- **R3.4**: Bulk set drip schedule untuk semua lessons dalam satu module

### R4 — Course Settings

- **R4.1**: Toggle fitur per course: affiliate, performance tracking, discussion
- **R4.2**: Set prerequisite course (student harus selesaikan course X sebelum enroll)
- **R4.3**: Certificate template selection
- **R4.4**: Course visibility: draft, preview (invite only), published

### R5 — Quiz Builder

- **R5.1**: Tambah/edit/hapus questions langsung di course builder
- **R5.2**: Question types: multiple choice, multi-select, free text
- **R5.3**: Set passing score dan max attempts
- **R5.4**: Preview quiz sebagai student

## Technical Constraints

- Route: `src/routes/(dashboard)/app/mentor/courses/` (sudah ada)
- Drag-and-drop: HTML5 Drag and Drop API — tidak boleh tambah library
- File upload: gunakan `FormData` dan server actions SvelteKit
- RBAC: hanya mentor dan admin yang bisa akses course builder
- Semua perubahan curriculum harus update `updatedAt` di tabel `course`

## Acceptance Criteria

- [ ] Drag-and-drop reorder berfungsi di desktop dan touch device
- [ ] Inline editing tersimpan otomatis (debounce 500ms)
- [ ] Drip schedule visual timeline akurat
- [ ] Quiz builder dapat tambah minimal 10 questions
- [ ] `pnpm run check` 0 errors
