# Spec: Advanced Analytics & Personalization

## Overview

Analytics mendalam untuk semua role — platform admin lihat platform-wide metrics, org owner lihat org metrics, student lihat personal learning analytics dan personalized recommendations.

## Requirements

### R1 — Platform Analytics (Admin)

- R1.1: Dashboard `/app/admin/analytics` — MAU, DAU, revenue trend, course completion rates
- R1.2: Cohort analysis: retention per batch
- R1.3: Revenue breakdown: per org, per course, per payment method
- R1.4: Export data ke CSV

### R2 — Org Analytics (Owner/Admin)

- R2.1: Halaman `/app/organizations/[id]/analytics` sudah ada — enhance dengan:
- R2.2: Student engagement heatmap (hari/jam paling aktif)
- R2.3: Course completion funnel (enrolled → started → 50% → completed)
- R2.4: Cohort comparison: batch A vs batch B performance

### R3 — Personal Learning Analytics (Student)

- R3.1: Halaman `/app/learning/analytics` — personal stats
- R3.2: Learning velocity: lessons per week trend
- R3.3: Strength/weakness analysis berdasarkan quiz scores per topic
- R3.4: Estimated completion date berdasarkan current pace
- R3.5: Personalized next action: "Kamu 3 hari tidak belajar, lanjutkan [lesson]"

## Technical Constraints

- Semua analytics dihitung dari data yang sudah ada (lessonProgress, trackerActivity, submission, enrollment)
- Tidak ada analytics service eksternal — pure SQL aggregation
- Charts: native SVG (sudah ada pattern di SalesTrendChart.svelte)
- Export CSV: server action yang generate CSV string

## Acceptance Criteria

- [ ] Platform analytics dashboard berfungsi dengan data real
- [ ] Org analytics enhanced dengan funnel dan heatmap
- [ ] Personal learning analytics tampil dengan data akurat
- [ ] Export CSV berfungsi
- [ ] pnpm run check 0 errors
