# Design: Payment Management Enhancement

## Overview

This design document outlines the implementation of the Payment Management Enhancement feature. The goal is to improve the payment workflow for both admins and students by:

1. **Admin Payment Review**: Faster approval/rejection of manual transfer proofs with bulk actions
2. **Student Payment History**: Clear view of all transactions with receipt download
3. **Coupon UI in Checkout**: Real-time coupon validation during checkout
4. **Reconciliation Reports**: Daily summary with CSV export

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Payment Management Layer                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Admin UI   │  │ Student UI   │  │   Coupon UI  │  │  Report  │ │
│  │  (payments)  │  │  (payments)  │  │  (checkout)  │  │  (CSV)   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────┬─────┘ │
│         │                  │                  │               │       │
│         └──────────────────┴──────────────────┴───────────────┘       │
│                            │                                          │
│                    ┌───────▼───────┐                                  │
│                    │  Server API   │                                  │
│                    │  (+page.server)│                                  │
│                    └───────┬───────┘                                  │
│                            │                                          │
│         ┌──────────────────┴──────────────────┐                       │
│         │         Drizzle ORM (Neon PG)       │                       │
│         └──────────────────┬──────────────────┘                       │
│                            │                                          │
│         ┌──────────────────▼──────────────────┐                       │
│         │      Database Tables (Schema)       │                       │
│         │  - transaction                      │                       │
│         │  - paymentProof                     │                       │
│         │  - coupon                           │                       │
│         │  - couponUsage                      │                       │
│         │  - enrollment                       │                       │
│         │  - notification                     │                       │
│         └─────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagrams

#### Admin Payment Approval Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Admin   │────▶│  Filter/Sort │────▶│  Select Proof│────▶│  Approve API │
└──────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                  │
                                                                  ▼
                                                         ┌──────────────┐
                                                         │  Update DB   │
                                                         │  - proof.status│
                                                         │  - enrollment  │
                                                         └──────┬───────┘
                                                                  │
                                                                  ▼
                                                         ┌──────────────┐
                                                         │ Send Notif   │
                                                         │ to Student   │
                                                         └──────────────┘
```

#### Student Payment History Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Student  │────▶│  Load History│────▶│  Display All │
└──────────┘     └──────────────┘     └──────┬───────┘
                                             │
                                             ▼
                                    ┌──────────────┐
                                    │  Combined View │
                                    │  - Midtrans  │
                                    │  - Manual      │
                                    └──────┬───────┘
                                             │
                                             ▼
                                    ┌──────────────┐
                                    │  Download      │
                                    │  Receipt (TXT) │
                                    └──────────────┘
```

#### Coupon Validation Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ Student  │────▶│  Enter Code  │────▶│  Validate API│
└──────────┘     └──────────────┘     └──────┬───────┘
                                             │
                                             ▼
                                    ┌──────────────┐
                                    │  Check Coupon  │
                                    │  - Active      │
                                    │  - Valid Date  │
                                    │  - Usage Limit │
                                    └──────┬───���───┘
                                             │
                                             ▼
                                    ┌──────────────┐
                                    │  Apply Discount│
                                    │  - Calculate   │
                                    │  - Record Usage│
                                    └──────────────┘
```

## Components and Interfaces

### Admin Payment Review UI

**Route**: `/app/admin/payments`

**Key Components**:

- `PaymentProofTable.svelte` - Main table with inline image preview
- `StatusFilter.svelte` - Tab-based status filtering
- `DateRangeFilter.svelte` - Date range picker
- `BulkActionBar.svelte` - Bulk approve action bar
- `StatsCard.svelte` - Daily revenue summary cards

**Props**:

```typescript
interface PaymentProof {
	id: string;
	status: 'pending' | 'approved' | 'rejected';
	notes?: string;
	dataBase64: string;
	mime: string;
	createdAt: Date;
	user: {
		id: string;
		username: string;
		fullName: string;
		email: string;
	};
	course: {
		id: string;
		title: string;
		price: number;
	};
}

