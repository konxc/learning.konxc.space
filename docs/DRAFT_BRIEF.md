## Brief Proyek: Naik Kelas by Koneksi

### 📋 Executive Summary

Naik Kelas by Koneksi adalah platform edukasi teknologi berbasis web yang berfokus pada program kursus dan pelatihan **Digital Marketing, bisnis digital, pemrograman, AI tools**, dan project-based learning untuk mengembangkan talenta digital dan wirausaha digital Indonesia. Platform ini dirancang sebagai learning ecosystem yang mengintegrasikan pembelajaran fundamental teknis dan non-teknis dengan praktik langsung menggunakan teknologi modern seperti LLM, AI agents, dan collaborative development tools lainnya.
Status Proyek: Development Phase 1 - Foundation ✅
Platform URL: naikkelas.id
Inisiator: Kolaboratif Tim IT (Yayasan Klub Fisika / PT Koneksi Jaringan Indonesia)
Launch Target: Q1 2025

### 🎯 Tujuan & Latar Belakang

#### Tujuan Utama

1. Membangun Unit Usaha Edukasi Teknologi yang berfokus pada:
   - **Digital Marketing** (bridge antara teknis dan bisnis)
   - **Bisnis Digital & Entrepreneurship** (non-teknis)
   - Dasar Pemrograman modern dan praktis
   - Integrasi AI tools untuk efisiensi coding
   - Project-based learning dengan output nyata
2. Pengembangan Talenta Digital & Bisnis:
   - Rekrutmen dan pembinaan talenta IT di kalangan pelajar SMA/SMK dan mahasiswa
   - Pengembangan skill bisnis dan digital marketing untuk wirausaha muda
   - Konsolidasi tim developer internal dari peserta terbaik
   - Pembentukan learning ecosystem berbasis upskilling digital dan bisnis
3. Eksperimen Model Pembelajaran Modern:
   - Pendekatan berbasis real project (baik teknis maupun bisnis)
   - Kultur learning by doing
   - Integrasi ekosistem coding, AI, marketing tools, dan kolaborasi open-source

#### Masalah yang Dipecahkan

- **Gap Skill Teknis**: Minimnya akses pembelajaran pemrograman yang praktis dan terstruktur untuk generasi muda
- **Gap Skill Bisnis Digital**: Perluasan skill bisnis tradisional ke digital, khususnya digital marketing
- **Pemisahan Teknis vs Bisnis**: Kebutuhan platform yang menyatukan pemahaman teknis dan strategi bisnis (khususnya untuk digital marketing)
- **Teori vs Praktik**: Kebutuhan platform yang mengintegrasikan teori dengan praktik langsung (baik teknis maupun bisnis)
- **Keterhubungan**: Kebutuhan ekosistem yang menghubungkan peserta, mentor, dan industri tech/bisnis

### 👥 Target Audience

#### Primary: Learner B2C

**Technical Track:**

- Pelajar SMA/SMK yang tertarik pemrograman
- Mahasiswa bidang teknologi atau yang ingin belajar coding
- Early/mid-career professionals yang ingin upgrade technical skill

**Business Track:**

- Wirausaha muda yang ingin memanfaatkan digital marketing
- Pelaku UMKM yang ingin go digital
- Mahasiswa bisnis yang ingin belajar praktik digital marketing
- Career switchers yang ingin masuk ke digital marketing

**Hybrid Track (Digital Marketing):**

- Orang yang ingin belajar kombinasi teknis (tools, analytics) dan bisnis (strategy, content)
- Content creators yang ingin upgrade skill teknis
- Marketers yang ingin memahami technical implementation

#### Secondary: B2B

- UMKM yang membutuhkan upskilling tim
- Perusahaan (HR/L&D) untuk corporate training
- Institusi pendidikan untuk white-label academy (Koneksi: Sistem Akademik/Sistem Administrasi Sekolah)
- Pemerintah/NGO untuk program vokasi

### 💡 Value Proposition

#### Unique Selling Points

1. **Multi-Track Learning Platform**
   - Technical track: Programming, AI tools, development
   - Business track: Entrepreneurship, business strategy, digital marketing
   - Hybrid track: Digital marketing yang menggabungkan teknis dan bisnis

2. AI-First Approach
   - Platform edukasi yang fully integrated dengan AI tools (Emergent.ai, Bolt, Lovable)
   - Prompt engineering untuk developer dan marketer
   - AI untuk content creation, SEO, dan marketing automation
   - Efisiensi belajar melalui AI assistance

3. Project-Based Learning
   - Fokus pada output nyata, bukan hanya teori
   - Technical projects: Deployable apps, websites
   - Business projects: Business plans, marketing campaigns, content strategies
   - Minimal 1 deployable project/campaign per peserta
   - Portfolio showcase yang dapat dipublikasikan

