# QA Testing Guide — Naik Kelas 2.0

> Dokumen pengujian menyeluruh untuk semua halaman, semua role, dan semua fungsionalitas platform.
> URL Dev: `http://localhost:5173` | Midtrans: Sandbox mode

---

## Persiapan: Akun Test yang Dibutuhkan

Buat akun berikut sebelum mulai testing. Gunakan `pnpm run db:seed` jika tersedia, atau buat manual via `/auth/signup`.

| Akun        | Username      | Password    | Role          | Catatan                      |
| ----------- | ------------- | ----------- | ------------- | ---------------------------- |
| Admin       | `admin-test`  | `Test1234!` | `admin`       | Set via DB langsung          |
| Mentor      | `mentor-test` | `Test1234!` | `mentor`      | Set via DB atau apply-mentor |
| Facilitator | `fasil-test`  | `Test1234!` | `facilitator` | Set via org invite           |
| Student     | `sandikodev`  | `Test1234!` | `user`        | Akun utama testing           |
| BD          | `bd-test`     | `Test1234!` | `bd`          | Set via DB                   |

**Set role via SQLite:**

```bash
pnpm run db:studio
# Atau langsung:
sqlite3 local.db "UPDATE user SET role='admin' WHERE username='admin-test';"
```

---

## BAGIAN 1 — PUBLIC PAGES (Tanpa Login)

### 1.1 Landing Page `/`

- [ ] Halaman terbuka tanpa error
- [ ] Semua section tampil (hero, features, testimonials)
- [ ] CTA "Gabung Waiting List" mengarah ke `/waiting-list`
- [ ] Dark/light mode toggle berfungsi
- [ ] Responsive di mobile (375px)

### 1.2 Marketplace `/marketplace`

- [ ] Daftar course published tampil
- [ ] Klik course → masuk ke detail `/marketplace/[id]`
- [ ] Tombol "Enroll" redirect ke `/auth/signin` jika belum login
- [ ] Harga tampil dalam format Rupiah

### 1.3 Marketplace Detail `/marketplace/[id]`

- [ ] Judul, deskripsi, harga, mentor tampil
- [ ] Kurikulum (modules & lessons) tampil
- [ ] Jumlah enrollment aktif tampil
- [ ] Checkout redirect ke login jika belum login

### 1.4 Waiting List `/waiting-list`

- [ ] Form submit berhasil
- [ ] Validasi field wajib (nama, email)
- [ ] Pesan sukses muncul setelah submit
- [ ] Email duplikat ditolak

### 1.5 Tentang `/tentang`

- [ ] Halaman terbuka tanpa error
- [ ] Semua section tampil

### 1.6 Verifikasi Sertifikat `/verify-certificate`

- [ ] Form input serial number tampil
- [ ] Serial valid → tampil info sertifikat
- [ ] Serial tidak valid → pesan error

### 1.7 Jobs Public `/jobs` (jika ada)

- [ ] Daftar job posting tampil
- [ ] Filter berfungsi

---

## BAGIAN 2 — AUTENTIKASI

### 2.1 Register `/auth/signup`

- [ ] Form tampil dengan field: username, email, password
- [ ] Submit dengan data valid → redirect ke `/onboarding` atau `/app`
- [ ] Username duplikat → error message
- [ ] Email duplikat → error message
- [ ] Password terlalu pendek → error message
- [ ] Field kosong → validasi client-side

### 2.2 Login `/auth/signin`

- [ ] Login dengan username + password valid → redirect ke `/app/overview`
- [ ] Password salah → error message
- [ ] Username tidak ada → error message
- [ ] Redirect param bekerja: `/auth/signin?redirect=/app/explore` → setelah login masuk ke `/app/explore`

### 2.3 Logout

- [ ] Klik logout → session dihapus → redirect ke `/auth/signin`
- [ ] Setelah logout, akses `/app/overview` → redirect ke login

### 2.4 Onboarding `/onboarding`

- [ ] User baru (role `user`) → tampil form preferensi
- [ ] Submit preferensi → redirect ke `/app`
- [ ] User yang sudah onboarding → skip ke `/app`
- [ ] Mentor baru → tampil info mentor
- [ ] Facilitator baru → tampil pilihan organisasi

