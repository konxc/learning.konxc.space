# Development Workflow & Best Practices

Dokumentasi ini menjelaskan workflow pengembangan untuk platform **"Naik Kelas by Koneksi"**, termasuk cara bekerja dengan AI coding assistant dan kolaborasi tim.

**Last Updated**: 2025-10-26

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Workflow](#development-workflow)
3. [Working with AI Coding Assistant](#working-with-ai-coding-assistant)
4. [Code Review & Evaluation](#code-review--evaluation)
5. [Bug Fixing Process](#bug-fixing-process)
6. [Feature Proposal Process](#feature-proposal-process)
7. [Testing & Deployment](#testing--deployment)
8. [Team Collaboration](#team-collaboration)

---

## Quick Start

### Before Starting Development

```bash
# 1. Checkout branch baru untuk feature
git checkout -b feature/nama-feature

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm run dev

# 4. Lihat aplikasi di browser
# http://localhost:5173
```

---

## Development Workflow

### 1. Planning Phase

**Do:**

- [ ] Baca dokumentasi yang relevan (`docs/ROADMAP.md`, `docs/PROGRESS.md`)
- [ ] Diskusikan dengan tim di channel atau meeting
- [ ] Buat issue di GitHub (jika ada)
- [ ] Update TODO list dengan task baru

**Example:**

```
Task: Membuat fitur user profile page
Status: pending → in_progress
```

### 2. Development Phase

**Do:**

- [ ] Buat branch baru dari `main`: `git checkout -b feature/user-profile`
- [ ] Kerjakan task sesuai spesifikasi
- [ ] Test di development environment
- [ ] Update dokumentasi jika perlu
- [ ] Commit dengan message yang jelas

**Commit Message Format:**

```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve timeline positioning issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: extract TimelineItem component"
```

### 3. Evaluation Phase

**Do:**

- [ ] Self-review kode Anda sendiri
- [ ] Pastikan tidak ada linting errors: `pnpm run lint`
- [ ] Test semua fitur yang dibuat
- [ ] Verifikasi responsive design
- [ ] Cek konsistensi dengan design system

**Checklist:**

- [ ] Kode mengikuti pattern yang sudah ada
- [ ] Tidak ada console.log yang terlewat
- [ ] TypeScript types sudah benar
- [ ] Aksesibilitas sudah proper (ARIA labels, semantic HTML)
- [ ] Performance sudah optimal

### 4. Perbaikan Phase

Jika ada bug atau issue:

**Do:**

1. **Reproduksi bug** di development environment
2. **Identifikasi root cause** dengan debugging
3. **Fix** dengan solusi yang tepat
4. **Test** fix tersebut
5. **Document** perubahan jika perlu

**Example Bug Fix Process:**

```
Bug: Timeline item tidak muncul di mobile view

1. Reproduce:
   - Buka http://localhost:5173
   - Check mobile view (width < 768px)
   - Scroll ke timeline section

2. Root Cause:
   - .timeline-content width calculation salah untuk mobile

3. Fix:
   - Update CSS responsive breakpoint

4. Test:
   - Check di berbagai device sizes
   - Verify tidak ada regressions

5. Document:
   - Commit dengan message: "fix: timeline mobile responsive"
```

### 5. Review & Merge Phase

**Do:**

- [ ] Update TODO list: task selesai
- [ ] Push branch: `git push origin feature/nama-feature`
- [ ] Buat Pull Request di GitHub
- [ ] Tunggu review dari tim
- [ ] Address review comments jika ada
- [ ] Merge ke `main` setelah approved

---

## Working with AI Coding Assistant

### Effective Prompt Engineering

Berikut contoh prompt yang efektif untuk bekerja dengan AI coding assistant:

#### 1. Prompt untuk Feature Development

```
Saya ingin membuat fitur user profile page dengan:
- Form untuk update profile (nama, email, avatar)
- Section untuk display user stats
- Integrasi dengan API endpoint /api/users/profile
- Responsive design
- Menggunakan komponen yang sudah ada di src/lib/components/

Silakan buat implementasi lengkap dengan:
1. Page component di src/routes/profile/+page.svelte
2. Form component di src/lib/components/ProfileForm.svelte
3. Server API route di src/routes/api/users/profile/+server.ts
```

#### 2. Prompt untuk Bug Fix

```
Ada bug di timeline component: timeline items tidak positioning dengan benar
di viewport mobile.

Root cause kemungkinan CSS positioning issue. Data structure sudah benar:
- timelineItems dengan subtitle dan description
- TimelineItem.svelte sudah menggunakan nth-child untuk positioning

Silakan:
1. Cek CSS di TimelineItem.svelte
2. Perbaiki responsive breakpoint
3. Pastikan konsisten dengan /prototype/v1
```

#### 3. Prompt untuk Refactoring

```
Tolong refactor komponen AboutSection untuk menggunakan data-driven approach:

Saat ini: hard-coded feature cards dengan HTML static
Target: dynamic feature cards dengan data structure seperti berikut:

const features = [
  { icon: '🎯', title: '...', description: '...' },
  // ... dst
];

Pastikan:
- Props interface dengan TypeScript
- Reusable FeatureCard component
- Styling tetap konsisten
```

#### 4. Prompt untuk Code Review

```
Tolong review kode saya di src/lib/components/RegistrationForm.svelte:

Concerns:
1. Apakah error handling sudah cukup?
2. Apakah TypeScript types sudah proper?
3. Apakah aksesibilitas sudah baik?
4. Apakah ada security issues?

Berikan feedback dan suggestion perbaikan jika ada.
```

#### 5. Prompt untuk Documentation

```
Saya baru selesai membuat komponen BenefitCard yang reusable.

Tolong buat dokumentasi yang mencakup:
1. Purpose & Usage
2. Props interface
3. Example implementation
4. Styling guidelines
5. Best practices

Simpan di docs/components/BenefitCard.md
```

### Workflow dengan AI Assistant

**Step-by-step:**

1. **Context Setting**

   ```
   Kita sedang mengembangkan landing page untuk learning platform.
   Struktur: modular components di lib/sections/ dan lib/components/
   Tech stack: SvelteKit 5, TypeScript, Tailwind CSS 4
   ```

2. **Define Task**

   ```
   Task: Membuat BenefitsSection component
   Requirements:
   - Display grid of benefit cards
   - Data-driven (array of benefits)
   - Gradient background #667eea to #764ba2
   - Glassmorphism effect pada cards
   ```

3. **Get Implementation**

   ```
   AI will generate: Complete component code
   ```

4. **Review & Refine**

   ```
   Tolong review implementasi ini dan perbaiki:
   - [Issue 1]: Styling tidak konsisten
   - [Issue 2]: Missing TypeScript interface
   ```

5. **Test & Iterate**

   ```
   Saya sudah test di browser, ada issue:
   - Cards terlalu rapat di mobile
   - Gradient tidak smooth

   Tolong perbaiki responsive design dan gradient.
   ```

---

## Code Review & Evaluation

### Self-Review Checklist

Sebelum commit, pastikan:

#### Code Quality

- [ ] Kode mengikuti style guide project
- [ ] Tidak ada dead code atau commented-out code
- [ ] Variable names descriptive dan meaningful
- [ ] Functions single responsibility
- [ ] No magic numbers (gunakan constants)

#### TypeScript

- [ ] Semua props memiliki interface/type
- [ ] Tidak ada `any` type (kecuali memang diperlukan)
- [ ] Types exported dengan benar
- [ ] No TypeScript errors: `pnpm run build`

#### Security

- [ ] Tidak ada hardcoded secrets
- [ ] User input di-sanitize jika perlu
- [ ] Tidak ada XSS vulnerabilities
- [ ] API calls dengan proper error handling

#### Performance

- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] Bundle size reasonable
- [ ] Lazy loading untuk heavy components

#### Testing

```bash
# Run linter
pnpm run lint

# Check types
pnpm run check

# Build untuk production
pnpm run build

# Test di berbagai browsers
```

---

## Bug Fixing Process

### 1. Bug Report Template

```markdown
## Bug Report

**Date**: 2025-10-26
**Reporter**: [Your Name]
**Priority**: [Low/Medium/High/Critical]

### Description

[Clear description of the bug]

### Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior

[What should happen]

### Actual Behavior

[What actually happens]

### Environment

- Browser: [Chrome 118 / Firefox 119 / etc]
- OS: [Windows / macOS / Linux]
- Screen size: [Desktop / Tablet / Mobile]

### Screenshots

[If applicable]

### Additional Context

[Any other relevant information]
```

### 2. Bug Fix Workflow

```
1. Identify
   ↓
2. Reproduce (create minimal test case)
   ↓
3. Root Cause Analysis
   ↓
4. Design Solution
   ↓
5. Implement Fix
   ↓
6. Test Fix (multiple scenarios)
   ↓
7. Review (self + peer)
   ↓
8. Deploy & Monitor
```

### 3. Common Issues & Solutions

**Issue: CSS tidak apply di komponen**

**Solution:**

```svelte
<!-- ❌ Salah -->
<div class="my-component">

<style>
  /* Styles di global scope */
</style>

<!-- ✅ Benar -->
<div class="my-component">

<style>
  /* Styles scoped secara otomatis oleh Svelte */
  .my-component { ... }
</style>
```

**Issue: Props tidak reactive**

**Solution:**

```svelte
<!-- ❌ Salah (Svelte 5) -->
<script>
  let props = $props();
  let { name } = props;
</script>

<!-- ✅ Benar (Svelte 5) -->
<script>
  let { name } = $props();
</script>
```

---

## Feature Proposal Process

### 1. Feature Proposal Template

```markdown
## Feature Proposal: [Feature Name]

**Date**: 2025-10-26
**Proposed by**: [Your Name]
**Status**: [Proposal / In Discussion / Approved / Rejected]

### Problem Statement

[What problem does this solve?]

### Proposed Solution

[Detailed description of the solution]

### Technical Approach

- Components needed: [...]
- Database changes: [...]
- API endpoints: [...]
- UI/UX changes: [...]

### Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Estimated Effort

- Development: [X hours]
- Testing: [X hours]
- Documentation: [X hours]
- Total: [X hours]

### Dependencies

[List of features/issues this depends on]

### Risks & Mitigation

[List potential risks and how to mitigate]

### Alternatives Considered

[List other approaches and why they were rejected]
```

### 2. Feature Development Workflow

```
1. Proposal
   ↓
2. Discussion (team review)
   ↓
3. Approval/Rejection
   ↓
4. Task Breakdown (if approved)
   ↓
5. Development
   ↓
6. Testing
   ↓
7. Documentation
   ↓
8. Deployment
```

### 3. Feature Addition Best Practices

**Do:**

- ✅ Discuss dengan tim sebelum implement
- ✅ Update ROADMAP.md jika fitur besar
- ✅ Update API.md jika ada perubahan API
- ✅ Update PROGRESS.md setelah selesai
- ✅ Test thoroughly
- ✅ Document usage

**Don't:**

- ❌ Implement fitur besar tanpa discussion
- ❌ Skip testing
- ❌ Forget documentation
- ❌ Break existing functionality

**Example Feature Addition:**

```
Feature: User Profile Page

1. Create branch: feature/user-profile
2. Implement components:
   - src/routes/profile/+page.svelte
   - src/lib/components/ProfileForm.svelte
   - src/lib/server/api/profile/+server.ts
3. Update documentation:
   - docs/API.md (add profile endpoint)
   - docs/PROGRESS.md (add completed task)
4. Create PR and get review
5. Merge to main
```

---

## Testing & Deployment

### Local Testing

```bash
# Run linter
pnpm run lint

# Type checking
pnpm run check

# Build test
pnpm run build

# Preview production build
pnpm run preview
```

### Manual Testing Checklist

- [ ] Test di Chrome, Firefox, Safari
- [ ] Test responsive di berbagai screen sizes
- [ ] Test di mobile devices (actual atau simulator)
- [ ] Test keyboard navigation
- [ ] Test dengan screen reader
- [ ] Test semua form submissions
- [ ] Test error states
- [ ] Test loading states

### Deployment

```bash
# Deploy ke GitHub Pages
git push origin main

# GitHub Actions akan:
# 1. Build project
# 2. Deploy ke gh-pages branch
# 3. Publish di https://[username].github.io/[repo]
```

---

## Team Collaboration

### Daily Standup Template

```
What I did yesterday:
- [Task 1]
- [Task 2]

What I'm working on today:
- [Task 1]
- [Task 2]

Blockers:
- [Issue 1]
- [Issue 2]

Help needed:
- [Request 1]
```

### Code Review Guidelines

**As Reviewer:**

- ✅ Be constructive and specific
- ✅ Suggest improvements, don't just complain
- ✅ Approve when ready, don't over-review
- ✅ Test the code if possible

**As Author:**

- ✅ Respond to all comments
- ✅ Don't take criticism personally
- ✅ Ask questions if unclear
- ✅ Thank reviewers

### Communication Channels

```
# Pilih channel yang tepat:

General discussion       → #general
Technical questions      → #tech-help
Code review requests     → #code-review
Bug reports              → #bugs
Feature discussions      → #features
Deployment notifications → #deployments
```

---

## Resources

### Documentation

- `docs/ROADMAP.md` - Project roadmap
- `docs/PROGRESS.md` - Current progress
- `docs/API.md` - API documentation
- `docs/CONTRIBUTING.md` - Contribution guidelines
- `docs/SECURITY.md` - Security best practices

### External Resources

- [Svelte Documentation](https://svelte.dev/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

---

**Remember**:

- Keep code clean and readable
- Write self-documenting code
- Document complex logic
- Communicate with team
- Test thoroughly
- Enjoy coding! 🚀

**Last Updated**: 2025-10-26
