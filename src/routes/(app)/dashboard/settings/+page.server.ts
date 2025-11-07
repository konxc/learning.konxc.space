import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/server/password';

function validateEmail(email: unknown): email is string {
	if (typeof email !== 'string') return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: unknown): password is string {
	if (typeof password !== 'string') return false;
	return password.length >= 8 && password.length <= 255;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const currentUser = await db.query.user.findFirst({
		where: eq(user.id, locals.user.id)
	});

	if (!currentUser) {
		throw error(404, 'User not found');
	}

	return {
		user: {
			id: currentUser.id,
			username: currentUser.username,
			fullName: currentUser.fullName,
			email: currentUser.email,
			phone: currentUser.phone,
			role: currentUser.role,
			createdAt: currentUser.createdAt
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const fullName = formData.get('fullName')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const phoneValue = formData.get('phone')?.toString();

		// Validation
		if (fullName && fullName.length > 100) {
			return fail(400, {
				error: 'Nama lengkap maksimal 100 karakter'
			});
		}

		if (email && !validateEmail(email)) {
			return fail(400, {
				error: 'Email tidak valid'
			});
		}

		if (phoneValue && phoneValue.length > 20) {
			return fail(400, {
				error: 'Nomor telepon maksimal 20 karakter'
			});
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

			return {
				success: 'Profil berhasil diperbarui!'
			};
		} catch (e) {
			console.error('Error updating profile:', e);
			return fail(500, {
				error: 'Terjadi kesalahan saat memperbarui profil'
			});
		}
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() || '';
		const newPassword = formData.get('newPassword')?.toString() || '';
		const confirmPassword = formData.get('confirmPassword')?.toString() || '';

		// Validation
		if (!currentPassword) {
			return fail(400, {
				error: 'Password saat ini harus diisi'
			});
		}

		if (!validatePassword(newPassword)) {
			return fail(400, {
				error: 'Password baru harus minimal 8 karakter'
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				error: 'Password baru dan konfirmasi password tidak cocok'
			});
		}

		// Get current user
		const currentUser = await db.query.user.findFirst({
			where: eq(user.id, locals.user.id)
		});

		if (!currentUser) {
			return fail(404, {
				error: 'User tidak ditemukan'
			});
		}

		// Verify current password
		const isValidPassword = await verifyPassword(currentUser.passwordHash, currentPassword);

		if (!isValidPassword) {
			return fail(400, {
				error: 'Password saat ini salah'
			});
		}

		try {
			// Hash new password
			const newPasswordHash = await hashPassword(newPassword);

			// Update password
			await db
				.update(user)
				.set({ passwordHash: newPasswordHash })
				.where(eq(user.id, locals.user.id));

			return {
				success: 'Password berhasil diubah!'
			};
		} catch (e) {
			console.error('Error changing password:', e);
			return fail(500, {
				error: 'Terjadi kesalahan saat mengubah password'
			});
		}
	}
};