4. Collaborative Learning Environment
   - Project spaces untuk kolaborasi tim
   - Code collaboration tools (untuk technical track)
   - Marketing campaign collaboration (untuk business/hybrid track)
   - Discussion forums dan peer review
   - Mentorship matching system

5. Modern Technology Stack
   - Menggunakan teknologi terkini (SvelteKit 5, AI integration)
   - Integration dengan GitHub, Replit, Codespaces (technical)
   - Integration dengan marketing tools (Analytics, Ads platforms, CMS)
   - Development dengan IDE berbasis web

6. Career Support
   - Sertifikat terverifikasi (technical & business)
   - Interview preparation
   - Referral ke perusahaan rekanan
   - Placement service

### 🚀 Fitur Platform

#### Phase 1: Foundation ✅ (Completed)

- ✅ Authentication system (Login/Register) dengan Lucia v3
- ✅ Database setup (Turso/LibSQL) dengan Drizzle ORM
- ✅ Basic UI framework dengan Tailwind CSS 4
- ✅ i18n support (Indonesian, English, Japanese) dengan Paraglide
- ✅ Development infrastructure

#### Phase 2: Core Features 🔄 (In Progress)

- [ ] User dashboard dengan profile management
- [ ] Protected routes middleware
- [ ] Error handling dan validation system
- [ ] Loading states dan UI feedback
- [ ] Session timeout handling

#### Phase 3: User Management (Planned)

- Role-based access control (Admin, Teacher, Student, User)
- Admin panel untuk manajemen users
- User activity tracking
- Audit logs

#### Phase 4: Learning Management System (Planned)

- Course management system (mendukung multiple track: Technical, Business, Hybrid)
- Module/lesson structure
- Video/PDF/Document support
- Interactive content types:
  - Code exercises (untuk technical)
  - Case studies & templates (untuk business)
  - Hands-on campaigns (untuk hybrid/digital marketing)
- Progress tracking
- Completion certificates (per track)
- Content organization by category/track
- Assessment system (coding challenges & business case evaluations)

#### Phase 5: Collaboration Features (Planned)

- Project spaces untuk tim
- Code collaboration tools
- Discussion forums
- Q&A system
- Peer review mechanism
- Mentorship matching

#### Phase 6: Analytics & Insights (Planned)

- Learning analytics dashboard
- Progress tracking per user
- Performance metrics
- Personal learning paths
- AI-based recommendations

### 🛠️ Tech Stack

#### Frontend

- Framework: SvelteKit 5 (Svelte 5 Runes)
- Styling: Tailwind CSS 4
- i18n: Paraglide (inlang) - Indonesian, English, Japanese

#### Backend & Database

- Database: Turso (LibSQL)
- ORM: Drizzle ORM
- Authentication: Lucia v3

#### Development Tools

- Package Manager: pnpm
- Type Checking: TypeScript
- Linting: ESLint + Prettier
- Testing: Playwright (E2E)
- Migration: Drizzle Kit

#### Deployment

- Hosting: Cloudflare Pages
- Static Adapter: @sveltejs/adapter-static

#### Future Integrations

**Technical Track:**

- GitHub API (project sync)
- Replit API (coding environment)
- AI Tools API (coding assistance)

**Business/Hybrid Track:**

- Google Analytics API
- Social media APIs (Facebook, Instagram, Twitter)
- Email marketing platforms (Mailchimp, SendGrid)
- CMS platforms (WordPress, Shopify)
- Ads platforms (Google Ads, Meta Ads)

**Common:**

- Video hosting services
- Payment gateway
- Certificate generation system

### 📊 Model Bisnis

#### Revenue Streams

B2C:

- One-off course purchases
- Subscription model (bulanan/tahunan)
- Cohort bootcamp packages
- Sertifikasi premium
  B2B:
- Corporate seats/tahun
- Custom kurikulum development
- Enterprise contract
  Marketplace:
- Revenue-share dengan mentor (tiering system)
- Placement fee untuk talenta

#### Cost Structure

COGS:

- Komisi mentor
- Tool kelas (video/storage)
- Sertifikasi/verifikasi
  Opex:
- Pemasaran dan akuisisi
- Gaji tim
- Server/infrastructure
- Support operations
- Compliance

#### Key Metrics (KPI)

North Star Metric:

- Proporsi lulusan yang naik pendapatan ≥20% dalam 6–12 bulan
  Core KPIs:
- Conversion rate landing → checkout
- Course completion rate
- NPS (Net Promoter Score)
- Subscription churn rate
- Seat utilization (B2B)
- Placement rate

### 🎓 Konsep Pembelajaran

#### Model: Project-Based Learning

Platform menawarkan **3 Learning Tracks**:

#### Track 1: Technical (Programming & Development)

