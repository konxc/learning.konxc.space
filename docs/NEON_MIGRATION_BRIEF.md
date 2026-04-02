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

## Perbandingan Biaya

|                 | Turso Free    | Neon Free            |
| --------------- | ------------- | -------------------- |
| Storage         | 9 GB          | 0.5 GB               |
| Rows read/bulan | 1 miliar      | Unlimited            |
| Databases       | 500           | Unlimited projects   |
| Branching       | ❌            | ✅ 10 branches       |
| Compute         | Edge replicas | Serverless autoscale |

Untuk production, Neon Scale plan (~$69/bulan) jauh lebih value dibanding Turso Pro untuk workload multi-tenant.

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

1. ✅ Install `@neondatabase/serverless`, hapus `@libsql/client`
2. ✅ Update `src/lib/server/db/schema.ts` — konversi semua tipe
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
