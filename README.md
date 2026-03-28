<p align="center">
  <img src="static/images/nk-new-logo.png" alt="Naik Kelas" width="80" />
</p>

<h1 align="center">Naik Kelas 2.0</h1>

<p align="center">
  <strong>Enterprise-grade Learning Management System for the Indonesian digital workforce</strong>
</p>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#features">Features</a> •
  <a href="#database">Database</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Overview

**Naik Kelas** (literally "Level Up") is a cohort-based LMS built for **Koneksi**, an Indonesian education company focused on outcome-driven learning. The platform enables mentors to deliver track-based curricula (Creator, Seller, Affiliator) and measure real-world economic productivity through action-based assessments.

### Key Differentiators

- **Multi-tenant architecture** — Organizations, workspaces, and plugin-based feature toggles
- **Cohort engine** — Batch-based enrollment with track specialization
- **Action-based learning** — Students submit real economic outputs (content links, sales data) instead of quizzes
- **RBAC** — Role-based access control powering distinct dashboards for Learner, Mentor, Admin, and Facilitator personas
- **Premium SaaS UI** — Glassmorphic design system with spring physics transitions, inspired by Linear and Vercel

---

## Tech Stack

| Layer         | Technology                                                                 |
|---------------|---------------------------------------------------------------------------|
| **Framework** | [SvelteKit 2](https://svelte.dev) + [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes) |
| **Styling**   | [Tailwind CSS 4](https://tailwindcss.com) + Custom design tokens (`src/lib/config/design.ts`) |
| **Database**  | [Turso](https://turso.tech) (LibSQL) via [Drizzle ORM](https://orm.drizzle.team) |
| **Auth**      | [Lucia v3](https://lucia-auth.com) (session-based, cookie auth)           |
| **i18n**      | [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (ID, EN, JP) |
| **Payments**  | [Midtrans Snap](https://midtrans.com) + manual transfer verification      |
| **Content**   | Markdown via [mdsvex](https://mdsvex.pngwn.io)                           |
| **Adapter**   | `@sveltejs/adapter-node` (production), local SQLite (development)         |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9

### Installation

```bash
# Clone and install
git clone <repo-url>
cd naikkelas.id
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your Turso credentials (or use local SQLite)

# Push database schema
pnpm run db:push

# Seed initial data (optional)
pnpm run db:seed

# Start development server
pnpm run dev
```

### Common Commands

| Command               | Description                                    |
|-----------------------|------------------------------------------------|
| `pnpm run dev`        | Start dev server at `localhost:5173`            |
| `pnpm run build`      | Production build via `adapter-node`             |
| `pnpm run check`      | Type-check with `svelte-check`                 |
| `pnpm run lint`       | Lint with Prettier + ESLint                    |
| `pnpm run db:push`    | Push schema changes to database                |
| `pnpm run db:studio`  | Open Drizzle Studio GUI                        |
| `pnpm run db:seed`    | Seed development data                          |
| `pnpm run test:e2e`   | Run Playwright end-to-end tests                |
| `pnpm run deploy`     | Safe deploy script with pre-flight checks      |

---

## Project Structure

```
naikkelas.id/
├── docs/                    # 38+ documentation files (roadmap, API, design, etc.)
├── drizzle/                 # Generated migrations
├── scripts/                 # Deployment & seeding scripts
│   └── seed/                # Modular domain-based seed files
├── src/
│   ├── app.css              # Global styles & Tailwind config
│   ├── app.html             # HTML shell with inline theme script
│   ├── hooks.server.ts      # Auth middleware (Lucia session validation)
│   ├── lib/
│   │   ├── components/      # 50+ Svelte components
│   │   │   ├── layouts/     # AppShell, Sidebar, DashboardHeader, Breadcrumb
│   │   │   ├── app/         # Role dashboards, overview graphs
│   │   │   ├── ui/          # Skeleton, reusable primitives
│   │   │   └── admin/       # Admin-specific components
│   │   ├── config/          # Design tokens, content config
│   │   ├── server/          # Server-side logic
│   │   │   ├── db/          # Drizzle schema (44 tables), relations
│   │   │   ├── auth.ts      # Lucia auth setup
│   │   │   ├── rbac.ts      # Role-based navigation & permissions
│   │   │   ├── payments/    # Payment processing logic
│   │   │   └── email.ts     # Email templates & delivery
│   │   ├── stores/          # Svelte stores (theme, toast, page metadata)
│   │   ├── plugins/         # Feature toggle plugin system
│   │   └── utils/           # Formatting, SEO, analytics, lazy loading
│   ├── routes/
│   │   ├── (auth)/          # Login, registration, waiting list
│   │   ├── (dashboard)/     # Protected dashboard (app/*)
│   │   │   └── app/
│   │   │       ├── admin/   # Admin panel (users, courses, coupons, reports)
│   │   │       ├── mentor/  # Mentor tools (grading, submissions, broadcast)
│   │   │       ├── courses/ # Course catalog & learning interface
│   │   │       └── ...      # 16 route groups total
│   │   ├── (public)/        # Landing pages, marketplace, docs
│   │   ├── api/             # REST endpoints (payments, webhooks, notes)
│   │   └── org/             # Organization public pages
│   └── types/               # Shared TypeScript types
├── static/                  # Static assets (images, fonts, favicons)
└── e2e/ & tests/            # Playwright test suites
```

---

## Features

### 🎓 Learning Management
- Course creation with modular curriculum (modules → lessons → materials)
- Video, PDF, document, and Markdown content support
- Quiz system with multiple-choice grading
- Drip content scheduling
- Real-time progress tracking per student

### 👥 Multi-Tenancy
- Organization system with member roles
- Workspace switching (personal / organization)
- Plugin-based feature toggles per workspace
- Organization invitation system

### 💰 Payments & Commerce
- Midtrans Snap integration for automated checkout
- Manual bank transfer with proof upload
- Coupon system (percentage/fixed, usage limits, expiry)
- Affiliate tracking with commission calculation
- Partner (school) enrollment with special pricing

### 📊 Dashboards
- **Learner**: Progress visualization, streak tracking, course continuation
- **Mentor**: Student management, submission grading, broadcast messaging
- **Admin**: User management, financial reports, coupon management, cohort oversight
- **Facilitator**: Cohort monitoring and student support

### 🎨 Premium UI/UX
- Custom design system with centralized tokens (`design.ts`)
- Glassmorphic header with `backdrop-blur-xl`
- Spring-physics page transitions (`fly` + `fade`)
- Bento grid dashboard with hover glow effects
- Command palette (`Ctrl+K`) for power-user navigation
- Full dark mode support
- Skeleton loading states

---

## Database

44 tables managed by Drizzle ORM on Turso (LibSQL):

**Core**: `user`, `session`, `course`, `enrollment`, `cohort`  
**Content**: `module`, `lesson`, `material`, `quiz`, `quizQuestion`, `quizChoice`  
**Progress**: `lessonProgress`, `lessonNote`, `submission`, `submissionGrade`, `checkpoint`, `checkpointSubmission`  
**Commerce**: `transaction`, `paymentProof`, `coupon`, `couponUsage`, `affiliateSale`, `affiliateLink`  
**Social**: `discussion`, `courseReview`, `notification`, `broadcastMessage`  
**Gamification**: `certificate`, `badge`, `userBadge`, `userXP`  
**Multi-tenant**: `organization`, `organizationMember`, `organizationInvitation`, `workspace`, `workspaceMember`  
**System**: `pluginRegistry`, `coursePlugin`, `partner`, `mentorApplication`, `waitingList`, `emailLog`, `whatsappLog`

---

## Deployment

The application is deployed as a Node.js server using `@sveltejs/adapter-node`:

```bash
pnpm run deploy          # Safe deploy with pre-flight checks
pnpm run build           # Manual build
pnpm run preview         # Preview production build locally
```

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed deployment instructions.

---

## Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|----------|-------------|
| [`ROADMAP.md`](docs/ROADMAP.md) | Development roadmap & business vision 2030-2035 |
| [`DESIGN_REFERENCE.md`](docs/DESIGN_REFERENCE.md) | Visual design system reference |
| [`DASHBOARD_RBAC_STRUCTURE.md`](docs/DASHBOARD_RBAC_STRUCTURE.md) | Role-based access control architecture |
| [`API.md`](docs/API.md) | API endpoint documentation |
| [`DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deployment guide |
| [`SECURITY.md`](docs/SECURITY.md) | Security practices |
| [`CONTRIBUTING.md`](docs/CONTRIBUTING.md) | Contribution guidelines |
| [`WORKFLOW.md`](docs/WORKFLOW.md) | Development workflow |
| [`AI_CODING_GUIDE.md`](docs/AI_CODING_GUIDE.md) | AI-assisted coding conventions |

---

## License

Private — © Koneksi. All rights reserved.
