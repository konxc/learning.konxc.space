# Roadmap Pengembangan

Roadmap pengembangan untuk platform **"Naik Kelas by Koneksi"**.

## 🎯 Konteks Project

Platform edukasi teknologi dengan fokus pada project-based learning, AI-enhanced coding, dan membangun learning ecosystem untuk talenta digital Indonesia.

## 📅 Timeline: Q1 2025

---

## Phase 1: Foundation ✅ (Completed)

**Duration**: Weeks 1-2  
**Status**: ✅ Completed

### Objectives

- Setup project infrastructure
- Implement basic authentication
- Setup database
- Configure development environment

### Deliverables

- ✅ Working SvelteKit application
- ✅ User authentication system
- ✅ Database schema and migrations
- ✅ i18n support (Indonesian, English, Japanese)

---

## Phase 2: Core Features 🔄 (Current)

**Duration**: Weeks 3-4  
**Status**: 🟡 In Progress  
**Sprint**: 2025-01-23 - 2025-02-06

### Objectives

- Enhance user experience
- Implement user dashboard
- Add protected routes
- Improve security

### Deliverables

- [ ] User dashboard with profile management
- [ ] Protected routes middleware
- [ ] Better error handling and validation
- [ ] Loading states and UI feedback
- [ ] Session timeout handling

### Tasks Breakdown

- [ ] Design dashboard UI/UX
- [ ] Implement profile edit functionality
- [ ] Add route guards
- [ ] Create generic error handling system
- [ ] Add toast notifications

---

## Phase 3: User Management (Planned)

**Duration**: Weeks 5-6  
**Status**: 📋 Planned  
**Target Start**: 2025-02-06

### Objectives

- Role-based access control
- Admin panel
- User activity tracking
- Audit logs

### Features

- Role management (Admin, Teacher, Student, User)
- Admin dashboard to manage users
- User activity logs
- System audit trail
- Bulk user operations

---

## Phase 4: Learning Content (Planned)

**Duration**: Weeks 7-10  
**Status**: 📋 Planned  
**Target Start**: 2025-02-20

### Objectives

- Course management system
- Learning modules
- Progress tracking
- Content organization

### Features

- Course creation and management
- Module/lesson structure
- Video/PDF/Document content support
- Student progress tracking
- Completion certificates
- Content categories and tags

---

## Phase 5: Collaboration Features (Future)

**Duration**: Weeks 11-14  
**Status**: 📋 Planned  
**Target Start**: 2025-03-20

### Objectives

- Community features
- Discussion forums
- Q&A system
- Peer interaction

### Features

- Discussion forums per course
- Q&A system
- Comments and reviews
- User rating system
- Study groups
- Mentorship program

---

## Phase 6: Analytics & Reporting (Future)

**Duration**: Weeks 15-16  
**Status**: 📋 Planned  
**Target Start**: 2025-04-17

### Objectives

- Analytics dashboard
- Progress reports
- Performance metrics
- Data visualization

### Features

- User analytics dashboard
- Course performance metrics
- Student progress reports
- Learning path recommendations
- Export data functionality

---

## Technical Debt & Improvements

### High Priority

- [ ] Comprehensive error handling
- [ ] Input validation and sanitization
- [ ] Security audit
- [ ] Performance optimization
- [ ] Database indexing optimization

### Medium Priority

- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Add E2E tests coverage
- [ ] Improve TypeScript type safety
- [ ] API rate limiting

### Low Priority

- [ ] Code documentation
- [ ] API documentation (OpenAPI)
- [ ] Accessibility improvements (a11y)
- [ ] PWA capabilities
- [ ] Mobile responsiveness optimization

---

## Dependencies & Infrastructure

### Current Stack

- **Frontend**: SvelteKit 2.x
- **Backend**: SvelteKit SSR
- **Database**: Turso (LibSQL)
- **ORM**: Drizzle
- **Auth**: Lucia v3
- **i18n**: Paraglide (inlang)
- **Styling**: Tailwind CSS 4
- **Deployment**: GitHub Pages (static adapter)

