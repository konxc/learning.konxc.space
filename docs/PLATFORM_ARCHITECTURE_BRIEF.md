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
