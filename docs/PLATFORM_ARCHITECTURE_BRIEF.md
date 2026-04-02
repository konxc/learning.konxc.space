# Platform Architecture Brief — Naik Kelas 2.0

> Dokumen brainstorming & klarifikasi arsitektur bisnis dan teknis
> Status: DRAFT — perlu review dan persetujuan sebelum implementasi

---

## 1. Konteks & Latar Belakang

### Asal Usul — Bukti dari Codebase

Platform ini **terbukti** dibangun awalnya untuk satu pengelola tunggal. Berikut evidence konkret yang ditemukan di codebase:

**Evidence 1 — Notulensi Proyek Asli** (`.cursor/commands/notulensi_naik_kelas.md`)

> _"Nama Proyek: Naik Kelas by Koneksi — Inisiator: Tim IT Yayasan Klub F / Koneksi"_
> Tujuan: membangun unit usaha edukasi teknologi untuk rekrutmen dan pembinaan talenta digital. Satu entitas, satu tujuan.

**Evidence 2 — Tagline Hardcoded di Prototype HTML** (`docs/COMPARISON_PROTOTYPE_VS_SVELTEKIT.md`)

```html
<p class="tagline">by Koneksi × Yayasan Klub Fisika</p>
```

Tagline ini hardcoded — tidak ada konsep multi-tenant sama sekali di prototype awal.

**Evidence 3 — Email Template Hardcoded** (`src/lib/server/email.ts`)

```
© 2026 Naik Kelas by Koneksi. All rights reserved.
In partnership with Yayasan ASIB
```

Nama partner di-hardcode langsung di kode, bukan dari database. Ini menunjukkan hanya ada satu partner yang dibayangkan.

**Evidence 4 — Schema `partner` sebagai Konsep Awal** (`src/lib/server/db/schema.ts`)

```typescript
export const partner = sqliteTable('partner', {
    id: text('id').primaryKey(), // e.g., 'yayasan-asib'
    name: text('name').notNull(), // e.g., 'Yayasan ASIB'
});
// Di tabel enrollment:
partnerId: text('partner_id'), // Partner organization ID (e.g., 'yayasan-asib')
```

Konsep "partner" awalnya adalah **yayasan/sekolah yang mengirim siswa** — bukan org yang punya kursus sendiri. Model B2B sederhana: Yayasan ASIB kirim siswa → di-enroll ke course Naik Kelas.

**Evidence 5 — Dokumen Pricing untuk Meeting** (`docs/BRIEF_PRICING_SUBSCRIPTION.md`)

> _"Untuk: Meeting PT Koneksi Jaringan Indonesia dengan Yayasan Klub Fisika"_
> Dokumen negosiasi kemitraan — model bisnis awal adalah Naik Kelas sebagai vendor, Yayasan Klub Fisika sebagai klien.

**Evidence 6 — Halaman Kemitraan Sekolah**
Routes `/school-partnership`, `/kemitraan`, `/paket-les` — dibuat khusus untuk menarik sekolah/yayasan sebagai **klien B2B**, bukan sebagai tenant mandiri.

**Evidence 7 — Social Proof** (`src/lib/config/socialProof.ts`)
Yayasan Klub Fisika tercantum sebagai satu-satunya partner di landing page.

### Kesimpulan: Model Bisnis Awal vs Sekarang

**Model awal (single-tenant):**

```
Naik Kelas (platform + konten) ←→ Yayasan/Sekolah (klien B2B)
                                          ↓
                                   Siswa mereka belajar di platform
```

**Model 2.0 yang diinginkan (multi-tenant):**

```
Naik Kelas (infrastruktur SaaS) ← Org A, Org B, Org C (tenant mandiri)
                                        ↓
                                   Masing-masing punya kursus & student sendiri
```

Masalahnya: **evolusi ini terjadi tanpa redesign arsitektur yang menyeluruh.** Konsep `partner` (yayasan klien lama) dan `organization` (tenant baru) bercampur aduk di schema dan kode.

### Evolusi ke 2.0

Naik Kelas 2.0 berevolusi menjadi **multi-tenant LMS** — platform yang mengizinkan **organisasi manapun** untuk:

