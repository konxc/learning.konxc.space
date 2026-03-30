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
	lastWorkspaceId: text('last_workspace_id'), // To remember user's last active workspace
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' }) // Soft delete timestamp
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
	orgId: text('org_id').references(() => organization.id), // Owner organization
	category: text('category').default('general'), // 'marketing', 'technical', 'business'
	title: text('title').notNull(),
	description: text('description').notNull(),
	thumbnailUrl: text('thumbnail_url'),
	price: integer('price').notNull(),
	duration: integer('duration'), // in weeks
	status: text('status').notNull().default('draft'),
	featuresConfig: text('features_config'), // JSON string: { tracks: boolean, affiliate: boolean, performance: boolean }
	mentorId: text('mentor_id').references(() => user.id),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const enrollment = sqliteTable('enrollment', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	cohortId: text('cohort_id').references(() => cohort.id),
	track: text('track'), // 'creator' | 'seller' | 'affiliate'
	couponId: text('coupon_id').references(() => coupon.id),
	partnerId: text('partner_id'), // Partner organization ID (e.g., 'yayasan-asib')
	status: text('status').notNull().default('pending'),
	enrolledAt: integer('enrolled_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	activatedAt: integer('activated_at', { mode: 'timestamp' }),
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
	validFrom: integer('valid_from', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	validUntil: integer('valid_until', { mode: 'timestamp' }),
	description: text('description'),
	applicableCourses: text('applicable_courses'), // JSON array
	minPurchaseAmount: integer('min_purchase_amount'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true)
});

export const couponUsage = sqliteTable('coupon_usage', {
	id: text('id').primaryKey(),
	couponId: text('coupon_id')
		.notNull()
		.references(() => coupon.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id').references(() => course.id),
	discountAmount: integer('discount_amount').notNull(),
	orderAmount: integer('order_amount').notNull(),
	finalAmount: integer('final_amount').notNull(),
	usedAt: integer('used_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const mentorApplication = sqliteTable('mentor_application', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
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
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
	reviewedBy: text('reviewed_by').references(() => user.id)
});

export const waitingList = sqliteTable('waiting_list', {
	id: text('id').primaryKey(),
	fullName: text('full_name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone'),
	interest: text('interest'), // e.g. 'python', 'web', 'career-switch'
	source: text('source'), // e.g. 'landing-cta', 'ads', 'referral'
	school: text('school'), // Asal sekolah atau universitas
	enrollmentYear: text('enrollment_year'), // Tahun masuk
	educationStatus: text('education_status'), // 'lulus' | 'tidak-lulus' | 'aktif' | 'nonaktif'
	screenshot: text('screenshot'), // URL screenshot bukti follow Instagram
	instagramUsername: text('instagram_username'), // Username Instagram untuk verifikasi
	status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'qualified' | 'converted' | 'archived'
	notes: text('notes'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Course content hierarchy
export const module = sqliteTable('module', {
	id: text('id').primaryKey(),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	title: text('title').notNull(),
	order: integer('order').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const lesson = sqliteTable('lesson', {
	id: text('id').primaryKey(),
	moduleId: text('module_id')
		.notNull()
		.references(() => module.id),
	title: text('title').notNull(),
	order: integer('order').notNull(),
	availableFrom: integer('available_from', { mode: 'timestamp' }), // Drip content
	weekNumber: integer('week_number'),
	isFree: integer('is_free', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const material = sqliteTable('material', {
	id: text('id').primaryKey(),
	lessonId: text('lesson_id')
		.notNull()
		.references(() => lesson.id),
	type: text('type').notNull(),
	content: text('content'),
	url: text('url'),
	order: integer('order').notNull(),
	durationMs: integer('duration_ms'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Progress tracking
export const lessonProgress = sqliteTable('lesson_progress', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	lessonId: text('lesson_id')
		.notNull()
		.references(() => lesson.id),
	lastPositionMs: integer('last_position_ms'),
	completedAt: integer('completed_at', { mode: 'timestamp' })
});

// Lesson Notes (sync from localStorage to server)
export const lessonNote = sqliteTable('lesson_note', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	lessonId: text('lesson_id')
		.notNull()
		.references(() => lesson.id),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Quiz & assessment
export const quiz = sqliteTable('quiz', {
	id: text('id').primaryKey(),
	lessonId: text('lesson_id')
		.notNull()
		.references(() => lesson.id),
	title: text('title').notNull(),
	passingScore: integer('passing_score').notNull(), // 0-100
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const quizQuestion = sqliteTable('quiz_question', {
	id: text('id').primaryKey(),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quiz.id),
	type: text('type').notNull(), // 'mcq'
	question: text('question').notNull(),
	order: integer('order_index').notNull()
});

export const quizChoice = sqliteTable('quiz_choice', {
	id: text('id').primaryKey(),
	questionId: text('question_id')
		.notNull()
		.references(() => quizQuestion.id),
	text: text('text').notNull(),
	isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false)
});

export const submission = sqliteTable('submission', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	lessonId: text('lesson_id').references(() => lesson.id),
	quizId: text('quiz_id').references(() => quiz.id),
	type: text('type').notNull(), // 'quiz' | 'assignment'
	payload: text('payload'), // JSON string (answers or content)
	metadata: text('metadata'), // JSON string (links, stats, tracking etc)
	score: integer('score'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const submissionGrade = sqliteTable('submission_grade', {
	id: text('id').primaryKey(),
	submissionId: text('submission_id')
		.notNull()
		.references(() => submission.id),
	gradedBy: text('graded_by').references(() => user.id),
	score: integer('score').notNull(),
	feedback: text('feedback'),
	gradedAt: integer('graded_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Certificates
export const certificate = sqliteTable('certificate', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	serial: text('serial').notNull().unique(),
	issuedAt: integer('issued_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	signature: text('signature')
});

// Payment proofs (temporary base64 storage)
export const paymentProof = sqliteTable('payment_proof', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	dataBase64: text('data_base64').notNull(),
	mime: text('mime').notNull(),
	size: integer('size').notNull(),
	status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
	notes: text('notes'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Midtrans Transactions
export const transaction = sqliteTable('transaction', {
	id: text('id').primaryKey(), // Order ID (e.g. NC-TRX-...)
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	amount: integer('amount').notNull(),
	status: text('status').notNull().default('pending'), // 'pending', 'settlement', 'expire', 'cancel', 'deny'
	paymentType: text('payment_type'),
	snapToken: text('snap_token'),
	snapUrl: text('snap_url'),
	payload: text('payload'), // JSON from Midtrans
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const cohort = sqliteTable('cohort', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	facilitatorId: text('facilitator_id').references(() => user.id), // Assigned facilitator
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }),
	status: text('status').notNull().default('active'), // 'active' | 'archived'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const partner = sqliteTable('partner', {
	id: text('id').primaryKey(), // e.g., 'yayasan-asib'
	name: text('name').notNull(), // e.g., 'Yayasan ASIB'
	description: text('description'),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	status: text('status').notNull().default('active'), // 'active' | 'inactive'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Organization/Workspace Support
export const organization = sqliteTable('organization', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	logoUrl: text('logo_url'),
	brandColor: text('brand_color').default('#4f46e5'),
	planType: text('plan_type').notNull().default('free'), // 'free' | 'pro' | 'enterprise'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const organizationMember = sqliteTable('organization_member', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	role: text('role').notNull().default('member'), // 'owner' | 'admin' | 'creator' | 'facilitator' | 'member'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const organizationInvitation = sqliteTable('organization_invitation', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	email: text('email').notNull(),
	role: text('role').notNull().default('member'),
	token: text('token').notNull().unique(),
	invitedBy: text('invited_by')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Workspace (sub-division within organization)
export const workspace = sqliteTable('workspace', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	name: text('name').notNull(),
	description: text('description'),
	logoUrl: text('logo_url'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Workspace Member (users in workspace with roles)
export const workspaceMember = sqliteTable('workspace_member', {
	id: text('id').primaryKey(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspace.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	role: text('role').notNull().default('member'), // 'admin' | 'member' | 'viewer'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Plugin Registry
export const pluginRegistry = sqliteTable('plugin_registry', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	version: text('version').notNull().default('1.0.0'),
	type: text('type').notNull(), // 'social' | 'assessment' | 'gamification' | 'content' | 'analytics' | 'communication'
	description: text('description'),
	icon: text('icon').default('📦'),
	dependencies: text('dependencies').default('[]'), // JSON array of plugin IDs
	defaultConfig: text('default_config').default('{}'), // JSON object
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const coursePlugin = sqliteTable('course_plugin', {
	id: text('id').primaryKey(),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	pluginId: text('plugin_id')
		.notNull()
		.references(() => pluginRegistry.id),
	isEnabled: integer('is_enabled', { mode: 'boolean' }).notNull().default(true),
	config: text('config').default('{}'), // JSON object for course-specific config
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Course = typeof course.$inferSelect;
export type Enrollment = typeof enrollment.$inferSelect;
export type Coupon = typeof coupon.$inferSelect;
export type CouponUsage = typeof couponUsage.$inferSelect;
export type MentorApplication = typeof mentorApplication.$inferSelect;
export type WaitingList = typeof waitingList.$inferSelect;
export type Module = typeof module.$inferSelect;
export type Lesson = typeof lesson.$inferSelect;
export type Material = typeof material.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type LessonNote = typeof lessonNote.$inferSelect;
export type Quiz = typeof quiz.$inferSelect;
export type QuizQuestion = typeof quizQuestion.$inferSelect;
export type QuizChoice = typeof quizChoice.$inferSelect;
export type Submission = typeof submission.$inferSelect;
export type SubmissionGrade = typeof submissionGrade.$inferSelect;
export type Certificate = typeof certificate.$inferSelect;
export type PaymentProof = typeof paymentProof.$inferSelect;
export type Transaction = typeof transaction.$inferSelect;
export type Cohort = typeof cohort.$inferSelect;
export type Partner = typeof partner.$inferSelect;
export type Organization = typeof organization.$inferSelect;
export type OrganizationMember = typeof organizationMember.$inferSelect;
export type OrganizationInvitation = typeof organizationInvitation.$inferSelect;
export type Workspace = typeof workspace.$inferSelect;
export type WorkspaceMember = typeof workspaceMember.$inferSelect;
export type Notification = typeof notification.$inferSelect;
export type EmailLog = typeof emailLog.$inferSelect;
export type WhatsAppLog = typeof whatsappLog.$inferSelect;
export type AffiliateSale = typeof affiliateSale.$inferSelect;
export type AffiliateLink = typeof affiliateLink.$inferSelect;
export type CourseReview = typeof courseReview.$inferSelect;
export type UserXP = typeof userXP.$inferSelect;
export type Badge = typeof badge.$inferSelect;
export type UserBadge = typeof userBadge.$inferSelect;
export type Checkpoint = typeof checkpoint.$inferSelect;
export type CheckpointSubmission = typeof checkpointSubmission.$inferSelect;
export type Discussion = typeof discussion.$inferSelect;
export type BroadcastMessage = typeof broadcastMessage.$inferSelect;
export type PluginRegistry = typeof pluginRegistry.$inferSelect;
export type CoursePlugin = typeof coursePlugin.$inferSelect;

// Notifications
export const notification = sqliteTable('notification', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	type: text('type').notNull(), // 'enrollment', 'grade', 'submission', 'certificate', 'system'
	title: text('title').notNull(),
	message: text('message').notNull(),
	link: text('link'), // URL to navigate to
	read: integer('read', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Broadcast Messages (from mentor/admin to students)
export const broadcastMessage = sqliteTable('broadcast_message', {
	id: text('id').primaryKey(),
	senderId: text('sender_id')
		.notNull()
		.references(() => user.id),
	title: text('title').notNull(),
	content: text('content').notNull(),
	targetRole: text('target_role'), // 'all', 'mentor', 'learner', 'partner'
	targetCohortId: text('target_cohort_id').references(() => cohort.id),
	targetCourseId: text('target_course_id').references(() => course.id),
	sentVia: text('sent_via').notNull().default('notification'), // 'notification', 'email', 'whatsapp', 'all'
	status: text('status').notNull().default('pending'), // 'pending', 'sent', 'failed'
	recipientCount: integer('recipient_count').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Email notifications log
export const emailLog = sqliteTable('email_log', {
	id: text('id').primaryKey(),
	to: text('to').notNull(),
	subject: text('subject').notNull(),
	type: text('type').notNull(), // 'welcome', 'enrollment', 'grade', 'certificate', 'reminder'
	status: text('status').notNull().default('pending'), // 'pending', 'sent', 'failed'
	error: text('error'),
	sentAt: integer('sent_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// WhatsApp notifications log
export const whatsappLog = sqliteTable('whatsapp_log', {
	id: text('id').primaryKey(),
	to: text('to').notNull(),
	type: text('type').notNull(), // 'welcome', 'enrollment', 'grade', 'certificate', 'reminder'
	status: text('status').notNull().default('pending'), // 'pending', 'sent', 'failed'
	error: text('error'),
	messageId: text('message_id'),
	sentAt: integer('sent_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Affiliate Sales Tracking
export const affiliateSale = sqliteTable('affiliate_sale', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	affiliateLinkId: text('affiliate_link_id'), // Reference to the link used
	productName: text('product_name').notNull(),
	platform: text('platform').notNull(), // 'shopee', 'tokopedia', 'tiktok_shop', 'lazada', 'other'
	saleAmount: integer('sale_amount').notNull(), // In rupiah
	commissionAmount: integer('commission_amount'), // In rupiah
	commissionRate: integer('commission_rate'), // Percentage (0-100)
	currency: text('currency').notNull().default('IDR'),
	transactionId: text('transaction_id'), // External transaction ID
	link: text('link'), // URL to the product
	status: text('status').notNull().default('pending'), // 'pending', 'confirmed', 'paid', 'cancelled'
	notes: text('notes'),
	recordedAt: integer('recorded_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Affiliate Links/Products
export const affiliateLink = sqliteTable('affiliate_link', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	platform: text('platform').notNull(), // 'shopee', 'tokopedia', 'tiktok_shop', 'lazada', 'other'
	url: text('url').notNull(),
	productPrice: integer('product_price'), // Recommended price
	commissionRate: integer('commission_rate'), // Default commission rate
	clicks: integer('clicks').notNull().default(0),
	conversions: integer('conversions').notNull().default(0),
	status: text('status').notNull().default('active'), // 'active', 'inactive'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Course Reviews
export const courseReview = sqliteTable('course_review', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	rating: integer('rating').notNull(), // 1-5 stars
	comment: text('comment'),
	moderationStatus: text('moderation_status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// User XP/Points for gamification
export const userXP = sqliteTable('user_xp', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	points: integer('points').notNull().default(0),
	level: integer('level').notNull().default(1),
	streakDays: integer('streak_days').notNull().default(0),
	lastActiveAt: integer('last_active_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Badges/Achievements
export const badge = sqliteTable('badge', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	icon: text('icon'), // emoji or icon name
	criteria: text('criteria').notNull(), // JSON criteria
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// User Badges
export const userBadge = sqliteTable('user_badge', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	badgeId: text('badge_id')
		.notNull()
		.references(() => badge.id),
	earnedAt: integer('earned_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Weekly Checkpoints for batches
export const checkpoint = sqliteTable('checkpoint', {
	id: text('id').primaryKey(),
	cohortId: text('cohort_id')
		.notNull()
		.references(() => cohort.id),
	title: text('title').notNull(),
	description: text('description'),
	weekNumber: integer('week_number').notNull(),
	dueDate: integer('due_date', { mode: 'timestamp' }),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Student Checkpoint Submissions
export const checkpointSubmission = sqliteTable('checkpoint_submission', {
	id: text('id').primaryKey(),
	checkpointId: text('checkpoint_id')
		.notNull()
		.references(() => checkpoint.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	notes: text('notes'),
	completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
	submittedAt: integer('submitted_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Discussion/Forum
export const discussion = sqliteTable('discussion', (t) => ({
	id: t.text('id').primaryKey(),
	userId: t
		.text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: t.text('course_id').references(() => course.id),
	lessonId: t.text('lesson_id').references(() => lesson.id),
	parentId: t.text('parent_id').references((): any => discussion.id),
	title: t.text('title'),
	content: t.text('content').notNull(),
	upvotes: t.integer('upvotes').notNull().default(0),
	isPinned: t.integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
	createdAt: t
		.integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: t
		.integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
}));

// ============================================================
// VERIFICATION SYSTEMS
// ============================================================

// User KTP Verification (Required to create Organization)
export const userVerification = sqliteTable('user_verification', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
		.unique(),
	// KTP Data
	ktpNumber: text('ktp_number'),
	ktpName: text('ktp_name'),
	ktpAddress: text('ktp_address'),
	ktpDob: integer('ktp_dob', { mode: 'timestamp' }), // Date of birth
	ktpPhotoUrl: text('ktp_photo_url'), // Base64 or uploaded URL
	selfieWithKtpUrl: text('selfie_with_ktp_url'),
	// Status
	status: text('status').default('pending'), // 'pending' | 'approved' | 'rejected'
	verifiedAt: integer('verified_at', { mode: 'timestamp' }),
	verifiedBy: text('verified_by').references(() => user.id),
	rejectionReason: text('rejection_reason'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Organization Verification (Trusted/Verified badge)
export const organizationVerification = sqliteTable('organization_verification', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id)
		.unique(),
	// Legal Entity Data
	legalName: text('legal_name'), // "Yayasan ASIB", "PT Koneksi Digital"
	legalType: text('legal_type'), // 'yayasan' | 'pt' | 'cv' | 'koperasi' | 'perorangan'
	npwp: text('npwp'),
	skPendirian: text('sk_pendirian'), // URL to document
	siup: text('siup'), // Optional
	// Representative
	representativeName: text('representative_name'), // Penanggung jawab
	representativeKtp: text('representative_ktp'),
	representativePosition: text('representative_position'), // 'ketua' | 'direktur' | 'pemilik'
	// Address
	legalAddress: text('legal_address'),
	city: text('city'),
	province: text('province'),
	postalCode: text('postal_code'),
	// Verification
	status: text('status').default('pending'), // 'pending' | 'verified' | 'rejected'
	verifiedAt: integer('verified_at', { mode: 'timestamp' }),
	verifiedBy: text('verified_by').references(() => user.id),
	rejectionReason: text('rejection_reason'),
	// Trust Benefits
	isTrusted: integer('is_trusted', { mode: 'boolean' }).default(false),
	trustedBadgeUrl: text('trusted_badge_url'),
	// Timestamps
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// ============================================================
// AUTO-AFFILIATE SYSTEM FOR MENTORS & FACILITATORS
// ============================================================

// Affiliate Account (Auto-created when user becomes mentor/facilitator)
export const affiliateAccount = sqliteTable('affiliate_account', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	role: text('role').notNull(), // 'mentor' | 'facilitator'
	// Commission
	commissionRate: integer('commission_rate').default(25), // Default 25%
	totalEarnings: integer('total_earnings').default(0),
	pendingPayout: integer('pending_payout').default(0),
	paidOut: integer('paid_out').default(0),
	// Payout Info
	bankName: text('bank_name'),
	bankAccountNumber: text('bank_account_number'),
	bankAccountName: text('bank_account_name'),
	// Status
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	// Tier (based on tracker points)
	tier: text('tier').default('bronze'), // 'bronze' | 'silver' | 'gold' | 'platinum'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Affiliate Links (Auto-generated for mentors/facilitators)
export const autoAffiliateLink = sqliteTable('auto_affiliate_link', {
	id: text('id').primaryKey(),
	accountId: text('account_id')
		.notNull()
		.references(() => affiliateAccount.id),
	courseId: text('course_id').references(() => course.id), // null = org landing page
	orgId: text('org_id').references(() => organization.id),
	// Link
	code: text('code').notNull().unique(), // e.g., "mentor-budi-abc123"
	url: text('url').notNull(), // Full URL
	// Tracking
	clickCount: integer('click_count').default(0),
	conversionCount: integer('conversion_count').default(0),
	// Status
	isActive: integer('is_active', { mode: 'boolean' }).default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// ============================================================
// TRACKER SYSTEM (Differentiating Feature)
// ============================================================

// User Tracker Points - Enhanced gamification
export const userTracker = sqliteTable('user_tracker', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	// Points
	totalPoints: integer('total_points').default(0),
	weeklyPoints: integer('weekly_points').default(0),
	// Streak
	currentStreak: integer('current_streak').default(0),
	longestStreak: integer('longest_streak').default(0),
	lastActiveDate: text('last_active_date'), // YYYY-MM-DD format
	// Stats
	totalLessonsCompleted: integer('total_lessons_completed').default(0),
	totalCheckpointsCompleted: integer('total_checkpoints_completed').default(0),
	totalDiscussions: integer('total_discussions').default(0),
	totalReferrals: integer('total_referrals').default(0),
	// Tier
	tier: text('tier').default('starter'), // 'starter' | 'learner' | 'achiever' | 'champion' | 'legend'
	tierProgress: integer('tier_progress').default(0), // Points to next tier
	// Rewards
	earnedCoupons: integer('earned_coupons').default(0),
	earnedCertificates: integer('earned_certificates').default(0),
	// Timestamps
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Tracker Activity Log
export const trackerActivity = sqliteTable('tracker_activity', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activityType: text('activity_type').notNull(), // 'lesson_complete' | 'checkpoint' | 'discussion' | 'referral' | 'streak'
	points: integer('points').notNull(),
	description: text('description'),
	referenceId: text('reference_id'), // lessonId, checkpointId, etc
	referenceType: text('reference_type'), // 'lesson' | 'checkpoint' | 'discussion' | 'referral'
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// ============================================================
// USER PREFERENCES (Telemetry for Personalization)
// ============================================================

export const userPreferences = sqliteTable('user_preferences', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	// Goals: what user wants to achieve
	goals: text('goals'), // JSON: ["career", "business", "skill", "hobby"]
	// Interests: topics user is interested in
	interests: text('interests'), // JSON: ["creator", "affiliate", "seller", "smm", "seo"]
	// Experience level
	experienceLevel: text('experience_level'), // 'beginner' | 'intermediate' | 'advanced'
	// Learning schedule preference
	learningSchedule: text('learning_schedule'), // 'morning' | 'afternoon' | 'evening' | 'flexible'
	// Notification preferences
	notificationPrefs: text('notification_prefs'), // JSON: ["email", "wa", "push"]
	// Timestamps
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
