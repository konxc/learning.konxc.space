# Tasks: Collaboration & Portfolio

## Task 1 — Database Schema

- [ ] Tambah tabel `userPortfolio` di `src/lib/server/db/schema.ts`
- [ ] Tambah tabel `peerReview` di `src/lib/server/db/schema.ts`
- [ ] Tambah type exports untuk kedua tabel
- [ ] Jalankan `pnpm run db:push`
- [ ] Jalankan `pnpm run check`

## Task 2 — Portfolio Management

- [ ] Buat `src/routes/(dashboard)/app/portfolio/+page.server.ts` — load + actions (add, edit, delete)
- [ ] Buat `src/routes/(dashboard)/app/portfolio/+page.svelte` — grid portfolio dengan form add/edit
- [ ] Buat `src/lib/components/app/portfolio/PortfolioCard.svelte`
- [ ] Tambah nav item "Portfolio" di rbac.ts untuk user
- [ ] Jalankan `pnpm run check`

## Task 3 — Public Portfolio Page

- [ ] Buat `src/routes/(public)/portfolio/[username]/+page.server.ts`
- [ ] Buat `src/routes/(public)/portfolio/[username]/+page.svelte`
- [ ] Filter hanya portfolio dengan `isPublic = true`
- [ ] Jalankan `pnpm run check`

## Task 4 — Peer Review System

- [ ] Buat `src/routes/(dashboard)/app/learning/courses/[courseId]/peer-review/+page.server.ts`
- [ ] Logic assign reviewer random dari cohort yang sama
- [ ] Buat `src/lib/components/app/learning/PeerReviewForm.svelte` — rubrik 1-5 per kriteria
- [ ] Tampilkan peer review feedback di submission history
- [ ] Jalankan `pnpm run check`

## Task 5 — Project Space

- [ ] Update `src/routes/(dashboard)/app/discussion/+page.server.ts` — tambah filter by type
- [ ] Tambah type `project_update` ke discussion
- [ ] Buat project space view per cohort
- [ ] Support file attachment (image/PDF) via base64 atau URL
- [ ] Jalankan `pnpm run check`
