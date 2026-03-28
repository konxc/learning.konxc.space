import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	expiresAt: integer("expires_at").notNull(),
});

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	username: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	role: text().default("user").notNull(),
	fullName: text("full_name"),
	email: text(),
	phone: text(),
	onboardingCompleted: integer("onboarding_completed").default(false),
	createdAt: integer("created_at").notNull(),
},
(table) => [
	uniqueIndex("user_username_unique").on(table.username),
]);

export const coupon = sqliteTable("coupon", {
	id: text().primaryKey().notNull(),
	code: text().notNull(),
	type: text().notNull(),
	discountType: text("discount_type"),
	discountValue: integer("discount_value"),
	maxUses: integer("max_uses"),
	currentUses: integer("current_uses").default(0).notNull(),
	validFrom: integer("valid_from").notNull(),
	validUntil: integer("valid_until"),
	description: text(),
	applicableCourses: text("applicable_courses"),
	minPurchaseAmount: integer("min_purchase_amount"),
	createdBy: text("created_by").notNull().references(() => user.id),
	createdAt: integer("created_at").notNull(),
	isActive: integer("is_active").default(true).notNull(),
},
(table) => [
	uniqueIndex("coupon_code_unique").on(table.code),
]);

export const couponUsage = sqliteTable("coupon_usage", {
	id: text().primaryKey().notNull(),
	couponId: text("coupon_id").notNull().references(() => coupon.id),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").references(() => course.id),
	discountAmount: integer("discount_amount").notNull(),
	orderAmount: integer("order_amount").notNull(),
	finalAmount: integer("final_amount").notNull(),
	usedAt: integer("used_at").notNull(),
});

export const course = sqliteTable("course", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	thumbnailUrl: text("thumbnail_url"),
	price: integer().notNull(),
	duration: integer(),
	status: text().default("draft").notNull(),
	mentorId: text("mentor_id").references(() => user.id),
	createdBy: text("created_by").notNull().references(() => user.id),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const enrollment = sqliteTable("enrollment", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	couponId: text("coupon_id").references(() => coupon.id),
	status: text().default("pending").notNull(),
	enrolledAt: integer("enrolled_at").notNull(),
	completedAt: integer("completed_at"),
	activatedAt: integer("activated_at"),
	cohortId: text("cohort_id").references(() => cohort.id),
	track: text(),
	partnerId: text("partner_id"),
});

export const mentorApplication = sqliteTable("mentor_application", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	fullName: text("full_name").notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	bio: text().notNull(),
	expertise: text().notNull(),
	yearsExperience: integer("years_experience").notNull(),
	portfolioUrl: text("portfolio_url"),
	githubUrl: text("github_url"),
	linkedinUrl: text("linkedin_url"),
	motivation: text().notNull(),
	status: text().default("pending").notNull(),
	adminNotes: text("admin_notes"),
	createdAt: integer("created_at").notNull(),
	reviewedAt: integer("reviewed_at"),
	reviewedBy: text("reviewed_by").references(() => user.id),
});

export const waitingList = sqliteTable("waiting_list", {
	id: text().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	email: text().notNull(),
	phone: text(),
	interest: text(),
	source: text(),
	status: text().default("new").notNull(),
	notes: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	school: text(),
	enrollmentYear: text("enrollment_year"),
	educationStatus: text("education_status"),
	screenshot: text(),
	instagramUsername: text("instagram_username"),
},
(table) => [
	uniqueIndex("waiting_list_email_unique").on(table.email),
]);

export const certificate = sqliteTable("certificate", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	serial: text().notNull(),
	issuedAt: integer("issued_at").notNull(),
	signature: text(),
},
(table) => [
	uniqueIndex("certificate_serial_unique").on(table.serial),
]);

export const lesson = sqliteTable("lesson", {
	id: text().primaryKey().notNull(),
	moduleId: text("module_id").notNull().references(() => module.id),
	title: text().notNull(),
	orderIndex: integer("order_index").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	availableFrom: integer("available_from"),
	weekNumber: integer("week_number"),
	isFree: integer("is_free").default(false),
});

