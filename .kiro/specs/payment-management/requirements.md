# Spec: Payment Management Enhancement

## Overview

Tingkatkan alur pembayaran — admin bisa approve/reject manual transfer lebih cepat, student punya payment history yang jelas, dan ada reconciliation report untuk admin.

## Requirements

### R1 — Admin Payment Review

- **R1.1**: Tabel payment proofs yang pending dengan preview gambar inline (thumbnail)
- **R1.2**: Approve/reject dengan satu klik + catatan opsional
- **R1.3**: Filter berdasarkan status (pending, approved, rejected) dan tanggal
- **R1.4**: Bulk approve untuk multiple proofs sekaligus
- **R1.5**: Notifikasi otomatis ke student saat proof di-approve atau di-reject

### R2 — Student Payment History

- **R2.1**: Halaman `/app/payments/history` — semua transaksi (Midtrans + manual transfer)
- **R2.2**: Status per transaksi: pending, paid, failed, expired
- **R2.3**: Download receipt/invoice sebagai teks (tanpa PDF library)
- **R2.4**: Re-upload proof jika rejected (dengan catatan alasan rejection)

### R3 — Coupon System Enhancement

- **R3.1**: Validasi coupon real-time saat checkout (sudah ada endpoint, perlu UI)
- **R3.2**: Tampilkan discount amount sebelum konfirmasi pembayaran
- **R3.3**: Admin bisa lihat coupon usage analytics — berapa kali dipakai, total discount diberikan
- **R3.4**: Bulk generate coupon codes (admin)

### R4 — Payment Reconciliation (Admin)

- **R4.1**: Summary harian: total transaksi, total revenue, pending approvals
- **R4.2**: Breakdown per payment method (Midtrans vs manual transfer)
- **R4.3**: Export reconciliation report ke CSV

## Technical Constraints

- Routes: `src/routes/(dashboard)/app/payments/` dan `src/routes/(dashboard)/app/admin/payments/`
- Tabel: `transaction`, `paymentProof`, `coupon`, `couponUsage`, `enrollment`
- Notifikasi via `notification` table
- Receipt: plain text format, download via Blob URL — tidak perlu library PDF
- RBAC: admin lihat semua, student hanya lihat miliknya

## Acceptance Criteria

- [ ] Admin bisa approve proof dengan satu klik
- [ ] Student menerima notifikasi saat proof di-approve/reject
- [ ] Payment history menampilkan semua transaksi dengan status yang benar
- [ ] Coupon validation berfungsi di checkout flow
- [ ] `pnpm run check` 0 errors
