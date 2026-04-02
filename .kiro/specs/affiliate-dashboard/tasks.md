# Tasks: Affiliate Dashboard

## Task 1 — Server Loader Enhancement

- [x] Update `src/routes/(dashboard)/app/affiliate/+page.server.ts`
- [x] Query `affiliateSale` dengan aggregation (sum komisi, count per marketplace)
- [x] Query `affiliateLink` milik user
- [x] Query payout history
- [x] Auth guard + auto-create affiliate account jika belum ada
- [x] Jalankan `pnpm run check`

## Task 2 — Sales Overview UI

- [x] Update `+page.svelte` dengan MetricCard untuk total komisi
- [x] Breakdown per marketplace (Shopee, Tokopedia, TikTok Shop, Lazada)
- [x] Grafik tren 30 hari dengan native SVG line chart
- [x] Gunakan design tokens untuk semua styling
- [x] Jalankan `pnpm run check`

## Task 3 — Link Management

- [x] Komponen `AffiliateLinkCard.svelte` di `src/lib/components/app/affiliate/`
- [x] Copy to clipboard dengan feedback visual (icon berubah jadi checkmark)
- [x] Filter links berdasarkan marketplace
- [x] Jalankan `pnpm run check`

## Task 4 — Sales History Table

- [x] Tabel dengan pagination (20/halaman)
- [x] Filter: marketplace, status, date range
- [x] Export CSV via server action
- [x] Jalankan `pnpm run check`

## Task 5 — Payout Request

- [x] UI payout summary dengan pending balance
- [x] Tombol "Request Payout" dengan validasi minimum threshold
- [x] Server action untuk create payout request
- [x] Notifikasi konfirmasi setelah request berhasil
- [x] Jalankan `pnpm run check`
