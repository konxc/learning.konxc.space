# Panduan Audit Performa & Lighthouse

## 1. Persiapan

1. Pastikan dependensi terpasang dan server dev berjalan.
   ```bash
   pnpm install
   pnpm run dev
   ```
2. Gunakan Chrome terbaru dengan ekstensi Lighthouse atau DevTools bawaan.

## 2. Menjalankan Lighthouse

1. Buka `http://localhost:5173/` pada mode **Incognito**.
2. Buka DevTools → tab **Lighthouse** → pilih "Mobile" dan "Desktop".
3. Checklist kategori **Performance**, **Best Practices**, **SEO**, **Accessibility**.
4. Klik **Analyze page load**.
5. Simpan laporan sebagai HTML/JSON di folder `docs/audits/` (buat jika belum ada).

## 3. Halaman yang diuji

- `/` (landing page)
- `/tentang`

Ulangi langkah di atas untuk kedua halaman. Catat metrik utama: LCP, CLS, TBT, FID.

## 4. Tindak lanjut

- Gunakan komentar `<!-- lighthouse:note -->` di dokumen ini untuk menyimpan insight dari audit berikutnya.
- Prioritaskan perbaikan yang memengaruhi LCP (gambar besar, dekorasi berat) dan CLS (layout shift).

> **Tip:** setelah perbaikan, jalankan kembali Lighthouse untuk memastikan regresi tidak terjadi.