- Menjual kursus mereka sendiri
- Mengelola member/student mereka sendiri
- Memiliki mentor dan fasilitator sendiri
- Beroperasi secara independen dalam satu platform

Ini bukan sekadar Moodle. Ini lebih mirip **Teachable/Kajabi versi Indonesia** yang bisa di-white-label per organisasi.

### Masalah Saat Ini

Dua lapisan role (platform global + org) tidak terdefinisi dengan jelas, menyebabkan:

- Ambiguitas siapa yang bisa melakukan apa
- User bisa punya role berbeda di tempat berbeda (membingungkan)
- Kode RBAC yang kompleks dan sulit di-maintain
- Potensi kebocoran data antar tenant

---

## 2. Pemisahan Mindset yang Diusulkan

### Layer 1 — Platform Layer (Naik Kelas sebagai Produk)

> "Siapa yang mengelola platform ini sebagai bisnis?"

Platform Naik Kelas adalah **produk SaaS**. Ada tim yang menjalankan bisnis ini:

| Role                | Tanggung Jawab                                                           | Akses              |
| ------------------- | ------------------------------------------------------------------------ | ------------------ |
| `superadmin`        | Pemilik platform, akses penuh mutlak                                     | Semua              |
| `admin`             | Operasional platform: approve org baru, kelola billing, lihat semua data | Platform-wide      |
| `bd` (Business Dev) | Akuisisi org baru, follow up waiting list, CRM                           | CRM only           |
| `support`           | _(opsional)_ Bantu user/org yang bermasalah                              | Read-only + ticket |

**Prinsip:** Tim platform TIDAK ikut campur dalam konten atau operasional org. Mereka hanya mengelola **infrastruktur dan bisnis platform**.

---

### Layer 2 — Organization Layer (Tenant)

> "Siapa yang mengelola kursus dan student dalam satu organisasi?"

Setiap organisasi adalah **tenant independen**. Mereka punya tim sendiri:

| Role Org      | Tanggung Jawab                              | Analogi          |
| ------------- | ------------------------------------------- | ---------------- |
| `owner`       | Pemilik org, kelola billing, bisa hapus org | CEO/Founder      |
| `admin`       | Kelola member, invite, setting org          | COO/Manager      |
| `mentor`      | Buat & kelola kursus, nilai submission      | Instruktur/Dosen |
| `facilitator` | Dampingi batch/cohort, monitor progress     | Tutor/TA         |
| `member`      | Student dalam org, ikut kursus              | Mahasiswa        |

**Prinsip:** Org owner/admin TIDAK bisa akses data org lain. Setiap org adalah silo yang terisolasi.

---

### Layer 3 — Learner Layer (End User)

> "Siapa yang belajar di platform ini?"

User biasa yang membeli dan mengikuti kursus. Bisa dari org tertentu atau beli langsung di marketplace publik.

| Role          | Konteks                                        | Akses                 |
| ------------- | ---------------------------------------------- | --------------------- |
| `user` (free) | Daftar sendiri, belum beli kursus              | Explore, waiting list |
| `student`     | Sudah enroll kursus (via org atau marketplace) | Learning dashboard    |

---

## 3. Skenario Bisnis yang Harus Didukung

### Skenario A — Org Mandiri (Yayasan Klub Fisika model)

Sebuah yayasan/sekolah/komunitas mendaftar sebagai org, upload kursus mereka, dan mengelola student mereka sendiri. Platform Naik Kelas hanya sebagai infrastruktur.

```
Yayasan Klub Fisika
├── Owner: Ketua Yayasan
├── Admin: Sekretaris
├── Mentor: Guru Fisika 1, Guru Fisika 2
├── Facilitator: Asisten 1, Asisten 2
└── Students: 200 siswa (member org)
```

### Skenario B — Marketplace Publik (Koneksi Digital model)

Mentor individual mendaftar, membuat kursus, dan menjualnya di marketplace publik Naik Kelas. Student beli langsung tanpa harus jadi member org.

