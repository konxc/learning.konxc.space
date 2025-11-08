# Midtrans Webhook Integration

Dokumen ini menjelaskan cara kerja webhook Midtrans di aplikasi Naik Kelas serta langkah konfigurasi dan pengujian.

## Ringkasan
- Endpoint webhook: `POST /api/payments/midtrans/webhook`
- Autentikasi: verifikasi `signature_key` (SHA512)
- Efek: update `enrollment.status` berdasarkan `transaction_status`
  - `settlement`/`capture` → `active` (+ set `activatedAt`)
  - `deny`/`cancel`/`expire` → `cancelled`
  - `pending` → `pending`

## Environment Variables
Wajib diisi (Sandbox/Production):

```
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_ID=<your-merchant-id>
MIDTRANS_CLIENT_KEY=<your-client-key>
MIDTRANS_SERVER_KEY=<your-server-key>
APP_URL=<https://your-domain>
```

## Konfigurasi di Dashboard Midtrans
1. Masuk ke Midtrans Dashboard (Sandbox/Production).
2. Buka: Settings → Configuration → Notification URL.
3. Set URL: `${APP_URL}/api/payments/midtrans/webhook`.
4. Simpan. Optional: kirim “Send test notification” untuk uji.

## Alur Teknis
1. Server membuat transaksi Snap dengan `order_id` = `enrollmentId`.
2. Pengguna menyelesaikan pembayaran di Snap.
3. Midtrans mengirim webhook ke endpoint kita.
4. Server memverifikasi `signature_key` dan mengubah status `enrollment`.

## Verifikasi Signature
Midtrans mengirim field berikut: `order_id`, `status_code`, `gross_amount`, `signature_key`.

- Rumus signature:

```
sha512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)
```

- Implementasi berada di `src/lib/server/payments/midtrans.ts` → `verifyMidtransSignature()`.

## Payload Contoh (settlement)
```json
{
  "order_id": "ENR-uuid-123",
  "transaction_status": "settlement",
  "status_code": "200",
  "gross_amount": "150000",
  "signature_key": "<hex-sha512>"
}
```

## Mapping Status → Enrollment
- `settlement`/`capture` → `active` dan `activatedAt` diset ke waktu saat ini.
- `pending` → tetap `pending` (menunggu pembayaran).
- `deny`/`cancel`/`expire` → `cancelled`.

Implementasi mapping ada di:
- `src/routes/api/payments/midtrans/webhook/+server.ts`

## Uji Manual dengan curl
Ganti nilai sesuai data Anda (`ENROLLMENT_ID`, jumlah, dan server key Sandbox/Prod).

```bash
ORDER_ID="<ENROLLMENT_ID>"
STATUS_CODE="200"
GROSS_AMOUNT="150000"
SERVER_KEY="<MIDTRANS_SERVER_KEY>"
SIG=$(printf "%s%s%s%s" "$ORDER_ID" "$STATUS_CODE" "$GROSS_AMOUNT" "$SERVER_KEY" | openssl dgst -sha512 -hex | awk '{print $2}')

curl -X POST "$APP_URL/api/payments/midtrans/webhook" \
  -H 'Content-Type: application/json' \
  -d '{
    "order_id":"'"$ORDER_ID"'",
    "transaction_status":"settlement",
    "status_code":"'"$STATUS_CODE"'",
    "gross_amount":"'"$GROSS_AMOUNT"'",
    "signature_key":"'"$SIG"'"
  }'
```

Ulangi dengan `transaction_status` = `expire` untuk memverifikasi pembatalan.

## Keamanan & Keandalan
- Signature wajib valid; request tanpa signature yang cocok ditolak (HTTP 401).
- Idempotensi: update dilakukan berdasarkan `order_id` (=`enrollmentId`), aman untuk notifikasi berulang.
- Jangan log `SERVER_KEY` ke output/log.

## Terkait
- Pembuatan transaksi: `POST /api/payments/midtrans/transaction`
- Util Midtrans: `src/lib/server/payments/midtrans.ts`
- Deploy/env: `DEPLOYMENT.md`
