# Design: Core LMS Enhancement

## Database Schema

### Existing Tables (No Changes Needed)

Semua tabel yang diperlukan sudah ada di `src/lib/server/db/schema.ts`:

- `course`, `module`, `lesson`, `material`
- `enrollment`, `cohort`
- `quiz`, `quizQuestion`, `quizChoice`
- `submission`, `submissionGrade`
- `lessonProgress`, `lessonNote`
- `checkpoint`, `checkpointSubmission`
- `organization`, `organizationMember`

### Schema Enhancements (Optional Columns)

Jika diperlukan, tambahkan kolom berikut via migration:

```typescript
// course table - tambah kolom untuk course builder
export const course = pgTable('course', {
	// ... existing columns
	isDraft: boolean('is_draft').default(true), // Draft mode untuk preview
	lastEditedAt: timestamp('last_edited_at'), // Track last edit
	templateId: text('template_id') // Jika course dibuat dari template
});

// lesson table - tambah kolom untuk rich content
export const lesson = pgTable('lesson', {
	// ... existing columns
	videoUrl: text('video_url'), // YouTube/Vimeo URL
	videoProvider: text('video_provider'), // 'youtube' | 'vimeo' | 'direct'
	estimatedDuration: integer('estimated_duration') // dalam menit
});

// submission table - tambah kolom untuk rubric grading
export const submission = pgTable('submission', {
	// ... existing columns
	rubricScores: text('rubric_scores'), // JSON string: {criteria1: score1, criteria2: score2}
	gradedAt: timestamp('graded_at'),
	gradedBy: text('graded_by').references(() => user.id)
});
```

## Component Architecture

### Reusable Components

```
src/lib/components/
├── app/
│   ├── course/
│   │   ├── CourseCard.svelte              # Card untuk course list
│   │   ├── CourseGrid.svelte              # Grid layout untuk courses
│   │   ├── CourseFilter.svelte            # Filter (track, category, price)
│   │   ├── CourseSearch.svelte            # Search bar
│   │   └── CourseEnrollButton.svelte      # Enroll button dengan payment flow
│   ├── learning/
│   │   ├── LessonSidebar.svelte           # Module/lesson navigation
│   │   ├── LessonContent.svelte           # Display lesson content
│   │   ├── VideoPlayer.svelte             # Video player (YouTube/Vimeo embed)
│   │   ├── PDFViewer.svelte               # PDF viewer
│   │   ├── NoteEditor.svelte              # Rich text note editor
│   │   ├── QuizTaker.svelte               # Quiz taking interface
│   │   └── AssignmentSubmitter.svelte     # Assignment submission form
│   ├── mentor/
│   │   ├── CourseBuilder/
│   │   │   ├── CourseWizard.svelte        # Step-by-step wizard
│   │   │   ├── ModuleEditor.svelte        # Module CRUD
│   │   │   ├── LessonEditor.svelte        # Lesson CRUD dengan rich text
│   │   │   ├── MaterialUploader.svelte    # File upload
│   │   │   ├── QuizBuilder.svelte         # Quiz builder
│   │   │   └── AssignmentBuilder.svelte   # Assignment builder
│   │   ├── GradingDashboard.svelte        # Grading overview
│   │   ├── SubmissionCard.svelte          # Submission card
│   │   ├── RubricGrader.svelte            # Rubric-based grading form
│   │   └── StudentProgressCard.svelte     # Student progress card
│   ├── facilitator/
│   │   ├── CohortMonitor.svelte           # Cohort monitoring dashboard
│   │   ├── CheckpointReviewer.svelte      # Checkpoint review interface
│   │   └── StudentSupportPanel.svelte     # Student support tools
│   └── admin/
│       ├── MetricsCard.svelte             # Metrics display card
│       ├── CourseApprovalCard.svelte      # Course approval interface
│       └── UserActivityTable.svelte       # User activity table
└── ui/
    ├── RichTextEditor.svelte              # Rich text editor (Tiptap atau Quill)
    ├── DragDropList.svelte                # Drag-and-drop list
    ├── Pagination.svelte                  # Pagination component
    ├── FilterBar.svelte                   # Generic filter bar
    └── ProgressBar.svelte                 # Progress bar
```

## API Endpoints

### Course Management