```
Marketplace Naik Kelas
├── Mentor Budi → Course "Bisnis Digital" → Student umum
├── Mentor Dewi → Course "Content Creator" → Student umum
└── Student beli langsung, tidak perlu join org
```

### Skenario C — Hybrid (Enterprise)

Org besar yang punya kursus internal (untuk member) DAN kursus publik (dijual di marketplace).

```
Koneksi Digital Academy
├── Internal: Kursus khusus member org (tidak dijual publik)
└── Public: Kursus dijual di marketplace Naik Kelas
```

---

## 4. Pertanyaan Kritis yang Perlu Dijawab

### 4.1 Tentang Org & Platform

- [ ] Apakah admin platform bisa melihat konten/data org tanpa izin? (Privacy concern)
- [ ] Apakah org bisa customize branding (logo, warna, domain)? Sudah ada di schema tapi belum diimplementasi penuh.
- [ ] Apakah ada tier org? (Free = 1 mentor, Pro = unlimited mentor, Enterprise = custom domain)

### 4.2 Tentang Kursus & Marketplace

- [ ] Kursus yang dibuat dalam org — apakah otomatis masuk marketplace publik atau harus di-publish manual?
- [ ] Siapa yang dapat revenue dari kursus? Org langsung atau lewat platform dulu?
- [ ] Apakah ada revenue sharing antara platform dan org?

### 4.3 Tentang User & Role

- [ ] Bisakah satu user jadi mentor di Org A dan student di Org B? (Saat ini: ya, tapi membingungkan)
- [ ] Apakah `mentor` platform global masih diperlukan, atau semua mentor harus dalam konteks org?
- [ ] Bagaimana onboarding org baru? Siapa yang approve?

### 4.4 Tentang Yayasan Klub Fisika

- [ ] Apakah Yayasan Klub Fisika akan jadi org di platform ini, atau mereka adalah "platform partner" yang berbeda?
- [ ] Apakah mereka punya akses khusus yang tidak dimiliki org lain?

---

## 5. Proposal Arsitektur yang Disederhanakan

### Terminologi Baru yang Diusulkan

**Hapus ambiguitas dengan terminologi yang jelas:**

```
PLATFORM NAIK KELAS
│
├── PLATFORM TEAM (mengelola bisnis platform)
│   ├── superadmin — akses penuh
│   ├── admin — operasional
│   └── bd — sales/CRM
│
└── ORGANIZATIONS (tenant independen)
    ├── Org A: Yayasan Klub Fisika
    │   ├── owner (1 orang)
    │   ├── admin (opsional)
    │   ├── mentor (buat kursus)
    │   ├── facilitator (dampingi batch)
    │   └── member/student
    │
    ├── Org B: Koneksi Digital Academy
    │   └── (struktur sama)
    │
    └── Marketplace (tanpa org)
        └── mentor individual → kursus publik → student umum
```

### Perubahan Role yang Diusulkan

**Saat ini (membingungkan):**

- `admin` = bisa jadi platform admin DAN org owner
- `mentor` = role platform tapi juga bisa jadi org creator/owner
- `facilitator` = role platform tapi juga role org

**Usulan (jelas):**

- Platform: `superadmin`, `admin`, `bd`
- Org: `owner`, `admin`, `mentor`, `facilitator`, `member`
- Tidak ada overlap — platform team tidak masuk org, org team tidak punya akses platform

---

## 6. Dampak Teknis

### Yang Perlu Diubah di Codebase

1. **Schema database** — Pisahkan `user.role` menjadi hanya platform roles (`superadmin`, `admin`, `bd`, `user`). Role dalam org sepenuhnya dari `organization_member.role`.

2. **RBAC (`src/lib/server/rbac.ts`)** — Pisahkan logika platform vs org. Saat ini tercampur.

3. **Dashboard** — Tidak ada lagi "role switching" yang membingungkan. User punya satu dashboard sesuai konteks mereka.

4. **Middleware** — `requireAdmin`, `requireMentor`, dll perlu dipisah menjadi `requirePlatformAdmin` dan `requireOrgMentor`.

5. **Seed data** — Redesign agar mencerminkan arsitektur baru.

