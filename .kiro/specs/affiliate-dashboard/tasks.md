# Tasks: Affiliate Dashboard

## Task 1 — Server Loader Enhancement

- [ ] Update `src/routes/(dashboard)/app/affiliate/+page.server.ts`
- [ ] Query `affiliateSale` dengan aggregation (sum komisi, count per marketplace)
- [ ] Query `affiliateLink` milik user
- [ ] Query payout history
- [ ] Auth guard + auto-create affiliate account jika belum ada
- [ ] Jalankan `pnpm run check`

## Task 2 — Sales Overview UI

- [ ] Update `+page.svelte` dengan MetricCard untuk total komisi
- [ ] Breakdown per marketplace (Shopee, Tokopedia, TikTok Shop, Lazada)
- [ ] Grafik tren 30 hari dengan native SVG line chart
- [ ] Gunakan design tokens untuk semua styling
- [ ] Jalankan `pnpm run check`

## Task 3 — Link Management

- [ ] Komponen `AffiliateLinkCard.svelte` di `src/lib/components/app/affiliate/`
- [ ] Copy to clipboard dengan feedback visual (icon berubah jadi checkmark)
- [ ] Filter links berdasarkan marketplace
- [ ] Jalankan `pnpm run check`

## Task 4 — Sales History Table

- [ ] Tabel dengan pagination (20/halaman)
- [ ] Filter: marketplace, status, date range
- [ ] Export CSV via server action
- [ ] Jalankan `pnpm run check`

## Task 5 — Payout Request

- [ ] UI payout summary dengan pending balance
- [ ] Tombol "Request Payout" dengan validasi minimum threshold
- [ ] Server action untuk create payout request
- [ ] Notifikasi konfirmasi setelah request berhasil
- [ ] Jalankan `pnpm run check`
