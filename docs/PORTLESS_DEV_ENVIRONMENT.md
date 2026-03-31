# 🏗️ Arsitektur Development: Portless Remote Server via Traefik & SSH

Dokumen ini adalah panduan teknis esensial (SOP) bagi tim *developer* Naik Kelas 2.0. Membahas secara mendalam bagaimana kita merancang, membidani, dan mengakses *environment* pengembangan di sebuah *Remote Server* (VPS / Dedicated Server) **secara 100% rahasia, portless, dan tanpa mengekspos port ke ranah pubik**.

---

## 🛑 Akar Masalah: "Bahaya Mengekspos Port Terbuka"
Praktik umum menjalankan kontainer di *server* jarak jauh adalah dengan melakukan *binding* port langsung ke host (misal `ports: - "3000:3000"` atau `"9001:9001"`). 

Jika peladen kita memiliki *Public IP*, maka mengekspos port ke `0.0.0.0` akan mengundang masalah serius:
1. **Rentan di-Scan Bot Global**: Pelabuhan port seperti `3000` (Node.js/Svelte/Next.js) dan `9001` (S3 MinIO) rutin dipindai oleh *bot-scanners* dari segala penjuru.
2. **Setup Nginx yang Menyulitkan**: Opsi alternatif adalah menggunakan Nginx Reverse Proxy berlapis, yang mana setiap kita mengubah nama/menambah kontainer, kita harus repot-repot menyunting skrip virtual host Nginx.
3. **Mengingat Kombinasi Port**: Mengakses `http://ip-server:9001` sangat memusingkan di proyek skala mikroservis di mana angka port saling bertabrakan.

---

## 🎯 Solusi Modern: "Portless SSH Tunneling"
Kita menggunakan sistem cerdas dengan menggabungkan dua raksasa: **Traefik (Dynamic Reverse Proxy)** dan **SSH Port Forwarding**.

### Diagram Arsitektur Gaib

```mermaid
flowchart LR
    subgraph Laptop Developer (Mac/Windows)
        Browser[Browser:\nhttp://naikkelas-app-dev.localhost]
        Terminal[VSCode Terminal:\nSSH Tunnel]
        
        Browser -- Port 80 Local --> Terminal
    end
    
    subgraph Remote Server (Naik Kelas Dev)
        SSH_Daemon[SSH Service]
        Traefik[Traefik Proxy\n127.0.0.1:8080]
        
        SvelteKit[SvelteKit App\n:3000]
        MinIO_Dash[MinIO Console\n:9001]
        MinIO_API[MinIO S3 API\n:9000]
        
        SSH_Daemon -- "Forwards to 127.0.0.1:8080" --> Traefik
        Traefik -- "Host(`naikkelas-app-dev.localhost`)" --> SvelteKit
        Traefik -- "Host(`naikkelas-minio.localhost`)" --> MinIO_Dash
        Traefik -- "Host(`s3.localhost`)" --> MinIO_API
    end

    Terminal -- Encrypted Tunnel --> SSH_Daemon
```

## 🛠️ Step-by-step: Cara Memutar Environment

### Langkah 1: Jalankan Docker Compose (Di Remote Server)
Semua konfigurasi "penyembunyian port" ini *hardcoded* di dalam `docker-compose.dev.yml`. SvelteKit, Redis, Traefik, dan MinIO diorkestrasi tanpa ada 1 port pun yang bisa dipanggil IP Publik.

Jalankan perintah ini di dalam server:
```bash
# Selesaikan pull & konfigurasi dulu, lalu spin container:
pnpm run db:push
docker compose -f docker-compose.dev.yml up -d --build
```
> **Rahasia Dapur:** Di `docker-compose.dev.yml`, kontainer *Traefik* sengaja dikunci HANYA ke `127.0.0.1`. Ini artinya hanya jaringan internal *server* itu sendiri yang bisa mengakses port 8080.

### Langkah 2: Tambahkan Host di Laptop Developer
Supaya *browser* Google Chrome / Edge di laptop lokal Anda mengenali bahwa domain `*.localhost` tersebut harus dikirimkan ke diri sendiri (supaya ditangkap oleh SSH Tunnel), buka dan ubah file `hosts`:

- **Windows**: Jalankan Notepad As Administrator lalu buka `C:\Windows\System32\drivers\etc\hosts`
- **MacOS/Linux**: `sudo nano /etc/hosts`

Tambahkan baris gaib ini di paling bawah:
```text
# Naik Kelas 2.0 Local Dev Routes
127.0.0.1 naikkelas-app-dev.localhost
127.0.0.1 s3.localhost
127.0.0.1 naikkelas-minio.localhost
```

