import { relations } from "drizzle-orm/relations";
import { user, session, coupon, course, couponUsage, enrollment, cohort, mentorApplication, certificate, module, lesson, lessonProgress, material, paymentProof, quiz, quizQuestion, quizChoice, submission, submissionGrade, transaction, affiliateLink, affiliateSale, broadcastMessage, checkpoint, checkpointSubmission, courseReview, discussion, lessonNote, notification, badge, userBadge, userXp } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	coupons: many(coupon),
	couponUsages: many(couponUsage),
	courses_createdBy: many(course, {
		relationName: "course_createdBy_user_id"
	}),
	courses_mentorId: many(course, {
		relationName: "course_mentorId_user_id"
	}),
	enrollments: many(enrollment),
	mentorApplications_reviewedBy: many(mentorApplication, {
		relationName: "mentorApplication_reviewedBy_user_id"
	}),
	mentorApplications_userId: many(mentorApplication, {
		relationName: "mentorApplication_userId_user_id"
	}),
	certificates: many(certificate),
	lessonProgresses: many(lessonProgress),
	paymentProofs: many(paymentProof),
	submissions: many(submission),
	submissionGrades: many(submissionGrade),
	transactions: many(transaction),
	cohorts: many(cohort),
	affiliateLinks: many(affiliateLink),
	affiliateSales: many(affiliateSale),
	broadcastMessages: many(broadcastMessage),
	checkpointSubmissions: many(checkpointSubmission),
	courseReviews: many(courseReview),
	discussions: many(discussion),
	lessonNotes: many(lessonNote),
	notifications: many(notification),
	userBadges: many(userBadge),
	userXps: many(userXp),
}));

export const couponRelations = relations(coupon, ({one, many}) => ({
	user: one(user, {
		fields: [coupon.createdBy],
		references: [user.id]
	}),
	couponUsages: many(couponUsage),
	enrollments: many(enrollment),
}));

