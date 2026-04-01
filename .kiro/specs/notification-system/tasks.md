# Tasks: Notification System Enhancement

## Task 1 — SSE Endpoint

- [ ] Buat `src/routes/api/notifications/stream/+server.ts`
- [ ] Implementasi `ReadableStream` dengan heartbeat 30 detik
- [ ] Poll DB setiap 5 detik untuk notifikasi baru milik user
- [ ] Auth guard: redirect jika tidak login
- [ ] Jalankan `pnpm run check`

## Task 2 — Notification Helper

- [ ] Buat `src/lib/server/notifications.ts`
- [ ] Fungsi `createNotification(params)` dengan type safety
- [ ] Fungsi `markAsRead(notificationId, userId)`
- [ ] Fungsi `getUnreadCount(userId): Promise<number>`
- [ ] Jalankan `pnpm run check`

## Task 3 — Update DashboardHeader

- [ ] Tambahkan SSE listener di `DashboardHeader.svelte` via `$effect`
- [ ] Update `unreadCount` state dari SSE events
- [ ] Trigger toast untuk notifikasi penting (payment, grade)
- [ ] Cleanup EventSource saat komponen destroy
- [ ] Jalankan `pnpm run check`

## Task 4 — Notification Preferences UI

- [ ] Tambahkan tab "Notifikasi" di `/app/settings`
- [ ] Toggle per notification type (in-app / email)
- [ ] Save preferences ke `userPreferences.notificationSettings`
- [ ] Load preferences saat halaman settings dibuka
- [ ] Jalankan `pnpm run check`

## Task 5 — Notification Center Enhancement

- [ ] Update `/app/notifications/+page.server.ts` dengan pagination (20/halaman)
- [ ] Tambahkan filter by type dan read/unread
- [ ] Implementasi "Mark all as read" action
- [ ] Jalankan `pnpm run check`
