# Toaster Implementation Review & Refactor Plan

## 1. Current State Analysis

### 1.1 Core Components

- **`src/lib/stores/toastStore.ts`**: Svelte 5 store implementing `ToastType` ('success', 'error', 'info') with push/dismiss logic.
- **`src/lib/components/Toaster.svelte`**: Component consuming the store, rendering fixed-position notifications with design tokens.
- **`src/lib/utils/withToast.ts`**: Wrapper utility for async actions showing loading/success/error states.

### 1.2 Usage Patterns (Dashboard)

- **Manual Fetch Handling**: `src/routes/(dashboard)/app/admin/coupons/+page.svelte` uses duplicated `try/catch` blocks with manual `toast.success`/`toast.error` calls.
- **Form Actions**: `use:enhance` callbacks in various `+page.svelte` files handle toast notifications.
- **Direct Store Usage**: `toast.success()`, `toast.error()`, `toast.info()` called directly in event handlers.

### 1.3 Identified Issues

1.  **Code Duplication**: `admin/coupons/+page.svelte` contains identical `try/catch` logic in 3+ functions.
2.  **Missing `warning` Type**: Cannot show validation warnings (e.g., "Link harus Google Drive/Docs").
3.  **Inconsistent Messages**: Mixed Indonesian/English strings ("Profil berhasil diperbarui!" vs "Code copied to clipboard").
4.  **Unused Utility**: `withToast.ts` is defined but not used in `admin/coupons/+page.svelte`.

## 2. Refactoring Tasks

### 2.1 Add Warning Toast Type

**File**: `src/lib/stores/toastStore.ts`

- [ ] Add `'warning'` to `ToastType` union.
- [ ] Add `toast.warning(text: string, id?: string)` method.
- [ ] Update timeout logic if needed (keep default 3500ms).

### 2.2 Update Toaster Component

**File**: `src/lib/components/Toaster.svelte`

- [ ] Add CSS styling for `warning` type (yellow/amber theme, dark mode compatible).
- [ ] Add iconography or visual distinction for warnings.
- [ ] Ensure accessibility (aria-live, roles) is consistent.

### 2.3 Refactor `admin/coupons/+page.svelte`

**File**: `src/routes/(dashboard)/app/admin/coupons/+page.svelte`

- [ ] Import `withToast` from `$lib/utils/withToast`.
- [ ] Refactor `copyCode`:
  - Wrap logic in `withToast`.
  - Remove manual `try/catch` and `toast.success`/`toast.error`.
- [ ] Refactor `duplicateCoupon`:
  - Wrap fetch logic in `withToast`.
  - Standardize message to Indonesian.
- [ ] Refactor `toggleStatus`:
  - Wrap fetch logic in `withToast`.
  - Standardize message to Indonesian.

### 2.4 Standardize Toast Messages

- [ ] Review all `toast.*` calls in dashboard pages.
- [ ] Standardize to Indonesian (or project convention).
- [ ] Ensure consistent formatting (sentence case, punctuation).

### 2.5 Audit `withToast` Usage

- [ ] Scan for other pages using manual `try/catch` + `toast` patterns.
- [ ] Identify candidates for `withToast` adoption (e.g., `src/routes/(dashboard)/app/explore/[id]/+page.svelte`).

## 3. Implementation Order

1.  `src/lib/stores/toastStore.ts` (Add warning type)
2.  `src/lib/components/Toaster.svelte` (Add warning styling)
3.  `src/routes/(dashboard)/app/admin/coupons/+page.svelte` (Refactor to `withToast`)
4.  Message standardization pass

## 4. Testing Checklist

- [ ] Warning toasts render correctly (color, icon).
- [ ] `copyCode`, `duplicateCoupon`, `toggleStatus` show loading/success/error states.
- [ ] No console errors in browser.
- [ ] Dark mode styling is correct for all toast types.
- [ ] `pnpm run check` passes (type safety).
