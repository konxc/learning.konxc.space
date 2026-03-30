import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return { courses: [] };
	}

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	// Filter courses by workspace (exclude soft-deleted courses)
	let query = db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.status, 'published'), isNull(schema.course.deletedAt)));

	if (activeWorkspaceId !== 'personal') {
		query = db
			.select()
			.from(schema.course)
			.where(
				and(
					eq(schema.course.status, 'published'),
					eq(schema.course.orgId, activeWorkspaceId),
					isNull(schema.course.deletedAt)
				)
			);
	}

	const courses = await query;

	return {
		courses
	};
};
