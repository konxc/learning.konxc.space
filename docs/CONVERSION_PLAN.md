# 📋 Rencana Konversi CSS ke Tailwind CSS 4

## 🎯 Tujuan Konversi

Mengganti semua CSS custom dengan Tailwind CSS 4 utilities untuk:

- **Konsistensi**: Semua menggunakan design tokens yang sama
- **Maintainability**: Lebih mudah di-maintain, kurang CSS custom
- **Bundle Size**: Tailwind melakukan purging otomatis, bundle lebih kecil
- **Dark Mode**: Otomatis dengan `dark:` prefix
- **Responsive**: Lebih mudah dengan breakpoints (`md:`, `lg:`)

## 📊 Daftar Halaman yang Perlu Dikonversi

### 🔴 PRIORITAS TINGGI (25+ CSS Rules)

#### 1. `mentor/courses/[id]/submissions/+page.svelte` (~42 rules)

**Yang akan dikonversi:**

- Layout: `.submissions-page`, `.page-header`, `.back-link`
- Filters: `.filters`, `.filter-btn` (active states)
- Table: `.submissions-table`, `thead`, `th`, `td`, `.student-cell`
- Badges: `.type-badge`, `.status-badge` (pending, graded variants)
- Buttons: `.action-btn` (gradient, view variant, hover effects)
- Modal: `.modal-overlay`, `.modal`, `.modal-close`, `.modal-content`
- Form elements: `.form-field`, `.form-field label`, input/textarea
- Empty states: `.empty-state`
- Responsive: Media queries untuk mobile

**Dikonversi menjadi:**

- Layout → Tailwind `grid`, `flex`, `gap-*`
- Filters → Tailwind `border`, `rounded-*`, `hover:`, active states
- Table → Tailwind table utilities + design tokens
- Badges → Design tokens (`COLOR.successBg`, `COLOR.warningBg`)
- Buttons → Design tokens + Tailwind hover/focus states
- Modal → Tailwind `fixed`, `inset-0`, `z-50`, `backdrop-blur-sm`
- Form → Design tokens (`RADIUS.input`, `SPACING.input`)
- Empty states → Tailwind `text-center`, `py-*`
- Responsive → Tailwind breakpoints (`md:`, `lg:`)

#### 2. `my-mentor-application/+page.svelte` (~36 rules)

**Yang akan dikonversi:**

- Status cards: `.status-card`, `.status-badge` (pending, approved, rejected)
- Form: Input fields, textarea, form layout
- Buttons: Submit, cancel buttons dengan gradient
- Admin notes section
- Back button
- Responsive grid

#### 3. `courses/[courseId]/learn/+page.svelte` (~34 rules)

**Yang akan dikonversi:**

- Two-column layout: `.learn-container` (sidebar + content)
- Sidebar: `.learn-sidebar`, sticky positioning
- Module/lesson list: Accordion-style navigation
- Material viewer: Content area, navigation buttons
- Complete section: Certificate button
- Responsive: Mobile layout

#### 4. `admin/mentor-applications/review/[id]/+page.svelte` (~41 rules)

**Yang akan dikonversi:**

- Application review form
- Status badges dan buttons
- Modal untuk approval/rejection
- Form fields dan validation styles
- Responsive layout

#### 5. `courses/[courseId]/learn/quiz/[quizId]/+page.svelte` (~28 rules)

**Yang akan dikonversi:**

- Quiz interface layout
- Question/answer styling
- Progress indicators
- Submit button
- Result display

#### 6. `apply-mentor/+page.svelte` (~27 rules)

**Yang akan dikonversi:**

- Application form layout
- Form fields (input, textarea, select)
- Submit button dengan gradient
- Cancel button
- Responsive grid

#### 7. `certificates/[id]/+page.svelte` (~27 rules)

**Yang akan dikonversi:**

- Certificate display layout
- Download button
- Certificate styling
- Responsive layout

### 🟡 PRIORITAS SEDANG (15-25 CSS Rules)

#### 8. `mentor/courses/[id]/materials/quiz/+page.svelte` (~31 rules)

#### 9. `mentor/courses/[id]/materials/+page.svelte` (~23 rules)

#### 10. `admin/coupons/edit/[id]/+page.svelte` (~23 rules)

#### 11. `admin/coupons/create/+page.svelte` (~23 rules)

#### 12. `admin/courses/edit/[id]/+page.svelte` (~16 rules)

#### 13. `admin/courses/create/+page.svelte` (~16 rules)