### Estimasi Dampak

- **Breaking change** — Perubahan ini akan mempengaruhi hampir semua halaman dashboard
- **Migrasi data** — User yang saat ini punya role `mentor` perlu di-migrate ke org member
- **Testing** — Semua flow perlu di-test ulang

---

## 7. Rekomendasi Langkah Selanjutnya

1. **Review dokumen ini** — Pastikan semua stakeholder setuju dengan arah yang diusulkan
2. **Jawab pertanyaan kritis** di section 4 — Ini akan menentukan detail implementasi
3. **Buat spec teknis** — Setelah arah bisnis jelas, buat spec implementasi yang detail
4. **Implementasi bertahap** — Jangan ubah semua sekaligus, mulai dari schema dan RBAC

---

## 8. Catatan Tambahan

### Tentang Yayasan Klub Fisika

Berdasarkan konteks, Yayasan Klub Fisika adalah **partner strategis pertama** platform ini. Mereka bukan sekadar org biasa — mereka adalah "anchor tenant" yang memvalidasi model bisnis. Perlu diputuskan apakah mereka mendapat perlakuan khusus (misalnya: free plan selamanya, akses fitur beta, dll).

### Tentang Multi-tenancy

Multi-tenancy yang benar membutuhkan **isolasi data yang ketat**. Saat ini platform belum sepenuhnya mengimplementasikan ini — ada beberapa query yang bisa "bocor" data antar org. Ini perlu di-audit sebelum onboarding org nyata.

### Tentang Monetisasi

Model bisnis platform perlu didefinisikan dengan jelas:

- Apakah platform ambil % dari setiap transaksi?
- Apakah ada subscription fee per org?
- Apakah ada free tier untuk org kecil?

Jawaban atas pertanyaan ini akan sangat mempengaruhi arsitektur payment dan billing.

---

_Dokumen ini adalah titik awal diskusi. Semua keputusan di sini perlu dikonfirmasi sebelum diimplementasikan._

## 5. Arsitektur Role yang Diputuskan

Berdasarkan analisis ketiga skenario bisnis, berikut keputusan arsitektur yang paling pragmatis dan scalable.

### Prinsip Utama

**1. `user.role` hanya untuk platform level.**
Kolom `role` di tabel `user` tidak lagi dipakai untuk menentukan akses ke fitur kursus/org. Nilainya hanya:

| `user.role` | Artinya                             |
| ----------- | ----------------------------------- |
| `admin`     | Tim operasional platform Naik Kelas |
| `bd`        | Tim Business Development / CRM      |
| `user`      | Semua orang lainnya (default)       |

**2. Role dalam org sepenuhnya dari `organization_member.role`.**
Seorang mentor tidak punya `role = 'mentor'` di tabel user. Mereka tetap `role = 'user'`, tapi punya `organization_member.role = 'mentor'` di org tertentu. Ini memungkinkan satu orang jadi mentor di Org A dan student di Org B — tanpa konflik.

**3. Mentor individual (Skenario B) tetap harus punya org.**
Daripada membuat jalur khusus "solo mentor tanpa org", mentor individual cukup membuat org dengan satu anggota (diri sendiri sebagai `owner`). Ini menyederhanakan kode secara signifikan — tidak ada cabang logika khusus untuk solo mentor.

**4. Tidak ada `superadmin` terpisah.**
`admin` platform sudah cukup. Jika perlu akses darurat, gunakan akses langsung ke database. Menambah `superadmin` hanya menambah kompleksitas RBAC tanpa manfaat nyata di tahap ini.

---

### Peta Role Lengkap

```
PLATFORM NAIK KELAS (user.role)
├── admin   → Operasional platform: approve org, kelola billing, lihat semua data
├── bd      → CRM: waiting list, akuisisi org baru
└── user    → Semua orang (default saat daftar)

ORGANIZATION (organization_member.role)
├── owner       → Pemilik org, bisa hapus org, kelola billing
├── admin       → Kelola member, invite, setting org
├── mentor      → Buat & kelola kursus, nilai submission
├── facilitator → Dampingi cohort, monitor progress student
└── member      → Student dalam org, ikut kursus
```

