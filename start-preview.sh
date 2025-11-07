#!/usr/bin/env bash
set -euo pipefail

# ======================================================
# PT Koneksi Jaringan Indonesia - DevOps Preview Script
# Platform: Naik Kelas
# Environment: Preview (learning.konxc.space)
# ======================================================

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
PROJECT_NAME="learningkonxcspace"
APP_SERVICE="naikkelas-app"

echo "🚀 [Naik Kelas Preview] Starting deployment for $PROJECT_NAME ..."
echo

# 1. Check Docker & network
if ! command -v docker &> /dev/null; then
  echo "❌ Docker tidak ditemukan. Pastikan Docker sudah terinstall dan berjalan."
  exit 1
fi

if ! docker network inspect nginx-net >/dev/null 2>&1; then
  echo "🌐 Membuat network 'nginx-net'..."
  docker network create nginx-net
else
  echo "✅ Network 'nginx-net' sudah ada."
fi
echo

# 2. Build dan jalankan container
echo "🏗️  Building dan menjalankan container..."
docker compose $COMPOSE_FILES up -d --build

# 3. Tampilkan status container
echo
echo "📦 Status container:"
docker compose $COMPOSE_FILES ps

# 4. Tunggu sebentar agar service siap
echo
echo "⏳ Menunggu 5 detik agar service siap..."
sleep 5

# 5. Cek health check (opsional, jika kamu nanti menambahkan HEALTHCHECK di Dockerfile)
if docker ps --format '{{.Names}}' | grep -q "$APP_SERVICE"; then
  echo "✅ Service '$APP_SERVICE' berjalan dengan normal."
else
  echo "⚠️  Service '$APP_SERVICE' belum muncul di daftar container. Periksa log manual jika perlu."
fi
echo

# 6. Tampilkan log live
echo "📜 Menampilkan log dari service '$APP_SERVICE' (Tekan Ctrl+C untuk keluar log viewer, container tetap berjalan)"
echo
docker compose $COMPOSE_FILES logs -f $APP_SERVICE
