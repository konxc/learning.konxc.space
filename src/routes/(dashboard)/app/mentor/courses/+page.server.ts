import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw error(401, 'Unauthorized');
	}

	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';
	
	// Map role
	const role = parentData.effectiveRole || user.role;
	const isMgmt = ['admin', 'mentor', 'owner', 'facilitator'].includes(role);
	
	if (!isMgmt) {
		throw error(403, 'Forbidden');
	}

	// Filter courses by workspace AND mentor assignment
	let query = db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			status: schema.course.status,
			createdAt: schema.course.createdAt,
			orgId: schema.course.orgId
		})
		.from(schema.course)
		.where(eq(schema.course.mentorId, user.id));

	if (activeWorkspaceId !== 'personal') {
		query = db
			.select({
				id: schema.course.id,
				title: schema.course.title,
				description: schema.course.description,
				thumbnailUrl: schema.course.thumbnailUrl,
				price: schema.course.price,
				duration: schema.course.duration,
				status: schema.course.status,
				createdAt: schema.course.createdAt,
				orgId: schema.course.orgId
			})
			.from(schema.course)
			.where(
				and(
					eq(schema.course.orgId, activeWorkspaceId),
					eq(schema.course.mentorId, user.id)
				)
			);
	}

	const courses = await query;

	return {
		courses
	};
};
