# Tasks: Career Support

## Task 1 — Database Schema

- [ ] Tambah tabel `referral` di schema.ts
- [ ] Tambah tabel `placement` di schema.ts
- [ ] Jalankan `pnpm run db:push`
- [ ] Jalankan `pnpm run check`

## Task 2 — Enhanced Job Board

- [ ] Update `src/routes/(dashboard)/app/jobs/+page.server.ts` — tambah filter by track
- [ ] Update `+page.svelte` — filter UI + match score display
- [ ] Update job application form — tambah "Apply with Portfolio" option
- [ ] Jalankan `pnpm run check`

## Task 3 — Referral System

- [ ] Buat `src/routes/(public)/r/[code]/+page.server.ts` — redirect + track referral
- [ ] Buat `src/routes/(dashboard)/app/career/+page.server.ts` — referral stats
- [ ] Generate referral code saat user pertama kali buka career page
- [ ] Tampilkan referral link + stats (clicks, registrations, conversions)
- [ ] Jalankan `pnpm run check`

## Task 4 — Placement Tracking (Admin)

- [ ] Buat `src/routes/(dashboard)/app/admin/placements/+page.server.ts`
- [ ] Actions: addPlacement, updatePlacement
- [ ] Dashboard stats: total placed, avg time, top companies
- [ ] Tambah nav item "Placements" di admin nav
- [ ] Jalankan `pnpm run check`

## Task 5 — Career Dashboard (Student)

- [ ] Update `src/routes/(dashboard)/app/career/+page.svelte`
- [ ] Tampilkan: referral link, referral stats, job recommendations
- [ ] Update employment status form
- [ ] Tambah nav item "Career" di user nav
- [ ] Jalankan `pnpm run check`
