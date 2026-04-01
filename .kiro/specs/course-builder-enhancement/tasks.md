# Tasks: Course Builder Enhancement

## Task 1 — Drag-and-Drop Reordering

- [ ] Implementasi HTML5 Drag API di curriculum list (modules & lessons)
- [ ] Update `order` field di DB via server action saat drop
- [ ] Visual feedback saat drag (opacity, border highlight)
- [ ] Optimistic UI update — reorder langsung di UI, sync ke DB di background
- [ ] Jalankan `pnpm run check`

## Task 2 — Inline Editing

- [ ] Komponen `InlineEdit.svelte` — click to edit, Enter to save, Escape to cancel
- [ ] Debounce auto-save 500ms ke server action
- [ ] Loading indicator saat saving
- [ ] Error handling jika save gagal (revert ke nilai sebelumnya)
- [ ] Jalankan `pnpm run check`

## Task 3 — Material Management

- [ ] Multi-file upload dengan progress indicator per file
- [ ] Preview komponen per material type (video embed, PDF iframe, markdown render)
- [ ] Drag-and-drop reorder materials dalam lesson
- [ ] Jalankan `pnpm run check`

## Task 4 — Drip Content Scheduling

- [ ] UI date picker per lesson (absolute date)
- [ ] Input "X hari setelah enrollment" sebagai alternatif
- [ ] Visual timeline component — horizontal scroll, lessons sebagai nodes
- [ ] Bulk set schedule untuk satu module
- [ ] Jalankan `pnpm run check`

## Task 5 — Quiz Builder

- [ ] Form tambah question dengan type selector
- [ ] Dynamic choices input untuk MCQ (tambah/hapus choice)
- [ ] Set passing score dan max attempts
- [ ] Preview mode — render quiz sebagai student view
- [ ] Jalankan `pnpm run check`

## Task 6 — Course Settings

- [ ] Toggle switches untuk fitur course (affiliate, discussion, performance)
- [ ] Prerequisite course selector (dropdown dari courses yang ada)
- [ ] Visibility selector: draft / preview / published
- [ ] Save settings via server action
- [ ] Jalankan `pnpm run check`