#### 14. `courses/+page.svelte` (~16 rules) - **Sebagian sudah dikonversi**

### 🟢 PRIORITAS RENDAH (<15 CSS Rules)

Halaman-halaman dengan CSS minimal, kebanyakan hanya:

- Text decoration untuk links
- Cursor pointer
- Media queries sederhana

## 🔧 Proses Konversi (Untuk Setiap Halaman)

### Step 1: Identifikasi CSS Rules

- Baca semua CSS rules di `<style>` tag
- Kategorikan: Layout, Typography, Colors, Spacing, Effects, Responsive

### Step 2: Mapping ke Tailwind

- **Layout**: `flex`, `grid`, `flex-col`, `flex-row`, `gap-*`
- **Spacing**: `p-*`, `px-*`, `py-*`, `m-*`, `mb-*`, `mt-*`
- **Colors**: Design tokens (`COLOR.card`, `COLOR.textPrimary`, dll)
- **Typography**: Design tokens (`TEXT.h1`, `TEXT.body`, dll)
- **Radius**: Design tokens (`RADIUS.card`, `RADIUS.button`)
- **Shadows**: Design tokens (`ELEVATION.base`, `ELEVATION.card`)
- **Transitions**: Design tokens (`TRANSITION.colors`, `TRANSITION.all`)
- **Dark Mode**: Tambahkan `dark:*` variants
- **Responsive**: Ganti media queries dengan `md:`, `lg:` breakpoints

### Step 3: Update HTML/Component

- Ganti class names dengan Tailwind utilities
- Tambahkan design tokens dari `$lib/config/design`
- Pastikan menggunakan `PageWrapper`, `PageHeader`, `PageSection` jika belum

### Step 4: Cleanup

- Hapus `<style>` tag yang tidak diperlukan lagi
- Hanya simpan CSS untuk:
  - Injected HTML strings (seperti di Table component)
  - Pseudo-elements yang tidak bisa dengan Tailwind
  - Animations kompleks (jika ada)

### Step 5: Testing

- Verifikasi visual tidak berubah
- Test responsive di mobile/tablet
- Test dark mode
- Test focus states (accessibility)

## 📦 Design Tokens yang Sudah Tersedia

Dari `src/lib/config/design.ts`:

- **COLOR**: `card`, `cardBorder`, `textPrimary`, `textSecondary`, `textMuted`, `accent`, `accentBg`, `success`, `successBg`, `warning`, `warningBg`, `error`, `errorBg`, `info`, `infoBg`
- **RADIUS**: `card`, `button`, `input`, `badge`, `small`
- **SPACING**: `page`, `section`, `cardPadding`, `button`, `input`, `tight`, `relaxed`
- **TEXT**: `h1`, `h2`, `h3`, `h4`, `secondary`, `muted`, `button`, `body`, `small`
- **ELEVATION**: `base`, `hover`, `transition`, `card`, `cardHover`
- **TRANSITION**: `colors`, `all`, `shadow`, `transform`

## ✅ Hasil yang Diharapkan

Setelah konversi:

- ✅ **0-5 baris CSS** tersisa per halaman (hanya untuk edge cases)
- ✅ **100% Tailwind utilities** + design tokens
- ✅ **Konsisten** dengan halaman lain
- ✅ **Dark mode** otomatis
- ✅ **Responsive** dengan breakpoints
- ✅ **Accessible** dengan focus states
- ✅ **Maintainable** dengan design tokens

## 📈 Progress Tracking

### ✅ Sudah Dikonversi

1. ✅ `admin/coupons/+page.svelte` (~150 lines removed)
2. ✅ `crm/waiting-list/+page.svelte` (~200 lines removed)

### 🔄 Sedang Dikerjakan (Plan Mode)

- Akan dikonversi satu per satu dengan approval

### ⏳ Belum Dikerjakan

- 24 halaman lainnya (lihat daftar di atas)

---

## 🎯 Execution Plan (Plan Mode)

Kita akan menggunakan **Plan Mode** untuk eksekusi bertahap:

1. ✅ Buat todo list terstruktur (12 tasks utama)
2. ⏳ Eksekusi satu task per approval
3. ✅ Verifikasi setiap konversi
4. ⏳ Update progress tracking

**Keuntungan Plan Mode:**

- ✅ Kontrol penuh atas progress
- ✅ Review setiap perubahan sebelum lanjut
- ✅ Rollback mudah jika ada masalah
- ✅ Tracking progress jelas

---

**Total estimasi**: ~3000+ lines CSS custom akan diganti dengan Tailwind utilities