---

### Skenario A — Org Mandiri (Yayasan Klub Fisika)

Yayasan mendaftar sebagai org. Semua anggota tim mereka adalah `user` di platform, dengan role org masing-masing.

```
User: ketua_yayasan   → user.role = 'user', org_member.role = 'owner'
User: sekretaris      → user.role = 'user', org_member.role = 'admin'
User: guru_fisika_1   → user.role = 'user', org_member.role = 'mentor'
User: asisten_1       → user.role = 'user', org_member.role = 'facilitator'
User: siswa_001       → user.role = 'user', org_member.role = 'member'
```

Dashboard yang ditampilkan ditentukan oleh `organization_member.role` dalam konteks org aktif, bukan `user.role`.

**Flow akses:**

1. User login → `user.role = 'user'` → masuk personal dashboard
2. User klik "Masuk ke Org Yayasan Klub Fisika" → sistem baca `organization_member.role`
3. Jika `owner` → tampilkan org owner dashboard
4. Jika `mentor` → tampilkan mentor dashboard dalam konteks org tersebut

---

### Skenario B — Marketplace Publik (Mentor Individual)

Mentor individual mendaftar, membuat org sendiri (otomatis saat apply jadi mentor), lalu publish kursus ke marketplace.

```
User: mentor_budi     → user.role = 'user'
                         org_member.role = 'owner' (di "Budi Academy" — org auto-created)
                         org_member.role = 'mentor' (di "Budi Academy")

Kursus "Bisnis Digital" → org_id = 'budi-academy', visibility = 'public'
Student umum beli → enrollment tanpa harus join org
```

**Poin penting:** Student yang beli kursus dari marketplace **tidak perlu jadi member org**. Mereka hanya punya `enrollment` yang terhubung ke kursus tersebut. `organization_member` hanya untuk orang yang benar-benar bagian dari tim org.

**Flow enrollment marketplace:**

```
Student beli kursus → enrollment.org_id = null (atau org pemilik kursus)
                    → enrollment.cohort_id = null (tidak masuk batch)
                    → akses kursus langsung via enrollment
```

---

### Skenario C — Hybrid Enterprise (Koneksi Digital)

Org besar dengan kursus internal (khusus member) dan kursus publik (dijual di marketplace).

```
Org: Koneksi Digital Academy
├── owner: direktur_koneksi   → org_member.role = 'owner'
├── admin: manajer_ops        → org_member.role = 'admin'
├── mentor: mentor_budi       → org_member.role = 'mentor'
├── facilitator: facil_irwan  → org_member.role = 'facilitator'
└── member: 200 student internal

Kursus A: "Akselerasi Bisnis" → visibility = 'public'  → dijual di marketplace
Kursus B: "Internal Onboarding" → visibility = 'internal' → hanya member org
```

**Kontrol visibility kursus:**

| `course.visibility` | Siapa yang bisa akses                 |
| ------------------- | ------------------------------------- |
| `public`            | Siapapun bisa beli di marketplace     |
| `internal`          | Hanya member org (via enrollment org) |
| `draft`             | Hanya mentor/admin org                |
| `invite_only`       | Hanya yang punya link khusus          |

---

## 6. Dampak Teknis & Rencana Implementasi

### 6.1 Perubahan Schema Database

**`user` table** — hapus role `mentor` dan `facilitator`, sisakan hanya platform roles:

```typescript
// SEBELUM
role: text('role').notNull().default('user');
// nilai: 'admin' | 'mentor' | 'facilitator' | 'bd' | 'user'

// SESUDAH
role: text('role').notNull().default('user');
// nilai: 'admin' | 'bd' | 'user'
// mentor/facilitator TIDAK ADA di sini — mereka tetap 'user'
```

**`organization_member` table** — sudah benar, tidak perlu diubah:

```typescript
role: text('role').notNull().default('member');
// nilai: 'owner' | 'admin' | 'mentor' | 'facilitator' | 'member'
```

**`course` table** — tambah kolom `visibility`:

```typescript
visibility: text('visibility').notNull().default('public');
// nilai: 'public' | 'internal' | 'draft' | 'invite_only'
```

