# Tasks: Advanced Analytics

## Task 1 — Platform Analytics Dashboard

- [ ] Buat `src/routes/(dashboard)/app/admin/analytics/+page.server.ts`
- [ ] Query: MAU/DAU trend 30 hari, revenue trend, top courses, completion rates
- [ ] Buat `+page.svelte` dengan SVG charts (line chart, bar chart)
- [ ] Export CSV action
- [ ] Tambah nav item "Analytics" di admin nav
- [ ] Jalankan `pnpm run check`

## Task 2 — Org Analytics Enhancement

- [ ] Update `src/routes/(dashboard)/app/organizations/[id]/analytics/+page.server.ts`
- [ ] Tambah query: completion funnel, engagement heatmap (hour of day × day of week)
- [ ] Update `+page.svelte` — tambah funnel visualization dan heatmap grid
- [ ] Jalankan `pnpm run check`

## Task 3 — Personal Learning Analytics

- [ ] Buat `src/routes/(dashboard)/app/learning/analytics/+page.server.ts`
- [ ] Query: learning velocity (lessons/week), quiz performance per topic, estimated completion
- [ ] Buat `+page.svelte` — personal stats dengan charts
- [ ] "Next action" recommendation berdasarkan last activity
- [ ] Tambah nav item "Analytics" di learning section
- [ ] Jalankan `pnpm run check`

## Task 4 — Cohort Comparison

- [ ] Update org analytics — tambah cohort comparison query
- [ ] Side-by-side comparison: completion rate, avg score, engagement per cohort
- [ ] Jalankan `pnpm run check`

## Task 5 — Export & Reporting

- [ ] Platform analytics: export CSV (users, revenue, completions)
- [ ] Org analytics: export student progress CSV
- [ ] Personal analytics: export learning history CSV
- [ ] Jalankan `pnpm run check`