---

## BAGIAN 3 — STUDENT (role: `user`)

Login sebagai `sandikodev`.

### 3.1 Overview `/app/overview`

- [ ] Dashboard learner tampil
- [ ] Stats: jumlah course, progress, certificates, pending payments
- [ ] Daftar course yang sedang diikuti tampil dengan progress bar
- [ ] "Lanjutkan Belajar" button ada dan mengarah ke lesson terakhir
- [ ] Grafik aktivitas tampil (atau "No Activity Data" jika kosong)

### 3.2 Explore `/app/explore`

- [ ] Daftar course published tampil
- [ ] Search/filter berfungsi
- [ ] Klik course → masuk ke detail

### 3.3 Course Detail `/app/explore/[id]`

- [ ] Info course tampil (judul, deskripsi, harga, mentor)
- [ ] Kurikulum tampil
- [ ] Jika belum enroll: tombol "Enroll" tampil
- [ ] Jika sudah enroll: tombol "Lanjutkan Belajar" tampil
- [ ] Reviews tampil (jika ada)
- [ ] Rating rata-rata tampil

### 3.4 Enroll Course

**Course Gratis:**

- [ ] Klik Enroll → enrollment langsung aktif → redirect ke `/app/learning/courses`
- [ ] Notifikasi "Enrollment Successful" muncul

**Course Berbayar:**

- [ ] Klik Enroll → redirect ke `/app/payments?courseId=[id]`
- [ ] Enrollment status `pending`

### 3.5 Payments `/app/payments`

- [ ] Daftar course pending payment tampil
- [ ] Upload bukti transfer: pilih file → preview tampil → submit
- [ ] File > 5MB → error
- [ ] File bukan gambar → error
- [ ] Setelah upload → status "Reviewing" tampil
- [ ] Tombol "Pay via GoPay/QRIS" → Midtrans Snap popup muncul

### 3.6 Payment History `/app/payments/history`

- [ ] Riwayat transaksi Midtrans tampil
- [ ] Riwayat payment proof tampil
- [ ] Status masing-masing tampil dengan benar

### 3.7 Learning Page `/app/learning`

- [ ] Tab "My Courses" tampil daftar enrollment aktif
- [ ] Tab "Performance" tampil stats dan submission history
- [ ] Tab "Mission Board" tampil checkpoints (jika ada cohort)
- [ ] Tab "Credentials" tampil sertifikat

### 3.8 Learn Page `/app/explore/[courseId]/learn`

- [ ] Sidebar modules & lessons tampil
- [ ] Klik lesson → konten tampil di area utama
- [ ] Video: play/pause berfungsi
- [ ] Video: progress tersimpan (refresh → posisi kembali)
- [ ] Video: selesai → lesson ditandai complete (✓)
- [ ] Text material: tombol "Tandai Selesai" berfungsi
- [ ] Link material: tombol "Saya Sudah Membaca" berfungsi
- [ ] Notes tab: ketik → auto-save dalam 1 detik
- [ ] Discussion tab: tampil diskusi lesson
- [ ] Progress bar di header terupdate
- [ ] Navigasi Next/Prev material berfungsi
- [ ] Jika ada quiz: tombol "Operational Quiz" tampil

### 3.9 Quiz `/app/explore/[courseId]/learn/quiz/[quizId]`

- [ ] Pertanyaan tampil
- [ ] MCQ: pilih satu jawaban
- [ ] Multi-select: pilih beberapa jawaban
- [ ] Submit → skor tampil
- [ ] Lulus (≥ passing score) → lesson ditandai complete
- [ ] Gagal → opsi retake tampil

### 3.10 Course Completion

- [ ] Semua lesson selesai → progress 100%
- [ ] Tombol "Claim Verified Seal" aktif
- [ ] Klik → certificate di-generate → redirect ke halaman certificate
- [ ] Enrollment status berubah ke `completed`

### 3.11 Certificates `/app/learning/certificates`

- [ ] Daftar sertifikat tampil
- [ ] Klik sertifikat → halaman detail `/app/learning/certificates/[id]`
- [ ] Serial number tampil
- [ ] Link verifikasi publik berfungsi

