import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').notNull().default('user'),
	fullName: text('full_name'),
	email: text('email'),
	phone: text('phone'),
	avatarUrl: text('avatar_url'),
	onboardingCompleted: boolean('onboarding_completed').default(false),
	lastWorkspaceId: text('last_workspace_id'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	deletedAt: timestamp('deleted_at')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const organization = pgTable('organization', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	logoUrl: text('logo_url'),
	brandColor: text('brand_color').default('#4f46e5'),
	planType: text('plan_type').notNull().default('free'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const course = pgTable('course', {
	id: text('id').primaryKey(),
	orgId: text('org_id').references(() => organization.id),
	category: text('category').default('general'),
	title: text('title').notNull(),
	description: text('description').notNull(),
	thumbnailUrl: text('thumbnail_url'),
	price: integer('price').notNull(),
	duration: integer('duration'),
	status: text('status').notNull().default('draft'),
	visibility: text('visibility').notNull().default('public'),
	featuresConfig: text('features_config'),
	mentorId: text('mentor_id').references(() => user.id),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date()),
	deletedAt: timestamp('deleted_at')
});

export const coupon = pgTable('coupon', {
	id: text('id').primaryKey(),
	code: text('code').notNull().unique(),
	type: text('type').notNull(),
	discountType: text('discount_type'),
	discountValue: integer('discount_value'),
	maxUses: integer('max_uses'),
	currentUses: integer('current_uses').notNull().default(0),
	validFrom: timestamp('valid_from')
		.notNull()
		.$defaultFn(() => new Date()),
	validUntil: timestamp('valid_until'),
	description: text('description'),
	applicableCourses: text('applicable_courses'),
	minPurchaseAmount: integer('min_purchase_amount'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	isActive: boolean('is_active').notNull().default(true)
});

export const cohort = pgTable('cohort', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	facilitatorId: text('facilitator_id').references(() => user.id),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date'),
	status: text('status').notNull().default('active'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const enrollment = pgTable('enrollment', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	cohortId: text('cohort_id').references(() => cohort.id),
	track: text('track'),
	couponId: text('coupon_id').references(() => coupon.id),
	partnerId: text('partner_id'),
	status: text('status').notNull().default('pending'),
	enrolledAt: timestamp('enrolled_at')
		.notNull()
		.$defaultFn(() => new Date()),
	activatedAt: timestamp('activated_at'),
	completedAt: timestamp('completed_at')
});

export const couponUsage = pgTable('coupon_usage', {
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
	usedAt: timestamp('used_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const mentorApplication = pgTable('mentor_application', {
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
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	reviewedAt: timestamp('reviewed_at'),
	reviewedBy: text('reviewed_by').references(() => user.id)
});

export const waitingList = pgTable('waiting_list', {
	id: text('id').primaryKey(),
	fullName: text('full_name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone'),
	interest: text('interest'),
	source: text('source'),
	school: text('school'),
	enrollmentYear: text('enrollment_year'),
	educationStatus: text('education_status'),
	screenshot: text('screenshot'),
	instagramUsername: text('instagram_username'),
	status: text('status').notNull().default('new'),
	notes: text('notes'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const module = pgTable('module', {
	id: text('id').primaryKey(),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	title: text('title').notNull(),
	order: integer('order').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const lesson = pgTable('lesson', {
	id: text('id').primaryKey(),
	moduleId: text('module_id')
		.notNull()
		.references(() => module.id),
	title: text('title').notNull(),
	order: integer('order').notNull(),
	availableFrom: timestamp('available_from'),
	weekNumber: integer('week_number'),
	isFree: boolean('is_free').default(false),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const material = pgTable('material', {
	id: text('id').primaryKey(),
	lessonId: text('lesson_id')
		.notNull()
		.references(() => lesson.id),
	type: text('type').notNull(),
	content: text('content'),
	url: text('url'),
	order: integer('order').notNull(),
	durationMs: integer('duration_ms'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const lessonProgress = pgTable('lesson_progress', {
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
	completedAt: timestamp('completed_at')
});

export const lessonNote = pgTable('lesson_note', {
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
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const quiz = pgTable('quiz', {
	id: text('id').primaryKey(),
	lessonId: text('lesson_id')
		.notNull()
		.references(() => lesson.id),
	title: text('title').notNull(),
	passingScore: integer('passing_score').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const quizQuestion = pgTable('quiz_question', {
	id: text('id').primaryKey(),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quiz.id),
	type: text('type').notNull(),
	question: text('question').notNull(),
	order: integer('order_index').notNull(),
	expectedKeywords: text('expected_keywords'),
	maxScore: integer('max_score').default(10)
});

export const quizChoice = pgTable('quiz_choice', {
	id: text('id').primaryKey(),
	questionId: text('question_id')
		.notNull()
		.references(() => quizQuestion.id),
	text: text('text').notNull(),
	isCorrect: boolean('is_correct').notNull().default(false)
});

export const submission = pgTable('submission', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	lessonId: text('lesson_id').references(() => lesson.id),
	quizId: text('quiz_id').references(() => quiz.id),
	type: text('type').notNull(),
	payload: text('payload'),
	metadata: text('metadata'),
	score: integer('score'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const submissionGrade = pgTable('submission_grade', {
	id: text('id').primaryKey(),
	submissionId: text('submission_id')
		.notNull()
		.references(() => submission.id),
	gradedBy: text('graded_by').references(() => user.id),
	score: integer('score').notNull(),
	feedback: text('feedback'),
	gradedAt: timestamp('graded_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const certificate = pgTable('certificate', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	serial: text('serial').notNull().unique(),
	issuedAt: timestamp('issued_at')
		.notNull()
		.$defaultFn(() => new Date()),
	signature: text('signature')
});

export const paymentProof = pgTable('payment_proof', {
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
	status: text('status').notNull().default('pending'),
	notes: text('notes'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const transaction = pgTable('transaction', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id').references(() => course.id),
	orgId: text('org_id').references(() => organization.id),
	amount: integer('amount').notNull(),
	status: text('status').notNull().default('pending'),
	paymentType: text('payment_type'),
	snapToken: text('snap_token'),
	snapUrl: text('snap_url'),
	payload: text('payload'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const partner = pgTable('partner', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	status: text('status').notNull().default('active'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const organizationMember = pgTable('organization_member', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	role: text('role').notNull().default('member'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const organizationInvitation = pgTable('organization_invitation', {
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
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const workspace = pgTable('workspace', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	name: text('name').notNull(),
	description: text('description'),
	logoUrl: text('logo_url'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const workspaceMember = pgTable('workspace_member', {
	id: text('id').primaryKey(),
	workspaceId: text('workspace_id')
		.notNull()
		.references(() => workspace.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	role: text('role').notNull().default('member'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const pluginRegistry = pgTable('plugin_registry', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	version: text('version').notNull().default('1.0.0'),
	type: text('type').notNull(),
	description: text('description'),
	icon: text('icon').default('📦'),
	dependencies: text('dependencies').default('[]'),
	defaultConfig: text('default_config').default('{}'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const coursePlugin = pgTable('course_plugin', {
	id: text('id').primaryKey(),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	pluginId: text('plugin_id')
		.notNull()
		.references(() => pluginRegistry.id),
	isEnabled: boolean('is_enabled').notNull().default(true),
	config: text('config').default('{}'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const notification = pgTable('notification', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	type: text('type').notNull(),
	title: text('title').notNull(),
	message: text('message').notNull(),
	link: text('link'),
	read: boolean('read').notNull().default(false),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const broadcastMessage = pgTable('broadcast_message', {
	id: text('id').primaryKey(),
	senderId: text('sender_id')
		.notNull()
		.references(() => user.id),
	title: text('title').notNull(),
	content: text('content').notNull(),
	targetRole: text('target_role'),
	targetCohortId: text('target_cohort_id').references(() => cohort.id),
	targetCourseId: text('target_course_id').references(() => course.id),
	sentVia: text('sent_via').notNull().default('notification'),
	status: text('status').notNull().default('pending'),
	recipientCount: integer('recipient_count').default(0),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const emailLog = pgTable('email_log', {
	id: text('id').primaryKey(),
	to: text('to').notNull(),
	subject: text('subject').notNull(),
	type: text('type').notNull(),
	status: text('status').notNull().default('pending'),
	error: text('error'),
	sentAt: timestamp('sent_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const whatsappLog = pgTable('whatsapp_log', {
	id: text('id').primaryKey(),
	to: text('to').notNull(),
	type: text('type').notNull(),
	status: text('status').notNull().default('pending'),
	error: text('error'),
	messageId: text('message_id'),
	sentAt: timestamp('sent_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const affiliateSale = pgTable('affiliate_sale', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	affiliateLinkId: text('affiliate_link_id'),
	productName: text('product_name').notNull(),
	platform: text('platform').notNull(),
	saleAmount: integer('sale_amount').notNull(),
	commissionAmount: integer('commission_amount'),
	commissionRate: integer('commission_rate'),
	currency: text('currency').notNull().default('IDR'),
	transactionId: text('transaction_id'),
	link: text('link'),
	status: text('status').notNull().default('pending'),
	notes: text('notes'),
	recordedAt: timestamp('recorded_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const affiliateLink = pgTable('affiliate_link', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	platform: text('platform').notNull(),
	url: text('url').notNull(),
	productPrice: integer('product_price'),
	commissionRate: integer('commission_rate'),
	clicks: integer('clicks').notNull().default(0),
	conversions: integer('conversions').notNull().default(0),
	status: text('status').notNull().default('active'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const courseReview = pgTable('course_review', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id')
		.notNull()
		.references(() => course.id),
	rating: integer('rating').notNull(),
	comment: text('comment'),
	moderationStatus: text('moderation_status').notNull().default('pending'),
	responseBy: text('response_by').references(() => user.id),
	response: text('response'),
	responseAt: timestamp('response_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const userXP = pgTable('user_xp', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	points: integer('points').notNull().default(0),
	level: integer('level').notNull().default(1),
	streakDays: integer('streak_days').notNull().default(0),
	lastActiveAt: timestamp('last_active_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const badge = pgTable('badge', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	icon: text('icon'),
	criteria: text('criteria').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const userBadge = pgTable('user_badge', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	badgeId: text('badge_id')
		.notNull()
		.references(() => badge.id),
	earnedAt: timestamp('earned_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const checkpoint = pgTable('checkpoint', {
	id: text('id').primaryKey(),
	cohortId: text('cohort_id')
		.notNull()
		.references(() => cohort.id),
	title: text('title').notNull(),
	description: text('description'),
	weekNumber: integer('week_number').notNull(),
	dueDate: timestamp('due_date'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const checkpointSubmission = pgTable('checkpoint_submission', {
	id: text('id').primaryKey(),
	checkpointId: text('checkpoint_id')
		.notNull()
		.references(() => checkpoint.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	notes: text('notes'),
	completed: boolean('completed').notNull().default(false),
	submittedAt: timestamp('submitted_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const discussion = pgTable('discussion', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	courseId: text('course_id').references(() => course.id),
	lessonId: text('lesson_id').references(() => lesson.id),
	parentId: text('parent_id'),
	title: text('title'),
	content: text('content').notNull(),
	upvotes: integer('upvotes').notNull().default(0),
	isPinned: boolean('is_pinned').notNull().default(false),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const userVerification = pgTable('user_verification', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
		.unique(),
	ktpNumber: text('ktp_number'),
	ktpName: text('ktp_name'),
	ktpAddress: text('ktp_address'),
	ktpDob: timestamp('ktp_dob'),
	ktpPhotoUrl: text('ktp_photo_url'),
	selfieWithKtpUrl: text('selfie_with_ktp_url'),
	status: text('status').default('pending'),
	verifiedAt: timestamp('verified_at'),
	verifiedBy: text('verified_by').references(() => user.id),
	rejectionReason: text('rejection_reason'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const organizationVerification = pgTable('organization_verification', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id)
		.unique(),
	legalName: text('legal_name'),
	legalType: text('legal_type'),
	npwp: text('npwp'),
	skPendirian: text('sk_pendirian'),
	siup: text('siup'),
	representativeName: text('representative_name'),
	representativeKtp: text('representative_ktp'),
	representativePosition: text('representative_position'),
	legalAddress: text('legal_address'),
	city: text('city'),
	province: text('province'),
	postalCode: text('postal_code'),
	status: text('status').default('pending'),
	verifiedAt: timestamp('verified_at'),
	verifiedBy: text('verified_by').references(() => user.id),
	rejectionReason: text('rejection_reason'),
	isTrusted: boolean('is_trusted').default(false),
	trustedBadgeUrl: text('trusted_badge_url'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const affiliateAccount = pgTable('affiliate_account', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	role: text('role').notNull(),
	commissionRate: integer('commission_rate').default(25),
	totalEarnings: integer('total_earnings').default(0),
	pendingPayout: integer('pending_payout').default(0),
	paidOut: integer('paid_out').default(0),
	bankName: text('bank_name'),
	bankAccountNumber: text('bank_account_number'),
	bankAccountName: text('bank_account_name'),
	isActive: boolean('is_active').default(true),
	tier: text('tier').default('bronze'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const autoAffiliateLink = pgTable('auto_affiliate_link', {
	id: text('id').primaryKey(),
	accountId: text('account_id')
		.notNull()
		.references(() => affiliateAccount.id),
	courseId: text('course_id').references(() => course.id),
	orgId: text('org_id').references(() => organization.id),
	code: text('code').notNull().unique(),
	url: text('url').notNull(),
	clickCount: integer('click_count').default(0),
	conversionCount: integer('conversion_count').default(0),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const userTracker = pgTable('user_tracker', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	totalPoints: integer('total_points').default(0),
	weeklyPoints: integer('weekly_points').default(0),
	currentStreak: integer('current_streak').default(0),
	longestStreak: integer('longest_streak').default(0),
	lastActiveDate: text('last_active_date'),
	totalLessonsCompleted: integer('total_lessons_completed').default(0),
	totalCheckpointsCompleted: integer('total_checkpoints_completed').default(0),
	totalDiscussions: integer('total_discussions').default(0),
	totalReferrals: integer('total_referrals').default(0),
	tier: text('tier').default('starter'),
	tierProgress: integer('tier_progress').default(0),
	earnedCoupons: integer('earned_coupons').default(0),
	earnedCertificates: integer('earned_certificates').default(0),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const trackerActivity = pgTable('tracker_activity', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activityType: text('activity_type').notNull(),
	points: integer('points').notNull(),
	description: text('description'),
	referenceId: text('reference_id'),
	referenceType: text('reference_type'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const userPreferences = pgTable('user_preferences', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	goals: text('goals'),
	interests: text('interests'),
	experienceLevel: text('experience_level'),
	learningSchedule: text('learning_schedule'),
	notificationPrefs: text('notification_prefs'),
	focusMode: boolean('focus_mode').default(true),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const organizationApiKey = pgTable('organization_api_key', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	key: text('key').notNull().unique(),
	name: text('name').notNull(),
	status: text('status').notNull().default('active'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	lastUsedAt: timestamp('last_used_at')
});

export const jobPosting = pgTable('job_posting', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id),
	title: text('title').notNull(),
	description: text('description').notNull(),
	requirements: text('requirements'),
	responsibilities: text('responsibilities'),
	salaryMin: integer('salary_min'),
	salaryMax: integer('salary_max'),
	jobType: text('job_type').notNull().default('full-time'),
	location: text('location'),
	isRemote: boolean('is_remote').default(false),
	visibility: text('visibility').notNull().default('internal'),
	status: text('status').notNull().default('active'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

export const jobApplication = pgTable('job_application', {
	id: text('id').primaryKey(),
	jobId: text('job_id')
		.notNull()
		.references(() => jobPosting.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	resumeUrl: text('resume_url'),
	coverLetter: text('cover_letter'),
	portfolioUrl: text('portfolio_url'),
	proposedRole: text('proposed_role'),
	status: text('status').notNull().default('pending'),
	notes: text('notes'),
	createdAt: timestamp('created_at')
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$defaultFn(() => new Date())
});

// ============================================================
// TYPE EXPORTS
// ============================================================

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
export type UserVerification = typeof userVerification.$inferSelect;
export type OrganizationVerification = typeof organizationVerification.$inferSelect;
export type AffiliateAccount = typeof affiliateAccount.$inferSelect;
export type AutoAffiliateLink = typeof autoAffiliateLink.$inferSelect;
export type UserTracker = typeof userTracker.$inferSelect;
export type TrackerActivity = typeof trackerActivity.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type OrganizationApiKey = typeof organizationApiKey.$inferSelect;
export type JobPosting = typeof jobPosting.$inferSelect;
export type JobApplication = typeof jobApplication.$inferSelect;
