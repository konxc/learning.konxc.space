# Tasks: Organization Management Enhancement

## Task 1 — Onboarding Wizard

- [ ] Update `organizations/new/+page.svelte` — multi-step wizard dengan $state step
- [ ] Step 1: form info dasar (nama, deskripsi, logo upload)
- [ ] Step 2: invite members (email input, add multiple)
- [ ] Step 3: konfirmasi dan redirect ke org dashboard
- [ ] Server action `create` yang handle semua data sekaligus
- [ ] Jalankan `pnpm run check`

## Task 2 — Member Management Page

- [ ] Update `organizations/[id]/members/+page.server.ts` — query members + pending invitations
- [ ] Tabel members dengan role selector (inline change)
- [ ] Server action `changeRole`, `removeMember`
- [ ] Pending invitations section dengan cancel action
- [ ] Jalankan `pnpm run check`

## Task 3 — Invitation System

- [ ] Server action `inviteMember` — generate token, insert ke `organizationInvitation`
- [ ] Buat `src/routes/org/invite/+page.server.ts` — handle token acceptance
- [ ] Notifikasi in-app ke user yang diundang (jika sudah punya akun)
- [ ] Jalankan `pnpm run check`

## Task 4 — Organization Analytics

- [ ] Update `organizations/[id]/+page.server.ts` — tambah analytics queries
- [ ] Enrollment count per course, revenue summary, member activity
- [ ] Komponen `OrgAnalyticsCard.svelte` di `src/lib/components/app/organizations/`
- [ ] Jalankan `pnpm run check`

## Task 5 — Workspace Switcher Polish

- [ ] Update `WorkspaceDropdown.svelte` — tampilkan org logo
- [ ] Visual indicator di sidebar header saat di org context
- [ ] Smooth transition saat switch workspace
- [ ] Jalankan `pnpm run check`