### 3.12 Learning Progress `/app/learning/progress`

- [ ] Stats: total courses, active, completed, lessons done
- [ ] XP dan level tampil
- [ ] Progress bar XP ke level berikutnya
- [ ] Daftar course dengan progress % tampil
- [ ] Tombol "Continue" mengarah ke learn page

### 3.13 Tracker `/app/tracker`

- [ ] Tier saat ini tampil (Starter/Learner/Achiever/Champion/Legend)
- [ ] Total poin tampil
- [ ] Progress bar ke tier berikutnya
- [ ] Stats: streak, weekly points, lessons, certificates
- [ ] Aktivitas terbaru tampil (atau empty state)
- [ ] Benefit tier tampil sesuai tier aktif
- [ ] "Cara Mendapatkan Poin" tampil dengan angka yang benar

### 3.14 Leaderboard `/app/leaderboard`

- [ ] Top 50 users tampil dengan rank
- [ ] User sendiri di-highlight
- [ ] Rank user tampil di bawah jika tidak masuk top 50
- [ ] Badge tampil di setiap row

### 3.15 Achievements `/app/achievements`

- [ ] Semua badge tampil (earned dan belum)
- [ ] Badge yang sudah earned di-highlight
- [ ] XP dan level tampil
- [ ] Career trajectory (track progress) tampil

### 3.16 Discussion Forum `/app/discussion`

- [ ] Daftar thread tampil
- [ ] Filter per course berfungsi
- [ ] Search thread berfungsi
- [ ] Klik "Start Discussion" → modal form tampil
- [ ] Submit diskusi baru → tampil di list

### 3.17 Discussion Detail `/app/discussion/[id]`

- [ ] Konten diskusi tampil
- [ ] Replies tampil
- [ ] Form reply berfungsi
- [ ] Upvote berfungsi

### 3.18 Notifications `/app/notifications`

- [ ] Daftar notifikasi tampil
- [ ] Unread ditandai biru
- [ ] Klik notifikasi → mark as read
- [ ] "Tandai Semua Dibaca" berfungsi
- [ ] Hapus notifikasi berfungsi
- [ ] Pagination berfungsi
- [ ] Bell icon di header menampilkan badge count yang akurat
- [ ] **Real-time**: buka tab lain → trigger notifikasi → badge count terupdate tanpa refresh

### 3.19 Affiliate `/app/affiliate`

- [ ] Stats tampil (total sales, komisi, links, transaksi)
- [ ] Grafik tren 30 hari tampil
- [ ] Tab "Links": daftar affiliate links tampil
- [ ] Tambah link baru → form submit → link muncul di list
- [ ] Copy link berfungsi
- [ ] Tab "Sales": daftar penjualan tampil
- [ ] Catat penjualan baru → form submit → muncul di list
- [ ] Tab "Payout": saldo pending tampil
- [ ] Request payout (jika saldo ≥ Rp 100.000) → notifikasi konfirmasi

### 3.20 Organizations `/app/organizations`

- [ ] Daftar organisasi yang diikuti tampil
- [ ] Tombol "Buat Organisasi Baru" tampil
- [ ] Klik org → masuk ke halaman org

### 3.21 Buat Organisasi `/app/organizations/new`

- [ ] Form tampil
- [ ] Submit → org dibuat → redirect ke org detail
- [ ] Validasi: nama wajib, slug unik

### 3.22 Settings `/app/settings`

- [ ] Tab Profile: edit nama, bio, avatar
- [ ] Tab Account: ganti username, email
- [ ] Tab Security: ganti password
- [ ] Tab Preferences: toggle notifikasi, focus mode
- [ ] Tab Verification: form KTP
- [ ] Semua save action berfungsi

### 3.23 Apply Mentor `/app/apply-mentor`

- [ ] Form tampil jika belum pernah apply
- [ ] Submit → redirect ke `/app/my-mentor-application`
- [ ] Jika sudah apply → tampil status aplikasi
- [ ] Jika sudah mentor → redirect ke `/app`

### 3.24 Jobs `/app/jobs`