export const couponUsageRelations = relations(couponUsage, ({one}) => ({
	course: one(course, {
		fields: [couponUsage.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [couponUsage.userId],
		references: [user.id]
	}),
	coupon: one(coupon, {
		fields: [couponUsage.couponId],
		references: [coupon.id]
	}),
}));

export const courseRelations = relations(course, ({one, many}) => ({
	couponUsages: many(couponUsage),
	user_createdBy: one(user, {
		fields: [course.createdBy],
		references: [user.id],
		relationName: "course_createdBy_user_id"
	}),
	user_mentorId: one(user, {
		fields: [course.mentorId],
		references: [user.id],
		relationName: "course_mentorId_user_id"
	}),
	enrollments: many(enrollment),
	certificates: many(certificate),
	lessonProgresses: many(lessonProgress),
	modules: many(module),
	paymentProofs: many(paymentProof),
	submissions: many(submission),
	transactions: many(transaction),
	cohorts: many(cohort),
	broadcastMessages: many(broadcastMessage),
	courseReviews: many(courseReview),
	discussions: many(discussion),
	lessonNotes: many(lessonNote),
}));

export const enrollmentRelations = relations(enrollment, ({one}) => ({
	coupon: one(coupon, {
		fields: [enrollment.couponId],
		references: [coupon.id]
	}),
	course: one(course, {
		fields: [enrollment.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [enrollment.userId],
		references: [user.id]
	}),
	cohort: one(cohort, {
		fields: [enrollment.cohortId],
		references: [cohort.id]
	}),
}));

export const cohortRelations = relations(cohort, ({one, many}) => ({
	enrollments: many(enrollment),
	course: one(course, {
		fields: [cohort.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [cohort.facilitatorId],
		references: [user.id]
	}),
	broadcastMessages: many(broadcastMessage),
	checkpoints: many(checkpoint),
}));

export const mentorApplicationRelations = relations(mentorApplication, ({one}) => ({
	user_reviewedBy: one(user, {
		fields: [mentorApplication.reviewedBy],
		references: [user.id],
		relationName: "mentorApplication_reviewedBy_user_id"
	}),
	user_userId: one(user, {
		fields: [mentorApplication.userId],
		references: [user.id],
		relationName: "mentorApplication_userId_user_id"
	}),
}));

export const certificateRelations = relations(certificate, ({one}) => ({
	course: one(course, {
		fields: [certificate.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [certificate.userId],
		references: [user.id]
	}),
}));

export const lessonRelations = relations(lesson, ({one, many}) => ({
	module: one(module, {
		fields: [lesson.moduleId],
		references: [module.id]
	}),
	lessonProgresses: many(lessonProgress),
	materials: many(material),
	quizzes: many(quiz),
	submissions: many(submission),
	discussions: many(discussion),
	lessonNotes: many(lessonNote),
}));

export const moduleRelations = relations(module, ({one, many}) => ({
	lessons: many(lesson),
	course: one(course, {
		fields: [module.courseId],
		references: [course.id]
	}),
}));

export const lessonProgressRelations = relations(lessonProgress, ({one}) => ({
	lesson: one(lesson, {
		fields: [lessonProgress.lessonId],
		references: [lesson.id]
	}),
	course: one(course, {
		fields: [lessonProgress.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [lessonProgress.userId],
		references: [user.id]
	}),
}));

export const materialRelations = relations(material, ({one}) => ({
	lesson: one(lesson, {
		fields: [material.lessonId],
		references: [lesson.id]
	}),
}));

export const paymentProofRelations = relations(paymentProof, ({one}) => ({
	course: one(course, {
		fields: [paymentProof.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [paymentProof.userId],
		references: [user.id]
	}),
}));

export const quizRelations = relations(quiz, ({one, many}) => ({
	lesson: one(lesson, {
		fields: [quiz.lessonId],
		references: [lesson.id]
	}),
	quizQuestions: many(quizQuestion),
	submissions: many(submission),
}));

export const quizChoiceRelations = relations(quizChoice, ({one}) => ({
	quizQuestion: one(quizQuestion, {
		fields: [quizChoice.questionId],
		references: [quizQuestion.id]
	}),
}));

export const quizQuestionRelations = relations(quizQuestion, ({one, many}) => ({
	quizChoices: many(quizChoice),
	quiz: one(quiz, {
		fields: [quizQuestion.quizId],
		references: [quiz.id]
	}),
}));

export const submissionRelations = relations(submission, ({one, many}) => ({
	quiz: one(quiz, {
		fields: [submission.quizId],
		references: [quiz.id]
	}),
	lesson: one(lesson, {
		fields: [submission.lessonId],
		references: [lesson.id]
	}),
	course: one(course, {
		fields: [submission.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [submission.userId],
		references: [user.id]
	}),
	submissionGrades: many(submissionGrade),
}));

export const submissionGradeRelations = relations(submissionGrade, ({one}) => ({
	user: one(user, {
		fields: [submissionGrade.gradedBy],
		references: [user.id]
	}),
	submission: one(submission, {
		fields: [submissionGrade.submissionId],
		references: [submission.id]
	}),
}));

export const transactionRelations = relations(transaction, ({one}) => ({
	course: one(course, {
		fields: [transaction.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [transaction.userId],
		references: [user.id]
	}),
}));

export const affiliateLinkRelations = relations(affiliateLink, ({one}) => ({
	user: one(user, {
		fields: [affiliateLink.userId],
		references: [user.id]
	}),
}));

export const affiliateSaleRelations = relations(affiliateSale, ({one}) => ({
	user: one(user, {
		fields: [affiliateSale.userId],
		references: [user.id]
	}),
}));

export const broadcastMessageRelations = relations(broadcastMessage, ({one}) => ({
	course: one(course, {
		fields: [broadcastMessage.targetCourseId],
		references: [course.id]
	}),
	cohort: one(cohort, {
		fields: [broadcastMessage.targetCohortId],
		references: [cohort.id]
	}),
	user: one(user, {
		fields: [broadcastMessage.senderId],
		references: [user.id]
	}),
}));

export const checkpointRelations = relations(checkpoint, ({one, many}) => ({
	cohort: one(cohort, {
		fields: [checkpoint.cohortId],
		references: [cohort.id]
	}),
	checkpointSubmissions: many(checkpointSubmission),
}));

export const checkpointSubmissionRelations = relations(checkpointSubmission, ({one}) => ({
	user: one(user, {
		fields: [checkpointSubmission.userId],
		references: [user.id]
	}),
	checkpoint: one(checkpoint, {
		fields: [checkpointSubmission.checkpointId],
		references: [checkpoint.id]
	}),
}));

export const courseReviewRelations = relations(courseReview, ({one}) => ({
	course: one(course, {
		fields: [courseReview.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [courseReview.userId],
		references: [user.id]
	}),
}));

export const discussionRelations = relations(discussion, ({one, many}) => ({
	discussion: one(discussion, {
		fields: [discussion.parentId],
		references: [discussion.id],
		relationName: "discussion_parentId_discussion_id"
	}),
	discussions: many(discussion, {
		relationName: "discussion_parentId_discussion_id"
	}),
	lesson: one(lesson, {
		fields: [discussion.lessonId],
		references: [lesson.id]
	}),
	course: one(course, {
		fields: [discussion.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [discussion.userId],
		references: [user.id]
	}),
}));

export const lessonNoteRelations = relations(lessonNote, ({one}) => ({
	lesson: one(lesson, {
		fields: [lessonNote.lessonId],
		references: [lesson.id]
	}),
	course: one(course, {
		fields: [lessonNote.courseId],
		references: [course.id]
	}),
	user: one(user, {
		fields: [lessonNote.userId],
		references: [user.id]
	}),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id]
	}),
}));

export const userBadgeRelations = relations(userBadge, ({one}) => ({
	badge: one(badge, {
		fields: [userBadge.badgeId],
		references: [badge.id]
	}),
	user: one(user, {
		fields: [userBadge.userId],
		references: [user.id]
	}),
}));

export const badgeRelations = relations(badge, ({many}) => ({
	userBadges: many(userBadge),
}));

export const userXpRelations = relations(userXp, ({one}) => ({
	user: one(user, {
		fields: [userXp.userId],
		references: [user.id]
	}),
}));