# Dashboard Pages Consistency Checklist

## ✅ Halaman yang Sudah Konsisten (Menggunakan DataTable + Struktur Standar)

### 1. `/dashboard/crm/waiting-list` ✅

- **Komponen Table**: `WaitingListTable` → menggunakan `DataTable`
- **Struktur**:
  - `PageQuick` untuk filters (outside PageWrapper)
  - `PageWrapper` → `PageHeader`
  - `ResultsSummary` + `WaitingListSearchBar`
  - `WaitingListTable` dengan snippet
- **Features**: Status filters, search, column visibility, export CSV, notes modal
- **Constants**: `WAITING_LIST_COLUMNS`, `waiting-list-columns.ts`
- **Utils**: `waiting-list-filters.ts`, `column-visibility.ts`
- **URL Sync**: Status filter sync dengan query params ✅

### 2. `/dashboard/admin/users` ✅

- **Komponen Table**: `UsersTable` → menggunakan `DataTable`
- **Struktur**:
  - `PageQuick` untuk filters (outside PageWrapper)
  - `PageWrapper` → `PageHeader`
  - `ResultsSummary` + `WaitingListSearchBar`
  - `UsersTable` dengan snippet
- **Features**: Role filters, search, column visibility
- **Constants**: `USER_COLUMNS`, `user-columns.ts`
- **Utils**: `user-filters.ts`, `column-visibility.ts`
- **URL Sync**: Role filter sync dengan query params ✅

### 3. `/dashboard/admin/courses` ✅

- **Komponen Table**: `CoursesTable` → menggunakan `DataTable`
- **Struktur**:
  - `PageQuick` untuk filters + Create button (outside PageWrapper)
  - `PageWrapper` → `PageHeader`
  - `ResultsSummary` + `WaitingListSearchBar`
  - `CoursesTable` dengan snippet
- **Features**: Status filters, search, column visibility
- **Constants**: `COURSE_COLUMNS`, `course-columns.ts`
- **Utils**: `course-filters.ts`, `column-visibility.ts`

### 4. `/dashboard/admin/coupons` ✅

- **Komponen Table**: `CouponsTable` → menggunakan `DataTable`
- **Struktur**:
  - `PageQuick` untuk filters + Create button (outside PageWrapper)
  - `PageWrapper` → `PageHeader`
  - `ResultsSummary` + `WaitingListSearchBar`
  - `CouponsTable` dengan snippet
- **Features**: Type filters (all/active/expired), search, column visibility, copy code, duplicate, toggle status
- **Constants**: `COUPON_COLUMNS`, `coupon-columns.ts`
- **Utils**: `coupon-filters.ts`, `column-visibility.ts`
- **URL Sync**: Filter sync dengan query params ✅

### 5. `/dashboard/admin/mentor-applications` ✅

- **Komponen Table**: `MentorApplicationsTable` → menggunakan `DataTable`
- **Struktur**:
  - `PageQuick` untuk filters (outside PageWrapper)
  - `PageWrapper` → `PageHeader`
  - `ResultsSummary` + `WaitingListSearchBar`
  - `MentorApplicationsTable` dengan snippet
- **Features**: Status filters, search, column visibility
- **Constants**: `MENTOR_APPLICATION_COLUMNS`, `mentor-application-columns.ts`
- **Utils**: `mentor-application-filters.ts`, `column-visibility.ts`
- **URL Sync**: Status filter sync dengan query params ✅

### 6. `/dashboard/admin/payments` ✅

- **Komponen Table**: `PaymentProofsTable` → menggunakan `DataTable`
- **Struktur**:
  - `PageQuick` untuk filters (outside PageWrapper)
  - `PageWrapper` → `PageHeader`
  - `ResultsSummary` + `WaitingListSearchBar`
  - `PaymentProofsTable` dengan snippet
- **Features**: Status filters, search, column visibility
- **Constants**: `PAYMENT_PROOF_COLUMNS`, `payment-proof-columns.ts`
- **Utils**: `payment-proof-filters.ts`, `column-visibility.ts`
- **URL Sync**: Status filter sync dengan query params ✅

---

## ❌ Halaman yang Belum Konsisten (Perlu Refactor)

### 1. `/dashboard/mentor/students` ❌

- **Komponen Table**: `Table.svelte` (component lama, bukan DataTable)
- **Struktur**:
  - ❌ Tidak ada `PageQuick`
  - ✅ `PageWrapper` → `PageHeader`
  - ❌ Tidak ada `ResultsSummary`
  - ❌ Tidak ada `WaitingListSearchBar`
  - ❌ Tidak ada `ColumnFilter`
  - ✅ `PageSection` dengan `Table` component