**Migrasi data yang diperlukan:**

```sql
-- User dengan role 'mentor' → tetap 'user', tapi pastikan ada org_member record
UPDATE "user" SET role = 'user' WHERE role = 'mentor';
UPDATE "user" SET role = 'user' WHERE role = 'facilitator';
-- Pastikan setiap ex-mentor punya organization_member dengan role = 'mentor'
```

---

### 6.2 Perubahan RBAC (`src/lib/server/rbac.ts`)

**Saat ini:** `isMentor()` cek `user.role === 'mentor'` — ini akan rusak setelah migrasi.

**Sesudah:** Semua pengecekan role org harus lewat `organization_member`:

```typescript
// SEBELUM (salah setelah migrasi)
export function isMentor(user: User | null): boolean {
	return hasRole(user, ['mentor', 'admin']);
}

// SESUDAH (benar)
// Platform-level checks (pakai user.role)
export function isPlatformAdmin(user: User | null): boolean {
	return user?.role === 'admin';
}
export function isBD(user: User | null): boolean {
	return user?.role === 'bd';
}

// Org-level checks (pakai organization_member.role — sudah ada di rbac.ts)
// hasOrgPermission(), canCreateCourses(), dll — sudah benar, tidak perlu diubah
```

**Middleware di server loaders:**

```typescript
// SEBELUM
if (user.role !== 'mentor' && user.role !== 'admin') redirect(302, '/app');

// SESUDAH — cek org membership
const membership = await db
	.select()
	.from(organizationMember)
	.where(
		and(
			eq(organizationMember.userId, user.id),
			eq(organizationMember.orgId, orgId),
			inArray(organizationMember.role, ['mentor', 'admin', 'owner'])
		)
	);
if (!membership.length) redirect(302, '/app');
```

---

### 6.3 Perubahan Dashboard & Navigasi

**Saat ini:** Dashboard ditentukan oleh `user.role` saja.

**Sesudah:** Dashboard ditentukan oleh **konteks aktif**:

```
Jika user tidak dalam konteks org:
  → Tampilkan personal dashboard (berdasarkan user.role)
  → admin → platform admin dashboard
  → bd → CRM dashboard
  → user → learner dashboard

Jika user dalam konteks org (ada orgId di session/URL):
  → Baca organization_member.role untuk org tersebut
  → owner/admin → org management dashboard
  → mentor → course builder + grading dashboard
  → facilitator → cohort monitoring dashboard
  → member → learning dashboard dalam konteks org
```

**Implementasi di `AppShell.svelte`:**

```typescript
// Tentukan dashboard context
const orgContext = $derived(() => {
	if (!currentOrgId) return null;
	return userMemberships.find((m) => m.orgId === currentOrgId);
});

const dashboardRole = $derived(() => {
	if (orgContext) return orgContext.role; // org role
	return user.role; // platform role
});
```

---

### 6.4 Perubahan Alur Onboarding

**Mentor baru (Skenario B):**

1. User daftar → `user.role = 'user'`
2. User apply jadi mentor → isi form `mentor_application`
3. Admin approve → sistem otomatis:
   - Buat org baru (nama default: "{nama} Academy")
   - Tambah user sebagai `owner` dan `mentor` di org tersebut
   - Kirim notifikasi + link onboarding org
4. User masuk org mereka → bisa mulai buat kursus

**Org baru (Skenario A & C):**

1. User daftar → `user.role = 'user'`
2. User buat org baru → isi form org (nama, slug, tipe)
3. Admin platform approve (jika diperlukan verifikasi)
4. User otomatis jadi `owner` org tersebut
5. Owner invite anggota tim → mereka dapat `organization_member` record

---

### 6.5 Isolasi Data Antar Tenant

Setiap query yang menyentuh data org **wajib** include filter `org_id`. Ini harus di-enforce di level aplikasi (belum ada RLS di Neon saat ini).

**Pattern yang benar:**

```typescript
// ✅ Benar — selalu filter by orgId
const courses = await db.select().from(course).where(eq(course.orgId, orgId));

// ❌ Salah — bisa bocor data org lain
const courses = await db.select().from(course);
```

