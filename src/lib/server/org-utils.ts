import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function getMembership(
	userId: string,
	orgId: string,
	fallbackRedirect = '/app/organizations'
) {
	const result = await db
		.select()
		.from(schema.organizationMember)
		.where(
			and(eq(schema.organizationMember.userId, userId), eq(schema.organizationMember.orgId, orgId))
		)
		.limit(1);

	if (!result.length) throw redirect(303, fallbackRedirect);
	return result[0];
}

export async function generateUniqueSlug(name: string): Promise<string> {
	const base = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	let slug = base;
	let counter = 1;
	while (true) {
		const existing = await db
			.select({ id: schema.organization.id })
			.from(schema.organization)
			.where(eq(schema.organization.slug, slug))
			.limit(1);
		if (!existing.length) return slug;
		slug = `${base}-${counter++}`;
	}
}