export const lessonProgress = sqliteTable("lesson_progress", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	lessonId: text("lesson_id").notNull().references(() => lesson.id),
	lastPositionMs: integer("last_position_ms"),
	completedAt: integer("completed_at"),
});

export const material = sqliteTable("material", {
	id: text().primaryKey().notNull(),
	lessonId: text("lesson_id").notNull().references(() => lesson.id),
	type: text().notNull(),
	content: text(),
	url: text(),
	orderIndex: integer("order_index").notNull(),
	durationMs: integer("duration_ms"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const module = sqliteTable("module", {
	id: text().primaryKey().notNull(),
	courseId: text("course_id").notNull().references(() => course.id),
	title: text().notNull(),
	orderIndex: integer("order_index").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const paymentProof = sqliteTable("payment_proof", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	dataBase64: text("data_base64").notNull(),
	mime: text().notNull(),
	size: integer().notNull(),
	status: text().default("pending").notNull(),
	notes: text(),
	createdAt: integer("created_at").notNull(),
});

export const quiz = sqliteTable("quiz", {
	id: text().primaryKey().notNull(),
	lessonId: text("lesson_id").notNull().references(() => lesson.id),
	title: text().notNull(),
	passingScore: integer("passing_score").notNull(),
	createdAt: integer("created_at").notNull(),
});

export const quizChoice = sqliteTable("quiz_choice", {
	id: text().primaryKey().notNull(),
	questionId: text("question_id").notNull().references(() => quizQuestion.id),
	text: text().notNull(),
	isCorrect: integer("is_correct").default(false).notNull(),
});

export const quizQuestion = sqliteTable("quiz_question", {
	id: text().primaryKey().notNull(),
	quizId: text("quiz_id").notNull().references(() => quiz.id),
	type: text().notNull(),
	question: text().notNull(),
	orderIndex: integer("order_index").notNull(),
});

export const submission = sqliteTable("submission", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	lessonId: text("lesson_id").references(() => lesson.id),
	quizId: text("quiz_id").references(() => quiz.id),
	type: text().notNull(),
	payload: text(),
	score: integer(),
	createdAt: integer("created_at").notNull(),
	metadata: text(),
});

export const submissionGrade = sqliteTable("submission_grade", {
	id: text().primaryKey().notNull(),
	submissionId: text("submission_id").notNull().references(() => submission.id),
	gradedBy: text("graded_by").references(() => user.id),
	score: integer().notNull(),
	feedback: text(),
	gradedAt: integer("graded_at").notNull(),
});

export const transaction = sqliteTable("transaction", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	amount: integer().notNull(),
	status: text().default("pending").notNull(),
	paymentType: text("payment_type"),
	snapToken: text("snap_token"),
	snapUrl: text("snap_url"),
	payload: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const cohort = sqliteTable("cohort", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	courseId: text("course_id").notNull().references(() => course.id),
	startDate: integer("start_date").notNull(),
	endDate: integer("end_date"),
	status: text().default("active").notNull(),
	createdAt: integer("created_at").notNull(),
	facilitatorId: text("facilitator_id").references(() => user.id),
});

export const affiliateLink = sqliteTable("affiliate_link", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	name: text().notNull(),
	platform: text().notNull(),
	url: text().notNull(),
	productPrice: integer("product_price"),
	commissionRate: integer("commission_rate"),
	clicks: integer().default(0).notNull(),
	conversions: integer().default(0).notNull(),
	status: text().default("active").notNull(),
	createdAt: integer("created_at").notNull(),
});

export const affiliateSale = sqliteTable("affiliate_sale", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	affiliateLinkId: text("affiliate_link_id"),
	productName: text("product_name").notNull(),
	platform: text().notNull(),
	saleAmount: integer("sale_amount").notNull(),
	commissionAmount: integer("commission_amount"),
	commissionRate: integer("commission_rate"),
	currency: text().default("IDR").notNull(),
	transactionId: text("transaction_id"),
	link: text(),
	status: text().default("pending").notNull(),
	notes: text(),
	recordedAt: integer("recorded_at"),
	createdAt: integer("created_at").notNull(),
});

export const badge = sqliteTable("badge", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	icon: text(),
	criteria: text().notNull(),
	createdAt: integer("created_at").notNull(),
});