**Middleware helper yang perlu dibuat:**

```typescript
// src/lib/server/org-context.ts
export async function requireOrgMembership(
	userId: string,
	orgId: string,
	minRole: OrgRole = 'member'
) {
	const membership = await db
		.select()
		.from(organizationMember)
		.where(and(eq(organizationMember.userId, userId), eq(organizationMember.orgId, orgId)))
		.limit(1);

	if (!membership.length) throw redirect(302, '/app');

	const roleHierarchy = ['member', 'facilitator', 'mentor', 'admin', 'owner'];
	const userRoleIndex = roleHierarchy.indexOf(membership[0].role);
	const minRoleIndex = roleHierarchy.indexOf(minRole);

	if (userRoleIndex < minRoleIndex) throw redirect(302, '/app');

	return membership[0];
}
```

---

## 7. Estimasi Dampak & Prioritas

### Breaking Changes

| Area                                 | Dampak                                         | Prioritas                    |
| ------------------------------------ | ---------------------------------------------- | ---------------------------- |
| `user.role` migrasi data             | Semua user mentor/facilitator perlu di-migrate | 🔴 Harus sebelum go-live     |
| RBAC `isMentor()`, `isFacilitator()` | Semua server loaders yang pakai ini akan rusak | 🔴 Harus sebelum go-live     |
| Dashboard routing                    | Perlu context-aware routing                    | 🟡 Bisa bertahap             |
| Onboarding flow                      | Perlu redesign form apply mentor               | 🟡 Bisa bertahap             |
| Data isolation audit                 | Audit semua query yang tidak filter orgId      | 🟠 Sebelum onboard org nyata |

### Yang Tidak Perlu Diubah

- `organization_member` table — sudah benar
- `hasOrgPermission()`, `canCreateCourses()`, dll — sudah benar
- Schema tabel lainnya — tidak ada perubahan
- Auth flow (Lucia) — tidak ada perubahan
- Payment flow — tidak ada perubahan

---

## 8. Rekomendasi Langkah Selanjutnya

1. **Migrasi `user.role`** — Update semua user `mentor`/`facilitator` → `user`, pastikan org_member records ada
2. **Fix RBAC functions** — Ganti `isMentor()`/`isFacilitator()` dengan org-context checks
3. **Buat `requireOrgMembership()` helper** — Standarisasi pengecekan akses org di semua server loaders
4. **Tambah `course.visibility`** — Untuk mendukung kursus internal vs publik
5. **Audit data isolation** — Pastikan semua query filter by `orgId`
6. **Update seed data** — Cerminkan arsitektur baru (tidak ada user dengan role mentor/facilitator)

---

## 9. Catatan Tambahan

### Tentang Yayasan Klub Fisika

Yayasan Klub Fisika adalah **anchor tenant** pertama. Mereka mendapat perlakuan khusus bukan di level kode, tapi di level bisnis: free plan, prioritas support, akses fitur beta. Di database, mereka tetap org biasa — tidak ada kolom `is_special` atau sejenisnya. Ini menjaga kode tetap bersih.

### Tentang Multi-tenancy & Isolasi Data

Saat ini isolasi data dilakukan di level aplikasi (filter `orgId` di setiap query). Ini cukup untuk fase awal. Jika platform sudah punya 50+ org aktif dengan data sensitif, pertimbangkan implementasi **Row Level Security (RLS)** di PostgreSQL — Neon mendukung ini secara native.

### Tentang Monetisasi

Model yang paling straightforward untuk fase awal:

- **Platform fee**: % dari setiap transaksi kursus (misal 10-15%)
- **Subscription org**: Free (hingga X kursus/member), Pro (unlimited)
- Revenue sharing otomatis via Midtrans split payment atau manual payout bulanan

Arsitektur payment saat ini sudah mendukung `transaction.org_id` — tinggal tambahkan logika split.

---

_Dokumen ini mencerminkan keputusan arsitektur yang telah diambil. Implementasi dilakukan bertahap sesuai prioritas di section 7._
