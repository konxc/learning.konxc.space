# Spec: Affiliate Dashboard

## Overview

Dashboard lengkap untuk user dengan affiliate account — tracking sales, komisi, payout history, dan link management untuk marketplace (Shopee, Tokopedia, TikTok Shop, Lazada).

## Requirements

### R1 — Sales Overview

- **R1.1**: Total komisi earned (all-time, bulan ini, minggu ini)
- **R1.2**: Jumlah sales per marketplace dengan breakdown persentase
- **R1.3**: Grafik tren sales harian/mingguan (30 hari terakhir)
- **R1.4**: Conversion rate: link clicks vs confirmed sales (jika data tersedia)

### R2 — Affiliate Link Management

- **R2.1**: Daftar semua affiliate links milik user dengan status aktif/nonaktif
- **R2.2**: Copy link ke clipboard dengan satu klik
- **R2.3**: Tampilkan commission rate per link
- **R2.4**: Filter links berdasarkan marketplace dan status

### R3 — Sales History

- **R3.1**: Tabel semua `affiliateSale` milik user dengan pagination
- **R3.2**: Kolom: tanggal, marketplace, produk, amount, komisi, status
- **R3.3**: Filter berdasarkan marketplace, status, dan rentang tanggal
- **R3.4**: Export ke CSV

### R4 — Payout Management

- **R4.1**: Total komisi yang belum dibayar (pending payout)
- **R4.2**: History payout yang sudah dibayarkan
- **R4.3**: Request payout jika saldo >= minimum threshold (Rp 100.000)
- **R4.4**: Status payout: pending, processing, paid

### R5 — Auto-Affiliate untuk Mentor/Facilitator

- **R5.1**: Mentor dan facilitator otomatis punya affiliate account saat `organization_member.role` di-set ke `mentor` atau `facilitator` (BUKAN dari `user.role` — role ini ada di org context)
- **R5.2**: Auto-generate affiliate links untuk semua course aktif milik org tersebut
- **R5.3**: Notifikasi saat affiliate account dibuat

## Technical Constraints

- Route: `src/routes/(dashboard)/app/affiliate/` (sudah ada, perlu enhancement)
- Tabel: `affiliateSale`, `affiliateLink`, `affiliateAccount` (sudah ada di schema)
- RBAC: semua role bisa punya affiliate account, tapi mentor/facilitator auto-enrolled
- Tidak ada dependency baru untuk charts — gunakan native SVG atau CSS

## Acceptance Criteria

- [ ] User dapat melihat total komisi dan breakdown per marketplace
- [ ] Copy link berfungsi di semua browser modern
- [ ] Pagination sales history berfungsi
- [ ] Request payout hanya aktif jika saldo >= Rp 100.000
- [ ] `pnpm run check` 0 errors
