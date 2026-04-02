# Migrasi Database: Turso (LibSQL/SQLite) → Neon (PostgreSQL)

> Dokumen ini menjelaskan alasan, rencana teknis, dan langkah eksekusi migrasi database platform Naik Kelas 2.0 dari Turso ke Neon.

---

## Latar Belakang

Platform Naik Kelas 2.0 awalnya dibangun di atas **Turso** (LibSQL — SQLite yang di-host di edge). Pilihan ini masuk akal di fase awal karena setup-nya cepat dan cocok untuk single-tenant sederhana.

Namun seiring platform berevolusi menjadi **multi-tenant LMS enterprise**, kebutuhan database juga berubah secara fundamental.

---

## Mengapa Harus Pindah ke Neon?

### 1. Platform Sudah Multi-Tenant — SQLite Tidak Dirancang untuk Ini

Schema kita sekarang punya 50+ tabel dengan relasi kompleks:

- `organization` → `workspace` → `course` → `enrollment` → `lessonProgress`
- `user` → `organizationMember` → `affiliateAccount` → `autoAffiliateLink`
- `cohort` → `checkpoint` → `checkpointSubmission`

SQLite (Turso) adalah **embedded database** — dirancang untuk satu proses, satu writer. Ketika ada banyak organisasi dengan banyak user aktif bersamaan, SQLite mulai menunjukkan batasannya:

- **Write lock**: SQLite hanya bisa satu writer pada satu waktu. Concurrent writes dari banyak tenant akan antri.
- **No native JSON operators**: Kita banyak menyimpan JSON (`featuresConfig`, `payload`, `criteria`, `goals`) tapi tidak bisa query efisien.
- **No full-text search**: Fitur pencarian kursus/diskusi tidak bisa dioptimalkan.

### 2. Turso Tidak Punya Branching — Development Jadi Berisiko

Neon punya fitur **database branching** — setiap developer atau PR bisa punya branch database sendiri yang identik dengan production, tanpa biaya storage tambahan. Ini sangat penting untuk:

- Testing migrasi schema tanpa takut merusak production
- Preview deployment yang punya database sendiri
- Rollback instan jika ada masalah

Turso tidak punya fitur ini.

### 3. PostgreSQL = Ekosistem yang Jauh Lebih Matang

| Fitur               | Turso (SQLite)   | Neon (PostgreSQL)             |
| ------------------- | ---------------- | ----------------------------- |
| Concurrent writes   | ❌ Single writer | ✅ MVCC, unlimited            |
| JSON operators      | ❌ Terbatas      | ✅ `jsonb`, `->`, `->>`, `@>` |
| Full-text search    | ❌ Tidak ada     | ✅ `tsvector`, `tsquery`      |
| Enum types          | ❌ Hanya text    | ✅ Native `enum`              |
| Array columns       | ❌ Tidak ada     | ✅ Native arrays              |
| Window functions    | ⚠️ Terbatas      | ✅ Full support               |
| Branching           | ❌ Tidak ada     | ✅ Instant branching          |
| Connection pooling  | ⚠️ Terbatas      | ✅ Built-in PgBouncer         |
| Scale-to-zero       | ✅               | ✅                            |
| Serverless-friendly | ✅               | ✅ (HTTP driver)              |

### 4. Neon Lebih Cocok untuk Arsitektur Multi-Tenant

Neon mendukung **Row Level Security (RLS)** PostgreSQL secara native — ini adalah fondasi yang tepat untuk isolasi data antar tenant (organisasi). Ke depan, kita bisa enforce `org_id` isolation di level database, bukan hanya di level aplikasi.

### 5. Drizzle ORM Sudah Support PostgreSQL Penuh

Kita sudah pakai Drizzle ORM. Migrasi ke PostgreSQL hanya perlu:

- Ganti `drizzle-orm/sqlite-core` → `drizzle-orm/pg-core`
- Ganti `@libsql/client` → `@neondatabase/serverless`
- Update tipe kolom (lihat bagian teknis di bawah)