**Stage 1: Fundamental**
- Dasar teori pemrograman
- Algoritma & logic thinking
- Version control (Git & GitHub)
- Workflow kolaboratif

**Stage 2: Praktik & Eksperimen**
- Proyek individu & tim
- Integration dengan Replit, Codespaces, GitHub
- Development dengan IDE berbasis web
- Mini project: Landing page dengan AI Agent

**Stage 3: AI-Enhanced Learning**
- Penggunaan AI Agent untuk efisiensi
- Prompt engineering untuk developer
- Best practices AI-assisted coding

**Stage 4: Output Showcase**
- Minimal 1 deployable project per peserta
- Portfolio display di platform
- Deployment (Replit/Netlify)

#### Track 2: Business (Entrepreneurship & Digital Business)

**Stage 1: Fundamental**
- Dasar bisnis digital
- Business model canvas
- Market research & validation
- Financial basics untuk bisnis

**Stage 2: Digital Marketing Foundations**
- Content strategy
- Social media marketing
- Email marketing
- SEO fundamentals

**Stage 3: Campaign Execution**
- Campaign planning & execution
- Analytics & measurement
- A/B testing
- Optimization strategies

**Stage 4: Output Showcase**
- Business plan atau marketing campaign yang dijalankan
- Case study dan hasil measurement
- Portfolio bisnis digital

#### Track 3: Hybrid (Digital Marketing - Technical + Business)

**Stage 1: Foundation**
- Digital marketing strategy
- Technical SEO
- Web analytics (Google Analytics, etc.)
- Content management systems

**Stage 2: Technical Implementation**
- Landing page development
- Marketing automation setup
- API integration untuk marketing tools
- Data tracking implementation

**Stage 3: Campaign & Optimization**
- Multi-channel campaign execution
- Technical optimization (performance, conversion)
- Data analysis & insights
- AI tools untuk content & optimization

**Stage 4: Output Showcase**
- End-to-end marketing campaign dengan technical implementation
- Measurement & reporting
- Portfolio digital marketing

#### Kurikulum Integrasi (2 Bulan - Contoh)

**Bulan 1 – Dasar & Lingkungan:**
- **Track Technical**: Terminal, Git, HTML/CSS/JS dasar
- **Track Business**: Business fundamentals, content strategy
- **Track Hybrid**: Marketing tools, analytics setup, CMS basics

**Bulan 2 – Proyek & Kolaborasi:**
- **Track Technical**: Deployable web project
- **Track Business**: Marketing campaign execution
- **Track Hybrid**: Technical marketing campaign dengan measurable results
- Presentasi dan dokumentasi proyek

### 🎨 Identitas Visual & Branding

#### Brand Identity

- Nama: Naik Kelas
- Sub-brand: by Koneksi
- Tone: Edukatif, modern, AI-friendly, praktis, inspiratif, kolaboratif

#### Design Direction

- Color Scheme: Dominasi biru & putih (clean aesthetic)
- Style: Minimalis, fokus pada konten
- Layout: Showcase dan dokumentasi oriented
- Inspiration: Kodacademy.id

#### Digital Assets

- Landing page dengan portfolio showcase
- Instagram & social media presence
- GitHub Organization untuk kolaborasi
- Content categories: Behind the Code, Code in Action, AI Tools Tips, DevTalk, Weekly Showcase

### 📅 Roadmap & Timeline

#### Q1 2025

Phase 1: Foundation ✅ (Weeks 1-2)

- ✅ Project setup
- ✅ Authentication system
- ✅ Database configuration
- ✅ i18n support
  Phase 2: Core Features 🔄 (Weeks 3-4)
- Dashboard development
- Protected routes
- Error handling
- UI improvements
  Phase 3: User Management 📋 (Weeks 5-6)
- Role-based access control
- Admin panel
- User activity tracking
  Phase 4: Learning Content 📋 (Weeks 7-10)
- Course management
- Module/lesson system
- Progress tracking
- Certificate generation

#### Future Phases (Q2-Q4 2025)

- Collaboration features
- Analytics & insights
- Mobile app (optional)
- Advanced AI integration

### 👨‍💻 Team & Resources

#### Required Roles

- Product Manager: Roadmap & feature prioritization
- Tech Lead: Architecture & technical decisions
- Frontend Developers: SvelteKit implementation
- Backend Developers: API & database management
- UX/UI Designer: User experience & interface design
- Content Creators: Curriculum development (technical & business)
- Technical Mentors: Teaching & guidance untuk programming/development
- Business Mentors: Teaching & guidance untuk bisnis & digital marketing
- Marketing: User acquisition & community building

#### Infrastructure

- Development environment (local)
- Cloud hosting (Cloudflare Pages)
- Database (Turso)
- CI/CD pipeline
- Monitoring & analytics tools

### 🎯 Success Metrics & Evaluation

#### Engagement Metrics

