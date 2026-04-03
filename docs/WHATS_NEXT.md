# What's Next — Naik Kelas 2.0

> Ringkasan eksekutif: Apa yang sudah, sedang, dan belum dikerjakan.

**Status:** Foundation Complete ✅ | Core Features In Progress 🔄 | Advanced Features Not Started 🔴

---

## TL;DR

**Sudah Selesai (30%):**

- Database migration ke Neon PostgreSQL
- Authentication & RBAC
- Multi-tenant architecture
- Design system & dashboard layout
- Basic course & payment management

**Belum Selesai (70%):**

- Content development (courses, videos)
- AI Integration (USP utama!)
- Marketplace publik
- Collaboration & Portfolio
- Testing & deployment production
- Legal compliance

**Estimasi ke MVP Launch:** 4-6 minggu dengan 2-3 developer full-time.

---

## Prioritas Tertinggi (Harus Selesai untuk MVP)

### 1. Content Development 🔥 KRITIS

**Status:** Belum ada konten sama sekali

**Yang Perlu:**

- [ ] 1 course lengkap (pilih: Technical, Business, atau Hybrid track)
- [ ] Video production (minimal 10-15 video)
- [ ] Exercise/assignment creation
- [ ] Mentor onboarding (minimal 2-3 mentor)

**Blocker:** Tanpa konten, platform tidak bisa launch.

**Action:** Koordinasi dengan content team ASAP.

---

### 2. AI Integration 🔥 KRITIS

**Status:** Spec ada, belum implementasi sama sekali

**Mengapa Kritis:** Ini adalah USP utama platform (AI-First Approach dari DRAFT_BRIEF.md)

**Yang Perlu:**

- [ ] AI Chat Widget di lesson page
- [ ] AI-powered course recommendations
- [ ] Prompt template library

**Estimasi:** 1-2 minggu (1 developer)

**Spec:** `.kiro/specs/ai-integration/`

---

### 3. Marketplace Publik 🔥 KRITIS

**Status:** Belum ada sama sekali

**Mengapa Kritis:** Ini adalah revenue stream utama B2C (Skenario B dari PLATFORM_ARCHITECTURE_BRIEF.md)

**Yang Perlu:**

- [ ] Marketplace landing page (`/marketplace`)
- [ ] Course discovery dengan filter
- [ ] Direct purchase flow tanpa join org
- [ ] Mentor onboarding flow (apply → auto-create org)

**Estimasi:** 2-3 minggu (1-2 developer)

---

### 4. Testing & QA 🔥 KRITIS

**Status:** Belum ada test suite

**Yang Perlu:**

- [ ] E2E test untuk critical paths (register, login, enroll, payment)
- [ ] Security audit basic (SQL injection, XSS, CSRF)
- [ ] Load testing untuk multi-tenant

**Estimasi:** 1-2 minggu (1 developer + QA)

**Spec:** `.kiro/specs/qa-testing-guide/`

---

### 5. Production Deployment 🔥 KRITIS

**Status:** Belum setup production environment

**Yang Perlu:**

- [ ] Production environment setup (Cloudflare Pages atau Node adapter)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] SSL certificate & domain setup
- [ ] Database backup automation
- [ ] Error tracking (Sentry)

**Estimasi:** 1 minggu (1 developer)

---

### 6. Legal Compliance 🔥 KRITIS

**Status:** Belum ada dokumen legal

**Yang Perlu:**

- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy

**Estimasi:** 3-5 hari (legal team atau template)

**Blocker:** Tidak bisa launch publik tanpa ini.

---

## Prioritas Tinggi (Penting untuk Growth)

### 7. Collaboration & Portfolio 🟡 PENTING

**Status:** Spec ada, belum implementasi

**Mengapa Penting:** Project-based learning adalah core value proposition

**Yang Perlu:**

- [ ] Portfolio showcase page
- [ ] Public portfolio (`/portfolio/[username]`)
- [ ] Peer review system
- [ ] Project spaces

**Estimasi:** 2-3 minggu (1-2 developer)

**Spec:** `.kiro/specs/collaboration-portfolio/`

---

### 8. Payment Webhook (v2) 🟡 PENTING

