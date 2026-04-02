# Payment Flow Documentation

Dokumen ini menjelaskan alur pembayaran kursus di Naik Kelas, termasuk implementasi saat ini dan rencana pengembangan.

## Daftar Isi

1. [Ringkasan](#ringkasan)
2. [Alur Saat Ini (v1 - Tanpa Webhook)](#alur-saat-ini-v1---tanpa-webhook)
3. [Alur yang Direncanakan (v2 - Dengan Webhook)](#alur-yang-direncanakan-v2---dengan-webhook)
4. [Setup untuk Production](#setup-untuk-production)
5. [Troubleshooting](#troubleshooting)

---

## Ringkasan

| Versi               | Status     | Keterangan                           |
| ------------------- | ---------- | ------------------------------------ |
| v1 (Tanpa Webhook)  | ✅ Active  | Admin manual approve setelah payment |
| v2 (Dengan Webhook) | 🔄 Planned | Auto-activation setelah settlement   |

---

## Alur Saat Ini (v1 - Tanpa Webhook)

### Flow Diagram

```
┌─────────────┐     Enroll      ┌─────────────┐
│   User      │ ─────────────►  │   System    │
│  Browser    │                 │             │
└─────────────┘                 └─────────────┘
                                       │
                                       ▼  enrollment.status = 'pending'
                               ┌─────────────┐
                               │ Enrollment  │
                               │   (pending) │
                               └─────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
   ┌─────────────┐             ┌─────────────┐             ┌─────────────┐
   │   Manual    │             │   Midtrans  │             │   Free      │
   │   Payment  │             │   Payment   │             │   Course    │
   │   Proof    │             │   (Snap)    │             │   (active)  │
   └─────────────┘             └─────────────┘             └─────────────┘
          │                            │                            │
          ▼                            ▼                            │
   ┌─────────────┐             ┌─────────────┐                   │
   │  Admin      │             │  Redirect   │                   │
   │  Review     │             │  to Finish  │                   │
   └─────────────┘             └─────────────┘                   │
          │                            │                            │
          ▼                            ▼                            │
   ┌─────────────────────────────────────────────┐                  │
   │       Admin Approve → Enrollment Active     │                  │
   └─────────────────────────────────────────────┘                  │
                                       │                            │
                                       ▼                            │
                               ┌─────────────┐                      │
                               │   Access    │ ◄─────────────────────┘
                               │   Course!   │
                               └─────────────┘
```

### Steps Detail

1. **User enrolls ke kursus paid**
   - Enrollment created dengan status: `pending`
   - Redirect ke `/app/payments?courseId=XXX`

2. **User memilih payment method:**
   - **Option A: Manual Payment Proof**
     - Upload bukti transfer via `/app/payments`
     - Payment proof status: `pending`
     - Admin review di `/app/admin/payments`
     - Jika approved → enrollment status: `active`

   - **Option B: Midtrans Online Payment**
     - User klik "Pay via Midtrans"
     - Snap popup opened
     - User completes payment
     - Midtrans redirect ke `/app/payments?status=success&orderId=XXX`
     - User melihat pesan: "Payment successful! Please wait for admin approval"

3. **Admin approval** (untuk kedua metode)
   - Admin check payment di `/app/admin/payments`
   - Klik "Approve"
   - Enrollment status: `active`, `activatedAt` diset
   - User dapat akses course

### Kelemahan v1

- ❌ User harus tunggu approval manual
- ❌ Admin harus approve satu-satu
- ❌ Delayed access ke course

---

## Alur yang Direncanakan (v2 - Dengan Webhook)

### Flow Diagram

```
┌─────────────┐     Enroll      ┌─────────────┐
│   User      │ ─────────────►  │   System    │
│  Browser    │                 │             │
└─────────────┘                 └─────────────┘
                                       │
                                       ▼  enrollment.status = 'pending'
                               ┌─────────────┐
                               │ Enrollment  │
                               │   (pending) │
                               └─────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
   ┌─────────────┐             ┌─────────────┐             ┌─────────────┐
   │   Manual    │             │   Midtrans  │             │   Free      │
   │   Payment   │             │   Payment   │             │   Course    │
   │   Proof     │             │   (Snap)    │             │   (active)  │
   └─────────────┘             └─────────────┘             └─────────────┘
          │                            │
          │                            ▼
          │                    ┌─────────────┐
          │                    │   Payment   │
          │                    │  Completed  │
          │                    └─────────────┘
          │                            │
          │                            ▼
          │                    ┌─────────────┐
          │                    │   Midtrans  │
          │                    │   Webhook   │
          │                    │  (callback) │
          │                    └─────────────┘
          │                            │
          │                            ▼
          │                    ┌─────────────────────────────────┐
          │                    │  Webhook Handler:               │
          │                    │  - Verify signature             │
          │                    │  - Update transaction status    │
          │                    │  - Update enrollment → 'active' │
          │                    └─────────────────────────────────┘
          │                            │
          ▼                            ▼
   ┌─────────────────────────────────────────────┐
   │        Enrollment Status: 'active'          │
   │        activatedAt: <timestamp>              │
   └─────────────────────────────────────────────┘
          │
          ▼
   ┌─────────────┐
   │   Access    │
   │   Course!   │
   └─────────────┘
```

### Kelebihan v2

- ✅ Auto-activation setelah payment settlement
- ✅ Tidak perlu admin approve untuk Midtrans
- ✅ User langsung bisa akses kursus setelah bayar
- ✅ Real-time update

---

## Setup untuk Production

### Prerequisites

1. **Domain yang publicly accessible**
   - Contoh: `https://naikkelas.id`

2. **Midtrans Dashboard Access**
   - Account Sandbox/Production

### Steps

#### 1. Register Webhook URL

1. Login ke Midtrans Dashboard:
   - Sandbox: https://dashboard.sandbox.midtrans.com
   - Production: https://dashboard.midtrans.com

2. Buka: **Settings → Configuration → Payment Notification URL**

3. Set URL:

   ```
   https://<your-domain>/api/webhooks/midtrans
   ```

4. Simpan

#### 2. Alternative: Setup Ngrok untuk Development

Untuk testing webhook di local:

```bash
# Install ngrok
brew install ngrok  # macOS
# atau download dari https://ngrok.com/download

# Run ngrok
ngrok http 3000
```

Akan dapat URL seperti:

```
https://abc123.ngrok-free.dev
```

Lalu register URL tersebut di Midtrans Sandbox Dashboard.

#### 3. Konfigurasi Environment Variables

```bash
# .env
MIDTRANS_IS_PRODUCTION=false  # atau true untuk production
MIDTRANS_CLIENT_KEY=<your-client-key>
MIDTRANS_SERVER_KEY=<your-server-key>
APP_URL=https://your-domain.com
```

### Verifikasi Webhook

Test dengan curl:

```bash
curl -X POST "https://<your-domain>/api/webhooks/midtrans" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "NC-TEST123",
    "transaction_status": "settlement",
    "status_code": "200",
    "gross_amount": "150000"
  }'
```

Lihat response dan check enrollment di database.

---

## Troubleshooting

### 404 pada Webhook Endpoint

**Masalah:** Midtrans tidak dapat reach webhook endpoint

**Solusi:**

1. Pastikan URL sudah benar di Dashboard Midtrans
2. Untuk local dev, gunakan ngrok atau tunnel lain
3. Check Traefik/docker routing jika pakai container

### Payment Tidak Redirect ke Halaman yang Benar

**Masalah:** Midtrans redirect ke `example.com`

**Solusi:**
Pastikan callback URLs sudah diset saat create transaction:

```typescript
callbacks: {
  finish: `${baseUrl}/app/payments?status=success&orderId=${orderId}`,
  error: `${baseUrl}/app/payments?status=error`,
  unfinish: `${baseUrl}/app/payments?status=pending`
}
```

### Enrollment Tidak Diaktifkan Setelah Payment

**Masalah:** Payment berhasil tapi enrollment masih pending

**Solusi:**

1. Check webhook endpoint可达性 (accessibility)
2. Check webhook handler logs
3. Untuk v1: Manual approve di admin panel

---

## Referensi

- File terkait:
  - `src/routes/api/webhooks/midtrans/+server.ts` - Webhook handler
  - `src/routes/api/payments/midtrans/webhook/+server.ts` - Alternative webhook
  - `src/lib/server/payments/midtrans.ts` - Midtrans utilities
  - `src/routes/(dashboard)/app/payments/+page.server.ts` - Payment page server
  - `src/lib/components/PaymentProofUpload.svelte` - Payment UI component

- Docs terkait:
  - `docs/MIDTRANS_WEBHOOK.md` - Technical webhook details

---

_Last updated: April 2026_
_Status: v1 Active, v2 Planned_