export const broadcastMessage = sqliteTable("broadcast_message", {
	id: text().primaryKey().notNull(),
	senderId: text("sender_id").notNull().references(() => user.id),
	title: text().notNull(),
	content: text().notNull(),
	targetRole: text("target_role"),
	targetCohortId: text("target_cohort_id").references(() => cohort.id),
	targetCourseId: text("target_course_id").references(() => course.id),
	sentVia: text("sent_via").default("notification").notNull(),
	status: text().default("pending").notNull(),
	recipientCount: integer("recipient_count").default(0),
	createdAt: integer("created_at").notNull(),
});

export const checkpoint = sqliteTable("checkpoint", {
	id: text().primaryKey().notNull(),
	cohortId: text("cohort_id").notNull().references(() => cohort.id),
	title: text().notNull(),
	description: text(),
	weekNumber: integer("week_number").notNull(),
	dueDate: integer("due_date"),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
});

export const checkpointSubmission = sqliteTable("checkpoint_submission", {
	id: text().primaryKey().notNull(),
	checkpointId: text("checkpoint_id").notNull().references(() => checkpoint.id),
	userId: text("user_id").notNull().references(() => user.id),
	notes: text(),
	completed: integer().default(false).notNull(),
	submittedAt: integer("submitted_at"),
	createdAt: integer("created_at").notNull(),
});

export const courseReview = sqliteTable("course_review", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	rating: integer().notNull(),
	comment: text(),
	moderationStatus: text("moderation_status").default("pending").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const discussion = sqliteTable("discussion", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").references(() => course.id),
	lessonId: text("lesson_id").references(() => lesson.id),
	parentId: text("parent_id"),
	title: text(),
	content: text().notNull(),
	upvotes: integer().default(0).notNull(),
	isPinned: integer("is_pinned").default(false).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	foreignKey(() => ({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "discussion_parent_id_discussion_id_fk"
		})),
]);

export const emailLog = sqliteTable("email_log", {
	id: text().primaryKey().notNull(),
	to: text().notNull(),
	subject: text().notNull(),
	type: text().notNull(),
	status: text().default("pending").notNull(),
	error: text(),
	sentAt: integer("sent_at"),
	createdAt: integer("created_at").notNull(),
});

export const lessonNote = sqliteTable("lesson_note", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	courseId: text("course_id").notNull().references(() => course.id),
	lessonId: text("lesson_id").notNull().references(() => lesson.id),
	content: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const notification = sqliteTable("notification", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	type: text().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	link: text(),
	read: integer().default(false).notNull(),
	createdAt: integer("created_at").notNull(),
});

export const partner = sqliteTable("partner", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	contactEmail: text("contact_email"),
	contactPhone: text("contact_phone"),
	status: text().default("active").notNull(),
	createdAt: integer("created_at").notNull(),
});

export const userBadge = sqliteTable("user_badge", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	badgeId: text("badge_id").notNull().references(() => badge.id),
	earnedAt: integer("earned_at").notNull(),
});

export const userXp = sqliteTable("user_xp", {
	userId: text("user_id").primaryKey().notNull().references(() => user.id),
	points: integer().default(0).notNull(),
	level: integer().default(1).notNull(),
	streakDays: integer("streak_days").default(0).notNull(),
	lastActiveAt: integer("last_active_at"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const whatsappLog = sqliteTable("whatsapp_log", {
	id: text().primaryKey().notNull(),
	to: text().notNull(),
	type: text().notNull(),
	status: text().default("pending").notNull(),
	error: text(),
	messageId: text("message_id"),
	sentAt: integer("sent_at"),
	createdAt: integer("created_at").notNull(),
});