**Status:** Endpoint ada, belum fully tested

**Mengapa Penting:** Auto-activation setelah payment (user experience lebih baik)

**Yang Perlu:**

- [ ] Test webhook dengan Midtrans sandbox
- [ ] Verify signature validation
- [ ] Test auto-activation flow
- [ ] Setup production webhook URL

**Estimasi:** 3-5 hari (1 developer)

**Docs:** `docs/PAYMENT_FLOW.md`

---

### 9. Course Builder Enhancement 🟡 PENTING

**Status:** Basic ada, perlu enhancement

**Yang Perlu:**

- [ ] Course templates untuk quick start
- [ ] Course duplication/cloning
- [ ] Bulk content import
- [ ] Interactive content types (code exercises, case studies)

**Estimasi:** 2 minggu (1 developer)

**Spec:** `.kiro/specs/course-builder-enhancement/`

---

### 10. Student Learning Experience Enhancement 🟡 PENTING

**Status:** Basic ada, perlu enhancement

**Yang Perlu:**

- [ ] Personalized learning dashboard
- [ ] Learning path visualization
- [ ] Bookmark/save lesson
- [ ] Note-taking enhancement
- [ ] Learning streak tracking

**Estimasi:** 2 minggu (1 developer)

**Spec:** `.kiro/specs/student-learning-experience/`

---

## Prioritas Medium (Bisa Ditunda)

### 11. Advanced Analytics 🟢 ENHANCEMENT

**Spec:** `.kiro/specs/advanced-analytics/`

**Estimasi:** 2-3 minggu

---

### 12. Career Support & Placement 🟢 ENHANCEMENT

**Spec:** `.kiro/specs/career-support/`

**Estimasi:** 2 minggu

---

### 13. Notification System 🟢 ENHANCEMENT

**Spec:** `.kiro/specs/notification-system/`

**Estimasi:** 1-2 minggu

---

### 14. Cohort Management 🟢 ENHANCEMENT

**Spec:** `.kiro/specs/cohort-management/`

**Estimasi:** 1-2 minggu

---

### 15. Mentor Grading System 🟢 ENHANCEMENT

**Spec:** `.kiro/specs/mentor-grading-system/`

**Estimasi:** 1-2 minggu

---

## Prioritas Low (Nice to Have)

### 16. Gamification & Tracker 🔵 NICE TO HAVE

**Spec:** `.kiro/specs/gamification-tracker/`

**Estimasi:** 2 minggu

---

### 17. Affiliate Dashboard 🔵 NICE TO HAVE

**Spec:** `.kiro/specs/affiliate-dashboard/`

**Estimasi:** 1 minggu

---

### 18. B2B Enterprise Features 🔵 NICE TO HAVE

- Custom domain per org
- White-label branding
- SSO integration
- Corporate billing

**Estimasi:** 4-6 minggu

---

## Roadmap Rekomendasi

### Sprint 1-2 (Minggu 1-2) — Content & AI

**Focus:** Content development + AI Integration

**Deliverables:**

- [ ] 1 course lengkap dengan 10-15 video
- [ ] AI Chat Widget implemented
- [ ] AI Recommendations implemented
- [ ] Prompt template library

**Team:** 1 content creator + 1 developer

---

### Sprint 3-4 (Minggu 3-4) — Marketplace & Payment

**Focus:** Marketplace publik + Payment enhancement

**Deliverables:**

- [ ] Marketplace landing page
- [ ] Course discovery & filter
- [ ] Direct purchase flow
- [ ] Mentor onboarding flow
- [ ] Payment webhook v2 tested

**Team:** 2 developers

---

### Sprint 5 (Minggu 5) — Testing & Deployment

**Focus:** QA + Production setup

**Deliverables:**

- [ ] E2E test suite
- [ ] Security audit
- [ ] Production environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring setup

**Team:** 1 developer + 1 QA

---

### Sprint 6 (Minggu 6) — Polish & Launch Prep

**Focus:** Bug fixes + Legal + Documentation

**Deliverables:**

- [ ] Bug fixes dari testing
- [ ] Terms of Service & Privacy Policy
- [ ] User documentation
- [ ] Launch checklist completed

