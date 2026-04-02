# Tasks: Student Learning Experience

## Task 1 — Video Player Enhancement

- [x] Buat `src/lib/components/app/learning/VideoPlayer.svelte`
- [x] Load `videoPosition` dari `lessonProgress` saat mount, set `video.currentTime`
- [x] Save posisi ke server action setiap 10 detik via debounce
- [x] Playback speed selector dengan `$state`
- [x] Auto-complete saat `currentTime / duration >= 0.9`
- [x] Keyboard event listener (Space, ArrowLeft, ArrowRight, F)
- [x] Jalankan `pnpm run check`

## Task 2 — Inline Notes Panel

- [x] Buat `src/lib/components/app/learning/NotesPanel.svelte`
- [x] Textarea dengan auto-resize dan debounce save 1 detik
- [x] Sync ke `POST /api/notes` dengan `lessonId` dan `content`
- [x] Timestamp button yang insert `[MM:SS]` ke notes
- [x] Export notes sebagai plain text download
- [x] Toggle panel open/close dengan `$state`
- [x] Jalankan `pnpm run check`

## Task 3 — Progress & Continuation

- [x] Update `/app/overview/+page.server.ts` — query lesson terakhir dari `lessonProgress`
- [x] "Lanjutkan Belajar" card dengan link ke lesson terakhir
- [x] Progress bar per module di course sidebar (% lessons completed)
- [x] Estimasi waktu tersisa berdasarkan durasi lesson yang belum selesai
- [x] Jalankan `pnpm run check`

## Task 4 — Checkpoint Submission Form

- [x] Update halaman checkpoint submission dengan markdown textarea
- [x] File upload untuk bukti (image, max 5MB) — convert ke base64 atau URL
- [x] Status badge: draft / submitted / graded
- [x] Tampilkan `submissionGrade.feedback` jika sudah dinilai
- [x] Server action untuk submit dan update status
- [x] Jalankan `pnpm run check`

## Task 5 — Course Navigation Sidebar

- [x] Komponen `CourseSidebar.svelte` dengan tree view module → lessons
- [x] Highlight lesson aktif, checkmark untuk yang sudah selesai
- [x] Progress bar per module
- [x] Search input dengan filter real-time via `$derived`
- [x] Next/Prev lesson navigation buttons
- [x] Jalankan `pnpm run check`