### Planned Additions

- [ ] Redis for caching
- [ ] Email service (SendGrid/SES)
- [ ] File storage (S3/Cloudflare R2)
- [ ] Monitoring (Sentry/Sentry)
- [ ] Analytics (Plausible/Google Analytics)

---

## Success Metrics

### Phase 2 Goals

- 100% authentication flow coverage
- Zero security vulnerabilities
- < 3s page load time
- Mobile responsive design

### Phase 3 Goals

- Admin can manage users
- Activity logs are complete
- Role-based access works flawlessly

### Phase 4 Goals

- 10+ courses created
- Video playback works smoothly
- Progress tracking is accurate

---

## Risk Assessment

### Technical Risks

- **Database scaling**: Turso has limits, may need migration
- **State management**: May need to add state management library
- **Performance**: SSR performance at scale

### Mitigation Strategies

- Plan database migration strategy early
- Monitor performance metrics closely
- Implement caching where possible
- Regular security audits

---

## Resource Requirements

### Development Team

- 1 Full-time Developer (Current)
- Future: 1 Designer (Phase 4+)
- Future: 1 DevOps Engineer (Phase 4+)

### Infrastructure Costs

- **Current**: Free tier (GitHub Pages, Turso)
- **Phase 3+**: ~$50-100/month (scaling)
- **Phase 6+**: $200-500/month (full production)

---

---

## Landing Page Enhancement Roadmap

Roadmap khusus untuk meningkatkan landing page platform, mendukung visi multi-domain (Developer, Akademik, Bisnis & UMKM, UI/UX Design, Outdoor Adventure) dan meningkatkan conversion rate.

### Konteks

Landing page saat ini memiliki struktur dasar:

- HeroSection
- CTASection
- ProgramSection (dengan timeline roadmap)
- BenefitsSection
- AboutSection

Platform ini dirancang untuk menjadi platform pembelajaran multi-domain yang terbuka dan heterogen, tidak hanya terbatas pada bidang coding/developer.

### Phase 1: Foundation & Multi-Domain Support (Minggu 1-2)

**Status**: 📋 Planned  
**Target Start**: 2025-02-01

#### 1.1 Content Abstraction

**File**: `src/lib/config/contentConfig.ts` (new)

- Buat domain-aware content configuration system
- Interface `DomainContent` untuk struktur content per domain
- Mapping `DOMAIN_CONTENT: Record<CareerOption, DomainContent>`
- Content untuk: Developer, Akademik, Bisnis & UMKM, UI/UX Design, Outdoor Adventure
- Helper function `getDomainContent(domain: CareerOption): DomainContent`

**Files to update**:

- `src/lib/config/sectionContent.ts` - Update untuk support multiple domains
- `src/lib/sections/HeroSection.svelte` - Use dynamic content
- `src/lib/sections/CTASection.svelte` - Use dynamic content
- `src/lib/sections/BenefitsSection.svelte` - Use dynamic content
- `src/lib/sections/AboutSection.svelte` - Use dynamic content

**Deliverables**:

- [ ] Content configuration system
- [ ] Dynamic content per domain
- [ ] Helper functions untuk content access

#### 1.2 SEO & Metadata Enhancement

**File**: `src/routes/(public)/+page.svelte`

- Dynamic meta tags berdasarkan domain selection
- Update structured data untuk support multiple course types
- Add `Course` schema per domain category
- Add `FAQPage` schema
- Add `AggregateRating` schema untuk testimonials

**File**: `src/lib/utils/seo.ts` (new)

- Generate dynamic meta tags
- Generate structured data per domain
- SEO helper functions

**Deliverables**:

- [ ] Dynamic SEO per domain
- [ ] Structured data untuk semua course types
- [ ] SEO utility functions

#### 1.3 Terminology Refactor (Optional)

**Files**:

- `src/lib/stores/career.ts` - Consider rename to `domain.ts`
- `src/lib/data/careerRoadmaps.ts` - Consider rename to `domainRoadmaps.ts`
- Update all imports

**Note**: Refactor ini optional, bisa dilakukan bertahap.

