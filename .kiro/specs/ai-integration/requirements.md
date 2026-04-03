# Spec: AI Integration

## Overview

Integrasi AI tools ke dalam platform untuk mendukung AI-first learning approach — AI assistant untuk student, AI-powered content recommendations, dan prompt engineering resources.

## Requirements

### R1 — AI Learning Assistant

- R1.1: Chat widget di halaman learning yang bisa menjawab pertanyaan tentang materi kursus
- R1.2: AI bisa membaca context lesson yang sedang dibuka (judul, deskripsi)
- R1.3: Riwayat chat tersimpan per lesson per user
- R1.4: Rate limiting: max 20 pesan per hari per user (free tier)

### R2 — AI Content Recommendations

- R2.1: Rekomendasi kursus berikutnya berdasarkan progress dan track user
- R2.2: "Suggested next lesson" berdasarkan completion pattern
- R2.3: Tampil di overview dashboard sebagai widget

### R3 — Prompt Engineering Resources

- R3.1: Halaman `/app/ai-tools` — koleksi prompt templates per track
- R3.2: Student bisa save dan fork prompt templates
- R3.3: Kategori: Coding, Marketing, Business, Content Creation

## Technical Constraints

- AI chat: gunakan fetch ke external AI API (OpenAI/Anthropic) — key dari env var
- Tidak ada dependency baru untuk AI client — gunakan native fetch
- Chat history: tabel `aiChatHistory` (id, userId, lessonId, role, content, createdAt)
- Prompt templates: tabel `promptTemplate` (id, userId, title, content, category, isPublic, forkCount)
- Rate limiting: cek count dari aiChatHistory per hari

## Acceptance Criteria

- [ ] AI chat widget berfungsi di halaman learning
- [ ] Rate limiting berfungsi (max 20/hari)
- [ ] Rekomendasi kursus tampil di dashboard
- [ ] Prompt templates bisa disimpan dan di-fork
- [ ] pnpm run check 0 errors
