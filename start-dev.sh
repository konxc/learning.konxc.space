#!/usr/bin/env bash
set -euo pipefail

# ======================================================
# PT Koneksi Jaringan Indonesia - DevOps Development
# Platform: Naik Kelas
# Environment: Remote Local Development (isolated HMR)
# ======================================================

COMPOSE_FILES="-f docker-compose.dev.yml"
PROJECT_NAME="learningkonxcdev"
APP_SERVICE="app"

echo "🚀 [Naik Kelas Dev Engine] Starting dev environment for $PROJECT_NAME ..."
echo

# 1. Check Docker & network
if ! command -v docker &> /dev/null; then
  echo "❌ Docker tidak ditemukan. Pastikan Docker sudah terinstall dan berjalan."
  exit 1
fi

if ! docker network inspect nginx-net >/dev/null 2>&1; then
  echo "🌐 Membuat network 'nginx-net'..."
  docker network create nginx-net
fi

# 2. Remove leftover containers from previous runs (avoids naming conflicts)
echo "🧹 Membersihkan container lama..."
docker rm -f naikkelas-dev-proxy naikkelas-app-dev naikkelas-redis-dev naikkelas-minio naikkelas-minio-init 2>/dev/null || true

# 3. Fix permissions on host-generated files (if root-owned from previous Docker runs)
#    Uses sudo -n (non-interactive) to avoid password prompt breaking the script
echo "🔧 Memastikan permission file host sesuai..."
ROOT_OWNED=$(find .svelte-kit -maxdepth 0 -user root 2>/dev/null && echo "yes" || echo "no")
if [ "$ROOT_OWNED" = "yes" ]; then
  if sudo -n chown -R "$(id -u):$(id -g)" .svelte-kit build 2>/dev/null; then
    echo "   ✅ .svelte-kit permissions fixed"
  else
    echo "   ⚠️  Tidak bisa sudo otomatis. Jalankan manual: sudo chown -R \$(id -u):\$(id -g) .svelte-kit build"
  fi
fi
echo

# 4. Build dan jalankan container HMR
echo "🏗️  Build dan menjalankan container development (pnpm dev)..."
docker compose $COMPOSE_FILES up -d --build

# 5. Status
echo
echo "⏳ Menunggu 5 detik untuk sinkronisasi dependencies..."
sleep 5

echo
echo "📦 Status service DEV:"
docker compose $COMPOSE_FILES ps

echo
echo "✅ Environment Development bersih sukses menyala!"
echo "➡️  Traefik: http://naikkelas-app-dev.localhost (via SSH tunnel: ssh -L 80:127.0.0.1:8080 user@host)"
echo "➡️  MinIO Console: http://naikkelas-minio.localhost"
echo "➡️  MinIO S3 API: http://s3.localhost"
echo
echo "📜 Menampilkan log dari 'pnpm dev' (Tekan Ctrl+C untuk keluar. Container akan tetap jalan di background)..."
echo
docker compose $COMPOSE_FILES logs -f $APP_SERVICE
