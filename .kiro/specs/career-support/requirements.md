# Spec: Career Support & Placement

## Overview

Fitur career support untuk menghubungkan lulusan dengan peluang kerja — job board yang terintegrasi dengan portfolio, referral system, dan placement tracking.

## Requirements

### R1 — Enhanced Job Board

- R1.1: Job board di `/app/jobs` sudah ada — enhance dengan filter by track (Technical/Business/Hybrid)
- R1.2: Tampilkan match score berdasarkan skills dari portfolio dan completed courses
- R1.3: "Apply with Portfolio" — sertakan link portfolio saat apply
- R1.4: Org bisa mark job sebagai "Naik Kelas Graduate Preferred"

### R2 — Referral System

- R2.1: Student yang lulus bisa refer teman untuk mendaftar kursus
- R2.2: Referral link unik per user
- R2.3: Track: berapa yang daftar via referral, berapa yang convert ke paid
- R2.4: Reward: poin tracker atau diskon untuk referrer

### R3 — Placement Tracking

- R3.1: Admin bisa record placement data: user, company, role, salary range, date
- R3.2: Dashboard placement stats: total placed, avg time to placement, top companies
- R3.3: Graduate bisa update employment status di profile mereka
- R3.4: Placement rate tampil di landing page sebagai social proof

## Technical Constraints

- Job board sudah ada (`jobPosting`, `jobApplication`) — enhance saja
- Referral: tabel `referral` (id, referrerId, refereeId, code, status, rewardGiven, createdAt)
- Placement: tabel `placement` (id, userId, company, role, salaryMin, salaryMax, placedAt, track)
- Referral link: `/r/[code]` redirect ke register dengan referral tracking

## Acceptance Criteria

- [ ] Job board filter by track berfungsi
- [ ] Apply with portfolio berfungsi
- [ ] Referral link generate dan track berfungsi
- [ ] Admin bisa record dan lihat placement stats
- [ ] pnpm run check 0 errors
