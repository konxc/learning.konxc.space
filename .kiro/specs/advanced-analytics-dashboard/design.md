# Design: Advanced Analytics Dashboard

## Arsitektur

```
src/routes/(dashboard)/app/admin/analytics/
├── +page.server.ts       # Loader: revenue, enrollment, cohort data
└── +page.svelte          # Admin analytics view

src/routes/(dashboard)/app/mentor/analytics/
├── +page.server.ts       # Loader: course-specific data (filtered by mentorId)
└── +page.svelte          # Mentor analytics view

src/lib/components/app/analytics/
├── RevenueChart.svelte   # Line/bar chart untuk revenue trend
├── MetricCard.svelte     # KPI card dengan delta indicator
├── ProgressHeatmap.svelte # Student engagement heatmap
└── DataTable.svelte      # Sortable table untuk top courses/students
```

## Data Flow

```
+page.server.ts
  └── db queries (Drizzle aggregations)
        ├── transactions: sum(amount) GROUP BY period
        ├── enrollments: count(*) GROUP BY courseId, month
        ├── lessonProgress: avg(completionRate) GROUP BY lessonId
        └── userXP: distribution query
  └── return { revenue, enrollments, progress, gamification }

+page.svelte
  └── receives data via $props()
  └── renders MetricCard, RevenueChart, DataTable
```

## Komponen Design

### MetricCard

```svelte
interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;        // % change vs previous period
  deltaLabel?: string;   // "vs bulan lalu"
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}
```

### RevenueChart (native SVG)

- Line chart dengan area fill menggunakan `<path>` SVG
- Tooltip on hover menggunakan Svelte `$state`
- Responsive via `viewBox` dan `preserveAspectRatio`
- Warna dari `COLOR.accentBg` design token

### DataTable

```svelte
interface DataTableProps {
  columns: { key: string; label: string; sortable?: boolean }[];
  rows: Record<string, unknown>[];
  pageSize?: number;
}
```

## RBAC Guard

```typescript
// +page.server.ts (admin)
if (!event.locals.user || event.locals.user.role !== 'admin') {
	redirect(302, '/app/overview');
}

// +page.server.ts (mentor)
if (!isMentor(event.locals.user)) {
	redirect(302, '/app/overview');
}
// Filter: WHERE mentorId = event.locals.user.id
```

## Nav Registration

Tambahkan di `src/lib/server/rbac.ts`:

```typescript
// Admin nav
{ label: 'Analytics', href: '/app/admin/analytics', icon: 'chart', category: 'platform' }

// Mentor nav
{ label: 'Analytics', href: '/app/mentor/analytics', icon: 'chart', category: 'management' }
```