**Team:** 2 developers + legal

---

### MVP Launch 🚀 (End of Week 6)

**Target:** Platform live dengan:

- 1 org pilot (Yayasan Klub Fisika)
- 1-3 courses lengkap
- AI integration working
- Marketplace publik ready
- Payment flow tested
- Legal compliance done

---

### Post-MVP (Week 7-12) — Growth Features

**Focus:** Collaboration, Portfolio, Analytics, Career Support

**Deliverables:**

- [ ] Portfolio showcase
- [ ] Peer review system
- [ ] Advanced analytics
- [ ] Career support features
- [ ] Notification system

**Team:** 2-3 developers

---

## Catatan Penting

### Dari DRAFT_BRIEF.md

**Target Launch:** Q1 2025 — **SUDAH TERLEWAT**

**Realistis:** Q2 2026 (April-Juni) untuk MVP Launch

**Alasan Delay:**

- Content development belum dimulai
- AI integration (USP utama) belum ada
- Marketplace publik belum ada
- Testing & deployment belum setup

### Dari PLATFORM_ARCHITECTURE_BRIEF.md

**Arsitektur Role Sudah Benar:**

- `user.role` hanya platform level (admin, bd, user)
- Mentor/facilitator adalah org-level role
- Isolasi data antar tenant sudah di-enforce

**Yang Perlu Divalidasi:**

- [ ] Audit semua query untuk pastikan filter `orgId`
- [ ] Test multi-tenant dengan 2-3 org dummy
- [ ] Verify tidak ada data leakage antar org

### Dari PAYMENT_FLOW.md

**Payment v1 (Manual Approval) — Working**

**Payment v2 (Webhook Auto-activation) — Belum Tested**

**Action:** Test webhook dengan Midtrans sandbox sebelum production.

### Dari NEON_MIGRATION_BRIEF.md

**Database Migration — SELESAI ✅**

**Self-host Plan:**

- Saat ini: Neon managed ($19/bulan Launch plan)
- Jika tagihan >$300/bulan: Consider self-host PostgreSQL di VPS
- Exit strategy: pg_dump → restore ke target baru (no lock-in)

---

## Action Items (Immediate)

### Untuk Product Manager:

1. **Prioritize content development** — Tanpa konten, semua fitur teknis tidak berguna
2. **Decide MVP scope** — Apakah 1 course cukup atau perlu 3-5 courses?
3. **Recruit mentors** — Minimal 2-3 mentor untuk pilot batch
4. **Prepare legal docs** — Terms of Service & Privacy Policy

### Untuk Tech Lead:

1. **Assign AI Integration** — Ini USP utama, harus prioritas
2. **Assign Marketplace Implementation** — Revenue stream utama
3. **Setup testing framework** — E2E test dengan Playwright
4. **Setup production environment** — Cloudflare Pages atau Node adapter

### Untuk Content Team:

1. **Create 1 course lengkap** — Pilih track yang paling siap (Technical/Business/Hybrid)
2. **Produce 10-15 videos** — Quality over quantity
3. **Create exercises/assignments** — Minimal 5 per course
4. **Write course description & syllabus** — For marketplace

### Untuk Marketing:

1. **Prepare launch campaign** — Email, social media, ads
2. **Setup analytics tracking** — Google Analytics, Meta Pixel
3. **Create landing page copy** — Highlight AI-First approach
4. **Prepare social proof** — Testimonials, case studies

---

## Kesimpulan

**Platform foundation sudah solid (30% done).**

**Yang belum:** Content, AI, Marketplace, Testing, Deployment (70% remaining).

**Estimasi realistis ke MVP Launch:** 6 minggu dengan tim 2-3 developer + 1 content creator + 1 QA.

**Blocker terbesar:** Content development — harus dimulai SEKARANG.

**Next step:** Review dokumen ini dengan tim, assign tasks, mulai Sprint 1.

---

_Dokumen ini adalah action plan berdasarkan analisis DRAFT_BRIEF.md, PLATFORM_ARCHITECTURE_BRIEF.md, PAYMENT_FLOW.md, NEON_MIGRATION_BRIEF.md, dan semua spec yang ada._
