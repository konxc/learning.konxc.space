# Tasks: Notification System Enhancement

## Task 1 — SSE Endpoint

- [x] Buat `src/routes/api/notifications/stream/+server.ts`
- [x] Implementasi `ReadableStream` dengan heartbeat 30 detik
- [x] Poll DB setiap 5 detik untuk notifikasi baru milik user
- [x] Auth guard: redirect jika tidak login
- [x] Jalankan `pnpm run check`

## Task 2 — Notification Helper

- [x] Buat `src/lib/server/notifications.ts`
- [x] Fungsi `createNotification(params)` dengan type safety
- [x] Fungsi `markAsRead(notificationId, userId)`
- [x] Fungsi `getUnreadCount(userId): Promise<number>`
- [x] Jalankan `pnpm run check`

## Task 3 — Update DashboardHeader

- [x] Tambahkan SSE listener di `DashboardHeader.svelte` via `$effect`
- [x] Update `unreadCount` state dari SSE events
- [x] Trigger toast untuk notifikasi penting (payment, grade)
- [x] Cleanup EventSource saat komponen destroy
- [x] Jalankan `pnpm run check`

## Task 4 — Notification Preferences UI

- [x] Tambahkan tab "Notifikasi" di `/app/settings`
- [x] Toggle per notification type (in-app / email)
- [x] Save preferences ke `userPreferences.notificationSettings`
- [x] Load preferences saat halaman settings dibuka
- [x] Jalankan `pnpm run check`

## Task 5 — Notification Center Enhancement

- [x] Update `/app/notifications/+page.server.ts` dengan pagination (20/halaman)
- [x] Tambahkan filter by type dan read/unread
- [x] Implementasi "Mark all as read" action
- [x] Jalankan `pnpm run check`