### Phase 2: Content & Messaging (Minggu 2-3)

**Status**: 📋 Planned  
**Target Start**: 2025-02-08

#### 2.1 Hero Section Enhancement

**File**: `src/lib/sections/HeroSection.svelte`

- Dynamic rotating headlines per domain
- Domain-specific hero visuals/icons
- Domain-specific CTAs
- Add social proof indicators (numbers, badges)

**Deliverables**:

- [ ] Dynamic hero content per domain
- [ ] Social proof indicators
- [ ] Domain-specific visuals

#### 2.2 Program Section Enhancement

**File**: `src/lib/data/careerRoadmaps.ts`

Complete roadmaps untuk semua domains:

- Developer (already exists)
- Akademik: IPA, Matematika, IPS, Bahasa Indonesia, Bahasa Inggris
- Bisnis & UMKM
- UI/UX Design
- Outdoor Adventure

**File**: `src/lib/sections/ProgramSection.svelte`

- Add visual roadmap improvements
- Interactive timeline
- Progress indicators
- Downloadable roadmap option

**Deliverables**:

- [ ] Complete roadmaps untuk semua domains
- [ ] Enhanced visual timeline
- [ ] Downloadable roadmap feature

#### 2.3 New Sections

**Testimonials Section**

- File: `src/lib/sections/TestimonialsSection.svelte` (new)
- File: `src/lib/config/testimonials.ts` (new)
- Testimonials data per domain
- Video testimonials support
- Before/after stories
- Star ratings display

**Social Proof Section**

- File: `src/lib/sections/SocialProofSection.svelte` (new)
- Student count
- Success rate metrics
- Partner logos
- Media mentions

**FAQ Section**

- File: `src/lib/sections/FAQSection.svelte` (new)
- File: `src/lib/config/faq.ts` (new)
- FAQ per domain
- Expandable FAQ items
- Search functionality
- Schema.org FAQPage structured data

**Deliverables**:

- [ ] TestimonialsSection component
- [ ] SocialProofSection component
- [ ] FAQSection component
- [ ] Content data untuk semua sections

### Phase 3: UX & Conversion (Minggu 3-4)

**Status**: 📋 Planned  
**Target Start**: 2025-02-15

#### 3.1 CTA Optimization

**Files**:

- `src/lib/sections/CTASection.svelte`
- `src/lib/components/FloatingCTA.svelte` (new)

- Multiple CTA placement (primary, secondary, tertiary)
- Floating sticky CTA button
- Exit-intent popup (optional)
- CTA di setiap section

**Deliverables**:

- [ ] Optimized CTA placement
- [ ] FloatingCTA component
- [ ] CTA tracking

#### 3.2 Navigation Enhancement

**File**: `src/lib/components/SectionNavigation.svelte` (new)

- Sticky section navigation menu
- Progress indicator
- Smooth scroll with offset
- "Back to top" button

**Deliverables**:

- [ ] SectionNavigation component
- [ ] Progress indicator
- [ ] Smooth scroll improvements

#### 3.3 Interactive Elements

**File**: `src/lib/components/DomainSelector.svelte` (new)

- Visual domain selector
- Filter by category
- Comparison table
- Preview content per domain

**Deliverables**:

- [ ] DomainSelector component
- [ ] Domain comparison feature
- [ ] Preview functionality

### Phase 4: Performance & Technical (Minggu 4-5)

**Status**: 📋 Planned  
**Target Start**: 2025-02-22

#### 4.1 Performance Optimization

**Files to update**: All section components

**Strategy**: Lihat `docs/LAZY_LOADING_STRATEGY.md` untuk detail implementasi

**Priority Implementation**:

1. **Image Lazy Loading** (Phase 1 - Immediate)
   - Add `loading="lazy"` to below-fold images
   - Add `loading="eager"` + `fetchpriority="high"` to hero images
   - Add `width` dan `height` attributes untuk prevent CLS
   - Convert images to WebP/AVIF with fallback
   - Add responsive images (srcset)

