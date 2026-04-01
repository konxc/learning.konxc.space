---
inclusion: always
---

# Naik Kelas 2.0 — Project Context

Platform LMS enterprise-grade untuk workforce digital Indonesia. Dibangun di atas SvelteKit 2 + Svelte 5 Runes.

## Stack Wajib

- **Framework**: SvelteKit 2 + Svelte 5 Runes (`$props`, `$state`, `$derived`, `$effect`)
- **Styling**: Tailwind CSS 4 — gunakan `bg-linear-to-*` bukan `bg-gradient-to-*`
- **Database**: Turso (LibSQL) via Drizzle ORM — schema di `src/lib/server/db/schema.ts`
- **Auth**: Lucia v3 — session di `event.locals.user`
- **Package Manager**: pnpm

## Aturan Kode

### WAJIB

- Setelah setiap perubahan kode: jalankan `pnpm run check` (harus 0 error, 0 warning)
- Gunakan design tokens dari `$lib/config/design` — jangan hardcode warna/shadow/radius
- Semua props komponen harus punya TypeScript interface eksplisit
- Cek `src/lib/server/rbac.ts` sebelum menambah route atau nav item baru
- Tutup semua HTML element secara eksplisit (Svelte 5 strict)

### DILARANG

- `export let` — gunakan `$props()` (Svelte 5)
- Import `$lib/server/*` di file `.svelte` client-side
- Hardcode warna, shadow, atau radius — pakai design tokens
- `@ts-ignore` atau cast `any`
- Tambah dependency baru tanpa instruksi eksplisit user
- Ubah business logic atau hapus security check saat refactoring

## Roles & RBAC

| Role          | Akses                               |
| ------------- | ----------------------------------- |
| `admin`       | Full platform management            |
| `mentor`      | Course creation, grading, broadcast |
| `facilitator` | Cohort monitoring, checkpoints      |
| `user`        | Learning, progress tracking         |
| `bd`          | CRM, waiting list                   |

## Design Tokens Cheat Sheet

```ts
import { COLOR, TEXT, RADIUS, ELEVATION, TRANSITION, SPACING, GRADIENT } from '$lib/config/design';

// Card
class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${ELEVATION.card}`}

// Button primary
class={`${COLOR.accentBg} ${COLOR.accentHover} ${RADIUS.button} ${TEXT.button} ${SPACING.button}`}

// Heading
class={`${TEXT.h1} ${COLOR.textPrimary}`}
```

## Pola Tambah Halaman Dashboard

1. Buat route: `src/routes/(dashboard)/app/nama-halaman/+page.svelte`
2. Buat server loader: `+page.server.ts` dengan auth check
3. Daftarkan nav item di `src/lib/server/rbac.ts`
4. Gunakan design tokens
5. Jalankan `pnpm run check`

## Commit Convention

```
feat: tambah fitur baru
fix: perbaiki bug
style: perubahan UI/UX (tanpa logic)
refactor: restruktur kode
docs: update dokumentasi
chore: tooling, config, dependencies
```
