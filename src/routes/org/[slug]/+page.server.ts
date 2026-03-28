import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	// Find organization by slug
	const organization = await db.query.organization.findFirst({
		where: eq(schema.organization.slug, slug)
	});

	if (!organization) {
		throw error(404, 'Organization not found');
	}

	// Get public courses for this organization
	const courses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			duration: schema.course.duration,
			status: schema.course.status
		})
		.from(schema.course)
		.where(
			and(
				eq(schema.course.orgId, organization.id),
				eq(schema.course.status, 'published')
			)
		);

	// Check if user is already a member
	let isMember = false;
	if (locals.user) {
		const membership = await db.query.organizationMember.findFirst({
			where: and(
				eq(schema.organizationMember.orgId, organization.id),
				eq(schema.organizationMember.userId, locals.user.id)
			)
		});
		isMember = !!membership;
	}

	return {
		organization,
		courses,
		isMember
	};
};
