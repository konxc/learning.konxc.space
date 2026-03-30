# 📝 Briefing: Integrasi Framework Agen Naik Kelas

Dokumen ini ditujukan bagi AI Agent yang bekerja pada repositori **naikkelas.id** agar memahami keberadaan ekosistem pendukung baru: **naikkelas-agent**.

---

## 🔷 OVERVIEW EKOSISTEM
Kita sedang membangun arsitektur dua-lapis untuk memodernisasi pembuatan kurikulum:
1.  **naikkelas.id (App Layer)**: Platform SvelteKit/Turso yang menangani pengantaran materi, progres peserta, dan database utama.
2.  **naikkelas-agent (Brain Layer)**: Repositori terpisah yang bertindak sebagai "Pusat Kendali AI". Di sinilah draf kurikulum dari berbagai institusi dirancang menggunakan AI sebelum dikirim ke platform utama.

---

## 🚀 VISI "CHAT-TO-CURRICULUM-TO-PRODUCTION"
Fitur ini memungkinkan pengelola yayasan/instansi untuk:
1.  Mengirim instruksi via Telegram/WhatsApp.
2.  Agen AI di `naikkelas-agent` akan merumuskan draf kurikulum (.md) secara otomatis.
3.  Agen akan melakukan **Deployment** langsung ke platform `naikkelas.id` melalui API.

---

## 🛠️ TUGAS UNTUK AGEN NAIKKELAS.ID
Kepada agen yang bekerja di repositori utama, Anda diminta untuk:

### 1. Review Skema Database
Pastikan tabel `courses`, `modules`, `lessons`, dan `materials` di `src/lib/server/db/schema.ts` dapat menampung data yang dikirim secara otomatis (misal: penanganan slug yang unik, urutan modul yang fleksibel, dan validasi link eksternal).

### 2. Persiapan API Deployment
Mulai rancang endpoint di `src/routes/api/v1/deployment/` yang mampu menerima payload JSON dari `naikkelas-agent`. Endpoint ini harus memiliki parameter keamanan yang ketat (API Key per-Organisasi).

### 3. Sinkronisasi Telemetri
Rancang agar progres peserta (Task/KC) yang didefinisikan di draf Markdown dapat terbaca secara presisi oleh sistem tracking di platform utama.

---

## 🏗️ STRUKTUR REPO TERKAIT
Hubungan antara kedua repositori ini adalah:
- `naikkelas-agent` berdiri sebagai repositori independen.
- `naikkelas.id` akan bertindak sebagai "Consumer" dari output yang dihasilkan agen tersebut.
- Konteks kurikulum spesifik (seperti ASIB) berada di `naikkelas-agent/instances/koneksi-digital`.

---

## 🎯 TUJUAN AKHIR
Membuat `naikkelas.id` menjadi platform LMS pertama yang memiliki integrasi AI end-to-end—mulai dari percakapan santai di aplikasi pesan hingga kelas yang siap diakses ribuan peserta secara otomatis.

**Mohon periksa codebase naikkelas.id dan berikan rekomendasi teknis untuk memperlancar integrasi ini.**

---
**Lead Engineering**: sandikodev  
**Last Updated**: 2026-03-30