- [ ] Daftar job posting tampil
- [ ] Filter berfungsi
- [ ] Klik job → detail `/app/jobs/[id]`

### 3.25 Job Detail `/app/jobs/[id]`

- [ ] Info job tampil
- [ ] Form apply tampil
- [ ] Submit application → sukses

### 3.26 Verification `/app/verification`

- [ ] Form KTP tampil
- [ ] Submit → status pending
- [ ] Jika sudah verified → tampil status

---

## BAGIAN 4 — MENTOR (role: `mentor`)

Login sebagai `mentor-test`.

### 4.1 Overview `/app/overview`

- [ ] Dashboard mentor tampil
- [ ] Stats: approval rate, active learners, pending submissions, avg score
- [ ] Track distribution tampil
- [ ] Grafik aktivitas tampil dari data nyata

### 4.2 My Courses `/app/mentor/courses`

- [ ] Daftar course yang di-assign tampil
- [ ] Student count per course tampil
- [ ] Pending submissions badge tampil (merah jika ada)
- [ ] Filter: all/published/draft berfungsi
- [ ] Tombol "Manage Materials" → `/app/mentor/courses/[id]/materials`
- [ ] Tombol "Review Submissions" → `/app/mentor/courses/[id]/submissions`

### 4.3 Materials `/app/mentor/courses/[id]/materials`

- [ ] Daftar modules & lessons tampil
- [ ] Tambah module → form submit → muncul di list
- [ ] Edit module → form submit → nama terupdate
- [ ] Hapus module → konfirmasi → hilang dari list
- [ ] Tambah lesson → form submit → muncul di module
- [ ] Hapus lesson → konfirmasi → hilang

### 4.4 Submissions `/app/mentor/courses/[id]/submissions`

- [ ] Daftar submission tampil
- [ ] Filter: type (quiz/assignment), status (pending/graded)
- [ ] Klik submission → form grade tampil
- [ ] Input score 0-100 → submit → grade tersimpan
- [ ] Feedback opsional → tersimpan
- [ ] Notifikasi terkirim ke student setelah grade

### 4.5 Students `/app/mentor/students`

- [ ] Daftar semua student tampil
- [ ] Filter: course, cohort, track berfungsi
- [ ] Klik "Monitor" → detail student

### 4.6 Student Detail `/app/mentor/students/[userId]`

- [ ] Info student tampil
- [ ] Progress per course tampil (% completion)
- [ ] Lesson-by-lesson progress tampil
- [ ] Submission history tampil dengan grade
- [ ] Form grade submission berfungsi

### 4.7 Broadcast `/app/mentor/broadcast`

- [ ] Form kirim pesan tampil
- [ ] Target: all/cohort/course
- [ ] Channel: notification/email/whatsapp
- [ ] Submit → pesan terkirim → recipient count tampil
- [ ] Riwayat broadcast tampil

---

## BAGIAN 5 — FACILITATOR (role: `facilitator`)

Login sebagai `fasil-test`. Pastikan sudah di-assign ke minimal 1 cohort.

### 5.1 Overview `/app/overview`

- [ ] Dashboard facilitator tampil
- [ ] Stats: active cohorts, total students

### 5.2 My Batches `/app/facilitator/cohorts`

- [ ] Daftar cohort yang di-assign tampil
- [ ] Student count per cohort tampil
- [ ] Status cohort tampil (active/archived)
- [ ] Klik cohort → detail cohort

---

## BAGIAN 6 — ADMIN (role: `admin`)

Login sebagai `admin-test`.

### 6.1 Overview `/app/overview`

- [ ] Dashboard admin tampil
- [ ] Stats: total users, active enrollments, pending applications, published courses
- [ ] Track distribution tampil
- [ ] Grafik engagement tampil
- [ ] Tabel pending mentor applications tampil

### 6.2 Course Builder `/app/admin/courses`

- [ ] Daftar semua course tampil
- [ ] Filter: status, search berfungsi
- [ ] Tombol "Buat Course Baru" → form create

### 6.3 Create Course `/app/admin/courses/create`

- [ ] Form tampil
- [ ] Submit → course dibuat dengan status draft
- [ ] Validasi field wajib

