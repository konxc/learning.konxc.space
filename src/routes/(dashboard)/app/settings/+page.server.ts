import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/server/password';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { logAudit } from '$lib/server/audit';
import { deleteSessionTokenCookie, sessionCookieName } from '$lib/server/auth';
import { sendEmail } from '$lib/server/email';

function validateEmail(email: unknown): email is string {
	if (typeof email !== 'string') return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: unknown): password is string {
	if (typeof password !== 'string') return false;
	return password.length >= 8 && password.length <= 255;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/signin');
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(user.id, locals.user.id)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	const tabParam = url.searchParams.get('tab') || 'profile';

	// Define base tabs available to everyone
	const tabs = [
		{ label: 'Profil', id: 'profile' },
		{ label: 'Keamanan', id: 'security' },
		{ label: 'Preferensi', id: 'preferences' },
		{ label: 'Akun', id: 'account' }
	];

	// Add administrative tabs
	if (currentUser.role === 'admin') {
		tabs.push({ label: 'Payment Gateway', id: 'payments' });
	}

	// Validate requested tab against available tabs for this role
	const activeTab = tabs.some((t) => t.id === tabParam) ? tabParam : 'profile';

	return {
		user: {
			id: currentUser.id,
			username: currentUser.username,
			fullName: currentUser.fullName,
			email: currentUser.email,
			phone: currentUser.phone,
			role: currentUser.role,
			createdAt: currentUser.createdAt
		},
		headerTabs: {
			tabs,
			activeTab
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/signin');
		}

		const formData = await request.formData();
		const fullName = formData.get('fullName')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const phoneValue = formData.get('phone')?.toString();

		// Validation
		if (fullName && fullName.length > 100) {
			return actionFailure(400, 'Nama lengkap maksimal 100 karakter');
		}

		if (email && !validateEmail(email)) {
			return actionFailure(400, 'Email tidak valid');
		}

		if (phoneValue && phoneValue.length > 20) {
			return actionFailure(400, 'Nomor telepon maksimal 20 karakter');
		}

		try {
			await db
				.update(user)
				.set({
					fullName: fullName || null,
					email: email || null,
					phone: phoneValue || null
				})
				.where(eq(user.id, locals.user.id));

			return actionSuccess({ message: 'Profil berhasil diperbarui!' });
		} catch (e) {
			console.error('Error updating profile:', e);
			return actionFailure(500, 'Terjadi kesalahan saat memperbarui profil');
		}
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/signin');
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() || '';
		const newPassword = formData.get('newPassword')?.toString() || '';
		const confirmPassword = formData.get('confirmPassword')?.toString() || '';

		// Validation
		if (!currentPassword) {
			return actionFailure(400, 'Password saat ini harus diisi');
		}

		if (!validatePassword(newPassword)) {
			return actionFailure(400, 'Password baru harus minimal 8 karakter');
		}

		if (newPassword !== confirmPassword) {
			return actionFailure(400, 'Password baru dan konfirmasi password tidak cocok');
		}

		// Get current user
		const currentUser = await db.query.user.findFirst({
			where: eq(user.id, locals.user.id)
		});

		if (!currentUser) {
			return actionFailure(404, 'User tidak ditemukan');
		}

		// Verify current password
		const isValidPassword = await verifyPassword(currentUser.passwordHash, currentPassword);

		if (!isValidPassword) {
			return actionFailure(400, 'Password saat ini salah');
		}

		try {
			// Hash new password
			const newPasswordHash = await hashPassword(newPassword);

			// Update password
			await db
				.update(user)
				.set({ passwordHash: newPasswordHash })
				.where(eq(user.id, locals.user.id));

			return actionSuccess({ message: 'Password berhasil diubah!' });
		} catch (e) {
			console.error('Error changing password:', e);
			return actionFailure(500, 'Terjadi kesalahan saat mengubah password');
		}
	},

	deleteAccount: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/signin');
		}

		const formData = await request.formData();
		const confirmText = formData.get('confirmText')?.toString() || '';

		// Validation - require "HAPUS" confirmation
		if (confirmText !== 'HAPUS') {
			return actionFailure(400, 'Konfirmasi tidak valid. Ketik "HAPUS" untuk menghapus akun.');
		}

		// Prevent admin account deletion through UI (admins can still be deleted via DB)
		if (locals.user.role === 'admin') {
			return actionFailure(
				400,
				'Akun admin tidak dapat dihapus melalui halaman ini. Hubungi administrator lain.'
			);
		}

		try {
			// Store user info before deletion for email
			const userEmail = locals.user.email;
			const userName = locals.user.fullName || locals.user.username;

			// Soft delete user by setting deleted_at timestamp
			await db.update(user).set({ deletedAt: new Date() }).where(eq(user.id, locals.user.id));

			// Invalidate all user sessions
			await db.delete(session).where(eq(session.userId, locals.user.id));

			// Log audit for account deletion
			await logAudit({} as any, 'account_deletion', {
				userId: locals.user.id,
				username: locals.user.username
			});

			// Send deletion confirmation email
			if (userEmail) {
				try {
					await sendEmail(userEmail, 'account_deleted', {
						email: userEmail,
						name: userName
					});
				} catch (emailError) {
					console.error('Failed to send deletion email:', emailError);
				}
			}

			return actionSuccess({
				message: 'Akun berhasil dihapus. Anda akan segera dialihkan.'
			});
		} catch (e) {
			console.error('Error deleting account:', e);
			return actionFailure(500, 'Terjadi kesalahan saat menghapus akun');
		}
	}
};
