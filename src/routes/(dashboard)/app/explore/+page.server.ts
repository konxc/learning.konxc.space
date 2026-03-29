import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return { courses: [] };
	}

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';

	// Filter courses by workspace
	let query = db
		.select()
		.from(schema.course)
		.where(eq(schema.course.status, 'published'));

	if (activeWorkspaceId !== 'personal') {
		query = db
			.select()
			.from(schema.course)
			.where(
				and(
					eq(schema.course.status, 'published'),
					eq(schema.course.orgId, activeWorkspaceId)
				)
			);
	}

	const courses = await query;

	return {
		courses
	};
};
