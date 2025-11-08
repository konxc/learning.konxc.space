# Quick Fix: Error 1101 - Environment Variables Missing

## 🔴 Problem

Error 1101 terjadi karena environment variables belum di-set di Cloudflare Pages.

## ✅ Solution: Set Environment Variables

### Cara 1: Via Cloudflare Dashboard (Recommended)

1. **Buka Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - Login ke account Anda

2. **Navigate ke Pages**
   - Klik "Workers & Pages" di sidebar
   - Pilih "Pages" tab
   - Cari project: `learning-konxc-space`
   - Klik pada project

3. **Set Environment Variables**
   - Pilih tab "**Settings**"
   - Scroll ke "**Environment variables**"
   - Klik "**Add variable**"

4. **Tambahkan variables berikut:**

   ```
   Variable Name: DATABASE_URL
   Value: libsql://learningkonxcspace-konxc.aws-ap-northeast-1.turso.io

   Variable Name: DATABASE_AUTH_TOKEN
   Value: [dari .env file Anda]

   Variable Name: SESSION_SECRET
   Value: [generate baru: openssl rand -base64 32]
   ```

5. **Save dan tunggu deployment selesai**

---

### Cara 2: Generate SESSION_SECRET

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔍 Verifikasi

Setelah set variables:

1. Tunggu 2-3 menit untuk propagation
2. Refresh page: https://learning-konxc-space.pages.dev
3. Jika masih error, check logs di Cloudflare Dashboard

---

## 📝 Required Variables

### Untuk Production:

- `DATABASE_URL` - Turso database URL
- `DATABASE_AUTH_TOKEN` - Turso auth token
- `SESSION_SECRET` - Random 32+ characters secret untuk Lucia sessions

### Untuk Development:

File `.env` di local sudah cukup untuk development dengan `pnpm run dev`

---

## 🐛 Troubleshooting

### Error masih muncul?

1. **Check variables sudah set:**
   - Cloudflare Dashboard → Pages → Settings → Environment variables

2. **Check deployment logs:**
   - Cloudflare Dashboard → Pages → Deployments → [Latest] → View logs

3. **Redeploy (jika perlu):**
   ```bash
   pnpm run deploy:cf
   ```

### Error: "DATABASE_URL is not set"

- Pastikan sudah set di Cloudflare Dashboard
- Pastikan format value benar (tanpa quotes)
- Redeploy setelah set variables

---

## 🎯 Quick Command Reference

```bash
# Deploy ke production
pnpm run deploy:cf

# Development local
pnpm run dev

# Development dengan Cloudflare local
pnpm run dev:cf
```
