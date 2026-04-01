# Spec: Notification System Enhancement

## Overview

Perkuat sistem notifikasi yang sudah ada — tambahkan real-time delivery via SSE (Server-Sent Events), notification preferences per user, dan digest email harian.

## Requirements

### R1 — Real-time Notifications

- **R1.1**: Notifikasi muncul di header bell icon tanpa page refresh menggunakan SSE endpoint
- **R1.2**: Badge count di bell icon terupdate otomatis saat notifikasi baru masuk
- **R1.3**: Toast popup muncul di pojok kanan bawah untuk notifikasi penting (grade released, payment confirmed)
- **R1.4**: Notifikasi ditandai "read" saat user klik atau buka notification center

### R2 — Notification Types

- **R2.1**: `enrollment_activated` — Enrollment dikonfirmasi admin/payment gateway
- **R2.2**: `submission_graded` — Mentor menilai submission student
- **R2.3**: `checkpoint_due` — Reminder checkpoint akan deadline (H-1, H-0)
- **R2.4**: `broadcast_received` — Pesan broadcast dari mentor/admin
- **R2.5**: `badge_earned` — Student unlock badge baru
- **R2.6**: `cohort_started` — Cohort baru dimulai
- **R2.7**: `payment_confirmed` — Pembayaran dikonfirmasi

### R3 — Notification Preferences

- **R3.1**: User dapat toggle on/off setiap notification type di Settings
- **R3.2**: Pilihan channel per type: in-app only, in-app + email, atau off
- **R3.3**: Preferences disimpan di tabel `userPreferences` (kolom JSON `notificationSettings`)
- **R3.4**: Default: semua notifikasi aktif untuk in-app, email hanya untuk payment dan grade

### R4 — Notification Center

- **R4.1**: Halaman `/app/notifications` menampilkan semua notifikasi dengan pagination (20 per halaman)
- **R4.2**: Filter berdasarkan type dan status (read/unread)
- **R4.3**: "Mark all as read" action
- **R4.4**: Notifikasi lebih dari 30 hari otomatis dihapus (soft delete)

## Technical Constraints

- SSE endpoint: `GET /api/notifications/stream` — stream events ke client
- Tidak boleh pakai WebSocket (tidak ada dependency baru)
- Preferences disimpan di kolom `notificationSettings` (JSON) di tabel `userPreferences`
- Email delivery via fungsi `sendEmail()` yang sudah ada di `$lib/server/email.ts`
- RBAC: user hanya bisa lihat notifikasi miliknya sendiri

## Acceptance Criteria

- [ ] Notifikasi baru muncul dalam < 3 detik tanpa refresh
- [ ] Badge count akurat setelah mark as read
- [ ] Preferences tersimpan dan diterapkan saat notifikasi dibuat
- [ ] Pagination berfungsi di notification center
- [ ] `pnpm run check` 0 errors
