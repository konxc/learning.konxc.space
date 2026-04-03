# Design: Career Support

## Database Schema

### Tabel Baru: referral

```typescript
export const referral = pgTable('referral', {
	id: text('id').primaryKey(),
	referrerId: text('referrer_id')
		.notNull()
		.references(() => user.id),
	refereeId: text('referee_id').references(() => user.id),
	code: text('code').notNull().unique(),
	status: text('status').default('pending'), // 'pending' | 'registered' | 'converted'
	rewardGiven: boolean('reward_given').default(false),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});
```

### Tabel Baru: placement

```typescript
export const placement = pgTable('placement', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	company: text('company').notNull(),
	role: text('role').notNull(),
	salaryMin: integer('salary_min'),
	salaryMax: integer('salary_max'),
	track: text('track'), // 'technical' | 'business' | 'hybrid'
	placedAt: timestamp('placed_at').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});
```

## Routes

- `/r/[code]` — referral redirect (di routes/(public)/)
- `/app/admin/placements` — admin placement management
- `/app/career` — student career dashboard
