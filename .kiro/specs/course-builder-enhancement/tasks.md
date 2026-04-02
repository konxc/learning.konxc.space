# Tasks: Course Builder Enhancement

## Task 1 — Drag-and-Drop Reordering

- [x] Implementasi HTML5 Drag API di curriculum list (modules & lessons)
- [x] Update `order` field di DB via server action saat drop
- [x] Visual feedback saat drag (opacity, border highlight)
- [x] Optimistic UI update — reorder langsung di UI, sync ke DB di background
- [x] Jalankan `pnpm run check`

## Task 2 — Inline Editing

- [x] Komponen `InlineEdit.svelte` — click to edit, Enter to save, Escape to cancel
- [x] Debounce auto-save 500ms ke server action
- [x] Loading indicator saat saving
- [x] Error handling jika save gagal (revert ke nilai sebelumnya)
- [x] Jalankan `pnpm run check`

## Task 3 — Material Management

- [x] Multi-file upload dengan progress indicator per file
- [x] Preview komponen per material type (video embed, PDF iframe, markdown render)
- [x] Drag-and-drop reorder materials dalam lesson
- [x] Jalankan `pnpm run check`

## Task 4 — Drip Content Scheduling

- [x] UI date picker per lesson (absolute date)
- [x] Input "X hari setelah enrollment" sebagai alternatif
- [x] Visual timeline component — horizontal scroll, lessons sebagai nodes
- [x] Bulk set schedule untuk satu module
- [x] Jalankan `pnpm run check`

## Task 5 — Quiz Builder

- [x] Form tambah question dengan type selector
- [x] Dynamic choices input untuk MCQ (tambah/hapus choice)
- [x] Set passing score dan max attempts
- [x] Preview mode — render quiz sebagai student view
- [x] Jalankan `pnpm run check`

## Task 6 — Course Settings

- [x] Toggle switches untuk fitur course (affiliate, discussion, performance) — parse dari `featuresConfig` JSON
- [x] Prerequisite course selector (dropdown dari courses yang ada)
- [x] Visibility selector: `public` / `internal` / `draft` / `invite_only` (sesuai `course.visibility` di schema)
  - `public` = siapapun bisa beli di marketplace
  - `internal` = hanya member org
  - `draft` = hanya mentor/admin org
  - `invite_only` = hanya yang punya link khusus
- [x] Save settings via server action
- [x] Jalankan `pnpm run check`
