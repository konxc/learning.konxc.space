# Tasks: Student Learning Experience

## Task 1 — Video Player Enhancement

- [ ] Buat `src/lib/components/app/learning/VideoPlayer.svelte`
- [ ] Load `videoPosition` dari `lessonProgress` saat mount, set `video.currentTime`
- [ ] Save posisi ke server action setiap 10 detik via debounce
- [ ] Playback speed selector dengan `$state`
- [ ] Auto-complete saat `currentTime / duration >= 0.9`
- [ ] Keyboard event listener (Space, ArrowLeft, ArrowRight, F)
- [ ] Jalankan `pnpm run check`

## Task 2 — Inline Notes Panel

- [ ] Buat `src/lib/components/app/learning/NotesPanel.svelte`
- [ ] Textarea dengan auto-resize dan debounce save 1 detik
- [ ] Sync ke `POST /api/notes` dengan `lessonId` dan `content`
- [ ] Timestamp button yang insert `[MM:SS]` ke notes
- [ ] Export notes sebagai plain text download
- [ ] Toggle panel open/close dengan `$state`
- [ ] Jalankan `pnpm run check`

## Task 3 — Progress & Continuation

- [ ] Update `/app/overview/+page.server.ts` — query lesson terakhir dari `lessonProgress`
- [ ] "Lanjutkan Belajar" card dengan link ke lesson terakhir
- [ ] Progress bar per module di course sidebar (% lessons completed)
- [ ] Estimasi waktu tersisa berdasarkan durasi lesson yang belum selesai
- [ ] Jalankan `pnpm run check`

## Task 4 — Checkpoint Submission Form

- [ ] Update halaman checkpoint submission dengan markdown textarea
- [ ] File upload untuk bukti (image, max 5MB) — convert ke base64 atau URL
- [ ] Status badge: draft / submitted / graded
- [ ] Tampilkan `submissionGrade.feedback` jika sudah dinilai
- [ ] Server action untuk submit dan update status
- [ ] Jalankan `pnpm run check`

## Task 5 — Course Navigation Sidebar

- [ ] Komponen `CourseSidebar.svelte` dengan tree view module → lessons
- [ ] Highlight lesson aktif, checkmark untuk yang sudah selesai
- [ ] Progress bar per module
- [ ] Search input dengan filter real-time via `$derived`
- [ ] Next/Prev lesson navigation buttons
- [ ] Jalankan `pnpm run check`
