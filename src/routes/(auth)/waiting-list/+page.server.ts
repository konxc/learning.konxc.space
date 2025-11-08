import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';
import { actionFailure, actionSuccess } from '$lib/server/actions';

// Disable prerendering because this page has server actions
export const prerender = false;

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	join: async ({ request }) => {
		const formData = await request.formData();
		const fullName = String(formData.get('fullName') || '').trim();
		const email = String(formData.get('email') || '')
			.trim()
			.toLowerCase();
		const phone = String(formData.get('phone') || '').trim();
		const interest = String(formData.get('interest') || '').trim();
		const school = String(formData.get('school') || '').trim();
		const enrollmentYear = String(formData.get('enrollmentYear') || '').trim();
		const educationStatus = String(formData.get('educationStatus') || '').trim();
		const screenshotFile = formData.get('screenshot') as File | null;
		const instagramUsername = String(formData.get('instagramUsername') || '').trim();
		const source = String(formData.get('source') || 'landing-cta').trim();

		// Validation
		const trimmedFullName = fullName.trim();
		if (!trimmedFullName || trimmedFullName.length < 2) {
			return actionFailure(400, 'Nama lengkap minimal 2 karakter');
		}

		if (!email) {
			return actionFailure(400, 'Email wajib diisi');
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return actionFailure(400, 'Format email tidak valid');
		}

		// Validate screenshot file
		if (!screenshotFile || screenshotFile.size === 0) {
			return actionFailure(400, 'Bukti screenshot wajib diisi');
		}

		// Validate file type
		if (!screenshotFile.type.startsWith('image/')) {
			return actionFailure(400, 'File harus berupa gambar');
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (screenshotFile.size > maxSize) {
			return actionFailure(400, 'Ukuran gambar maksimal 5MB');
		}

		// Compress image before converting to base64
		let screenshotDataUrl: string;
		try {
			const arrayBuffer = await screenshotFile.arrayBuffer();
			const inputBuffer = Buffer.from(arrayBuffer);

			// Use sharp to compress the image
			// Resize if too large (max width 1200px), convert to JPEG with 80% quality
			const compressedBuffer = await sharp(inputBuffer)
				.resize(1200, null, {
					withoutEnlargement: true,
					fit: 'inside'
				})
				.jpeg({ quality: 80, mozjpeg: true })
				.toBuffer();

			// Convert compressed buffer to base64
			const base64 = compressedBuffer.toString('base64');
			screenshotDataUrl = `data:image/jpeg;base64,${base64}`;
		} catch (err) {
			console.error('Error compressing image:', err);
			// Fallback to original conversion if compression fails
			const arrayBuffer = await screenshotFile.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const base64 = buffer.toString('base64');
			screenshotDataUrl = `data:${screenshotFile.type};base64,${base64}`;
		}

		// Validate Instagram username
		const trimmedInstagramUsername = instagramUsername.trim();
		if (!trimmedInstagramUsername || trimmedInstagramUsername.length < 1) {
			return actionFailure(400, 'Username Instagram wajib diisi');
		}

		// Check if email already exists
		const existing = await db
			.select()
			.from(schema.waitingList)
			.where(eq(schema.waitingList.email, email))
			.limit(1);

		if (existing.length > 0) {
			return actionFailure(
				400,
				'Email ini sudah terdaftar di waiting list. Kami akan menghubungi kamu segera!'
			);
		}

		try {
			const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
			const now = new Date();

			await db.insert(schema.waitingList).values({
				id,
				fullName: trimmedFullName,
				email,
				phone: phone || null,
				interest: interest || null,
				school: school || null,
				enrollmentYear: enrollmentYear || null,
				educationStatus: educationStatus || null,
				screenshot: screenshotDataUrl || null,
				instagramUsername: trimmedInstagramUsername || null,
				source: source || 'landing-cta',
				status: 'new',
				notes: null,
				createdAt: now,
				updatedAt: now
			});

			return actionSuccess({
				message: 'Berhasil mendaftar waiting list. Kami akan menghubungi kamu segera.'
			});
		} catch (err) {
			console.error('Error saving to waiting list:', err);
			return actionFailure(500, 'Terjadi kesalahan. Silakan coba lagi nanti.');
		}
	}
};
