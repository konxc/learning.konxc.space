# Deployment Guide - Naik Kelas Platform

## Overview

Aplikasi telah dikonfigurasi untuk SSR-first deployment dengan Cloudflare Pages/Workers support.

## Prerequisites

- Node.js 20+
- pnpm
- Cloudflare account (untuk production deployment)
- Turso database dengan DATABASE_URL dan DATABASE_AUTH_TOKEN

## Build Configuration

### Current Setup

- **Adapter**: `@sveltejs/adapter-cloudflare` (SSR-first)
- **SSR**: Enabled globally (`ssr: true`)
- **Prerender**: Auto (hanya untuk static files seperti robots.txt, sitemap.xml)
- **Database**: Turso (LibSQL) dengan HTTP mode untuk Cloudflare Workers

## Environment Variables

### Required Variables

```
DATABASE_URL=<turso-database-url>
DATABASE_AUTH_TOKEN=<turso-auth-token>
SESSION_SECRET=<random-secret-key>
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_ID=<your-merchant-id>
MIDTRANS_CLIENT_KEY=<your-client-key>
MIDTRANS_SERVER_KEY=<your-server-key>
APP_URL=<https://your-domain>
```

### Local Development

Copy `.env.example` ke `.env` dan isi variables:

```bash
cp .env.example .env
# Edit .env dengan credentials
```

### Cloudflare Pages

Set environment variables di Cloudflare Dashboard:

1. Go to Pages project
2. Settings > Environment Variables
3. Add variables for Production, Preview, and Development

## Development

### Local Development

```bash
pnpm install
pnpm run dev
```

### Build Project

```bash
pnpm run build
```

Build output ada di `build/` directory.

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

#### Manual Deployment

```bash
# Build project
pnpm run build

# Deploy via Wrangler CLI
pnpm run deploy:cf

# Or use Cloudflare Dashboard
# Drag & drop build/ folder to Cloudflare Pages
```

#### Git-based Deployment (Automatic)

1. Connect GitHub repository ke Cloudflare Pages
2. Set build command: `pnpm run build`
3. Set output directory: `build`
4. Add environment variables di dashboard
5. Deploy automatic dari main branch

### Midtrans Setup (Sandbox/Production)

1. Isi environment variables Midtrans seperti di atas.
2. Di Midtrans Dashboard, set Notification URL ke:
   - `${APP_URL}/api/payments/midtrans/webhook`
3. Allowed origins/front-end gunakan domain aplikasi Anda: `${APP_URL}`.
4. Untuk Sandbox, gunakan Snap JS dari `https://app.sandbox.midtrans.com/snap/snap.js`.
5. Pastikan `APP_URL` benar agar redirect dan webhook valid.

### Option 2: Selfhosted (Node.js)

Jika ingin deploy ke VPS/Railway/Render dengan Node.js:

#### Install Node Adapter

```bash
pnpm add -D @sveltejs/adapter-node
```

#### Update svelte.config.js

```javascript
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter()
	}
};
```

#### Run Production Server

```bash
cd build
node index.js
```

### Option 3: Hybrid (Static + SSR)

Untuk optimal SEO, bisa prerender homepage:

Update `src/routes/+page.ts`:

```typescript
export const prerender = true;
export const ssr = true;
```

Homepage akan static, tapi dashboard/auth tetap SSR.

## Database Setup

### Turso Database

1. Create database di [Turso](https://turso.tech)
2. Copy connection URL dan auth token
3. Set di environment variables
4. Push schema:

```bash
pnpm run db:push
```

## Testing

### Test Local SSR

```bash
pnpm run build
pnpm run preview
# Visit http://localhost:4173
```

### Test Cloudflare Local

```bash
pnpm run dev:cf
# Visit http://localhost:8788
```

## Troubleshooting

### Issue: Build still generates static HTML

**Solution**: Pastikan `prerender = false` di routes yang perlu SSR, dan cek `ssr = true` di layout.

### Issue: Database connection fails di Cloudflare

**Solution**: Pastikan DATABASE_URL menggunakan HTTPS (remote URL), bukan file:// (local).

### Issue: Session tidak persisten

**Solution**: Pastikan SESSION_SECRET di-set di Cloudflare environment variables.

## File Structure

```
build/           # Build output untuk Cloudflare Pages
wrangler.toml    # Cloudflare configuration
.env             # Local environment variables (gitignored)
```

## Migration from Static (GitHub Pages)

Aplikasi sebelumnya menggunakan static adapter untuk GitHub Pages:

- ✅ Changed: `adapter-static` → `adapter-cloudflare`
- ✅ Changed: `ssr: false` → `ssr: true`
- ✅ Added: Browser checks untuk client-side code
- ✅ Added: Turso HTTP mode untuk Cloudflare Workers
- ✅ Updated: Deploy scripts

Semua features yang sebelumnya static (auth, dashboard) sekarang bisa berjalan dengan SSR.

## Next Steps

1. ✅ Install Cloudflare adapter
2. ✅ Enable SSR
3. ✅ Fix client-side code
4. ⏳ Set production environment variables
5. ⏳ Deploy to Cloudflare Pages
6. ⏳ Test production deployment