- **Features**:
  - ✅ Course filter (select dropdown)
  - ❌ Tidak ada search
  - ❌ Tidak ada column visibility
- **Perlu**:
  - Refactor ke `DataTable`
  - Tambahkan search functionality
  - Tambahkan column visibility
  - Buat constants untuk columns
  - Buat filter utils
  - Gunakan struktur standar

### 2. `/dashboard/mentor/courses/[id]/submissions` ❌

- **Komponen Table**: Custom HTML `<table>` (bukan component)
- **Struktur**:
  - ❌ Tidak ada `PageQuick`
  - ✅ `PageWrapper` → `PageHeader`
  - ✅ Filter buttons (quiz/assignment/pending) tapi menggunakan `<a>` tags
  - ❌ Tidak ada `ResultsSummary`
  - ❌ Tidak ada `WaitingListSearchBar`
  - ❌ Tidak ada `ColumnFilter`
  - ✅ Custom HTML table dalam `PageSection`
- **Features**:
  - ✅ Type/Status filter (quiz/assignment/pending) tapi menggunakan URL query params dengan `<a>` tags
  - ❌ Tidak ada search
  - ❌ Tidak ada column visibility
- **Perlu**:
  - Refactor ke `DataTable`
  - Refactor filter buttons ke component terpisah (seperti `SubmissionFilters`)
  - Tambahkan search functionality
  - Tambahkan column visibility
  - Buat constants untuk columns
  - Buat filter utils
  - Gunakan struktur standar

---

## 📊 Summary

### Status

- **✅ Konsisten**: 6 halaman (100% halaman admin/crm)
- **❌ Perlu Refactor**: 2 halaman (mentor pages)

### Komponen yang Digunakan Konsisten

- ✅ `DataTable` - semua table components
- ✅ `PageQuick` - untuk filters di luar PageWrapper
- ✅ `PageWrapper` - container utama
- ✅ `PageHeader` - title dan description
- ✅ `ResultsSummary` - menampilkan filtered/total count
- ✅ `WaitingListSearchBar` - search + column filter
- ✅ `ColumnFilter` - untuk column visibility
- ✅ Filter components spesifik per halaman (WaitingListFilters, UserFilters, dll)

### Pattern yang Konsisten

1. **Layout Structure**:

   ```
   <PageQuick> <!-- Filters outside PageWrapper -->
     <[Entity]Filters />
   </PageQuick>

   <PageWrapper>
     <PageHeader />
     <div> <!-- ResultsSummary + WaitingListSearchBar -->
     <[Entity]Table /> <!-- atau conditional empty state -->
   </PageWrapper>
   ```

2. **State Management**:
   - `searchQuery` - untuk search
   - `[entity]Filter` - untuk filter state
   - `columnVisibility` - untuk column visibility
   - `columnFilterRef` - untuk ColumnFilter reference

3. **URL Sync**:
   - `onMount` untuk initialize dari URL
   - `$effect` untuk sync dengan URL changes
   - `updateQueryParam` utility untuk update URL

4. **Constants & Utils**:
   - Column definitions di `constants/[entity]-columns.ts`
   - Filter functions di `utils/[entity]-filters.ts`
   - Reusable `column-visibility.ts` utils

5. **Table Component Pattern**:
   - Semua menggunakan `DataTable` dengan named snippet `cell`
   - Custom rendering via snippet untuk setiap column
   - Empty state message prop
   - Column visibility support
   - Loading state support

---

## 🎯 Action Items

### Priority: HIGH

1. ✅ **Standardisasi TableColumn interface** - DONE
2. ✅ **Refactor semua admin/crm tables ke DataTable** - DONE
3. ⏳ **Refactor mentor/students ke DataTable** - TODO
4. ⏳ **Refactor mentor/submissions ke DataTable** - TODO

### Priority: MEDIUM

5. ⏳ **Tambah search untuk mentor/students**
6. ⏳ **Tambah search untuk mentor/submissions**
7. ⏳ **Standardisasi empty state messages**

### Priority: LOW

8. ⏳ **Review semua empty state styling untuk konsistensi**
9. ⏳ **Review semua filter button styling untuk konsistensi**

---

## 📝 Notes

- Semua halaman admin sudah 100% konsisten menggunakan DataTable dan struktur standar
- Mentor pages masih menggunakan pattern lama, perlu refactor untuk konsistensi
- Pattern yang sudah established sangat baik untuk maintainability dan scalability
