# Toaster Implementation Review & Refactor Plan

## Current State Analysis

### Toast Store (`src/lib/stores/toastStore.ts`)

- **Current Types**: `success`, `error`, `info`
- **Missing**: `warning` type (useful for validation/UX feedback)
- **Timeout**: Fixed 3500ms, but supports override via `timeoutMs`
- **Architecture**: Simple writable store with push/dismiss/clear methods

### Toaster Component (`src/lib/components/Toaster.svelte`)

- **Position**: Fixed bottom-right (`right-4 bottom-4`)
- **Animations**: Custom CSS animation `slide-in-from-right-8`
- **Styling**: Uses design tokens (`RADIUS`, `ELEVATION`, `TEXT`)
- **Accessibility**: Basic `aria-live="polite"` support
- **Motion**: Respects `prefers-reduced-motion`

### Usage Patterns (Dashboard)

Found usage in:

1. **Forms**: Common pattern in `+page.svelte` files (e.g., settings, organizations)
2. **Async Actions**: `fetch` calls with try/catch (e.g., admin/coupons)
3. **Helper Utility**: `withToast.ts` wrapper for loading/success/error states

## Identified Issues

### 1. Missing `warning` Toast Type

- **Severity**: Low
- **Impact**: Cannot show validation warnings (e.g., "Link harus Google Drive/Docs")
- **Location**: `src/lib/stores/toastStore.ts:3`
- **Fix**: Add `'warning'` to `ToastType`

### 2. Inconsistent Toast Messages

- **Severity**: Medium
- **Impact**: Mixed languages (ID/EN) and inconsistent formatting
- **Examples**:
  - `"Profil berhasil diperbarui!"` (ID)
  - `"Code copied to clipboard"` (EN)
  - `"Failed to duplicate coupon"` (EN)
- **Fix**: Standardize language (prefer Indonesian for UI) and message formatting

### 3. Duplicate Error Handling

- **Severity**: Medium
- **Impact**: Code duplication in `admin/coupons/+page.svelte`
- **Pattern**:
  ```typescript
  try {
    // ... fetch ...
    toast.success(...);
  } catch (err) {
    console.error(...);
    toast.error(...); // Duplicated in multiple handlers
  }
  ```
- **Fix**: Extract to reusable utility or use `withToast` wrapper

### 4. No Toast Dismissal on Navigation

- **Severity**: Low
- **Impact**: Toasts persist during SPA navigation
- **Fix**: Clear toasts on `$page` store change in `AppShell.svelte`

### 5. Animation Performance

- **Severity**: Low
- **Impact**: Custom CSS animation may not be GPU-accelerated
- **Fix**: Use `transform: translateX()` (already present) + `will-change`

### 6. Accessibility Gaps

- **Severity**: Medium
- **Impact**:
  - No keyboard focus management
  - No screen reader announcements for dynamic content
  - Missing `role="alert"` for error toasts
- **Fix**:
  - Add `role="alert"` for errors
  - Use `aria-describedby` for toast content

### 7. Missing Toast ID in `withToast.ts`

- **Severity**: Low
- **Impact**: Cannot dismiss loading toast manually
- **Location**: `src/lib/utils/withToast.ts:10`
- **Fix**: Return toast ID from `toast.info()`

### 8. Hardcoded Colors in Toaster Component

- **Severity**: Low
- **Impact**: Inconsistent with design system
- **Location**: `src/lib/components/Toaster.svelte:25-32`
- **Fix**: Use design tokens for colors (if available) or create `COLOR.toast` tokens

## Refactoring Plan

### Phase 1: Core Improvements (Priority: High)

1. **Add Warning Type** (`toastStore.ts`)
   - Add `'warning'` to `ToastType`
   - Add `toast.warning()` method
   - Update `Toaster.svelte` to handle warning colors

2. **Standardize Messages**
   - Review all toast usages in dashboard pages
   - Standardize to Indonesian
   - Ensure consistent formatting (sentence case)

### Phase 2: Utility & Patterns (Priority: Medium)

3. **Enhance `withToast.ts`**
   - Add warning support
   - Return toast IDs for manual dismissal
   - Add timeout customization

4. **Create API Response Handler**
   - New utility: `handleApiResponse.ts`
   - Standardize fetch response handling
   - Auto-toast success/error based on response

### Phase 3: UI/UX (Priority: Medium)

5. **Improve Toaster Component**
   - Add `will-change: transform` for performance
   - Add `role="alert"` for error toasts
   - Add keyboard dismiss (Esc key)
   - Consider adding close button always (not just hover)

6. **Clear Toasts on Navigation**
   - Add `$page` subscription in `AppShell.svelte`
   - Clear toasts on route change

### Phase 4: Design System Integration (Priority: Low)

7. **Add Toast Design Tokens**
   - Create `COLOR.toastSuccess`, `COLOR.toastError`, etc.
   - Or create `TOAST` token object
   - Update `Toaster.svelte` to use tokens

## Implementation Order

1. `src/lib/stores/toastStore.ts` - Add warning type
2. `src/lib/components/Toaster.svelte` - Add warning styling + accessibility
3. `src/lib/utils/withToast.ts` - Enhance wrapper
4. `src/lib/components/layouts/AppShell.svelte` - Clear toasts on navigation
5. Standardize toast messages across dashboard pages
6. Create `handleApiResponse.ts` utility (optional)

## Testing Checklist

- [ ] Warning toast displays correctly (colors, icon)
- [ ] All toast types dismiss automatically after timeout
- [ ] Manual dismiss works (X button, Esc key)
- [ ] Toasts clear on page navigation
- [ ] Screen reader announces toasts (aria-live)
- [ ] Error toasts have `role="alert"`
- [ ] `withToast` shows loading/success/error correctly
- [ ] No console errors in browser
- [ ] Dark mode colors are correct

## Files to Modify

1. `src/lib/stores/toastStore.ts`
2. `src/lib/components/Toaster.svelte`
3. `src/lib/utils/withToast.ts`
4. `src/lib/components/layouts/AppShell.svelte`
5. Dashboard pages with inconsistent toast usage (see grep results)

## Notes

- No breaking changes expected
- All changes are additive or internal improvements
- Existing toast API remains compatible
- Design token integration can be done incrementally