### Langkah 3: Menggali "Terowongan" (SSH Port Forwarding)
Nah! Inilah kuncinya. Dari laptop Anda, bukalah satu tab Terminal khusus dan biarkan selalu terbuka. Panggil perintah sakti ini:

```bash
# Ubah bagian user@ip_server
ssh -L 80:127.0.0.1:8080 user@IP_REMOTE_SERVER
```

**Penjelasan Anatomis Perintah Tersebut:**
- `-L 80:` : Minta terminal laptop untuk mendengarkan port 80 (HTTP) secara lokal.
- `127.0.0.1:8080` : Setiap *request* yang masuk ke port 80 tadi, angkut jalurnya secara terenkripsi menggunakan sambungan SSH, dan lempar persis ke alamat *localhost* (`127.0.0.1`) di port `8080` pada server tujuan.
- *(Alamat 127.0.0.1:8080 adalah pintu masuk penjaga utama kita, yaitu Traefik).*

### Langkah 4: Voila! Mengakses Ekosistem
Gunakan peramban dari laptop lokal, ketik persis tanpa *port* apapun (layaknya web HTTPS komersil asli!):

| Fitur / Layanan | Akses URL (Tanpa Port!) | Kredensial Akses | Keterangan |
| :--- | :--- | :--- | :--- |
| **Aplikasi LMS SvelteKit** | `http://naikkelas-app-dev.localhost` | Sistem Autentikasi NaikKelas | *Vite HMR (Hot Reload) aktif tersinkron via WebSocket tanpa disadari.* |
| **MinIO Console Dashboard** | `http://naikkelas-minio.localhost` | User: `admin`<br>Pass: `password123` | Antarmuka grafis emulator cermin dari Amazon S3 Bucket (*naikkelas-assets*). |
| **S3 Direct API Server** | `http://s3.localhost` | N/A | Endpoint rujukan API backend Drizzle / presigned upload url image. |

---

## 🔧 Keajaiban Docker Labels & Otomatisasi Traefik

Coba perhatikan file `docker-compose.dev.yml` pada bagian SvelteKit App kita:
```yaml
app:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.app-dev.rule=Host(`naikkelas-app-dev.localhost`)"
    - "traefik.http.services.app-dev.loadbalancer.server.port=3000"
```

Jika esok hari Anda ingin menambahkan alat *developer* baru (seperti **PgAdmin**, **Redis Insight**), Anda TIDAK PERLU MERESTART Traefik atau SSH tunnel!
Pola kerangka kerjanya sesederhana:
1. Daftarkan di *compose*.
2. Buat label `.rule=Host(...)` baru.
3. Tambahkan IP/Domain-nya di `/etc/hosts` laptop Anda.
4. Traefik akan **otomatis** dan instan mengenali kontainer baru dan membuat *routing* nya terbang ke URL cantik!

---

## ⚕️ Pemecahan Masalah (Troubleshooting) & Investigasi Log

Sama seperti sistem jaringan lainnya, kadang sistem akan ngambek. Anda cukup memantaunya menggunakan instrumen *Log* berikut (Jalankan di server):

**1. SvelteKit Web Page saya tidak mau ter-reload padahal saya mengubah kodingan**
*Kemungkinan:* Proses *build/compiler* Vite *crash* di balik layar atau ada cacat TypeScript yang memaksa node mati.
*Buktikan dengan log:*
```bash
docker compose -f docker-compose.dev.yml logs -f app
```

**2. Traefik Error: `{...} too many services`**
*Penyebab:* Kontainer ini mencoba mendaftarkan banyak *sub-domain* (*Router*), tapi Anda lupa mendeklarasikan router A harus memetakan ke *Service (port)* A, bukan B.
*Cara Mengatasinya:* Selalu perhatikan *Label* kontainer tersebut, pastikan setiap `router` dipetakan ke layanan `service` yang eksplisit:
```yaml
# Definisi Router
- "traefik.http.routers.nama-router-1.rule=Host(...)"
# Wajib dipasangkan agar Traefik tidak kebingungan jika di dalam 1 instruksi container ada >1 url target
- "traefik.http.routers.nama-router-1.service=nama-bantuan-service-1"
- "traefik.http.services.nama-bantuan-service-1.loadbalancer.server.port=9000"
```

**3. "Browser mengatakan Situs Tidak Bisa Diakses (Connection Refused)"**
Hampir 100% dipastikan: **Window SSH Tunnel (Langkah 3) Anda tertutup / terputus!**
Silakan buka ulang VSCode terminal, dan jalankan perintah penyebrangan jalur SSH tersebut kembali.

---
> 💡 *Ingat*: Etos kerja di Naik Kelas harus mengedepankan keamanan berlapis. Praktik *Remote Server* dengan membuka *port* itu beresiko fatal dan merugikan perusahan, selalu andalkan kombinasi keajaiban **Traefik + SSH Portless**.
