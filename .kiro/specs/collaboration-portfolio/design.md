# Design: Collaboration & Portfolio

## Database Schema

### Tabel Baru: userPortfolio

```typescript
export const userPortfolio = pgTable('user_portfolio', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	url: text('url'),
	screenshotUrl: text('screenshot_url'),
	tags: text('tags'), // JSON array
	courseId: text('course_id').references(() => course.id),
	track: text('track'), // 'technical' | 'business' | 'hybrid'
	isPublic: boolean('is_public').default(true),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});
```

### Tabel Baru: peerReview

```typescript
export const peerReview = pgTable('peer_review', {
	id: text('id').primaryKey(),
	submissionId: text('submission_id')
		.notNull()
		.references(() => submission.id),
	reviewerId: text('reviewer_id')
		.notNull()
		.references(() => user.id),
	scores: text('scores').notNull(), // JSON: { criteria: score }
	feedback: text('feedback'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});
```

## Routes

- `/app/portfolio` — student portfolio management
- `/portfolio/[username]` — public portfolio page (di routes/(public)/)
- `/app/learning/courses/[courseId]/peer-review` — peer review interface

## Components

- `PortfolioCard.svelte` — card untuk satu project
- `PeerReviewForm.svelte` — form rubrik penilaian
- `ProjectSpaceThread.svelte` — thread diskusi project