### 6.4 Edit Course `/app/admin/courses/edit/[id]`

- [ ] Tab "General Info": edit judul, deskripsi, harga, status, mentor
- [ ] Save → perubahan tersimpan
- [ ] Tab "Curriculum": daftar modules & lessons
- [ ] Tambah/edit/hapus module berfungsi
- [ ] Tambah/hapus lesson berfungsi

### 6.5 Cohorts `/app/admin/cohorts`

- [ ] Daftar cohort tampil dengan stats
- [ ] Buat cohort baru → form submit → muncul di list
- [ ] Update status cohort (aktifkan/selesaikan) berfungsi
- [ ] Klik "Detail" → halaman cohort detail

### 6.6 Cohort Detail `/app/admin/cohorts/[id]`

- [ ] Info cohort tampil (course, periode, status)
- [ ] Assign facilitator → dropdown → save berfungsi
- [ ] Stats: total/active/pending/completed students
- [ ] Track distribution tampil
- [ ] Daftar students tampil
- [ ] Tombol "View" → student detail
- [ ] Tombol "Remove" → konfirmasi → student dihapus dari cohort

### 6.7 Users & Roles `/app/admin/users`

- [ ] Daftar semua user tampil
- [ ] Search berfungsi
- [ ] Filter by role berfungsi
- [ ] Klik "Edit" → modal edit nama/email/phone → save
- [ ] Klik "Change Role" → modal pilih role → save → role terupdate

### 6.8 Coupons `/app/admin/coupons`

- [ ] Daftar coupon tampil
- [ ] Buat coupon baru → form submit → muncul di list
- [ ] Edit coupon berfungsi
- [ ] Klik "Analytics" → halaman analytics coupon

### 6.9 Coupon Analytics `/app/admin/coupons/[id]/analytics`

- [ ] Stats: total penggunaan, total diskon, total revenue
- [ ] Tabel riwayat penggunaan tampil

### 6.10 Mentor Applications `/app/admin/mentor-applications`

- [ ] Daftar aplikasi tampil
- [ ] Filter: pending/approved/rejected berfungsi
- [ ] Klik "Review" → halaman review

### 6.11 Review Mentor Application `/app/admin/mentor-applications/review/[id]`

- [ ] Detail aplikasi tampil (bio, expertise, links)
- [ ] Form catatan admin (opsional)
- [ ] Tombol "Setujui" → role user berubah ke mentor → notifikasi terkirim
- [ ] Tombol "Tolak" → status rejected → notifikasi terkirim
- [ ] Redirect ke list setelah action

### 6.12 Payments `/app/admin/payments`

- [ ] Daftar payment proof tampil
- [ ] Filter: pending/approved/rejected berfungsi
- [ ] Klik "Approve" → enrollment aktif → notifikasi ke student
- [ ] Klik "Reject" → status rejected → notifikasi ke student

### 6.13 Payment Detail `/app/admin/payments/view/[id]`

- [ ] Detail proof tampil (user, course, status)
- [ ] Approve/reject berfungsi dengan notifikasi

### 6.14 Payouts `/app/admin/payouts`

- [ ] Stats: total pending, sudah dibayar, total akun
- [ ] Daftar affiliate dengan pending payout tampil
- [ ] Info bank tampil
- [ ] Tombol "Approve" → payout diproses → notifikasi ke affiliate
- [ ] Riwayat payout tampil

### 6.15 Partners `/app/admin/partner`

- [ ] Daftar partner tampil dengan stats
- [ ] Tambah partner baru → form submit → muncul di list
- [ ] Aktifkan/nonaktifkan partner berfungsi

### 6.16 Reports `/app/admin/reports`

- [ ] Stats: total students, active, completed, courses
- [ ] Track distribution tampil
- [ ] Export CSV: pilih filter → download file
- [ ] Generate summary: pilih periode → hasil tampil

### 6.17 Reviews `/app/admin/reviews`

- [ ] Daftar review tampil
- [ ] Approve/reject review berfungsi
- [ ] Form respons mentor berfungsi

### 6.18 Broadcast `/app/mentor/broadcast`

- [ ] (Sama dengan mentor, tapi admin bisa target semua)
- [ ] Target "All Users" tersedia untuk admin