interface PaymentStats {
	totalPending: number;
	approvedToday: number;
	rejectedToday: number;
	revenueToday: number;
	revenueManual: number;
	revenueMidtrans: number;
}
```

### Student Payment History UI

**Route**: `/app/payments/history`

**Key Components**:

- `PaymentHistoryTable.svelte` - Combined view of all transactions
- `ReceiptDownloader.svelte` - Plain text receipt generator

**Props**:

```typescript
interface TransactionEntry {
	id: string;
	date: Date;
	courseTitle: string | null;
	amount: number;
	status: string;
	type: 'midtrans' | 'manual';
	courseId?: string;
	notes?: string;
}
```

### Coupon UI in Checkout

**Route**: `/app/payments` (existing, enhanced)

**Key Components**:

- `CouponInput.svelte` - Coupon code input with validation
- `CouponResult.svelte` - Display discount info

**Props**:

```typescript
interface CouponValidationResult {
	valid: boolean;
	discountAmount: number;
	finalPrice: number;
	error?: string;
}
```

### Reconciliation Report

**Route**: `/app/admin/payments` (CSV export)

**Key Components**:

- `ReconciliationExporter.svelte` - CSV generation logic

**Data Structure**:

```typescript
interface ReconciliationRow {
	date: string;
	student: string;
	course: string;
	method: 'Manual' | 'Midtrans';
	amount: number;
	status: string;
}
```

## Data Models

### Existing Tables (No Schema Changes)

#### paymentProof

```typescript
{
  id: string;              // Primary key
  userId: string;          // Foreign key to user
  courseId: string;       // Foreign key to course
  dataBase64: string;     // Base64 encoded image
  mime: string;           // Image MIME type
  size: number;           // File size in bytes
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;         // Admin rejection notes
  createdAt: Date;
}
```

#### transaction

```typescript
{
  id: string;              // Primary key (order_id)
  userId: string;          // Foreign key to user
  courseId?: string;      // Foreign key to course
  orgId?: string;         // Foreign key to organization
  amount: number;
  status: string;         // Midtrans status
  paymentType?: string;
  snapToken?: string;
  snapUrl?: string;
  payload?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### coupon

```typescript
{
  id: string;              // Primary key
  code: string;           // Unique coupon code
  type: string;           // 'free' or 'discount'
  discountType?: string;  // 'percentage' or 'fixed'
  discountValue?: number;
  maxUses?: number;
  currentUses: number;
  validFrom: Date;
  validUntil?: Date;
  description?: string;
  applicableCourses?: string;  // JSON array of course IDs
  minPurchaseAmount?: number;
  createdBy: string;      // Foreign key to user
  createdAt: Date;
  isActive: boolean;
}
```

#### couponUsage

```typescript
{
  id: string;              // Primary key
  couponId: string;       // Foreign key to coupon
  userId: string;         // Foreign key to user
  courseId?: string;      // Foreign key to course
  discountAmount: number;
  orderAmount: number;
  finalAmount: number;
  usedAt: Date;
}
```

#### enrollment

```typescript
{
  id: string;              // Primary key
  userId: string;         // Foreign key to user
  courseId: string;       // Foreign key to course
  cohortId?: string;
  track?: string;
  couponId?: string;
  partnerId?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledAt: Date;
  activatedAt?: Date;
  completedAt?: Date;
}
```

#### notification

```typescript
{
  id: string;              // Primary key
  userId: string;         // Foreign key to user
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}
```

## API Endpoints and Server Actions

### Admin Payment Review (`+page.server.ts`)

#### Load Data

```typescript
export const load: PageServerLoad = async (event) => {
	// 1. Require admin role
	// 2. Fetch payment proofs with filters (status, date range)
	// 3. Fetch stats (pending count, approved/rejected today, revenue)
	// 4. Return proofs and filters
};
```

#### Actions

```typescript
export const actions = {
	// Approve single proof
	approve: async (event) => {
		// 1. Validate admin role
		// 2. Update proof status to 'approved'
		// 3. Activate enrollment
		// 4. Send notification to student
		// 5. Return success
	},

	// Reject single proof
	reject: async (event) => {
		// 1. Validate admin role
		// 2. Update proof status to 'rejected' with notes
		// 3. Send notification to student
		// 4. Return success
	},

	// Bulk approve proofs
	bulkApprove: async (event) => {
		// 1. Validate admin role
		// 2. Process each proof ID in array
		// 3. Return count of approved proofs
	},

	// Export CSV
	exportCSV: async (event) => {
		// 1. Validate admin role
		// 2. Fetch proofs and transactions within date range
		// 3. Generate CSV rows
		// 4. Return CSV response
	}
};
```

### Student Payment History (`history/+page.server.ts`)

#### Load Data

```typescript
export const load: PageServerLoad = async (event) => {
	// 1. Require auth
	// 2. Fetch student's payment proofs
	// 3. Fetch student's transactions
	// 4. Combine and format for display
	// 5. Return combined array
};
```

### Coupon Validation (API Route)

#### Validate Coupon

```typescript
// POST /api/coupons/validate
export async function POST(event) {
	// 1. Parse request body
	// 2. Call validateCoupon() from $lib/server/coupon
	// 3. Return validation result
}
```

## UI Component Structure

### Admin Payments Page

```
AdminPayments.svelte
├── PageHeader
├── StatsCards (3 cards)
│   ├── Total Revenue Today
│   ├── Pending Count
│   └── Approved/Rejected Today
├── FilterBar
│   ├── StatusTabs (All, Pending, Approved, Rejected)
│   ├── DateRangeInputs (From, To)
│   ├── FilterButton
│   ├── ResetButton
│   └── ExportCSVButton
├── BulkActionBar (conditional)
│   ├── SelectedCount
│   ├── BulkApproveButton
│   └── CancelButton
└── PaymentProofTable
    ├── CheckboxHeader
    ├── ProofThumbnail
    ├── StudentInfo
    ├── CourseInfo
    ├── Date
    ├── StatusBadge
    └── ActionButtons (Approve, Reject, Detail)
```

### Student Payment History Page

```
PaymentHistory.svelte
├── PageHeader
└── PaymentHistoryTable
    ├── Date
    ├── CourseTitle
    ├── MethodBadge
    ├── Amount
    ├── StatusBadge
    └── Actions
        ├── ReuploadProof (if rejected)
        └── DownloadReceipt (if paid/approved)
```

### Checkout Coupon UI

```
PaymentPage.svelte (enhanced)
├── CouponInput
│   ├── InputField
│   └── ApplyButton
└── CouponResult (conditional)
    ├── SuccessState (discount info)
    └── ErrorState (error message)
```

## Data Flow Details

### Admin Payment Approval

1. Admin views `/app/admin/payments`
2. Filter by status/date (optional)
3. Select proofs via checkboxes
4. Click "Approve Selected" or individual "Approve" button
5. Server action updates:
   - `paymentProof.status` → 'approved'
   - `enrollment.status` → 'active'
   - `enrollment.activatedAt` → now
6. Notification created for student
7. UI refreshes with updated data

### Student Payment History

1. Student visits `/app/payments/history`
2. Server fetches:
   - All `paymentProof` records for user
   - All `transaction` records for user
3. Combined into single array with type indicator
4. Displayed in unified table
5. Student can:
   - Download receipt (plain text)
   - Re-upload proof if rejected

### Coupon Validation

1. Student enters coupon code in checkout
2. Click "Apply" button
3. API call to `/api/coupons/validate`
4. Server validates:
   - Code exists
   - Coupon is active
   - Within date range
   - Usage limit not exceeded
   - Minimum purchase amount met
   - Applicable to course
5. Return result with discount info
6. UI displays success/error state

### Reconciliation Report

1. Admin sets date range in filter bar
2. Click "Export CSV" button
3. Server fetches:
   - All `paymentProof` within date range
   - All `transaction` within date range
4. Generate CSV rows:
   - Date, Student, Course, Method, Amount, Status
5. Return CSV as downloadable file

## Error Handling

### Admin Payment Actions

| Error            | HTTP | Message                   | Recovery         |
| ---------------- | ---- | ------------------------- | ---------------- |
| Missing proof ID | 400  | "Missing proof ID"        | Show error toast |
| Proof not found  | 404  | "Payment proof not found" | Show error toast |
| Not admin        | 401  | Redirect to /app          | Auto-redirect    |
| DB error         | 500  | "Database error"          | Show error toast |

### Student Payment Actions

| Error                | HTTP | Message                        | Recovery         |
| -------------------- | ---- | ------------------------------ | ---------------- |
| Not authenticated    | 302  | Redirect to /auth/signin       | Auto-redirect    |
| Enrollment not found | 404  | "Enrollment not found"         | Show error toast |
| Invalid file type    | 400  | "Only JPEG, PNG, WebP allowed" | Show error toast |
| File too large       | 400  | "Exceeds 1MB limit"            | Show error toast |

### Coupon Validation

| Error              | HTTP | Message                         | Recovery         |
| ------------------ | ---- | ------------------------------- | ---------------- |
| Code not found     | 200  | "Coupon code not found"         | Show error in UI |
| Coupon inactive    | 200  | "Coupon is not active"          | Show error in UI |
| Expired            | 200  | "Coupon has expired"            | Show error in UI |
| Usage limit        | 200  | "Usage limit reached"           | Show error in UI |
| Min amount not met | 200  | "Minimum purchase amount..."    | Show error in UI |
| Not applicable     | 200  | "Not applicable to this course" | Show error in UI |

## Security Considerations

### Authentication & Authorization

1. **Admin-only routes**: All admin payment routes require `requireAdmin()` middleware
2. **Student-only history**: Payment history requires `requireAuth()` and filters by `user.id`
3. **Org isolation**: Transaction records include `orgId` for multi-tenant isolation

### Input Validation

1. **File uploads**:
   - MIME type whitelist: `image/jpeg`, `image/png`, `image/webp`
   - Size limit: 1MB
   - Base64 encoding validation

2. **Coupon validation**:
   - Code format validation
   - Date range validation
   - Usage limit enforcement
   - Course applicability check

3. **Bulk actions**:
   - Proof ID array validation
   - Max batch size limit (e.g., 100 proofs)

### Data Integrity

1. **Atomic updates**: Enrollment activation happens within same transaction as proof approval
2. **Notification safety**: Notifications created with `crypto.randomUUID()` for IDs
3. **CSV sanitization**: Special characters escaped in CSV export

### Rate Limiting

1. **Coupon validation**: Rate limit per IP/user to prevent brute force
2. **Proof uploads**: Limit uploads per course per student

## Testing Strategy

### Unit Tests

1. **Coupon validation logic** (`coupon.ts`)
   - Valid coupon acceptance
   - Expired coupon rejection
   - Usage limit enforcement
   - Course applicability check

2. **CSV export logic**
   - Correct row generation
   - Special character escaping
   - Date formatting

3. **Receipt generation**
   - Plain text format
   - All required fields included

### Property-Based Tests

1. **Payment approval**
   - For all pending proofs, approve action changes status to 'approved'
   - For all approved proofs, enrollment status becomes 'active'

2. **Notification delivery**
   - For every proof approval/rejection, exactly one notification is created

3. **History completeness**
   - For every student, combined history includes all proofs and transactions

4. **Coupon round-trip**
   - For all valid coupons, apply then validate returns consistent results

### Edge Cases

1. **Empty date range**: Return all records
2. **Zero proofs**: Show empty state
3. **Invalid base64**: Reject upload
4. **Coupon with no maxUses**: Allow unlimited usage
5. **Course price < discount**: Set final price to 0

## Implementation Tasks

### Task 1: Admin Payment Proof Review UI

- [ ] Add inline image preview in table
- [ ] Implement status filter tabs
- [ ] Add date range filter
- [ ] Implement approve/reject actions
- [ ] Add notification creation

### Task 2: Bulk Approve Functionality

- [ ] Add checkbox selection
- [ ] Implement bulk approve action
- [ ] Add bulk action bar
- [ ] Show approval count

### Task 3: Student Payment History

- [ ] Create history route
- [ ] Combine proofs and transactions
- [ ] Implement receipt download
- [ ] Add re-upload for rejected proofs

### Task 4: Coupon UI in Checkout

- [ ] Add coupon input field
- [ ] Implement validation API call
- [ ] Display discount info
- [ ] Show error states

### Task 5: Reconciliation Report

- [ ] Implement CSV export
- [ ] Add date range filter
- [ ] Generate combined report
- [ ] Download file

## Dependencies

### Existing (No New Packages)

- `@sveltejs/kit` - Framework
- `drizzle-orm` - Database
- `@neondatabase/serverless` - PostgreSQL
- `lucia` - Auth
- `@oslojs/encoding` - Base32 encoding

### No New Dependencies Required

All functionality can be implemented with existing packages.