```typescript
// GET /api/courses - List courses dengan filter
// Query params: track, category, price, search, page, limit
// Response: { courses: Course[], total: number, page: number }

// POST /api/courses - Create course (mentor only)
// Body: { title, description, track, category, price, orgId }
// Response: { courseId: string }

// PUT /api/courses/[id] - Update course
// Body: Partial<Course>
// Response: { success: boolean }

// POST /api/courses/[id]/duplicate - Duplicate course
// Response: { newCourseId: string }

// POST /api/courses/[id]/publish - Publish course (change isDraft to false)
// Response: { success: boolean }
```

### Grading

```typescript
// GET /api/grading/pending - Get pending submissions (mentor only)
// Query params: courseId, orgId, page, limit
// Response: { submissions: Submission[], total: number }

// POST /api/grading/[submissionId] - Grade submission
// Body: { score, feedback, rubricScores: {criteria: score} }
// Response: { success: boolean }

// POST /api/grading/bulk - Bulk grade submissions
// Body: { submissionIds: string[], score, feedback }
// Response: { success: boolean, gradedCount: number }
```

### Learning

```typescript
// POST /api/learning/progress - Update lesson progress
// Body: { lessonId, completed: boolean, timeSpent: number }
// Response: { success: boolean }

// POST /api/learning/notes - Save lesson note
// Body: { lessonId, content, timestamp }
// Response: { noteId: string }

// POST /api/learning/quiz/submit - Submit quiz
// Body: { quizId, answers: {questionId: answer} }
// Response: { score: number, correct: number, total: number }

// POST /api/learning/assignment/submit - Submit assignment
// Body: { assignmentId, content, fileUrl }
// Response: { submissionId: string }
```

### Cohort Management

```typescript
// POST /api/cohorts - Create cohort (org admin/mentor)
// Body: { name, courseId, startDate, endDate, facilitatorId, orgId }
// Response: { cohortId: string }

// POST /api/cohorts/[id]/enroll - Enroll students to cohort
// Body: { studentIds: string[] }
// Response: { success: boolean, enrolledCount: number }

// GET /api/cohorts/[id]/progress - Get cohort progress
// Response: { students: StudentProgress[], avgCompletion: number }
```

## UI/UX Patterns

### Course Builder Wizard (Step-by-step)

```
Step 1: Basic Info
├── Title
├── Description
├── Track (Technical/Business/Hybrid)
├── Category
├── Thumbnail upload
└── [Next]

Step 2: Modules & Lessons
├── Add Module
│   ├── Module title
│   ├── Module description
│   └── Add Lesson
│       ├── Lesson title
│       ├── Lesson type (video/text/quiz/assignment)
│       ├── Content editor
│       └── [Save Lesson]
├── Drag-and-drop reorder
└── [Next]

Step 3: Pricing & Visibility
├── Price (free/paid)
├── Visibility (public/internal/draft)
├── Enrollment limit
└── [Publish Course]
```

### Grading Interface

```
┌─────────────────────────────────────────────────┐
│ Submission Detail                               │
├─────────────────────────────────────────────────┤
│ Student: John Doe                               │
│ Assignment: Build a Landing Page                │
│ Submitted: 2026-04-01 10:30                     │
│ Status: Pending                                 │
├─────────────────────────────────────────────────┤
│ Submission Content:                             │
│ [Display content/file preview]                  │
├─────────────────────────────────────────────────┤
│ Rubric Grading:                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Criteria 1: Code Quality        [5/10] ─────│ │
│ │ Criteria 2: Design              [8/10] ─────│ │
│ │ Criteria 3: Functionality       [7/10] ─────│ │
│ │ Total Score:                    [20/30]     │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Feedback:                                       │
│ [Rich text editor]                              │
├─────────────────────────────────────────────────┤
│ [Save Grade] [Save as Draft] [Cancel]          │
└─────────────────────────────────────────────────┘
```

### Learning Page Layout

```
┌─────────────────────────────────────────────────┐
│ Course: Web Development Fundamentals            │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │ Lesson Content                       │
│          │                                      │
│ Module 1 │ [Video Player]                       │
│ ✓ Intro  │                                      │
│ → HTML   │ Lesson: HTML Basics                  │
│   CSS    │                                      │
│          │ [Lesson text content]                │
│ Module 2 │                                      │
│   JS     │ [Note Editor]                        │
│   DOM    │                                      │
│          │ [Previous] [Mark Complete] [Next]    │
└──────────┴──────────────────────────────────────┘
```

## State Management

### Course Builder State

