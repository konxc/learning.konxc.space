# Naik Kelas - Analisis Fitur & Rencana Pengembangan

**Last Updated**: 2026-03-28

---

## 📊 ANALISIS FITUR SAAT INI

### ✅ Fitur yang Sudah Ada

#### 1. Struktur Kursus

| Fitur             | Status | Keterangan                   |
| ----------------- | ------ | ---------------------------- |
| Course Management | ✅     | Create, edit, delete courses |
| Modules           | ✅     | Bab per course               |
| Lessons           | ✅     | Pelajaran per module         |
| Materials         | ✅     | Text, video, link content    |
| Quizzes           | ✅     | Multiple choice questions    |
| Assignments       | ✅     | Via submission system        |
| Certificates      | ✅     | Generated on completion      |

#### 2. User Roles (RBAC)

| Role      | Deskripsi            | Akses                         |
| --------- | -------------------- | ----------------------------- |
| `learner` | Peserta kursus       | Browse & enroll courses       |
| `mentor`  | Pengajar             | Manage courses, view students |
| `admin`   | Administrator        | Full platform access          |
| `bd`      | Business Development | CRM & waiting list            |

#### 3. Progress Tracking

| Fitur           | Status                      |
| --------------- | --------------------------- |
| Lesson Progress | ✅ Track completed lessons  |
| Quiz Scores     | ✅ Via submission           |
| Assignments     | ✅ Via submission + grading |
| Certificates    | ✅ Auto-generated           |

#### 4. Admin Features

| Fitur                | Status |
| -------------------- | ------ |
| User Management      | ✅     |
| Course Management    | ✅     |
| Coupon Management    | ✅     |
| Payment Verification | ✅     |
| Mentor Applications  | ✅     |

---

## ❌ FITUR YANG KURANG / BELUM ADA

### 1. Course Tracks System (KURANG)

**Saat ini**: Course adalah unit tunggal generic

**Kebutuhan untuk Naik Kelas**:

- ❌ Course tracks: Content Creator, Seller, Affiliator
- ❌ Kurikulum per track
- ❌ Target output per track (konten, produk, affiliate link)
- ❌ Assessment criteria per track

### 2. Batch/Cohort Management (TIDAK ADA)

**Saat ini**: Tidak ada konsep batch

**Kebutuhan**:

- ❌ Batch/Cohort system (Batch 1, Batch 2, dll)
- ❌ Tanggal mulai & selesai
- ❌ Daftar peserta per batch
- ❌ Status batch (ongoing, completed, archived)

### 3. Action-Based Progress (KURANG)

**Saat ini**: Progress hanya berdasarkan lesson completion

**Kebutuhan**:

- ❌ Upload bukti konten (TikTok link, Shopee link, dll)
- ❌ Task submission dengan link/url
- ❌ Mentor feedback on deliverables
- ❌ Progress tracker per deliverable

### 4. Partner/Yayasan Integration (TIDAK ADA)

**Kebutuhan untuk ASIB partnership**:

- ❌ Asal yayasan/sekolah di profile user
- ❌ Tracking peserta per yayasan
- ❌ Reporting per yayasan
- ❌ Bulk enrollment per batch

### 5. Enhanced Mentor Dashboard (KURANG)

**Saat ini**: Mentor hanya lihat student list

**Kebutuhan**:

- ❌ Progress individual student
- ❌ Assignment grading interface
- ❌ Student performance analytics
- ❌ Broadcast message to students
- ❌ Export student data

### 6. Analytics & Reporting (KURANG)

**Kebutuhan**:

- ❌ Completion rate per batch
- ❌ Output tracking (konten dibuat, produk diupload, dll)
- ❌ Revenue/sales tracking per affiliator
- ❌ Export reports (CSV/PDF)

---

## 🎯 RENCANA PENGEMBANGAN

### Phase 1: Core Structure (Immediate)

#### 1.1 Database Schema Enhancement

