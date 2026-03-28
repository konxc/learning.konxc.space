import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { workspaceId } = await request.json();

	// If workspaceId is 'personal', we switch back to personal context
	if (workspaceId === 'personal') {
		cookies.set('active-workspace', 'personal', {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			sameSite: 'lax'
		});

		// Update user's last workspace in DB
		await db.update(schema.user)
			.set({ lastWorkspaceId: 'personal' })
			.where(eq(schema.user.id, locals.user.id));

		return json({ success: true, context: 'personal' });
	}

	// Verify that the user is a member of this organization
	const membership = await db.query.organizationMember.findFirst({
		where: and(
			eq(schema.organizationMember.orgId, workspaceId),
			eq(schema.organizationMember.userId, locals.user.id)
		)
	});

	if (!membership) {
		return json({ error: 'Forbidden: You are not a member of this organization' }, { status: 403 });
	}

	// Set cookie for persistence across SSR
	cookies.set('active-workspace', workspaceId, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
		sameSite: 'lax'
	});

	// Update user's last workspace in DB
	await db.update(schema.user)
		.set({ lastWorkspaceId: workspaceId })
		.where(eq(schema.user.id, locals.user.id));

	return json({ success: true, context: 'organization', orgId: workspaceId });
};
