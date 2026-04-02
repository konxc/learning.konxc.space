# Tasks: Payment Management Enhancement

## Task 1 — Admin: Payment Proof Review UI

- [~] Update `admin/payments/+page.svelte` — tambah thumbnail preview inline
- [ ] Approve/reject buttons dengan server action
- [ ] Server action `approveProof` dan `rejectProof` — update status + kirim notifikasi
- [ ] Filter by status dan date range
- [ ] Jalankan `pnpm run check`

## Task 2 — Admin: Bulk Approve

- [ ] Checkbox selection di tabel payment proofs
- [ ] Server action `bulkApprove` — loop approve + activate enrollments
- [ ] Toast konfirmasi dengan jumlah yang di-approve
- [ ] Jalankan `pnpm run check`

## Task 3 — Student: Payment History

- [ ] Update `payments/history/+page.server.ts` — query transactions + payment proofs
- [ ] Tampilkan status, amount, tanggal, dan course name
- [ ] Re-upload proof jika rejected (dengan alasan rejection)
- [ ] Download receipt sebagai plain text via Blob
- [ ] Jalankan `pnpm run check`

## Task 4 — Coupon UI di Checkout

- [ ] Update `payments/+page.svelte` — tambah coupon input field
- [ ] Client-side fetch ke `/api/coupons/:code` untuk validasi real-time
- [ ] Tampilkan discount amount dan harga akhir
- [ ] Pass coupon code ke server action `createOnlineTransaction`
- [ ] Jalankan `pnpm run check`

## Task 5 — Admin: Reconciliation Report

- [ ] Update `admin/payments/+page.server.ts` — tambah daily summary query
- [ ] Summary card: total revenue, pending count, approved today
- [ ] Export CSV via server action
- [ ] Jalankan `pnpm run check`
