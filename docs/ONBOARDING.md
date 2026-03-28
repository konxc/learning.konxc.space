# Onboarding Guide - Learning.konxc.space

Selamat datang di **Learning.konxc.space**! Dokumentasi ini akan membantu Anda memahami struktur, teknologi, dan cara kerja project platform pembelajaran "Naik Kelas by Koneksi".

## 📋 Daftar Isi

1. [Overview Project](#overview-project)
2. [Tech Stack](#tech-stack)
3. [Struktur Project](#struktur-project)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Routing & Layout](#routing--layout)
7. [Component Architecture](#component-architecture)
8. [Development Workflow](#development-workflow)
9. [Key Features](#key-features)
10. [Resources & Dokumentasi](#resources--dokumentasi)

---

## 🎯 Overview Project

**Learning.konxc.space** adalah platform pembelajaran berbasis web untuk program edukasi teknologi **"Naik Kelas by Koneksi"**.

### Konsep Pembelajaran

1. **Project-Based Learning** - Fokus pada real output
2. **AI-Enhanced Coding** - Integrasi AI tools untuk efisiensi
3. **Learning by Doing** - Praktik langsung dengan GitHub, Replit, Codespaces
4. **Portfolio Showcase** - Setiap peserta wajib menghasilkan deployable project

### Target Pengguna

- **Learners**: Peserta program yang mengikuti kursus
- **Mentors**: Pengajar yang membuat dan mengelola kursus
- **Admins**: Administrator platform
- **Business**: Stakeholder yang melihat analytics bisnis

---

## 🛠 Tech Stack

### Frontend

- **Framework**: SvelteKit 5 dengan Svelte 5 Runes
- **Styling**: Tailwind CSS 4
- **i18n**: Paraglide (inlang) - Indonesian, English, Japanese
- **Build Tool**: Vite 7

### Backend

- **Runtime**: SvelteKit server-side (Node.js)
- **Database**: Turso (LibSQL) - SQLite-compatible
- **ORM**: Drizzle ORM
- **Authentication**: Lucia v3

### Development Tools

- **TypeScript**: Type safety
- **ESLint + Prettier**: Code quality & formatting
- **Playwright**: E2E testing
- **Drizzle Kit**: Database migrations

### Deployment

- **Production**: Cloudflare Pages
- **CI/CD**: GitHub Actions (via deploy scripts)

---

## 📁 Struktur Project

```
learning.konxc.space/
├── src/
│   ├── lib/                      # Shared libraries & components
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/              # Base UI components (Button, Card, Table, etc.)
│   │   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── layouts/        # Layout components (AppShell, PublicShell)
│   │   │   └── ...
│   │   ├── sections/            # Page sections (Hero, Benefits, CTA, etc.)
│   │   ├── server/              # Server-side code
│   │   │   ├── db/              # Database schema & client
│   │   │   ├── auth.ts          # Authentication logic
│   │   │   ├── rbac.ts          # Role-based access control
│   │   │   └── payments/       # Payment processing
│   │   ├── stores/              # Svelte stores (theme, toast, user)
│   │   ├── hooks/               # Reusable hooks (useRole, etc.)
│   │   ├── utils/               # Utility functions (format, fetcher)
│   │   ├── types/               # TypeScript type definitions
│   │   ├── constants/           # Application constants (roles, routes)
│   │   ├── config/              # Configuration (design tokens)
│   │   └── paraglide/           # i18n messages
│   │
│   ├── routes/                  # SvelteKit routes
│   │   ├── (public)/            # Public pages (landing, marketing)
│   │   ├── (auth)/              # Auth pages (signin, signup, waiting-list)
│   │   ├── (app)/               # Authenticated app pages (dashboard, etc.)
│   │   ├── (prototype)/         # Experimental/prototype pages
│   │   └── api/                 # API endpoints
│   │
│   ├── app.css                  # Global styles & design system
│   ├── app.html                 # HTML template
│   └── hooks.ts / hooks.server.ts  # SvelteKit hooks
│
├── docs/                        # Documentation
├── drizzle/                     # Database migrations
├── scripts/                     # Utility scripts (seed, deploy)
├── static/                      # Static assets
└── package.json                 # Dependencies & scripts

```

### Route Groups

SvelteKit menggunakan grup route untuk pemisahan domain:

- **`(public)`**: Landing/marketing pages, bebas autentikasi
- **`(auth)`**: Alur autentikasi (signin/signup/waiting-list)
- **`(app)`**: Area pengguna login (dashboard, settings, dsb.)
- **`(prototype)`**: Halaman percobaan; tidak dijamin stabil

---

## 🗄 Database Schema

Database menggunakan **Turso (LibSQL)** dengan Drizzle ORM. Schema utama:

### Core Tables

#### `user`

- `id` (PK), `username` (unique), `passwordHash`
- `role` (default: 'user'), `fullName`, `email`, `phone`
- `onboardingCompleted`, `createdAt`

#### `session`

- `id` (PK), `userId` (FK → user), `expiresAt`

#### `course`

- `id` (PK), `title`, `description`, `thumbnailUrl`
- `price`, `duration` (weeks), `status` (default: 'draft')
- `mentorId` (FK → user), `createdBy` (FK → user)
- `createdAt`, `updatedAt`

#### `enrollment`

- `id` (PK), `userId` (FK), `courseId` (FK), `couponId` (FK)
- `status` (default: 'pending'), `enrolledAt`, `activatedAt`, `completedAt`

### Content Hierarchy

- **`module`** → `courseId` (FK)
- **`lesson`** → `moduleId` (FK)
- **`material`** → `lessonId` (FK) - types: 'text' | 'video' | 'link'
- **`lessonProgress`** - tracks user progress per lesson

### Assessment

- **`quiz`** → `lessonId` (FK), `passingScore`
- **`quizQuestion`** → `quizId` (FK), `type` ('mcq'), `question`
- **`quizChoice`** → `questionId` (FK), `isCorrect`
- **`submission`** - User submissions (quiz/assignment)
- **`submissionGrade`** - Mentor grading

### Business

- **`coupon`** - Discount codes
- **`couponUsage`** - Usage tracking
- **`mentorApplication`** - Mentor registration
- **`waitingList`** - Pre-registration signups
- **`paymentProof`** - Payment verification
- **`certificate`** - Course completion certificates

### Database Commands

```bash
# Generate migration
pnpm run db:generate

# Push schema changes
pnpm run db:push

# Open Drizzle Studio (database GUI)
pnpm run db:studio

# Seed database
pnpm run db:seed

# Seed with reset
pnpm run db:seed:reset
```

---

## 🔐 Authentication & Authorization

### Authentication (Lucia v3)

- **Login**: `/auth/signin`
- **Register**: `/auth/signup`
- **Session Management**: Cookie-based dengan expiry

File kunci:

- `src/lib/server/auth.ts` - Lucia setup & session management
- `src/lib/server/password.ts` - Password hashing (Argon2id via @oslojs)

### Authorization (RBAC)

Role-based access control di `src/lib/server/rbac.ts`:

**Roles:**

- `user` / `learner` - Default role
- `mentor` - Course creator & instructor
- `admin` - Platform administrator
- `business` - Business analytics viewer

**Middleware:**

- `requireAuth()` - Ensures user is logged in
- `requireRole()` - Ensures user has specific role
- Route-level protection via `+layout.server.ts`

---

## 🗺 Routing & Layout

### Route Structure

```
routes/
├── (public)/
│   ├── +page.svelte          # Landing page
│   └── typing-challenge/     # Public features
│
├── (auth)/
│   ├── auth/
│   │   ├── signin/           # Login page
│   │   └── signup/           # Registration page
│   └── waiting-list/         # Pre-registration
│
├── (app)/
│   ├── +layout.svelte        # AppShell layout
│   ├── +layout.server.ts    # Auth check & data loading
│   ├── dashboard/            # Dashboard routes
│   │   ├── +page.svelte      # Role-based dashboard
│   │   ├── my-courses/       # Learner courses
│   │   ├── admin/            # Admin routes
│   │   └── mentor/           # Mentor routes
│   └── onboarding/          # User onboarding flow
│
└── api/                      # API endpoints
```

### Layouts

#### `PublicShell.svelte`

- Untuk route grup `(public)`
- Header dengan navigation
- Footer

#### `AppShell.svelte`

- Untuk route grup `(app)`
- Sidebar navigation
- Header dengan user menu
- Theme toggle
- Command palette
- Breadcrumbs

---

## 🧩 Component Architecture

### Component Hierarchy

```
lib/components/
├── ui/                       # Base UI components
│   ├── Button.svelte        # Button with variants (primary/secondary/ghost)
│   ├── Card.svelte          # Card container
│   ├── Table.svelte         # Data table
│   └── Input.svelte         # Form inputs
│
├── layouts/                  # Layout components
│   ├── AppShell.svelte      # Main app layout
│   ├── PublicShell.svelte   # Public pages layout
│   └── PageSection.svelte   # Section wrapper
│
├── dashboard/                # Dashboard components
│   ├── RoleSwitcher.svelte  # Role switching UI
│   ├── OverviewGraph.svelte # Analytics charts
│   └── roles/                # Role-specific dashboards
│       ├── DashboardLearner.svelte
│       ├── DashboardMentor.svelte
│       ├── DashboardAdmin.svelte
│       └── DashboardBusiness.svelte
│
└── sections/                 # Page sections
    ├── HeroSection.svelte
    ├── BenefitsSection.svelte
    ├── CTASection.svelte
    └── FooterSection.svelte
```

### Component Patterns

#### Button Component

```svelte
<!-- Usage -->
<Button variant="ghost" type="button">Lihat semua</Button>

<!-- Variants: primary | secondary | ghost -->
<!-- Types: button | submit | reset -->
```

**Files menggunakan Button:**

- `src/lib/components/dashboard/roles/DashboardBusiness.svelte`
- `src/lib/components/dashboard/roles/DashboardAdmin.svelte`
- `src/lib/components/dashboard/roles/DashboardMentor.svelte`
- `src/lib/components/dashboard/roles/DashboardLearner.svelte`

#### Design System

Design tokens di `src/lib/config/design.ts`:

- `COLOR` - Color palette (OKLCH)
- `SPACING` - Consistent spacing
- `TEXT` - Typography scale
- `RADIUS` - Border radius
- `TRANSITION` - Animation timing
- `ELEVATION` - Shadow levels

---

## 💻 Development Workflow

### Setup Environment

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Setup environment variables:**

   ```bash
   # Copy .env.example to .env
   # Set DATABASE_URL and DATABASE_AUTH_TOKEN (Turso)
   ```

3. **Setup database:**

   ```bash
   pnpm run db:push        # Push schema
   pnpm run db:seed        # Seed initial data
   ```

4. **Start dev server:**
   ```bash
   pnpm run dev
   ```

### Available Scripts

```bash
# Development
pnpm run dev              # Start dev server
pnpm run dev:cf           # Cloudflare Pages dev

# Building
pnpm run build            # Production build
pnpm run preview          # Preview production build

# Database
pnpm run db:push          # Push schema changes
pnpm run db:generate      # Generate migration
pnpm run db:studio        # Open Drizzle Studio
pnpm run db:seed          # Seed database

# Code Quality
pnpm run check            # TypeScript check
pnpm run lint             # ESLint + Prettier
pnpm run format           # Auto-format code

# Testing
pnpm run test             # E2E tests (Playwright)

# Deployment
pnpm run deploy           # Deploy to production
pnpm run deploy:cf        # Deploy to Cloudflare Pages
```

### Development Guidelines

1. **Component Creation:**
   - Place reusable components in `src/lib/components/`
   - Place section components in `src/lib/sections/`
   - Use TypeScript interfaces for props
   - Follow Svelte 5 Runes pattern (`$props()`)

2. **Styling:**
   - Use Tailwind CSS utilities
   - Follow design system from `DESIGN_REFERENCE.md`
   - Use design tokens from `src/lib/config/design.ts`
   - Mobile-first responsive design (breakpoint: 768px)

3. **Database Changes:**
   - Update schema in `src/lib/server/db/schema.ts`
   - Run `pnpm run db:push` to apply changes
   - Never commit sensitive data

4. **Routing:**
   - Use route groups for separation of concerns
   - Protect routes with `+layout.server.ts`
   - Load data in `+page.server.ts` or `+layout.server.ts`

---

## ✨ Key Features

### Implemented Features

✅ **Authentication System**

- Login/Register dengan Lucia v3
- Session management
- Password hashing (Argon2id)

✅ **i18n Support**

- Paraglide (inlang) integration
- Indonesian, English, Japanese

✅ **Dashboard System**

- Role-based dashboards (Learner, Mentor, Admin, Business)
- Role switcher untuk testing
- Analytics overview

✅ **UI Components**

- Design system dengan OKLCH colors
- Theme toggle (light/dark/system)
- Command palette
- Toast notifications
- Responsive layouts

✅ **Database Schema**

- Complete schema untuk courses, enrollments, quizzes, etc.
- Progress tracking
- Payment proofs
- Certificates

### In Progress / Planned

🚧 **Course Management**

- Course creation & editing
- Module/Lesson structure
- Material upload

🚧 **Learning System**

- Video player integration
- Quiz system
- Assignment submission
- Progress tracking

🚧 **Payment Integration**

- Midtrans integration
- Payment verification
- Coupon system

---

## 📚 Resources & Dokumentasi

### Essential Documentation

1. **`docs/README.md`** - Index dokumentasi
2. **`docs/WORKFLOW.md`** - Workflow pengembangan lengkap
3. **`docs/AI_CODING_GUIDE.md`** - Panduan bekerja dengan AI assistant
4. **`docs/DESIGN_REFERENCE.md`** - Design system & color palette
5. **`docs/API.md`** - API endpoints documentation
6. **`docs/SECURITY.md`** - Security guidelines

### Component Documentation

- **`src/lib/README.md`** - Component structure & usage

### Project Context

- **`docs/PROJECT_VISION.md`** - Visi & goals project
- **`docs/ROADMAP.md`** - Roadmap pengembangan
- **`docs/PROGRESS.md`** - Status pengembangan saat ini

### Technical Reference

- **SvelteKit Docs**: https://kit.svelte.dev/
- **Svelte 5 Runes**: https://svelte.dev/docs/svelte/runes
- **Drizzle ORM**: https://orm.drizzle.team/
- **Lucia Auth**: https://lucia-auth.com/
- **Tailwind CSS 4**: https://tailwindcss.com/

---

## 🚀 Quick Start Checklist

Untuk developer baru yang ingin mulai berkontribusi:

- [ ] Clone repository
- [ ] Install dependencies (`pnpm install`)
- [ ] Setup environment variables (.env)
- [ ] Setup database (`pnpm run db:push && pnpm run db:seed`)
- [ ] Baca `docs/WORKFLOW.md` untuk workflow pengembangan
- [ ] Baca `docs/AI_CODING_GUIDE.md` untuk panduan AI assistant
- [ ] Baca `src/lib/README.md` untuk component structure
- [ ] Explore `src/routes/` untuk memahami routing
- [ ] Explore `src/lib/components/` untuk memahami component architecture
- [ ] Run dev server (`pnpm run dev`) dan explore aplikasi

---

## 💡 Tips & Best Practices

1. **Gunakan Design Tokens**: Selalu gunakan tokens dari `src/lib/config/design.ts` untuk consistency
2. **Type Safety**: Manfaatkan TypeScript dengan interfaces untuk props
3. **Component Reusability**: Extract reusable logic ke components
4. **Responsive Design**: Selalu test di mobile (breakpoint 768px)
5. **Accessibility**: Gunakan semantic HTML dan ARIA labels
6. **Performance**: Lazy load sections & optimize images
7. **Code Quality**: Run `pnpm run lint` sebelum commit

---

**Last Updated**: 2025-01-23  
**Maintained By**: Koneksi Development Team

Jika ada pertanyaan atau butuh bantuan, silakan lihat dokumentasi terkait atau tanyakan ke tim development.
