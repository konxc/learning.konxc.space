// Learning page for enrolled students
// Route: /app/explore/[courseId]/learn
// Note: [courseId] is the enrolled course ID, different from [id] in explore/[id] (course detail)
import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { uploadFile, BUCKET_NAME, PUBLIC_S3_URL } from '$lib/server/s3';

function safeParseJSON<T>(str: string | null | undefined): T | null {
	if (!str) return null;
	try {
		return JSON.parse(str) as T;
	} catch {
		console.error(`[Learn] Failed to parse JSON: ${str.substring(0, 50)}...`);
		return null;
	}
}

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const courseId = event.params.courseId;

	// Verify enrollment with active status
	const enrollmentSelection = await db
		.select()
		.from(schema.enrollment)
		.where(
			and(
				eq(schema.enrollment.userId, user.id),
				eq(schema.enrollment.courseId, courseId),
				eq(schema.enrollment.status, 'active')
			)
		)
		.limit(1);

	if (enrollmentSelection.length === 0) {
		// Check if user is enrolled but pending
		const pendingEnrollment = await db
			.select()
			.from(schema.enrollment)
			.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.courseId, courseId)))
			.limit(1);

		if (pendingEnrollment.length > 0) {
			throw redirect(303, `/app/learning/courses`);
		}

		throw redirect(303, `/app/explore/${courseId}`);
	}

	const enrollment = enrollmentSelection[0];

	const courseSelection = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			status: schema.course.status,
			featuresConfig: schema.course.featuresConfig,
			orgId: schema.course.orgId,
			organization: {
				id: schema.organization.id,
				name: schema.organization.name,
				logoUrl: schema.organization.logoUrl,
				brandColor: schema.organization.brandColor
			}
		})
		.from(schema.course)
		.leftJoin(schema.organization, eq(schema.course.orgId, schema.organization.id))
		.where(eq(schema.course.id, courseId))
		.limit(1);

	if (courseSelection.length === 0) {
		throw redirect(303, '/app/explore');
	}

	const course = courseSelection[0];

	// Get cohort info for drip content calculation
	let cohortStartDate: Date | null = null;
	if (enrollment.cohortId) {
		const cohort = await db
			.select({ startDate: schema.cohort.startDate })
			.from(schema.cohort)
			.where(eq(schema.cohort.id, enrollment.cohortId))
			.limit(1);
		if (cohort[0]?.startDate) {
			cohortStartDate = cohort[0].startDate;
		}
	}

	// Calculate current week number based on cohort start date
	let currentWeek = 1;
	const now = new Date();
	if (cohortStartDate) {
		const daysSinceStart = Math.floor(
			(now.getTime() - cohortStartDate.getTime()) / (1000 * 60 * 60 * 24)
		);
		currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 12); // Max 12 weeks
	}

	// Get modules with lessons and materials
	const modules = await db
		.select()
		.from(schema.module)
		.where(eq(schema.module.courseId, courseId))
		.orderBy(schema.module.order);

	// Get all lessons
	const lessons = await db
		.select()
		.from(schema.lesson)
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId))
		.orderBy(asc(schema.lesson.order));

	// Get all materials
	const materials = await db
		.select()
		.from(schema.material)
		.innerJoin(schema.lesson, eq(schema.material.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId))
		.orderBy(asc(schema.material.order));

	// Get all quizzes
	const quizzes = await db
		.select()
		.from(schema.quiz)
		.innerJoin(schema.lesson, eq(schema.quiz.lessonId, schema.lesson.id))
		.innerJoin(schema.module, eq(schema.lesson.moduleId, schema.module.id))
		.where(eq(schema.module.courseId, courseId));

	// Get user's progress
	const progress = await db
		.select()
		.from(schema.lessonProgress)
		.where(
			and(eq(schema.lessonProgress.userId, user.id), eq(schema.lessonProgress.courseId, courseId))
		);

	// Get user's submissions
	const submissions = await db
		.select()
		.from(schema.submission)
		.where(and(eq(schema.submission.userId, user.id), eq(schema.submission.courseId, courseId)));

	// Structure data hierarchically
	const structuredModules = modules.map((module) => {
		const moduleLessons = lessons
			.filter((l) => l.lesson.moduleId === module.id)
			.map((l) => {
				const lessonMaterials = materials.filter((m) => m.material.lessonId === l.lesson.id);
				const lessonProgress = progress.find((p) => p.lessonId === l.lesson.id);
				const lessonQuiz = quizzes.find((q) => q.quiz.lessonId === l.lesson.id);
				const lessonSubmission = submissions.find((s) => s.lessonId === l.lesson.id);

				// Drip content: check if lesson is locked
				const lessonWeek = l.lesson.weekNumber || 1;
				const isLocked = !l.lesson.isFree && !!cohortStartDate && lessonWeek > currentWeek;
				const availableFrom = l.lesson.availableFrom
					? new Date(l.lesson.availableFrom)
					: cohortStartDate
						? new Date(cohortStartDate.getTime() + (lessonWeek - 1) * 7 * 24 * 60 * 60 * 1000)
						: null;

				return {
					...l.lesson,
					materials: lessonMaterials.map((m) => m.material),
					progress: lessonProgress || null,
					quiz: lessonQuiz ? lessonQuiz.quiz : null,
					submission: lessonSubmission
						? {
								...lessonSubmission,
								payload: safeParseJSON(lessonSubmission.payload),
								metadata: safeParseJSON(lessonSubmission.metadata)
							}
						: null,
					isLocked,
					availableFrom,
					lessonWeek
				};
			});

		return {
			...module,
			lessons: moduleLessons
		};
	});

	// Get first lesson for redirect if no specific lesson selected
	const firstLesson = structuredModules[0]?.lessons?.[0] || null;

	// Compute progress summary
	const totalLessons = structuredModules.reduce((sum, m) => sum + m.lessons.length, 0);
	const completedLessons = progress.filter((p) => p.completedAt !== null).length;
	const progressPercent =
		totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

	return {
		user,
		enrollment,
		course,
		modules: structuredModules,
		progress: progress.map((p) => ({
			lessonId: p.lessonId,
			lastPositionMs: p.lastPositionMs,
			completedAt: p.completedAt
		})),
		firstLesson,
		totalLessons,
		completedLessons,
		progressPercent,
		dripContent: {
			enabled: !!cohortStartDate,
			currentWeek,
			cohortStartDate
		}
	};
};

