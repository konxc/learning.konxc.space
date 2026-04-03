import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	const { params, locals } = event;
	const user = locals.user;
	if (!user) throw error(401, 'Unauthorized');

	const { membership } = await event.parent();
	if (!membership || !['admin', 'mentor', 'owner'].includes(membership.role)) {
		throw error(403, 'Forbidden');
	}

	const orgId = membership.orgId;
	const { courseId } = params;

	// Verify course exists in this organization and mentor has access
	const [course] = await db
		.select()
		.from(schema.course)
		.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
		.limit(1);

	if (!course || (membership.role === 'mentor' && course.mentorId !== user.id)) {
		throw redirect(302, `/app/organizations/${orgId}/mentor/courses`);
	}

	return {
		course
	};
};

export const actions: Actions = {
	updateSettings: async (event) => {
		const { request, params, locals } = event;
		const user = locals.user;
		if (!user) return actionFailure(401, 'Unauthorized');

		const orgId = params.id;
		const { courseId } = params;

		// Verify membership
		const [membership] = await db
			.select()
			.from(schema.organizationMember)
			.where(and(eq(schema.organizationMember.orgId, orgId), eq(schema.organizationMember.userId, user.id)))
			.limit(1);

		if (!membership || !['owner', 'admin', 'mentor'].includes(membership.role)) {
			return actionFailure(403, 'Unauthorized management access');
		}

		// Verify ownership and organization
		const [course] = await db
			.select()
			.from(schema.course)
			.where(and(eq(schema.course.id, courseId), eq(schema.course.orgId, orgId)))
			.limit(1);

		if (!course) return actionFailure(404, 'Course not found');
		if (membership.role === 'mentor' && course.mentorId !== user.id) {
			return actionFailure(403, 'Unauthorized course access');
		}

		const formData = await request.formData();
		const visibility = formData.get('visibility') as string;
		const affiliateEnabled = formData.get('affiliate') === 'on';
		const discussionEnabled = formData.get('discussion') === 'on';
		const performanceEnabled = formData.get('performance') === 'on';

		const featuresConfig = JSON.stringify({
			affiliate: affiliateEnabled,
			discussion: discussionEnabled,
			performance: performanceEnabled
		});

		const validVisibilities = ['draft', 'public', 'internal', 'invite_only'];
		if (!validVisibilities.includes(visibility)) {
			return actionFailure(400, 'Invalid visibility value');
		}

		await db
			.update(schema.course)
			.set({ visibility, featuresConfig, updatedAt: new Date() })
			.where(eq(schema.course.id, courseId));

		return actionSuccess({ message: 'Pengaturan kursus disimpan.' });
	}
} satisfies Actions;
