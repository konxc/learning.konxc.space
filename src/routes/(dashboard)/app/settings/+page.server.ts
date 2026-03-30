import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/server/password';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { sendEmail } from '$lib/server/email';
import { timingSafeEqual } from 'crypto';

function validateEmail(email: unknown): email is string {
	if (typeof email !== 'string') return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: unknown): password is string {
	if (typeof password !== 'string') return false;
	return password.length >= 8 && password.length <= 255;
}

function constantTimeEquals(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	try {
		return timingSafeEqual(Buffer.from(a), Buffer.from(b));
	} catch {
		return a === b;
	}
}

async function requireOrgAdmin(
	userId: string,
	workspaceId: string
): Promise<
	| { error: true; message: string }
	| { error: false; membership: typeof schema.organizationMember.$inferSelect }
> {
	const membership = await db.query.organizationMember.findFirst({
		where: and(
			eq(schema.organizationMember.orgId, workspaceId),
			eq(schema.organizationMember.userId, userId)
		)
	});

	if (!membership || !['owner', 'admin'].includes(membership.role)) {
		return { error: true, message: 'Anda tidak memiliki akses untuk melakukan tindakan ini' };
	}
	return { error: false, membership };
}

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/signin');
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(schema.user.id, locals.user.id)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	// 1. Fetch KTP Verification Status
	const verification = await db.query.userVerification.findFirst({
		where: eq(schema.userVerification.userId, currentUser.id)
	});

	// 2. Fetch Organization Data
	const activeWorkspaceId = cookies.get('active-workspace');
	let organization = null;
	let orgMembers: any[] = [];
	let orgApiKeys: any[] = [];
	let isOrgAdmin: boolean = false;

	if (activeWorkspaceId && activeWorkspaceId !== 'personal') {
		organization = await db.query.organization.findFirst({
			where: eq(schema.organization.id, activeWorkspaceId)
		});

		if (organization) {
			const membership = await db.query.organizationMember.findFirst({
				where: and(
					eq(schema.organizationMember.orgId, activeWorkspaceId),
					eq(schema.organizationMember.userId, currentUser.id)
				)
			});

			if (membership) {
				isOrgAdmin = ['owner', 'admin'].includes(membership.role);

				// Fetch members
				orgMembers = await db
					.select({
						id: schema.organizationMember.id,
						role: schema.organizationMember.role,
						createdAt: schema.organizationMember.createdAt,
						user: {
							id: schema.user.id,
							fullName: schema.user.fullName,
							username: schema.user.username,
							email: schema.user.email,
							role: schema.user.role
						}
					})
					.from(schema.organizationMember)
					.innerJoin(schema.user, eq(schema.organizationMember.userId, schema.user.id))
					.where(eq(schema.organizationMember.orgId, activeWorkspaceId));

				// Fetch API Keys if admin
				if (isOrgAdmin) {
					orgApiKeys = await db.query.organizationApiKey.findMany({
						where: eq(schema.organizationApiKey.orgId, activeWorkspaceId),
						orderBy: [desc(schema.organizationApiKey.createdAt)]
					});
				}
			}
		}
	}

	const tabParam = url.searchParams.get('tab') || 'profile';

	const tabs = [
		{ label: 'Profil', id: 'profile', icon: 'user' },
		{ label: 'Keamanan', id: 'security', icon: 'shield' },
		{ label: 'Organisasi', id: 'organization', icon: 'layout' },
		{ label: 'Preferensi', id: 'preferences', icon: 'settings' },
		{ label: 'Akun', id: 'account', icon: 'trash-2' }
	];

	if (currentUser.role === 'admin') {
		tabs.push({ label: 'Payment Gateway', id: 'payments', icon: 'credit-card' });
	}

	const activeTab = tabs.some((t) => t.id === tabParam) ? tabParam : 'profile';

	// 3. Fetch User Preferences
	const userPrefs = await db.query.userPreferences.findFirst({
		where: eq(schema.userPreferences.userId, currentUser.id)
	});

	let notificationPrefs = { email: true, wa: false, push: false };
	try {
		if (userPrefs?.notificationPrefs) {
			notificationPrefs = JSON.parse(userPrefs.notificationPrefs);
		}
	} catch {
		notificationPrefs = { email: true, wa: false, push: false };
	}

	return {
		user: {
			id: currentUser.id,
			username: currentUser.username,
			fullName: currentUser.fullName,
			email: currentUser.email,
			phone: currentUser.phone,
			role: currentUser.role,
			createdAt: currentUser.createdAt,
			isVerified: verification?.status === 'approved'
		},
		organization,
		orgMembers,
		orgApiKeys,
		isOrgAdmin,
		headerTabs: {
			tabs,
			activeTab
		},
		preferences: {
			emailNotif: notificationPrefs.email,
			waNotif: notificationPrefs.wa,
			focusMode: userPrefs?.focusMode ?? true
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');
		const formData = await request.formData();
		const fullName = formData.get('fullName')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const phoneValue = formData.get('phone')?.toString();

		if (fullName && fullName.length > 100)
			return actionFailure(400, 'Nama lengkap maksimal 100 karakter');
		if (email && !validateEmail(email)) return actionFailure(400, 'Email tidak valid');

		try {
			await db
				.update(schema.user)
				.set({ fullName: fullName || null, email: email || null, phone: phoneValue || null })
				.where(eq(schema.user.id, locals.user.id));
			return actionSuccess({ message: 'Profil berhasil diperbarui!' });
		} catch (e) {
			return actionFailure(500, 'Terjadi kesalahan saat memperbarui profil');
		}
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');
		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() || '';
		const newPassword = formData.get('newPassword')?.toString() || '';
		const confirmPassword = formData.get('confirmPassword')?.toString() || '';

		if (!validatePassword(newPassword))
			return actionFailure(400, 'Password baru minimal 8 karakter');
		if (newPassword !== confirmPassword) return actionFailure(400, 'Password tidak cocok');

		const currentUser = await db.query.user.findFirst({
			where: eq(schema.user.id, locals.user.id)
		});
		if (!currentUser) return actionFailure(404, 'User tidak ditemukan');

		if (!(await verifyPassword(currentUser.passwordHash, currentPassword))) {
			return actionFailure(400, 'Password saat ini salah');
		}

		try {
			const newPasswordHash = await hashPassword(newPassword);
			await db
				.update(schema.user)
				.set({ passwordHash: newPasswordHash })
				.where(eq(schema.user.id, locals.user.id));
			return actionSuccess({ message: 'Password berhasil diubah!' });
		} catch (e) {
			return actionFailure(500, 'Terjadi kesalahan saat mengubah password');
		}
	},

	createOrganization: async ({ request, locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');

		// KTP Verification Check
		const verification = await db.query.userVerification.findFirst({
			where: eq(schema.userVerification.userId, locals.user.id)
		});

		if (verification?.status !== 'approved' && locals.user.role !== 'admin') {
			return actionFailure(
				403,
				'Anda harus verifikasi KTP terlebih dahulu untuk membuat organisasi.'
			);
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const brandColor = (formData.get('brandColor') as string) || '#4f46e5';

		if (!name || !slug) return actionFailure(400, 'Nama dan Slug wajib diisi');
		if (!/^[a-z0-9-]+$/.test(slug))
			return actionFailure(400, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung');

		const existingOrg = await db.query.organization.findFirst({
			where: eq(schema.organization.slug, slug)
		});
		if (existingOrg) return actionFailure(400, 'URL ini sudah digunakan');

		try {
			const orgId = 'org-' + crypto.randomUUID().substring(0, 8);
			await db.insert(schema.organization).values({ id: orgId, slug, name, brandColor });
			await db.insert(schema.organizationMember).values({
				id: 'mem-' + crypto.randomUUID().substring(0, 8),
				orgId,
				userId: locals.user.id,
				role: 'owner'
			});

			cookies.set('active-workspace', orgId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
				sameSite: 'lax'
			});
			return actionSuccess({ message: 'Organisasi berhasil dibuat!' });
		} catch (e) {
			return actionFailure(500, 'Gagal membuat organisasi');
		}
	},

	updateOrgSettings: async ({ request, locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');
		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId || activeWorkspaceId === 'personal')
			return actionFailure(400, 'Workspace tidak valid');

		const authCheck = await requireOrgAdmin(locals.user.id, activeWorkspaceId!);
		if (authCheck.error) {
			return actionFailure(403, authCheck.message);
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const brandColor = formData.get('brandColor') as string;

		await db
			.update(schema.organization)
			.set({ name, brandColor, updatedAt: new Date() })
			.where(eq(schema.organization.id, activeWorkspaceId!));

		return actionSuccess({ message: 'Pengaturan organisasi diperbarui' });
	},

	createApiKey: async ({ request, locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');

		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId || activeWorkspaceId === 'personal') {
			return actionFailure(400, 'Workspace tidak valid');
		}

		const authCheck = await requireOrgAdmin(locals.user.id, activeWorkspaceId);
		if (authCheck.error) {
			return actionFailure(403, authCheck.message);
		}

		// Verify the organization exists
		const organization = await db.query.organization.findFirst({
			where: eq(schema.organization.id, activeWorkspaceId)
		});

		if (!organization) {
			return actionFailure(404, 'Organisasi tidak ditemukan');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString() || 'New Agent Key';

		try {
			const key = 'nk_' + crypto.randomUUID().replace(/-/g, '');
			await db.insert(schema.organizationApiKey).values({
				id: crypto.randomUUID(),
				orgId: activeWorkspaceId,
				key,
				name,
				status: 'active'
			});
			return actionSuccess({ message: 'API Key berhasil dibuat!', data: { key } });
		} catch (e) {
			return actionFailure(500, 'Gagal membuat API Key');
		}
	},

	revokeApiKey: async ({ request, locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');

		const activeWorkspaceId = cookies.get('active-workspace');
		if (!activeWorkspaceId || activeWorkspaceId === 'personal') {
			return actionFailure(400, 'Workspace tidak valid');
		}

		const authCheck = await requireOrgAdmin(locals.user.id, activeWorkspaceId);
		if (authCheck.error) {
			return actionFailure(403, authCheck.message);
		}

		const formData = await request.formData();
		const keyId = formData.get('keyId')?.toString();
		if (!keyId) return actionFailure(400, 'Key ID required');

		// Verify the key belongs to this organization
		const apiKey = await db.query.organizationApiKey.findFirst({
			where: eq(schema.organizationApiKey.id, keyId)
		});

		if (!apiKey || apiKey.orgId !== activeWorkspaceId) {
			return actionFailure(404, 'API Key tidak ditemukan');
		}

		await db
			.update(schema.organizationApiKey)
			.set({ status: 'revoked' })
			.where(eq(schema.organizationApiKey.id, keyId));

		return actionSuccess({ message: 'API Key berhasil dicabut' });
	},

	updatePreferences: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');

		const formData = await request.formData();
		const emailNotif = formData.get('emailNotif') === 'true';
		const waNotif = formData.get('waNotif') === 'true';
		const focusMode = formData.get('focusMode') === 'true';

		const notificationPrefs = JSON.stringify({ email: emailNotif, wa: waNotif, push: false });

		try {
			await db
				.insert(schema.userPreferences)
				.values({
					userId: locals.user.id,
					notificationPrefs,
					focusMode,
					updatedAt: new Date()
				})
				.onConflictDoUpdate({
					target: schema.userPreferences.userId,
					set: { notificationPrefs, focusMode, updatedAt: new Date() }
				});

			return actionSuccess({ message: 'Preferensi disimpan!' });
		} catch (e) {
			console.error('Save preferences error:', e);
			return actionFailure(500, 'Gagal menyimpan preferensi');
		}
	},

	deleteAccount: async ({ request, locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/auth/signin');

		const formData = await request.formData();
		const confirmText = formData.get('confirmText')?.toString() || '';
		if (!constantTimeEquals(confirmText, 'HAPUS')) {
			return actionFailure(400, 'Konfirmasi tidak valid');
		}
		if (locals.user.role === 'admin') {
			return actionFailure(400, 'Admin tidak dapat dihapus');
		}

		// Get user email before deletion
		const user = await db.query.user.findFirst({
			where: eq(schema.user.id, locals.user.id)
		});

		if (!user) {
			return actionFailure(404, 'User tidak ditemukan');
		}

		// Perform deletion
		await db
			.update(schema.user)
			.set({ deletedAt: new Date() })
			.where(eq(schema.user.id, locals.user.id));

		// Send deletion confirmation email (fire and forget)
		if (user.email) {
			sendEmail(user.email, 'account_deleted', {
				name: user.fullName || user.username,
				deletedAt: new Date().toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'long',
					year: 'numeric'
				})
			}).catch(console.error);
		}

		// Delete all sessions
		await db.delete(schema.session).where(eq(schema.session.userId, locals.user.id));

		// Clear session cookie
		cookies.set('session', '', { path: '/', maxAge: 0 });

		// Redirect to home page after deletion
		throw redirect(302, '/?deleted=true');
	}
};