---

## Mengapa Neon, Bukan Supabase?

Ini pertanyaan yang wajar — keduanya PostgreSQL, keduanya managed, keduanya punya free tier. Tapi ada perbedaan fundamental yang membuat Neon lebih tepat untuk kita saat ini.

### Supabase = Platform Lengkap (Terlalu Banyak)

Supabase bukan sekadar database — ia adalah **BaaS (Backend as a Service)** yang bundling:

- PostgreSQL database
- Auth system (GoTrue)
- Storage (S3-compatible)
- Realtime (WebSocket via Elixir Phoenix)
- Edge Functions
- Dashboard admin

Kita **tidak butuh semua itu**. Kita sudah punya:

- Auth sendiri (custom session dengan Drizzle)
- Storage sendiri (AWS S3)
- Realtime sendiri (SSE di `/api/notifications/stream`)
- Framework sendiri (SvelteKit)

Membayar Supabase berarti membayar fitur yang tidak kita pakai. Lebih parah lagi, ada **vendor lock-in** — kalau kita pakai Supabase Auth, Supabase Storage, Supabase Realtime, kita terikat ke ekosistem mereka.

### Neon = Database Saja (Tepat Sasaran)

Neon fokus pada satu hal: **serverless PostgreSQL yang cepat**. Tidak ada bundling fitur yang tidak perlu. Kita bayar untuk compute dan storage database saja.

| Aspek              | Neon                        | Supabase                       |
| ------------------ | --------------------------- | ------------------------------ |
| Fokus              | Database only               | Full BaaS                      |
| Branching          | ✅ Core feature             | ❌ Tidak ada                   |
| Scale-to-zero      | ✅ Otomatis                 | ⚠️ Hanya pause manual          |
| Cold start         | ~100ms                      | ~500ms+                        |
| Vendor lock-in     | Rendah (standar PostgreSQL) | Tinggi (ekosistem proprietary) |
| Self-host          | ✅ Neon open source         | ✅ Supabase open source        |
| Harga compute      | Per-second billing          | Per-hour billing               |
| Connection pooling | ✅ Built-in PgBouncer       | ✅ Built-in PgBouncer          |
| Cocok untuk kita   | ✅ Database saja            | ❌ Overkill                    |

### Branching adalah Keunggulan Kritis Neon

Fitur ini tidak ada di Supabase. Dengan Neon branching:

```
main (production)
├── dev (development)
├── feature/payment-v2 (PR preview)
└── staging (UAT)
```

Setiap branch adalah **copy-on-write** dari parent — tidak ada duplikasi storage, tapi data terisolasi penuh. Ini mengubah cara kerja tim secara fundamental: developer bisa test migrasi schema berbahaya tanpa risiko apapun ke production.

---

## Strategi Self-Host: Keluar dari Tagihan Cloud Jika Perlu

Ini poin penting yang perlu direncanakan dari sekarang. Neon adalah **open source** — kodenya ada di GitHub dan bisa di-deploy sendiri. Ini berbeda dengan banyak managed service lain yang proprietary.

### Kapan Self-Host Mulai Masuk Akal?

Tagihan Neon akan mulai terasa ketika:

- **Compute hours** tinggi karena banyak query concurrent (banyak tenant aktif)
- **Storage** tumbuh besar karena data kursus, progress, transaksi
- **Data transfer** keluar region mahal

Estimasi kasar: jika tagihan Neon sudah di atas **$200-300/bulan**, self-host mulai worth it secara ekonomi.

### Opsi Self-Host PostgreSQL

Karena kita pakai **standar PostgreSQL** (bukan fitur proprietary Neon), migrasi ke self-host sangat mudah — cukup ganti `DATABASE_URL`.

**Opsi 1: PostgreSQL di VPS (paling murah)**

```
VPS 4 vCPU / 8 GB RAM / 100 GB SSD
Harga: ~$20-40/bulan (DigitalOcean, Hetzner, Vultr)
Cocok untuk: hingga ~500 concurrent users
```

