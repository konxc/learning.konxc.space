#!/usr/bin/env bash
set -euo pipefail

# ======================================================
# PT Koneksi Jaringan Indonesia - DevOps Production/Preview
# Platform: Naik Kelas
# Environment: Preview & Production
# ======================================================

COMPOSE_FILES="-f docker-compose.yml"
PROJECT_NAME="learningkonxcspace"
APP_SERVICE="naikkelas-app"

echo "🚀 [Naik Kelas Production/Preview] Starting deployment for $PROJECT_NAME ..."
echo

# 1. Check Docker & network
if ! command -v docker &> /dev/null; then
  echo "❌ Docker tidak ditemukan. Pastikan Docker sudah terinstall dan berjalan."
  exit 1
fi

if ! docker network inspect nginx-net >/dev/null 2>&1; then
  echo "🌐 Membuat network 'nginx-net' untuk reverse proxy..."
  docker network create nginx-net
else
  echo "✅ Network 'nginx-net' sudah ada."
fi
echo

# 2. Build dan jalankan container
echo "🏗️  Building dan menjalankan container production..."
docker compose $COMPOSE_FILES up -d --build

# 3. Tampilkan status container
echo
echo "📦 Status service:"
docker compose $COMPOSE_FILES ps

echo
echo "✅ Deployment selesai! Silakan hubungkan Nginx Proxy Host Anda ke container '$APP_SERVICE:3000' yang berjalan di network 'nginx-net'."
echo "📜 Menampilkan log secara live (Tekan Ctrl+C untuk keluar)..."
echo
docker compose $COMPOSE_FILES logs -f $APP_SERVICE