- Active users per batch
- Module completion rate
- Project submission rate
- Average session duration
- Forum participation rate

#### Learning Outcomes

**Technical Track:**
- Number of deployable projects created
- GitHub activity metrics
- Code quality assessments

**Business Track:**
- Number of marketing campaigns executed
- Business plan submissions
- Campaign performance metrics

**Hybrid Track:**
- Technical marketing campaigns completed
- Measurement & reporting quality
- ROI/performance improvements

**Common:**
- Skills progression tracking
- Certification rate (per track)
- Portfolio quality score
- Project/campaign success rate

#### Business Metrics

- User acquisition cost (CAC)
- Customer lifetime value (CLV)
- Revenue per user
- Churn rate
- NPS score

#### Community Health

- Mentor engagement rate
- Peer interaction frequency
- Content creation volume
- Event participation

### 🔄 Workflow Platform

```
User Registration → Authentication → Browse Courses (by Track) → Enroll
    ↓
Learning Modules → Practice Projects/Campaigns
    ↓
    ├─ Technical Track: Code Submission
    ├─ Business Track: Campaign/Business Plan Submission
    └─ Hybrid Track: Technical Campaign Submission
    ↓
Peer Review → Mentor Feedback → Iteration
    ↓
    ├─ Technical: Project Deployment
    ├─ Business: Campaign Launch/Execution
    └─ Hybrid: Campaign Launch with Technical Implementation
    ↓
Portfolio Showcase → Certificate Issuance (per Track)
    ↓
Career Support → Job Placement (Optional)
```

### 📝 Next Steps & Priorities

#### Immediate Actions (Week 1-2)

1. ✅ Complete Phase 1 foundation
2. 🔄 Finalize user dashboard design
3. 📋 Plan Phase 3 user management features
4. 📋 Prepare first batch curriculum content

#### Short-term (Month 1-2)

1. Launch beta version untuk testing
2. Onboard first cohort (pilot batch) - technical track
3. Develop course content untuk batch pertama:
   - Technical track curriculum
   - Business track curriculum
   - Hybrid/Digital Marketing track curriculum
4. Build mentor network (technical & business mentors)
5. Collect user feedback
6. Iterate berdasarkan feedback

#### Medium-term (Month 3-6)

1. Scale ke multiple batches
2. Implement advanced features (collaboration, analytics)
3. Build mentor network
4. Establish B2B partnerships
5. Develop marketplace features

#### Long-term (Month 6+)

1. Expand course catalog:
   - Advanced technical courses
   - Specialized business courses (e-commerce, social media marketing, etc.)
   - Advanced digital marketing tracks
   - Industry-specific certifications
2. AI-enhanced personalized learning
3. Career services & placement program (untuk technical & business roles)
4. International expansion (English market)
5. Mobile app development (if needed)

### ⚠️ Risks & Mitigation

#### Technical Risks

- Risk: Scalability issues dengan database
- Mitigation: Monitor performance, optimize queries, consider scaling options

#### Business Risks

- Risk: Low user adoption
- Mitigation: Strong marketing strategy, referral programs, free tier offering

#### Content Risks

- **Risk**: Outdated curriculum (technical & business)
- **Mitigation**: 
  - Regular content review dengan technical & business experts
  - Industry expert involvement untuk semua track
  - Student feedback loop untuk continuous improvement
  - Market trend monitoring untuk digital marketing content

### 📚 Referensi & Dokumentasi

#### Project Documentation

- PROJECT_VISION.md - Visi dan tujuan platform
- ROADMAP.md - Roadmap pengembangan detail
- BUSINESS_MODEL_CANVAS.md - Model bisnis
- DESIGN_REFERENCE.md - Panduan desain
- notulensi_naik_kelas.md - Notulensi awal proyek

#### Technical Documentation

- API.md - Dokumentasi API
- SECURITY.md - Security guidelines
- CONTRIBUTING.md - Panduan kontribusi
- WORKFLOW.md - Development workflow

### 📞 Contact & Communication

Project Repository: learning.konxc.space
Organization: Yayasan Klub F / Koneksi
Status: Active Development
Last Updated: 2025-01-23
Version: 1.0
Owner: Tim IT Yayasan Klub F / Koneksi
Draft brief proyek mencakup:

- Executive Summary — ringkasan proyek
- Tujuan & Latar Belakang — konteks dan tujuan
- Target Audience — segmen pengguna
- Value Proposition — nilai unik platform
- Fitur Platform — roadmap fitur per fase
- Tech Stack — teknologi yang digunakan
- Model Bisnis — revenue streams dan cost structure
- Konsep Pembelajaran — metodologi pembelajaran
- Identitas Visual — branding dan design
- Roadmap & Timeline — timeline pengembangan
- Success Metrics — KPI dan metrik keberhasilan
- Next Steps — langkah prioritas ke depan