```typescript
// NEW: Course Track System
export const courseTrack = sqliteTable('course_track', {
	id: text('id').primaryKey(),
	name: text('name').notNull(), // 'content_creator', 'seller', 'affiliator'
	description: text('description'),
	icon: text('icon'),
	order: integer('order_index').notNull()
});

// NEW: Batch/Cohort System
export const batch = sqliteTable('batch', {
	id: text('id').primaryKey(),
	name: text('name').notNull(), // 'Batch 1 - Digital Marketing'
	trackId: text('track_id').references(() => courseTrack.id),
	startDate: integer('start_date', { mode: 'timestamp' }),
	endDate: integer('end_date', { mode: 'timestamp' }),
	status: text('status').notNull().default('draft'), // 'draft', 'ongoing', 'completed'
	maxParticipants: integer('max_participants'),
	createdBy: text('created_by').references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' })
});

// NEW: Batch Enrollment (extends enrollment)
export const batchEnrollment = sqliteTable('batch_enrollment', {
	id: text('id').primaryKey(),
	batchId: text('batch_id').references(() => batch.id),
	enrollmentId: text('enrollment_id').references(() => enrollment.id),
	status: text('status').notNull().default('active'),
	joinedAt: integer('joined_at', { mode: 'timestamp' })
});

// NEW: Task/Deliverable
export const task = sqliteTable('task', {
	id: text('id').primaryKey(),
	courseId: text('course_id').references(() => course.id),
	title: text('title').notNull(),
	description: text('description'),
	type: text('type').notNull(), // 'content_link', 'product_listing', 'affiliate_link', 'quiz'
	targetUrl: text('target_url'), // Template URL yang diharapkan
	dueDate: integer('due_date', { mode: 'timestamp' }),
	points: integer('points').notNull().default(0),
	order: integer('order_index').notNull()
});

// NEW: Task Submission (extends submission)
export const taskSubmission = sqliteTable('task_submission', {
	id: text('id').primaryKey(),
	taskId: text('task_id').references(() => task.id),
	submissionId: text('submission_id').references(() => submission.id),
	submittedUrl: text('submitted_url'), // Link ke konten/product/affiliate
	mentorFeedback: text('mentor_feedback'),
	mentorRating: integer('mentor_rating'), // 1-5 stars
	reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
	reviewedBy: text('reviewed_by').references(() => user.id)
});

// NEW: User Profile Enhancement
export const userProfile = sqliteTable('user_profile', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => user.id)
		.notNull()
		.unique(),
	partnerId: text('partner_id'), // FK ke partner/yayasan
	bio: text('bio'),
	whatsapp: text('whatsapp'),
	instagram: text('instagram'),
	tiktok: text('tiktok'),
	shopeeStore: text('shopee_store'),
	tiktokShop: text('tiktok_shop'),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

// NEW: Partner/Yayasan
export const partner = sqliteTable('partner', {
	id: text('id').primaryKey(),
	name: text('name').notNull(), // 'Yayasan Amal Salih Insan Bantul'
	type: text('type').notNull(), // 'yayasan', 'sekolah', 'umkm', 'komunitas'
	contactPerson: text('contact_person'),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	address: text('address'),
	status: text('status').notNull().default('active'),
	createdAt: integer('created_at', { mode: 'timestamp' })
});
```

#### 1.2 RBAC Enhancement

```typescript
// Enhanced Roles
export type UserRole =
	| 'learner' // Peserta reguler
	| 'mentor' // Pengajar/pembina
	| 'admin' // Administrator platform
	| 'bd' // Business Development
	| 'partner_admin'; // Admin dari yayasan/sekolah

// Mentor Permissions
export const MENTOR_PERMISSIONS = {
	canCreateCourse: true,
	canEditOwnCourse: true,
	canDeleteOwnCourse: false,
	canViewAllStudents: true,
	canViewOwnStudents: true,
	canGradeAssignments: true,
	canGiveFeedback: true,
	canExportStudentData: true,
	canSendBroadcast: true,
	canManageBatch: true
};

// Partner Admin Permissions
export const PARTNER_ADMIN_PERMISSIONS = {
	canViewPartnerStudents: true,
	canExportPartnerReport: true,
	canManagePartnerEnrollment: true,
	cannotManagePlatform: true
};
```

---

### Phase 2: Features (Week 1-2)

#### 2.1 Track-Based Course View

- Tampilan berbeda per track di dashboard learner
- Quick action: upload bukti/link deliverable
- Progress visualization per deliverable

#### 2.2 Batch Management

- Create/edit batch dengan tanggal
- Assign course ke batch
- Enroll users ke batch
- Batch progress overview

#### 2.3 Task & Deliverable System

- Mentor buat task dengan target URL
- Student submit link bukti
- Mentor review & give feedback
- Auto-calculate progress based on tasks

---

### Phase 3: Partner Integration (Week 3-4)

#### 3.1 Partner Dashboard

- View all students from their organization
- Export reports (CSV)
- Bulk actions

#### 3.2 Enhanced Student Profile

- Social media links
- Store links (Shopee, TikTok Shop)
- Portfolio/deliverable history

