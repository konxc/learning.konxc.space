import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '$lib/server/middleware';
import { sendEmail } from '$lib/server/email';

function generateId() {
	return 'org-' + Math.random().toString(36).substring(2, 11);
}

function generateMemberId() {
	return 'mem-' + Math.random().toString(36).substring(2, 11);
}

function generateToken() {
	return crypto.randomUUID();
}

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const parentData = await event.parent() as any;
	const activeWorkspaceId = parentData.workspaces?.activeId;

	if (!activeWorkspaceId || activeWorkspaceId === 'personal') {
		return { organization: null, members: [] };
	}

	// Get organization details
	const organization = await db.query.organization.findFirst({
		where: eq(schema.organization.id, activeWorkspaceId)
	});

	if (!organization) {
		throw error(404, 'Organization not found');
	}

	// Verify if the user is a member of this organization
	const membership = await db.query.organizationMember.findFirst({
		where: and(
			eq(schema.organizationMember.orgId, activeWorkspaceId),
			eq(schema.organizationMember.userId, user.id)
		)
	});

	if (!membership) {
		throw error(403, 'Forbidden');
	}

	const isReadOnly = !['owner', 'admin'].includes(membership.role);

	// Get all members
	const members = await db
		.select({
			id: schema.organizationMember.id,
			role: schema.organizationMember.role,
			createdAt: schema.organizationMember.createdAt,
			user: {
				id: schema.user.id,
				fullName: schema.user.fullName,
				username: schema.user.username,
				email: schema.user.email,
				role: schema.user.role // global role
			}
		})
		.from(schema.organizationMember)
		.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
		.where(eq(schema.organizationMember.orgId, activeWorkspaceId));

	return {
		organization,
		members,
		isReadOnly,
		user
	};
};

export const actions: Actions = {
	createOrganization: async ({ request, locals, cookies }) => {
		const user = locals.user;
		if (!user) throw error(401);

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const brandColor = formData.get('brandColor') as string || '#4f46e5';

		if (!name || !slug) {
			return fail(400, { error: 'Name and slug are required' });
		}

		// Validate slug format
		if (!/^[a-z0-9-]+$/.test(slug)) {
			return fail(400, { error: 'Slug can only contain lowercase letters, numbers, and hyphens' });
		}

		// Check if slug is already taken
		const existingOrg = await db.query.organization.findFirst({
			where: eq(schema.organization.slug, slug)
		});

		if (existingOrg) {
			return fail(400, { error: 'This URL is already taken' });
		}

		const orgId = generateId();
		const now = new Date();

		// Create organization
		await db.insert(schema.organization).values({
			id: orgId,
			slug,
			name,
			brandColor,
			planType: 'free',
			createdAt: now,
			updatedAt: now
		});

		// Add creator as owner
		await db.insert(schema.organizationMember).values({
			id: generateMemberId(),
			orgId: orgId,
			userId: user.id,
			role: 'owner',
			createdAt: now,
			updatedAt: now
		});

		// Set as active workspace
		cookies.set('active-workspace', orgId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			sameSite: 'lax'
		});

		// Update user's last workspace
		await db.update(schema.user)
			.set({ lastWorkspaceId: orgId })
			.where(eq(schema.user.id, user.id));

		throw redirect(303, '/app/settings/organization');
	},

	updateSettings: async ({ request, locals, cookies }) => {
		const user = locals.user;
		if (!user) throw error(401);
		
		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId || activeWorkspaceId === 'personal') throw error(400);

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const brandColor = formData.get('brandColor') as string;

		await db.update(schema.organization)
			.set({ name, brandColor, updatedAt: new Date() })
			.where(eq(schema.organization.id, activeWorkspaceId));

		return { success: true };
	},

	inviteMember: async ({ request, locals, cookies, url }) => {
		const user = locals.user;
		if (!user) throw error(401);

		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId || activeWorkspaceId === 'personal') throw error(400);

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const role = (formData.get('role') as string) || 'member';

		// Get organization details
		const org = await db.query.organization.findFirst({
			where: eq(schema.organization.id, activeWorkspaceId)
		});

		if (!org) {
			return { error: 'Organization not found' };
		}

		// Check if user already exists
		const targetUser = await db.query.user.findFirst({
			where: eq(schema.user.email, email)
		});

		if (targetUser) {
			// Check if already a member
			const existingMember = await db.query.organizationMember.findFirst({
				where: and(
					eq(schema.organizationMember.orgId, activeWorkspaceId),
					eq(schema.organizationMember.userId, targetUser.id)
				)
			});

			if (existingMember) {
				return { error: 'User is already a member of this organization.' };
			}

			// Direct add if user exists
			await db.insert(schema.organizationMember).values({
				id: generateMemberId(),
				orgId: activeWorkspaceId,
				userId: targetUser.id,
				role: role as any,
				createdAt: new Date(),
				updatedAt: new Date()
			});

			return { success: true, message: 'Member added successfully!' };
		}

		// User doesn't exist - send invitation email
		const token = generateToken();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

		// Create invitation record
		await db.insert(schema.organizationInvitation).values({
			id: 'inv-' + generateId(),
			orgId: activeWorkspaceId,
			email,
			role,
			token,
			invitedBy: user.id,
			expiresAt,
			createdAt: new Date()
		});

		// Send invitation email
		const inviteLink = `${url.origin}/org/invite/${token}`;
		try {
			await sendEmail(email, 'org_invitation', {
				orgName: org.name,
				inviterName: user.fullName || user.username,
				role,
				inviteLink
			});
		} catch (e) {
			console.error('Failed to send invitation email:', e);
			// Still return success since the invitation was created
		}

		return { success: true, message: 'Invitation sent to ' + email };
	},

	removeMember: async ({ request, locals, cookies }) => {
		const user = locals.user;
		if (!user) throw error(401);

		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId) throw error(400);

		const formData = await request.formData();
		const memberId = formData.get('memberId') as string;

		await db.delete(schema.organizationMember)
			.where(and(
				eq(schema.organizationMember.id, memberId),
				eq(schema.organizationMember.orgId, activeWorkspaceId)
			));

		return { success: true };
	},

	updateMemberRole: async ({ request, locals, cookies }) => {
		const user = locals.user;
		if (!user) throw error(401);

		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId || activeWorkspaceId === 'personal') throw error(400);

		const formData = await request.formData();
		const memberId = formData.get('memberId') as string;
		const newRole = formData.get('role') as string;

		// Verify requester's permission
		const requesterMembership = await db.query.organizationMember.findFirst({
			where: and(
				eq(schema.organizationMember.orgId, activeWorkspaceId),
				eq(schema.organizationMember.userId, user.id)
			)
		});

		if (!requesterMembership || !['admin', 'owner'].includes(requesterMembership.role)) {
			throw error(403, 'Forbidden');
		}

		// Find target member
		const targetMember = await db.query.organizationMember.findFirst({
			where: eq(schema.organizationMember.id, memberId)
		});

		if (!targetMember) {
			return { error: 'Member not found' };
		}

		// Prevent updating own role via this action (to avoid self-lockout)
		if (targetMember.userId === user.id) {
			return { error: 'You cannot update your own role.' };
		}

		// Prevent updating the owner
		if (targetMember.role === 'owner') {
			return { error: 'The primary owner cannot be demoted.' };
		}

		await db.update(schema.organizationMember)
			.set({ role: newRole as any })
			.where(eq(schema.organizationMember.id, memberId));

		return { success: true };
	}
};