```typescript
// src/lib/stores/courseBuilder.ts
import { writable } from 'svelte/store';

interface CourseBuilderState {
	step: number; // 1, 2, 3
	course: {
		title: string;
		description: string;
		track: string;
		category: string;
		thumbnailUrl: string;
	};
	modules: Module[];
	pricing: {
		price: number;
		visibility: string;
	};
}

export const courseBuilderStore = writable<CourseBuilderState>({
	step: 1,
	course: {},
	modules: [],
	pricing: {}
});
```

### Learning State

```typescript
// src/lib/stores/learning.ts
import { writable } from 'svelte/store';

interface LearningState {
	currentLesson: Lesson | null;
	progress: number; // 0-100
	notes: Note[];
	bookmarks: string[]; // lessonIds
}

export const learningStore = writable<LearningState>({
	currentLesson: null,
	progress: 0,
	notes: [],
	bookmarks: []
});
```

## Performance Optimizations

### Pagination

```typescript
// Default: 20 items per page
const ITEMS_PER_PAGE = 20;

// Server-side pagination
const offset = (page - 1) * ITEMS_PER_PAGE;
const courses = await db.select().from(schema.course).limit(ITEMS_PER_PAGE).offset(offset);
```

### Lazy Loading

```typescript
// Video player - load on demand
<video src={videoUrl} preload="metadata" />

// PDF viewer - load on scroll
<iframe src={pdfUrl} loading="lazy" />
```

### Debounce Search

```typescript
// Search dengan debounce 300ms
let searchTimeout: NodeJS.Timeout;
function handleSearch(query: string) {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		// Fetch search results
	}, 300);
}
```

## Security Considerations

### RBAC Enforcement

```typescript
// Setiap route harus cek role
// Platform admin
if (user.role !== 'admin') throw redirect(302, '/app');

// Org-level (mentor, facilitator)
const membership = await requireOrgMembership(user.id, orgId, 'mentor');
```

### Input Validation

```typescript
// Validate semua input dari user
import { z } from 'zod';

const courseSchema = z.object({
	title: z.string().min(3).max(200),
	description: z.string().min(10).max(5000),
	price: z.number().min(0).max(10000000),
	track: z.enum(['technical', 'business', 'hybrid'])
});
```

### File Upload Security

```typescript
// Validate file type & size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

if (!ALLOWED_TYPES.includes(file.type)) {
	throw new Error('Invalid file type');
}
if (file.size > MAX_SIZE) {
	throw new Error('File too large');
}
```

## Testing Strategy

### Unit Tests

```typescript
// Test utility functions
describe('calculateProgress', () => {
	it('should calculate correct progress percentage', () => {
		const completed = 5;
		const total = 10;
		expect(calculateProgress(completed, total)).toBe(50);
	});
});
```

### Integration Tests

```typescript
// Test API endpoints
describe('POST /api/courses', () => {
  it('should create course for mentor', async () => {
    const response = await fetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Course', ... })
    });
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests (Playwright)

```typescript
// Test complete flow
test('mentor can create and publish course', async ({ page }) => {
	await page.goto('/app/organizations/test-org/mentor/courses/new');
	await page.fill('[name="title"]', 'Test Course');
	await page.click('button:has-text("Next")');
	// ... continue flow
	await page.click('button:has-text("Publish")');
	await expect(page.locator('text=Course published')).toBeVisible();
});
```

## Migration Plan

### Phase 1: Course Builder Enhancement (Week 1)

1. Buat CourseWizard component
2. Implement step-by-step flow
3. Add drag-and-drop reordering
4. Add rich text editor
5. Test dengan data dummy

### Phase 2: Grading System (Week 1)

1. Buat GradingDashboard component
2. Implement rubric grading
3. Add bulk grading
4. Test grading flow

### Phase 3: Learning Experience (Week 2)

1. Enhance LessonContent component
2. Add VideoPlayer & PDFViewer
3. Implement note-taking
4. Add quiz & assignment submission
5. Test learning flow

### Phase 4: Course Discovery (Week 2)

1. Enhance course catalog
2. Add filter & search
3. Implement enrollment flow
4. Test discovery & enrollment

## Rollback Plan

Jika ada breaking change:

1. Backup database sebelum migration
2. Test di staging environment dulu
3. Jika gagal, rollback via `pnpm run db:rollback`
4. Restore backup jika perlu

## Monitoring

### Metrics to Track

- Course creation rate (courses/day)
- Enrollment rate (enrollments/day)
- Completion rate (completed/enrolled)
- Grading time (avg time to grade)
- Student engagement (lessons/day, time spent)

### Error Tracking

- Use Sentry atau console.error untuk track errors
- Log semua API errors
- Monitor database query performance
