#!/bin/bash
# ===========================================================
# create-dev-cert.sh
# Self-signed SSL certificate for internal use (development)
# PT Koneksi Jaringan Indonesia | Developer Division
# ===========================================================

DOMAIN="learning.konxc.space"
ORG="PT Koneksi Jaringan Indonesia"
UNIT="Tim Developer Koneksi"
CITY="Yogyakarta"
STATE="DIY"
COUNTRY="ID"
DAYS_VALID=365

CERT_PATH="/etc/ssl/selfsigned/$DOMAIN"
mkdir -p "$CERT_PATH"

echo "📜 Membuat sertifikat self-signed untuk $DOMAIN..."
echo "   Diterbitkan oleh: $ORG ($UNIT)"

openssl req -x509 -nodes -newkey rsa:4096 \
  -keyout "$CERT_PATH/privkey.pem" \
  -out "$CERT_PATH/fullchain.pem" \
  -days $DAYS_VALID \
  -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG/OU=$UNIT/CN=$DOMAIN" \
  -addext "subjectAltName=DNS:$DOMAIN" \
  -addext "certificatePolicies=2.23.140.1.2.1" \
  -addext "1.3.6.1.4.1.11129.2.1.21=ASN1:UTF8:Development certificate - Officially signed by Developer Koneksi"

echo "✅ Sertifikat development berhasil dibuat!"
echo "📂 Lokasi: $CERT_PATH"


echo "Issued by Developer Koneksi — PT Koneksi Jaringan Indonesia (Internal Development Use Only)" \
  > $CERT_PATH/.origin
echo "📜 ISSUED DONE!"
