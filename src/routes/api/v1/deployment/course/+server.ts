import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const POST: RequestHandler = async ({ request }) => {
	const apiKey = request.headers.get('x-api-key');

	if (!apiKey) {
		return error(401, 'Unauthorized: Missing API Key');
	}

	// 1. Validate API Key
	const keyRecord = await db.query.organizationApiKey.findFirst({
		where: and(
			eq(schema.organizationApiKey.key, apiKey),
			eq(schema.organizationApiKey.status, 'active')
		)
	});

	if (!keyRecord) {
		return error(401, 'Unauthorized: Invalid or Revoked API Key');
	}

	// Update last used timestamp
	await db.update(schema.organizationApiKey)
		.set({ lastUsedAt: new Date() })
		.where(eq(schema.organizationApiKey.id, keyRecord.id));

	const organizationId = keyRecord.orgId;

	try {
		const payload = await request.json();
		const { courseData } = payload;

		if (!courseData) {
			return error(400, 'Missing courseData');
		}

		// 2. Perform Atomic Deployment Transaction
		const result = await db.transaction(async (tx) => {
			// A. Find or Create Course
			let courseId = courseData.id;
			const existingCourse = courseId 
				? await tx.query.course.findFirst({ where: eq(schema.course.id, courseId) })
				: null;

			if (!existingCourse) {
				courseId = uuidv4();
				await tx.insert(schema.course).values({
					id: courseId,
					orgId: organizationId,
					title: courseData.title,
					description: courseData.description || '',
					price: courseData.price || 0,
					status: 'draft',
					createdBy: courseData.createdBy || 'system-agent',
				});
			} else {
				await tx.update(schema.course)
					.set({
						title: courseData.title,
						description: courseData.description,
						updatedAt: new Date()
					})
					.where(eq(schema.course.id, courseId));
			}

			// B. Process Modules
			if (courseData.modules && Array.isArray(courseData.modules)) {
				for (const mod of courseData.modules) {
					const moduleId = mod.id || uuidv4();
					
					// Upsert Module
					const existingModule = await tx.query.module.findFirst({
						where: and(
							eq(schema.module.courseId, courseId),
							eq(schema.module.title, mod.title)
						)
					});

					if (!existingModule) {
						await tx.insert(schema.module).values({
							id: moduleId,
							courseId: courseId,
							title: mod.title,
							order: mod.order || 0
						});
					} else {
						// Update order if needed
						await tx.update(schema.module)
							.set({ order: mod.order, updatedAt: new Date() })
							.where(eq(schema.module.id, existingModule.id));
					}

					const finalModuleId = existingModule?.id || moduleId;

					// C. Process Lessons
					if (mod.lessons && Array.isArray(mod.lessons)) {
						for (const les of mod.lessons) {
							const lessonId = les.id || uuidv4();

							const existingLesson = await tx.query.lesson.findFirst({
								where: and(
									eq(schema.lesson.moduleId, finalModuleId),
									eq(schema.lesson.title, les.title)
								)
							});

							if (!existingLesson) {
								await tx.insert(schema.lesson).values({
									id: lessonId,
									moduleId: finalModuleId,
									title: les.title,
									order: les.order || 0
								});
							}

							const finalLessonId = existingLesson?.id || lessonId;

							// D. Process Materials
							if (les.materials && Array.isArray(les.materials)) {
								for (const mat of les.materials) {
									// Simplified: Always insert material for now or match by order/type
									await tx.insert(schema.material).values({
										id: uuidv4(),
										lessonId: finalLessonId,
										type: mat.type,
										content: mat.content,
										url: mat.url,
										order: mat.order || 0
									});
								}
							}
						}
					}
				}
			}

			return { courseId };
		});

		return json({
			success: true,
			message: 'Course deployed successfully',
			data: result
		});

	} catch (e: any) {
		console.error('Deployment Error:', e);
		return json({
			success: false,
			message: e.message || 'Internal Server Error during deployment'
		}, { status: 500 });
	}
};