### 6.19 Plugins `/app/admin/plugins`

- [ ] Daftar plugin tampil per kategori
- [ ] Stats: total, active, categories
- [ ] Toggle enable/disable plugin berfungsi

### 6.20 Email & WA Logs `/app/admin/email-logs`

- [ ] Tab Email: daftar log tampil
- [ ] Tab WhatsApp: daftar log tampil
- [ ] Filter by status berfungsi
- [ ] Search berfungsi

### 6.21 Verification Admin `/app/admin/verification`

- [ ] Daftar KTP pending tampil
- [ ] Daftar org verification pending tampil
- [ ] Approve/reject berfungsi

### 6.22 Waiting List CRM `/app/crm/waiting-list`

- [ ] Daftar waiting list tampil
- [ ] Filter/search berfungsi
- [ ] Update status berfungsi
- [ ] Export berfungsi

---

## BAGIAN 7 — ORGANISASI

Login sebagai user yang jadi owner org.

### 7.1 Org Overview `/app/organizations/[id]`

- [ ] Info org tampil (nama, plan, member count, course count)
- [ ] Recent members tampil

### 7.2 Members `/app/organizations/[id]/members`

- [ ] Daftar member tampil dengan role
- [ ] Tombol "Remove" (untuk non-owner) berfungsi
- [ ] Tombol "Leave Organization" tampil untuk non-owner

### 7.3 Invite `/app/organizations/[id]/invite`

- [ ] Form invite: email + role
- [ ] Submit → invitation dibuat → token tampil
- [ ] Copy invite link berfungsi
- [ ] Daftar pending invitations tampil
- [ ] Cancel invitation berfungsi

### 7.4 Invitation Acceptance `/org/invite/[token]`

- [ ] Halaman tampil dengan info org dan role
- [ ] Login to Accept → redirect ke `/auth/signin?redirect=/org/invite/[token]`
- [ ] Setelah login → user ditambahkan ke org → redirect ke `/app`
- [ ] Token expired → error message
- [ ] Token tidak valid → 404

### 7.5 Analytics `/app/organizations/[id]/analytics`

- [ ] Stats: revenue, enrollment, active, completed, courses, members
- [ ] Tabel per-course stats tampil

### 7.6 Billing `/app/organizations/[id]/billing`

- [ ] Plan saat ini tampil
- [ ] Tombol upgrade ke Pro/Enterprise → Midtrans Snap popup
- [ ] Downgrade ke free berfungsi

### 7.7 Verification Org `/app/organizations/[id]/verification`

- [ ] Form legal entity tampil
- [ ] Submit → status pending
- [ ] Jika sudah verified → tampil badge

---

## BAGIAN 8 — BD (role: `bd`)

Login sebagai `bd-test`.

### 8.1 Overview `/app/overview`

- [ ] Dashboard tampil (minimal)

### 8.2 Waiting List `/app/crm/waiting-list`

- [ ] Daftar waiting list tampil
- [ ] Update status berfungsi
- [ ] Export berfungsi

---

## BAGIAN 9 — CROSS-CUTTING TESTS

### 9.1 Real-time Notifications (SSE)

- [ ] Login sebagai student
- [ ] Di tab lain, login sebagai admin dan approve payment proof student tersebut
- [ ] Kembali ke tab student → badge notifikasi terupdate dalam < 10 detik tanpa refresh
- [ ] Notifikasi "Pembayaran Dikonfirmasi" muncul di dropdown

### 9.2 Gamification Integration

- [ ] Selesaikan 1 lesson → cek `/app/tracker` → poin +10 muncul di aktivitas terbaru
- [ ] Submit checkpoint → poin +25 muncul
- [ ] Login hari berturut-turut → streak terupdate
- [ ] Unlock badge "First Lesson" → notifikasi badge muncul
- [ ] Cek `/app/achievements` → badge tampil sebagai earned

### 9.3 Role Switching (Admin)

- [ ] Login sebagai admin
- [ ] Klik role switcher di sidebar → pilih "user"
- [ ] Dashboard berubah ke tampilan learner
- [ ] Nav items berubah ke nav user
- [ ] Switch kembali ke "admin" → kembali normal