Setup:

```bash
# Install PostgreSQL 16
apt install postgresql-16

# Atau pakai Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16
```

Ganti `.env`:

```diff
- DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
+ DATABASE_URL="postgresql://user:password@your-vps-ip:5432/naikkelas"
```

**Opsi 2: Neon Self-Hosted (fitur branching tetap ada)**

Neon merilis [neon-local](https://github.com/neondatabase/neon) yang bisa di-deploy di server sendiri. Ini mempertahankan fitur branching tapi dengan infrastruktur kita sendiri.

```bash
# Jalankan Neon stack lokal/VPS
docker compose -f docker-compose/docker-compose.yml up
```

Lebih kompleks dari plain PostgreSQL, tapi cocok jika tim sudah terbiasa dengan workflow branching Neon.

**Opsi 3: Managed PostgreSQL Murah (middle ground)**

Jika tidak mau manage server sendiri tapi ingin lebih murah dari Neon:

| Provider                | Harga mulai | Catatan                     |
| ----------------------- | ----------- | --------------------------- |
| Hetzner Managed DB      | ~€15/bulan  | Eropa, latency lebih tinggi |
| DigitalOcean Managed PG | ~$15/bulan  | Singapore region tersedia   |
| Railway                 | ~$5/bulan   | Cocok untuk staging         |
| Render                  | ~$7/bulan   | Simple setup                |

### Rencana Migrasi Keluar dari Neon (Jika Diperlukan)

Karena kita pakai Drizzle ORM dengan standar PostgreSQL, proses migrasi keluar dari Neon sangat straightforward:

1. **Dump data dari Neon:**

   ```bash
   pg_dump "postgresql://...neon.tech/neondb" > backup.sql
   ```

2. **Restore ke target baru:**

   ```bash
   psql "postgresql://...your-new-db..." < backup.sql
   ```

3. **Ganti `DATABASE_URL` di `.env`** — tidak ada perubahan kode apapun.

4. **Jalankan `pnpm run check`** — verifikasi 0 error.

Tidak ada lock-in. Tidak ada kode yang perlu diubah. Ini adalah keunggulan utama memilih standar PostgreSQL dari awal.

### Rekomendasi Roadmap Database

```
Sekarang (0-100 org aktif)
└── Neon Managed — fokus development, manfaatkan branching

Fase 2 (100-500 org aktif, tagihan ~$100-200/bulan)
└── Evaluasi: Neon Scale vs DigitalOcean Managed PG

Fase 3 (500+ org aktif, tagihan >$300/bulan)
└── Self-host PostgreSQL di dedicated VPS
    + PgBouncer untuk connection pooling
    + Barman/pgBackRest untuk backup otomatis
    + Patroni untuk high availability (opsional)
```

---

## Perbandingan Biaya

|                 | Turso Free    | Neon Free         | Neon Launch ($19/bln) | Self-host VPS |
| --------------- | ------------- | ----------------- | --------------------- | ------------- |
| Storage         | 9 GB          | 0.5 GB            | 10 GB                 | Sesuai disk   |
| Compute         | Edge replicas | 191 compute hours | 300 compute hours     | Unlimited     |
| Branching       | ❌            | ✅ 10 branches    | ✅ Unlimited          | ❌ (manual)   |
| Concurrent conn | Terbatas      | 100               | 1000                  | Unlimited     |
| Backup          | Manual        | 7 hari            | 30 hari               | Manual setup  |
| Support         | Community     | Community         | Email                 | Self          |
| Lock-in         | Medium        | Rendah            | Rendah                | Nol           |

Untuk production awal, **Neon Launch ($19/bulan)** sudah cukup untuk ratusan user aktif. Jauh lebih murah dari Supabase Pro ($25/bulan) yang bundling fitur tidak kita pakai.

---

## Konfigurasi Database

### Development

```
postgresql://neondb_owner:***@ep-green-art-a16z2lg2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Region: `ap-southeast-1` (Singapore) — latency optimal untuk Indonesia.

### Production

```
postgresql://neondb_owner:***@ep-patient-king-a14vbxpv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Keduanya menggunakan **connection pooler** (suffix `-pooler`) — ini penting untuk serverless/edge deployment agar tidak exhausted connection limit.

---

## Rencana Teknis Migrasi

### Perubahan Dependencies

```diff
- "@libsql/client": "^0.15.15"
+ "@neondatabase/serverless": "^0.10.x"
```

`drizzle-orm` tetap sama, hanya ganti driver dan dialect.

### Perubahan Tipe Kolom SQLite → PostgreSQL

| SQLite (Turso)                        | PostgreSQL (Neon)         | Catatan                           |
| ------------------------------------- | ------------------------- | --------------------------------- |
| `sqliteTable`                         | `pgTable`                 | Import dari `drizzle-orm/pg-core` |
| `text('id').primaryKey()`             | `text('id').primaryKey()` | Tetap sama (kita pakai string ID) |
| `integer('x', { mode: 'boolean' })`   | `boolean('x')`            | Native boolean                    |
| `integer('x', { mode: 'timestamp' })` | `timestamp('x')`          | Native timestamp                  |
| `integer('x')`                        | `integer('x')`            | Tetap sama                        |
| `text('x')`                           | `text('x')`               | Tetap sama                        |

### File yang Perlu Diubah

1. `src/lib/server/db/schema.ts` — ganti semua `sqliteTable`, `integer({ mode: 'boolean' })`, `integer({ mode: 'timestamp' })`
2. `src/lib/server/db/index.ts` — ganti driver dari `@libsql/client` ke `@neondatabase/serverless`
3. `drizzle.config.ts` — ganti dialect dari `turso` ke `postgresql`
4. `.env` — update `DATABASE_URL`, hapus `DATABASE_AUTH_TOKEN`
5. `.env.example` — update template
6. `scripts/seed.ts` — pastikan kompatibel dengan PostgreSQL
7. `src/lib/server/auth.ts` — cek Lucia adapter (kemungkinan perlu ganti ke Drizzle PostgreSQL adapter)

### Perubahan `.env`

```diff
- DATABASE_URL="file:./local.db"
- DATABASE_AUTH_TOKEN="..."
+ DATABASE_URL="postgresql://neondb_owner:***@ep-green-art-a16z2lg2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

---

## Langkah Eksekusi

> **Status: SELESAI** — Migrasi schema ke PostgreSQL/Neon telah dieksekusi.

1. ✅ Install `@neondatabase/serverless`, hapus `@libsql/client`
2. ✅ Update `src/lib/server/db/schema.ts` — semua tabel dikonversi ke `pgTable`, `boolean`, `timestamp`
3. ✅ Update `src/lib/server/db/index.ts` — ganti driver
4. ✅ Update `drizzle.config.ts` — ganti dialect
5. ✅ Update `.env` dan `.env.example`
6. ✅ Update `src/lib/server/auth.ts` jika perlu
7. ✅ Jalankan `pnpm run check` — 0 error
8. ✅ Jalankan `pnpm run db:push` ke Neon dev
9. ✅ Jalankan `pnpm run db:seed` untuk populate data
10. ✅ Test semua halaman
11. ✅ Deploy ke production, jalankan `db:push` ke Neon prod

---

## Risiko & Mitigasi

| Risiko                    | Mitigasi                                                     |
| ------------------------- | ------------------------------------------------------------ |
| Data loss saat migrasi    | Backup Turso sebelum migrasi, Neon branching untuk testing   |
| Breaking changes di query | `pnpm run check` wajib 0 error sebelum deploy                |
| Lucia auth adapter        | Cek kompatibilitas, gunakan Drizzle adapter untuk PostgreSQL |
| Seed script gagal         | Test di Neon dev branch dulu sebelum production              |

---

_Dokumen ini dibuat sebagai brief untuk tim engineering. Eksekusi migrasi dilakukan secara bertahap dengan validasi di setiap langkah._