2. **Component Lazy Loading** (Phase 2 - High Priority)
   - Lazy load TestimonialsSection (below fold)
   - Lazy load FAQSection (below fold)
   - Lazy load SocialProofSection (below fold)
   - Use `LazySection.svelte` wrapper component
   - Add skeleton loaders untuk better UX

3. **Progressive Enhancement** (Phase 3 - Medium Priority)
   - Lazy load heavy animations
   - Lazy load search functionality
   - Keep content in HTML source

**Files to create/update**:
- `src/lib/utils/lazyLoading.ts` - Utility functions ✅
- `src/lib/components/LazySection.svelte` - Wrapper component ✅
- `docs/LAZY_LOADING_STRATEGY.md` - Strategy documentation ✅
- All section components - Add image lazy loading
- TestimonialsSection, FAQSection, SocialProofSection - Component lazy loading

**Deliverables**:

- [x] Lazy loading utilities created
- [x] Lazy loading strategy documentation
- [ ] Image optimization (WebP/AVIF conversion)
- [ ] Image lazy loading implementation
- [ ] Component lazy loading untuk non-critical sections
- [ ] Code splitting
- [ ] Performance metrics improvement

#### 4.2 Analytics & Tracking

**File**: `src/lib/utils/analytics.ts` (new)

- Event tracking setup
- CTA click tracking
- Scroll depth tracking
- Form interaction tracking
- Domain selection tracking

**Deliverables**:

- [ ] Analytics setup
- [ ] Event tracking system
- [ ] Conversion tracking

#### 4.3 Accessibility Improvements

**Files**: All section components

- Complete ARIA labels
- Skip to content link
- Focus management
- Keyboard navigation
- Screen reader testing
- WCAG AA compliance
- Color contrast improvements

**Deliverables**:

- [ ] WCAG AA compliance
- [ ] Complete accessibility features
- [ ] Keyboard navigation
- [ ] Screen reader support

### Phase 5: Advanced Features (Minggu 5-6)

**Status**: 📋 Planned  
**Target Start**: 2025-03-01

#### 5.1 Personalization

**File**: `src/lib/stores/userPreferences.ts` (new)

- Remember domain selection
- Personalized content based on interest
- Location-based content (optional)

**Deliverables**:

- [ ] User preferences store
- [ ] Personalization system
- [ ] Content customization

#### 5.2 Social Features

**File**: `src/lib/components/SocialShare.tsvelte` (new)

- Share buttons per section
- Custom share previews
- Referral tracking

**Deliverables**:

- [ ] SocialShare component
- [ ] Referral system
- [ ] Share tracking

#### 5.3 Advanced Interactivity

**File**: `src/lib/components/VirtualTour.svelte` (new)

- Platform preview (optional)
- Interactive demos
- Course preview videos

**Deliverables**:

- [ ] VirtualTour component (optional)
- [ ] Interactive demos

### Phase 6: Multi-Language Support (Minggu 6-7)

**Status**: 📋 Planned  
**Target Start**: 2025-03-08

#### 6.1 i18n Enhancement

**File**: Update existing i18n setup

- Translate all new sections
- Domain-specific translations
- Cultural adaptation per language

**Deliverables**:

- [ ] Complete translations
- [ ] Domain-specific translations
- [ ] Cultural adaptation

### Phase 7: Mobile Optimization (Minggu 7-8)

**Status**: 📋 Planned  
**Target Start**: 2025-03-15

#### 7.1 Mobile-First Improvements

**Files**: All section components

- Touch-friendly interactions
- Swipe gestures
- Mobile-optimized forms
- PWA features
- Mobile performance optimization

**Deliverables**:

- [ ] Mobile optimization
- [ ] PWA features
- [ ] Touch interactions
- [ ] Mobile performance

### Quick Wins (Can Start Immediately)

1. Add testimonials section (1-2 days)
2. Add FAQ section (1 day)
3. Improve CTA placement (1 day)
4. Add social proof numbers (1 day)
5. Optimize images (1 day)

### Metrics & KPIs

#### Conversion Metrics