export const actions: Actions = {
	submitAction: async (event) => {
		const user = await requireAuth(event);
		const formData = await event.request.formData();

		const lessonId = formData.get('lessonId') as string;
		const courseId = formData.get('courseId') as string;
		const urlString = formData.get('url') as string;
		const note = formData.get('note') as string;
		const file = formData.get('file') as File | null;

		if (!lessonId || !courseId) {
			return actionFailure(400, 'Lesson ID and Course ID are required.');
		}

		// Validate that either URL or file is provided
		if (!urlString && !file) {
			return actionFailure(400, 'Please provide either a URL or upload a file.');
		}

		// Validate URL if provided
		if (urlString) {
			try {
				new URL(urlString);
			} catch (e) {
				return actionFailure(400, 'Invalid URL format.');
			}
		}

		// Handle file upload if provided
		let fileUrl: string | null = null;
		let fileName: string | null = null;
		let fileSize: number | null = null;

		if (file && file.size > 0) {
			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024;
			if (file.size > maxSize) {
				return actionFailure(400, 'File size exceeds 10MB limit.');
			}

			// Validate file type
			const allowedTypes = [
				'application/pdf',
				'image/jpeg',
				'image/png',
				'image/webp',
				'application/zip',
				'text/plain'
			];
			if (!allowedTypes.includes(file.type)) {
				return actionFailure(
					400,
					'File type not allowed. Please upload PDF, images, ZIP, or text files.'
				);
			}

			// Upload to S3
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			// Generate unique file key
			const timestamp = Date.now();
			const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
			const key = `assignments/${courseId}/${lessonId}/${user.id}_${timestamp}_${sanitizedFileName}`;

			try {
				fileUrl = await uploadFile(buffer, key, file.type);
				fileName = file.name;
				fileSize = file.size;
			} catch (error) {
				console.error('File upload error:', error);
				return actionFailure(500, 'Failed to upload file. Please try again.');
			}
		}

		const submissionId = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));

		// Check if already submitted for this lesson
		const existing = await db
			.select()
			.from(schema.submission)
			.where(
				and(
					eq(schema.submission.userId, user.id),
					eq(schema.submission.lessonId, lessonId),
					eq(schema.submission.type, 'assignment')
				)
			)
			.limit(1);

		const payload = JSON.stringify({
			url: urlString || null,
			fileUrl,
			fileName,
			fileSize,
			note
		});
		const metadata = JSON.stringify({ submitted_at: new Date().toISOString() });

		if (existing.length > 0) {
			await db
				.update(schema.submission)
				.set({
					payload,
					metadata,
					createdAt: new Date()
				})
				.where(eq(schema.submission.id, existing[0].id));
		} else {
			await db.insert(schema.submission).values({
				id: submissionId,
				userId: user.id,
				courseId,
				lessonId,
				type: 'assignment',
				payload,
				metadata
			});
		}

		return actionSuccess();
	}
};
