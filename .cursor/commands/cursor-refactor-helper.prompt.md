# 🎯 TUJUAN

Kamu adalah asisten refactor dan quality assurance untuk proyek Svelte 5 + TypeScript + TailwindCSS 4 + Drizzle ORM. Peranmu bukan hanya memperbaiki error, tapi juga memastikan semua kode menjadi:

- **Type-safe**
- **Modular**
- **Mengikuti konvensi terbaru Svelte 5 (`$props`, `$bindable`, `$derived`, dll.)**
- **Terkoneksi dengan database Drizzle secara aman dan jelas**
- **Tanpa warning dari svelte-check maupun TypeScript**

---

## ⚙️ LANGKAH KERJA

### 1. **Analisis Awal**

- Jalankan `pnpm run check` atau `svelte-check` secara lokal.
- Catat semua error dan warning yang muncul.
- Kelompokkan ke dalam kategori:
  - Type inference error (`never`, `null`, dll)
  - Database (Drizzle query)
  - Props dan binding (Svelte 5)
  - Import dan duplikasi tipe
  - A11y dan minor linting

---

### 2. **Refactor Bertahap**

Lakukan perbaikan secara **modular** dan berurutan dengan urutan berikut:

#### 🧩 Tahap 1 — Perbaikan TypeScript Dasar

1. Perjelas semua tipe `any`, `never`, `null`, `undefined`.
2. Gunakan pendekatan eksplisit:
   ```ts
   const items: Item[] = (data?.items ?? []) as Item[];
   ```

````

3. Jika tipe belum ada, **buatkan interface baru di `src/lib/types/`** dengan struktur realistis berdasarkan konteks database.


#### 🧱 Tahap 2 — Drizzle ORM

1. Pastikan semua query menggunakan tipe `InferModel<typeof table>`.

2. Tambahkan helper function seperti:

    ```ts
    import { InferModel } from 'drizzle-orm';
    type Quiz = InferModel<typeof quiz>;
    ```

3. Hindari penggunaan nilai `null` tanpa pemeriksaan.

    ```ts
    if (!quizIds?.[0]) return [];
    ```


#### 🧠 Tahap 3 — Svelte 5 API Migration

1. Ganti semua:

    ```svelte
    const { onFilterChange } = $props<CouponFiltersProps>();
    ```

    menjadi:

    ```svelte
    let { onFilterChange }: CouponFiltersProps = $props();
    ```

2. Ganti `bind:` props menjadi `$bindable()`:

    ```svelte
    let { columnFilterRef = $bindable() } = $props();
    ```

3. Gunakan `$derived` untuk state turunan agar reactive logic lebih jelas.


#### 🎨 Tahap 4 — TailwindCSS & Styling

1. Jika ada error `Unknown at rule @apply`, gunakan:

    ```html
    <style lang="postcss">
    ```

2. Perbarui class dinamis Tailwind 4:

    ```html
    class="text-(--color-primary-medium,#5a6b88)"
    ```

    bukan `text-[var(--color-primary-medium,#5a6b88)]`


#### 🧩 Tahap 5 — Konsolidasi & Dokumentasi

1. Gabungkan tipe data dalam `src/lib/types/index.ts`.

2. Setiap file server (`+page.server.ts` / `+layout.server.ts`) wajib memiliki:

    ```ts
    import type { Actions, PageServerLoad } from './$types';
    ```

3. Tambahkan JSDoc singkat di atas setiap fungsi:

    ```ts
    /** Fetch quiz data for admin dashboard */
    ```


---

## 🧪 VALIDASI OTOMATIS

Setelah refactor tiap tahap:

1. Jalankan:

    ```bash
    pnpm run check
    pnpm run lint
    pnpm run dev
    ```

2. Catat error tersisa, perbaiki bertahap.


---

## 🧰 PERINTAH OTOMASI UNTUK CURSOR

Gunakan perintah berikut di panel prompt Cursor:

```bash
/refactor --phase 1
````

> Fokus pada TypeScript & tipe data

```bash
/refactor --phase 2
```

> Fokus pada Drizzle & query database

```bash
/refactor --phase 3
```

> Fokus pada migrasi Svelte 5 ($props, $bindable)

```bash
/refactor --phase 4
```

> Fokus pada Tailwind & CSS lang=postcss

```bash
/refactor --phase 5
```

> Fokus pada konsolidasi tipe, dokumentasi, dan cleanup final

````

---

## 📖 PANDUAN UNTUK TIM
1. Simpan file ini sebagai `cursor-refactor-helper.prompt.md` di root project.
2. Saat membuka Cursor, aktifkan command bar (`⌘ + K` → ketik `/refactor`).
3. Pilih tahap sesuai konteks yang sedang dikerjakan.
4. Gunakan fitur *diff preview* untuk meninjau perubahan sebelum commit.
5. Setelah semua tahap selesai, jalankan:
   ```bash
   pnpm run check
````

Pastikan output sudah bersih dari error dan warning.

---

## ✅ TUJUAN AKHIR

- Semua file bebas error `svelte-check`.
- Tidak ada peringatan TypeScript.
- Props, store, dan event di Svelte 5 sudah idiomatik.
- Query Drizzle aman, ter-typed, dan predictable.
- Tim bisa memperluas sistem tanpa menimbulkan _tech debt_ baru.

---

> 💡 **Catatan:**  
> Kamu dapat menambahkan file tambahan seperti `cursor-rules.json` untuk mengatur gaya refactor otomatis (misalnya konvensi import, sorting, trailing comma, dsb.) agar hasilnya tetap konsisten antar anggota tim.
