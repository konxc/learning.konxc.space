# Tasks: Organization Management

- [x] 1. Shared Helper: org-utils.ts
  - [x] 1.1 Buat `src/lib/server/org-utils.ts`
  - [x] 1.2 Implementasi `getMembership(userId, orgId, fallbackRedirect?)` — query + redirect jika tidak ditemukan
  - [x] 1.3 Implementasi `generateUniqueSlug(name)` — slugify + numeric suffix jika conflict
  - [x] 1.4 Jalankan `pnpm run check`

- [x] 2. Onboarding Wizard
  - [x] 2.1 Update `organizations/new/+page.svelte` — 3-step wizard dengan `$state step`
  - [x] 2.2 Step 1: nama, deskripsi, logo upload (FileReader → base64, validasi 500KB client-side)
  - [x] 2.3 Step 2: invite emails (add multiple, role selector per email)
  - [x] 2.4 Step 3: konfirmasi summary + submit
  - [x] 2.5 Update `organizations/new/+page.server.ts` — action `create`: slug generation, insert org, insert owner membership, process invitations, redirect ke org dashboard
  - [x] 2.6 Jalankan `pnpm run check`

- [x] 3. Member Management
  - [x] 3.1 Update `organizations/[id]/members/+page.server.ts` — load members + pending invitations, actions: changeRole, removeMember, cancelInvite
  - [x] 3.2 Update `organizations/[id]/members/+page.svelte` — tabel members dengan inline role selector, pending invitations section, konfirmasi dialog
  - [x] 3.3 Jalankan `pnpm run check`

- [x] 4. Invitation System
  - [x] 4.1 Update `organizations/[id]/invite/+page.server.ts` — action sendInvite: duplicate check, token generation, notification
  - [x] 4.2 Buat `src/routes/org/invite/+page.server.ts` — load: validate token, action: accept (transaction)
  - [x] 4.3 Buat `src/routes/org/invite/+page.svelte` — UI accept invitation
  - [x] 4.4 Jalankan `pnpm run check`

- [x] 5. Organization Settings
  - [x] 5.1 Update `organizations/[id]/settings/+page.server.ts` — actions: updateSettings, updateLogo
  - [x] 5.2 Update `organizations/[id]/settings/+page.svelte` — form settings
  - [x] 5.3 Jalankan `pnpm run check`

- [x] 6. Organization Analytics
  - [x] 6.1 Update `organizations/[id]/analytics/+page.server.ts` — permission check, enrollment/activity/completion queries
  - [x] 6.2 Buat `src/lib/components/app/organizations/OrgAnalyticsCard.svelte`
  - [x] 6.3 Update `organizations/[id]/analytics/+page.svelte` — tampilkan analytics cards
  - [x] 6.4 Jalankan `pnpm run check`

- [x] 7. Workspace Switcher Polish
  - [x] 7.1 Update `WorkspaceDropdown.svelte` — tampilkan org logo, fallback ke initial letter dengan brandColor
  - [x] 7.2 Update `WorkspaceSwitcher.svelte` — visual indicator saat di org context
  - [x] 7.3 Jalankan `pnpm run check`
