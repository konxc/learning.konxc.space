# Spec: Organization Management Enhancement

## Overview

Tingkatkan fitur manajemen organisasi — onboarding org baru yang lebih smooth, member management yang lebih lengkap, dan analytics per org untuk owner/admin.

## Requirements

### R1 — Organization Onboarding

- **R1.1**: Wizard multi-step saat buat org baru: (1) Info dasar → (2) Invite members → (3) Setup course pertama
- **R1.2**: Validasi nama org unik (slug auto-generated dari nama)
- **R1.3**: Upload logo org (base64, max 500KB)
- **R1.4**: Pilih plan type: free / pro / enterprise dengan feature comparison

### R2 — Member Management

- **R2.1**: Tabel members dengan role, join date, dan last active
- **R2.2**: Invite via email — generate invitation token, kirim notifikasi in-app
- **R2.3**: Change member role (owner/admin/creator/facilitator/member)
- **R2.4**: Remove member dengan konfirmasi
- **R2.5**: Pending invitations — lihat dan batalkan invitation yang belum diterima

### R3 — Organization Analytics

- **R3.1**: Total enrollment per course milik org
- **R3.2**: Revenue summary (jika org punya course berbayar)
- **R3.3**: Member activity — berapa member yang aktif dalam 30 hari terakhir
- **R3.4**: Course completion rate per course

### R4 — Workspace Switching UX

- **R4.1**: Workspace switcher di sidebar menampilkan org logo dan nama
- **R4.2**: Indikator visual saat berada di org context vs personal
- **R4.3**: Quick switch tanpa reload halaman (sudah ada, perlu polish)

## Technical Constraints

- Routes: `src/routes/(dashboard)/app/organizations/` (sudah ada)
- Tabel: `organization`, `organizationMember`, `organizationInvitation`
- RBAC: owner dan admin org bisa manage members, creator hanya bisa lihat
- Invitation token: generate UUID, simpan di `organizationInvitation.token`
- Logo upload: base64 di `organization.logoUrl`

## Acceptance Criteria

- [ ] Wizard onboarding selesai dalam 3 step
- [ ] Invite member via email berfungsi (notifikasi in-app)
- [ ] Change role tersimpan dan berlaku langsung
- [ ] Analytics menampilkan data yang akurat
- [ ] `pnpm run check` 0 errors
