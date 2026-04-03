# Tasks: AI Integration

## Task 1 — Database Schema

- [ ] Tambah tabel `aiChatHistory` di schema.ts
- [ ] Tambah tabel `promptTemplate` di schema.ts
- [ ] Jalankan `pnpm run db:push`
- [ ] Jalankan `pnpm run check`

## Task 2 — AI Chat API

- [ ] Buat `src/routes/api/ai/chat/+server.ts` — POST handler
- [ ] Cek rate limit dari aiChatHistory (max dari env AI_DAILY_LIMIT)
- [ ] Fetch ke AI API dengan lesson context
- [ ] Simpan chat history ke DB
- [ ] Return response ke client
- [ ] Jalankan `pnpm run check`

## Task 3 — AI Chat Widget

- [ ] Buat `src/lib/components/app/learning/AIChatWidget.svelte`
- [ ] Toggle open/close dengan $state
- [ ] Tampilkan chat history dari server
- [ ] Input field + send button
- [ ] Loading state saat menunggu response
- [ ] Jalankan `pnpm run check`

## Task 4 — AI Recommendations

- [ ] Buat `src/routes/api/ai/recommendations/+server.ts`
- [ ] Logic: berdasarkan completed courses dan track user, suggest next course
- [ ] Tampilkan di overview dashboard sebagai "Rekomendasi untuk Kamu"
- [ ] Jalankan `pnpm run check`

## Task 5 — Prompt Templates

- [ ] Buat `src/routes/(dashboard)/app/ai-tools/+page.server.ts`
- [ ] Buat `src/routes/(dashboard)/app/ai-tools/+page.svelte`
- [ ] Grid prompt templates dengan filter kategori
- [ ] Save dan fork functionality
- [ ] Tambah nav item "AI Tools" di rbac.ts
- [ ] Jalankan `pnpm run check`
