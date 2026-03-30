# 📝 Briefing: Integrasi Framework Agen Naik Kelas

Dokumen ini ditujukan bagi AI Agent yang bekerja pada repositori **naikkelas.id** dan **naikkelas-agent** agar memahami infrastruktur pendukung untuk: **naikkelas-agent**.

---

## 🔷 STATUS IMPLEMENTASI (UPDATE 2026-03-31)
Infrastruktur dasar untuk deployment otomatis telah siap di sisi **naikkelas.id**:

1.  **Database Layer**: Tabel `organizationApiKey` telah ditambahkan di `src/lib/server/db/schema.ts` untuk mengelola otentikasi per-organisasi.
2.  **API Layer**: Endpoint `POST /api/v1/deployment/course` telah aktif di `src/routes/api/v1/deployment/course/+server.ts`.
3.  **UI/UX Layer**: Menu manajemen API Key telah tersedia di Dashboard Pengguna (`/app/settings?tab=organization`).
4.  **Security Policy**: Hanya akun dengan status **KTP Terverifikasi** yang dapat membuat organisasi dan mengelola API Key.

---

## 🚀 ALUR "CHAT-TO-CURRICULUM-TO-PRODUCTION"

1.  **Input**: Pengguna mengirim instruksi (e.g. via Telegram) ke `naikkelas-agent`.
2.  **Processing**: `naikkelas-agent` merumuskan draf kurikulum dalam format JSON sesuai skema platform.
3.  **Authentication**: `naikkelas-agent` mengambil API Key organisasi dari environment variable.
4.  **Deployment**: `naikkelas-agent` mengirim `POST` request ke `naikkelas.id/api/v1/deployment/course` dengan header `x-api-key`.
5.  **Synchronization**: Platform utama melakukan *atomic transaction* untuk membuat/update Course, Module, Lesson, dan Material.

---

## 🛠️ PANDUAN INTEGRASI (UNTUK AGEN)

### Endpoint Deployment
- **URL**: `https://learning.naikkelas.id/api/v1/deployment/course` (atau localhost saat dev)
- **Method**: `POST`
- **Headers**:
  ```http
  Content-Type: application/json
  x-api-key: nk_your_secret_key_here
  ```
- **Payload Structure**:
  ```json
  {
    "courseData": {
      "title": "Judul Kursus",
      "description": "Deskripsi panjang...",
      "price": 0,
      "modules": [
        {
          "title": "Modul 1: Dasar-dasar",
          "lessons": [
            {
              "title": "Pelajaran 1.1",
              "materials": [
                {
                  "type": "text",
                  "content": "Isi materi Markdown di sini..."
                }
              ]
            }
          ]
        }
      ]
    }
  }
  ```

---

## 🏗️ TATA KELOLA ORGANISASI
Pengelola dapat mengelola koneksi agen melalui:
- **Settings Dashboard**: Buka `/app/settings` -> Tab **Organisasi**.
- **Generate Key**: Buat key baru untuk agen tertentu. Simpan segera karena key hanya ditampilkan sekali.
- **Revoke Key**: Jika dicurigai ada kebocoran, admin dapat mencabut akses secara instan.

---

## 🎯 TARGET BERIKUTNYA
1.  **Sync Progress (KC/Task)**: Menghubungkan definisi tugas di Markdown dengan sistem tracking di database.
2.  **Webhook Notification**: Platform memberi tahu agen jika kursus telah berhasil di-deploy atau butuh revisi.

**Lead Engineering**: Antigravity AI
**Status**: API Standardized & UI Unified
**Last Updated**: 2026-03-31