#### 3.3 Analytics Dashboard

- Completion rate per batch
- Output metrics (konten dibuat, produk diupload, dll)
- Per-partner reporting

---

## 📱 DASHBOARD LAYOUT RECOMMENDATION

### Learner Dashboard (per Track)

```
┌─────────────────────────────────────────────────┐
│  🎯 My Learning Path: [Content Creator]       │
│  📊 Progress: ████████░░ 80%                   │
├─────────────────────────────────────────────────┤
│  📅 Today's Tasks                               │
│  □ Upload 1 TikTok content (due today)        │
│  □ Complete Module 3 Quiz                       │
├─────────────────────────────────────────────────┤
│  📈 My Deliverables                             │
│  📹 Content: 12 videos • 2,340 views           │
│  🛒 Products: 5 listed • 3 sold                │
│  🔗 Affiliate: 8 links • 2 conversions        │
├─────────────────────────────────────────────────┤
│  📚 My Courses                                 │
│  • Digital Marketing Fundamentals [████░░ 60%] │
│  • Content Creation Mastery [██████ 100%]     │
└─────────────────────────────────────────────────┘
```

### Mentor Dashboard

```
┌─────────────────────────────────────────────────┐
│  🎓 My Students: 45 | 📊 Avg Progress: 67%   │
├─────────────────────────────────────────────────┤
│  📋 Pending Reviews (3)                        │
│  • Ahmad - TikTok Content - Needs Review        │
│  • Budi - Shopee Listing - Approved             │
│  • Siti - Affiliate Link - Needs Review        │
├─────────────────────────────────────────────────┤
│  📈 Batch Progress                              │
│  Batch 1 - DM: ████████░░ 82% (23/28 students)│
│  Batch 1 - AF: ██████░░░░ 60% (18/28 students)│
├─────────────────────────────────────────────────┤
│  📊 Student Performance                         │
│  [View All Students] [Export Report]           │
└─────────────────────────────────────────────────┘
```

### Partner Admin Dashboard (ASIB)

```
┌─────────────────────────────────────────────────┐
│  🏛️ Yayasan Amal Salih Insan Bantul          │
│  👥 Total Students: 28 | 📊 Active: 25       │
├─────────────────────────────────────────────────┤
│  📈 Participant Progress                         │
│  • Completed: 8 (29%)                          │
│  • In Progress: 17 (61%)                       │
│  • Not Started: 3 (11%)                        │
├─────────────────────────────────────────────────┤
│  📊 Output Summary                             │
│  📹 Content Created: 156                        │
│  🛒 Products Listed: 45                         │
│  🔗 Affiliate Links: 89                         │
├─────────────────────────────────────────────────┤
│  📥 Export Reports                             │
│  [CSV] [PDF]                                   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION PRIORITY

### Priority 1 (Critical - Before Launch)

1. ✅ Course tracks (content_creator, seller, affiliator)
2. ✅ Batch system
3. ✅ Task/deliverable system
4. ✅ Partner table
5. ✅ Enhanced user profile

### Priority 2 (Important - Within 1 month)

1. Enhanced mentor dashboard
2. Task submission & review flow
3. Progress visualization per track

### Priority 3 (Nice to have - Within 3 months)

1. Analytics dashboard
2. Partner admin dashboard
3. Automated reports
4. Mobile app consideration

---

## 📝 NOTES

### Concept yang Perlu Diingat

Dari conversation dengan user:

1. **3 Jalur**: Content Creator, Seller/Dropshipper, Affiliator
2. **Praktik > Teori**: 70% praktik, 30% teori
3. **Output Terukur**: Bukan hanya "selesai kursus" tapi:
   - X konten dibuat
   - X produk diupload
   - X affiliate link dibuat
4. **Batch System**: Seperti yang dijalankan di yayasan
5. **Partnership**: Tracking per yayasan (ASIB)

### Naming Convention

| English            | Indonesian (Display) |
| ------------------ | -------------------- |
| Content Creator    | Kreator Konten       |
| Seller/Dropshipper | Penjual/Mitra        |
| Affiliator         | Afiliator            |
| Batch              | Batch/Kelompok       |
| Task               | Tugas/Task           |
| Deliverable        | Hasil Kerja          |

---

## 🔗 Related Documents

- [ROADMAP.md](./ROADMAP.md)
- [DASHBOARD_RBAC_STRUCTURE.md](./DASHBOARD_RBAC_STRUCTURE.md)
- [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md)
