# Cloudflare Pages Environment Variables Setup

## Cara Mengatur Environment Variables untuk Cloudflare Pages

### ⚠️ Penting: JANGAN commit secrets ke git!

Environment variables sebaiknya diatur melalui Cloudflare Dashboard, bukan di `wrangler.toml`.

---

## Setup Environment Variables di Cloudflare Dashboard

### 1. Akses Cloudflare Dashboard

1. Buka https://dash.cloudflare.com
2. Login ke akun Cloudflare Anda
3. Pilih account yang digunakan untuk project

### 2. Navigate ke Pages

1. Klik "Workers & Pages" di sidebar kiri
2. Pilih project `learning-konxc-space`
3. Klik tab **"Settings"** → **"Environment variables"**

### 3. Tambahkan Variables

Klik **"Add variable"** dan tambahkan variables berikut:

#### Required Variables:

```
DATABASE_URL = libsql://learningkonxcspace-konxc.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN = [token dari .env]
SESSION_SECRET = [generate random secret]
```

#### Cara Generate SESSION_SECRET:

```bash
openssl rand -base64 32
```

Atau:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Setup untuk Development Local

Untuk development local dengan Wrangler:

### 1. Buat `wrangler.toml` environment untuk dev

```toml
[env.development]
vars = {
    DATABASE_URL = "file:local.db",  # Local database untuk dev
    DATABASE_AUTH_TOKEN = "",
    SESSION_SECRET = "dev-secret-key-change-in-production"
}
```

### 2. Deploy dengan environment tertentu

```bash
# Deploy ke production (default)
pnpm run deploy:cf

# Deploy ke specific environment
wrangler pages deploy build --env production
```

---

## Alternative: Setup dengan Wrangler CLI

### Option 1: Set via command line

```bash
# Set variables satu per satu
wrangler pages deployment create \
    --project-name=learning-konxc-space \
    DATABASE_URL="libsql://..." \
    DATABASE_AUTH_TOKEN="..." \
    SESSION_SECRET="..."
```

### Option 2: Load dari .env file (untuk development)

Edit `wrangler.toml`:

```toml
[env.production]
# Load from .env file (development only)
# Load variables from .env
```

**PENTING:** Jangan gunakan untuk production! Selalu gunakan Cloudflare Dashboard.

---

## Recommended Approach

### ✅ Production (Recommended)

1. Set environment variables via Cloudflare Dashboard
2. Deploy dengan: `pnpm run deploy:cf`
3. Variables akan otomatis tersedia di runtime

### ✅ Development

1. Gunakan `.env` file untuk local development
2. SvelteKit akan load `.env` otomatis saat `pnpm run dev`

### ✅ Testing Deployment

1. Set test variables di Cloudflare Dashboard
2. Deploy ke specific environment: `wrangler pages deploy build --env staging`

---

## Verifikasi Variables

Setelah deploy, verifikasi variables tersedia:

```bash
# Check deployed configuration
wrangler pages deployment tail
```

Atau buka Cloudflare Dashboard → Pages → Your Project → Settings → Environment variables

---

## Troubleshooting

### Variables tidak tersedia di runtime?

1. Pastikan sudah set di Cloudflare Dashboard
2. Pastikan sudah deploy ulang setelah menambahkan variables
3. Check project name di `wrangler.toml` match dengan di Cloudflare

### Error: "DATABASE_URL is not set"

1. Pastikan variables sudah di-set di Cloudflare Dashboard
2. Deploy ulang: `pnpm run deploy:cf`
3. Wait beberapa menit untuk propagation

---

## Example: Full Setup

### 1. Production Setup

```bash
# 1. Generate SESSION_SECRET
openssl rand -base64 32
# Output: abc123...xyz

# 2. Set di Cloudflare Dashboard
# DATABASE_URL = libsql://...
# DATABASE_AUTH_TOKEN = ...
# SESSION_SECRET = abc123...xyz

# 3. Deploy
pnpm run deploy:cf
```

### 2. Development Setup

```bash
# 1. File .env sudah ada dengan credentials

# 2. Run locally
pnpm run dev

# 3. Test dengan local wrangler
pnpm run dev:cf
```

---

## Security Best Practices

1. ✅ **NEVER** commit secrets ke git
2. ✅ Gunakan Cloudflare Dashboard untuk production secrets
3. ✅ Gunakan `.env` untuk development (jangan commit!)
4. ✅ Generate strong random secrets untuk production
5. ✅ Rotate secrets secara berkala
6. ✅ Gunakan separate variables untuk staging & production

---

## References

- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/functions/#adding-environment-variables)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Turso Environment Variables](https://docs.turso.tech/libsql/database-connect/connecting-to-turso#environment-variables)
