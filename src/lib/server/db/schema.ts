import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').notNull().default('user'),
	fullName: text('full_name'),
	email: text('email'),
	phone: text('phone'),
	onboardingCompleted: integer('onboarding_completed', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const course = sqliteTable('course', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	thumbnailUrl: text('thumbnail_url'),
	price: integer('price').notNull(),
	duration: integer('duration'), // in weeks
	status: text('status').notNull().default('draft'),
	mentorId: text('mentor_id').references(() => user.id),
	createdBy: text('created_by').notNull().references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const enrollment = sqliteTable('enrollment', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	courseId: text('course_id').notNull().references(() => course.id),
	couponId: text('coupon_id').references(() => coupon.id),
	status: text('status').notNull().default('active'),
	enrolledAt: integer('enrolled_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	completedAt: integer('completed_at', { mode: 'timestamp' })
});

export const coupon = sqliteTable('coupon', {
	id: text('id').primaryKey(),
	code: text('code').notNull().unique(),
	type: text('type').notNull(), // 'discount' | 'free'
	discountType: text('discount_type'), // 'percentage' | 'fixed'
	discountValue: integer('discount_value'),
	maxUses: integer('max_uses'),
	currentUses: integer('current_uses').notNull().default(0),
	validFrom: integer('valid_from', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	validUntil: integer('valid_until', { mode: 'timestamp' }),
	description: text('description'),
	applicableCourses: text('applicable_courses'), // JSON array
	minPurchaseAmount: integer('min_purchase_amount'),
	createdBy: text('created_by').notNull().references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true)
});

export const couponUsage = sqliteTable('coupon_usage', {
	id: text('id').primaryKey(),
	couponId: text('coupon_id').notNull().references(() => coupon.id),
	userId: text('user_id').notNull().references(() => user.id),
	courseId: text('course_id').references(() => course.id),
	discountAmount: integer('discount_amount').notNull(),
	orderAmount: integer('order_amount').notNull(),
	finalAmount: integer('final_amount').notNull(),
	usedAt: integer('used_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const mentorApplication = sqliteTable('mentor_application', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	fullName: text('full_name').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull(),
	bio: text('bio').notNull(),
	expertise: text('expertise').notNull(),
	yearsExperience: integer('years_experience').notNull(),
	portfolioUrl: text('portfolio_url'),
	githubUrl: text('github_url'),
	linkedinUrl: text('linkedin_url'),
	motivation: text('motivation').notNull(),
	status: text('status').notNull().default('pending'),
	adminNotes: text('admin_notes'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
	reviewedBy: text('reviewed_by').references(() => user.id)
});

export const waitingList = sqliteTable('waiting_list', {
	id: text('id').primaryKey(),
	fullName: text('full_name').notNull(),
	email: text('email').notNull(),
	phone: text('phone'),
	interest: text('interest'), // e.g. 'python', 'web', 'career-switch'
	source: text('source'), // e.g. 'landing-cta', 'ads', 'referral'
	status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'qualified' | 'converted' | 'archived'
	notes: text('notes'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Course = typeof course.$inferSelect;
export type Enrollment = typeof enrollment.$inferSelect;
export type Coupon = typeof coupon.$inferSelect;
export type CouponUsage = typeof couponUsage.$inferSelect;
export type MentorApplication = typeof mentorApplication.$inferSelect;
export type WaitingList = typeof waitingList.$inferSelect;