- Conversion rate (visitor → signup)
- Bounce rate
- Time on page
- Scroll depth
- CTA click rate

#### Technical Metrics

- Page load time (< 3s target)
- First Contentful Paint (< 1.5s)
- Largest Contentful Paint (< 2.5s)
- Cumulative Layout Shift (< 0.1)
- Lighthouse score (> 90)

#### Business Metrics

- Signups per domain
- Most popular sections
- User journey analysis
- Drop-off points

### Implementation Notes

- **Incremental approach**: Implement and test each phase
- **Data-driven**: Use analytics untuk decision making
- **User feedback**: Collect feedback dari early users
- **Mobile-first**: Prioritize mobile experience
- **Accessibility**: Don't skip a11y improvements

### Dependencies

- Analytics setup (Google Analytics 4, Hotjar/Clarity)
- A/B testing tool (optional)
- Performance monitoring (Lighthouse CI)
- Image optimization tools

---

## Business Roadmap 2030–2035 (High-level)

### Visi & North Star

- Visi: Platform pembelajaran karier berbasis mentor dan proyek riil yang meningkatkan mobilitas pendapatan talenta Indonesia dan regional.
- North Star Metric: lulusan yang mengalami kenaikan pendapatan ≥20% dalam 6–12 bulan.

### Model Bisnis

- B2C: pembelian kursus/bundel, langganan tahunan, cohort bootcamp, sertifikasi.
- B2B: corporate academy (multi-tenant), kurikulum custom, laporan HR, integrasi LMS/HRIS.
- Marketplace: revenue-share mentor (tiering), komisi transaksi, tools premium.
- Value-add: job placement fee, micro-credential, exam proctoring, komunitas premium, AI assistant.

### Peta Fase

- 0–6 bulan: core marketplace, cohort engine v1, pembayaran lengkap, analitik dasar, monetisasi awal.
- 6–18 bulan: personalisasi jalur belajar, mentor tooling, B2B v1 (SSO, seat), subscription.
- 18–36 bulan: job network, AI co-pilot belajar/mentor, akreditasi awal, PWA/offline.
- 2028–2030: ekspansi SEA, enterprise features, integrasi HRIS/LMS, kontrak multi-year.
- 2030–2035: kredensial standar industri, open ecosystem (plug-in), skills wallet.

### Target Indikatif

- 12 bulan: ARR USD 0.8–1.5M; GM 40–55%; CAC payback < 9 bln.
- 24–36 bulan: ARR USD 3–15M; GM 55–75%; retensi langganan >70%.
- 2028–2030: ARR USD 20–30M; margin kontribusi positif; enterprise 30–40% ARR.
- 2030–2035: ARR > USD 50M; EBITDA positif; 1M+ learner; 50k+ mentor; 10k+ perusahaan.

### KPI Inti

- Akuisisi: CAC, konversi landing→checkout, referral rate.
- Aktivasi: course start rate, TTM modul 3, SLA respons mentor.
- Retensi: completion rate, cohort graduation, churn.
- Outcome: job placement, salary uplift, NPS, kelulusan sertifikasi.
- B2B: seat utilization, expansion, NRR.

### Risiko & Mitigasi

- Relevansi konten: komite kurikulum, loop umpan balik, insight data.
- Skala mentor: sertifikasi/tiering, quality review, tooling mengajar.
- Regulasi data/finansial: DPO, audit rutin, PSP compliant, UU PDP/PDPA.
- Diferensiasi: fokus outcome, jaringan pekerjaan, akreditasi, komunitas.
- Kualitas AI: human-in-the-loop, audit dataset, explainability.

### Next 60–90 Hari (aksi)

- Jalankan 3 cohort flagship; rekrut 20+ mentor; 200–500 learner; 3 pilot B2B.
- OKR: aktivasi >60%, completion >35%, NPS >45, CAC payback <12 bln.
- Perkuat observabilitas, keamanan, dan e2e test checkout/cohort.
- GTM: referral program, konten berfokus outcome, outbound B2B ke 50 prospek.

---

**Last Updated**: 2025-10-30  
**Next Review**: 2025-11-30