### 9.4 Workspace Switching

- [ ] Login sebagai user yang punya org
- [ ] Klik workspace switcher → pilih org
- [ ] Nav berubah ke org-specific nav
- [ ] Overview berubah ke org context
- [ ] Switch kembali ke "Personal" → kembali normal

### 9.5 Dark Mode

- [ ] Toggle dark mode di header
- [ ] Semua halaman tampil dengan benar di dark mode
- [ ] Preference tersimpan (refresh → tetap dark)

### 9.6 Mobile Responsiveness

- [ ] Buka di viewport 375px
- [ ] Sidebar collapse ke icon-only
- [ ] Semua form masih bisa diisi
- [ ] Tabel scroll horizontal

### 9.7 RBAC Guard

- [ ] Login sebagai `user` → akses `/app/admin/users` → redirect ke overview
- [ ] Login sebagai `mentor` → akses `/app/admin/cohorts` → redirect ke overview
- [ ] Akses `/app/overview` tanpa login → redirect ke `/auth/signin`

---

## BAGIAN 10 — PAYMENT FLOW END-TO-END

### 10.1 Manual Transfer Flow

1. Login sebagai `sandikodev`
2. Explore → pilih course berbayar → Enroll
3. Di `/app/payments`, upload foto bukti transfer (JPEG, < 5MB)
4. Verifikasi status "Reviewing" tampil
5. Login sebagai `admin-test`
6. Buka `/app/admin/payments` → temukan proof → klik Approve
7. Kembali ke `sandikodev` → notifikasi "Pembayaran Dikonfirmasi" muncul
8. Buka `/app/learning` → course sudah aktif

### 10.2 Midtrans Online Payment Flow

1. Login sebagai `sandikodev`
2. Explore → pilih course berbayar → Enroll
3. Di `/app/payments`, klik "Pay via GoPay/QRIS"
4. Midtrans Snap popup muncul
5. Pilih metode pembayaran sandbox → complete
6. Redirect ke `/app/learning/courses?payment=success`
7. Course aktif

### 10.3 Coupon Flow

1. Login sebagai admin → buat coupon (misal: `DISKON50`, 50% off)
2. Login sebagai student → Explore → Enroll course berbayar
3. Di form enroll, masukkan kode `DISKON50`
4. Harga berubah sesuai diskon
5. Lanjutkan pembayaran

---

## BAGIAN 11 — MENTOR APPLICATION FLOW

1. Login sebagai `sandikodev` (role: user)
2. Buka `/app/apply-mentor`
3. Isi semua field → Submit
4. Redirect ke `/app/my-mentor-application` → status "Under Review"
5. Login sebagai `admin-test`
6. Buka `/app/admin/mentor-applications` → temukan aplikasi sandikodev
7. Klik "Review" → baca detail → klik "Setujui"
8. Kembali ke `sandikodev` → notifikasi "Aplikasi Disetujui" muncul
9. Logout → login ulang → role sudah `mentor`
10. Nav berubah ke mentor nav

---

## BAGIAN 12 — FACILITATOR ASSIGNMENT FLOW

1. Login sebagai `admin-test`
2. Buka `/app/admin/cohorts` → pilih cohort aktif
3. Di halaman cohort detail → dropdown "Assign Facilitator" → pilih `fasil-test` → Save
4. Login sebagai `fasil-test`
5. Buka `/app/facilitator/cohorts` → cohort tersebut muncul
6. Klik cohort → lihat daftar students

---

## BAGIAN 13 — CHECKLIST AKHIR

Setelah semua test selesai, verifikasi:

- [ ] `pnpm run check` → 0 errors
- [ ] Tidak ada halaman yang return 500 error
- [ ] Semua notifikasi terkirim dengan benar
- [ ] Gamification points terakumulasi dengan benar
- [ ] Database tidak ada data corrupt

---

## Catatan Bug

Gunakan format berikut untuk mencatat bug:

```
**[BUG-001]** Halaman: /app/xxx
Role: user/mentor/admin
Langkah: 1. ... 2. ... 3. ...
Expected: ...
Actual: ...
Screenshot: (attach)
```
