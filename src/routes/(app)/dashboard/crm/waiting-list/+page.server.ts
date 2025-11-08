import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { WAITING_LIST_STATUSES, type WaitingListStatus } from '$lib/constants/waiting-list';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async ({ locals }) => {
	// Only admin and bd can access
	if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'bd')) {
		throw redirect(303, '/dashboard');
	}

	// Get all waiting list entries, ordered by newest first
	const entries = await db.select().from(schema.waitingList).orderBy(schema.waitingList.createdAt);

	return {
		entries
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		// Only admin and bd can update
		if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'bd')) {
			return actionFailure(403, 'Unauthorized');
		}

		const formData = await request.formData();
		const id = String(formData.get('id') || '').trim();
		const status = String(formData.get('status') || '').trim();

		if (!id || !status) {
			return actionFailure(400, 'Invalid data');
		}

		// Validate status
		if (!WAITING_LIST_STATUSES.includes(status as WaitingListStatus)) {
			return actionFailure(400, 'Invalid status');
		}

		try {
			await db
				.update(schema.waitingList)
				.set({
					status,
					updatedAt: new Date()
				})
				.where(eq(schema.waitingList.id, id));

			return actionSuccess();
		} catch (err) {
			console.error('Error updating waiting list status:', err);
			return actionFailure(500, 'Failed to update status');
		}
	},

	addNotes: async ({ request, locals }) => {
		// Only admin and bd can add notes
		if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'bd')) {
			return actionFailure(403, 'Unauthorized');
		}

		const formData = await request.formData();
		const id = String(formData.get('id') || '').trim();
		const notes = String(formData.get('notes') || '').trim();

		if (!id) {
			return actionFailure(400, 'Invalid data');
		}

		try {
			await db
				.update(schema.waitingList)
				.set({
					notes: notes || null,
					updatedAt: new Date()
				})
				.where(eq(schema.waitingList.id, id));

			return actionSuccess({ message: 'Catatan waiting list berhasil diperbarui.' });
		} catch (err) {
			console.error('Error updating notes:', err);
			return actionFailure(500, 'Failed to update notes');
		}
	},

	export: async ({ locals }) => {
		// Only admin and bd can export
		if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'bd')) {
			throw redirect(303, '/dashboard');
		}

		const entries = await db
			.select()
			.from(schema.waitingList)
			.orderBy(schema.waitingList.createdAt);

		// Generate CSV
		const headers = [
			'ID',
			'Nama Lengkap',
			'Email',
			'HP',
			'Minat',
			'Source',
			'Status',
			'Notes',
			'Tanggal Daftar'
		];
		const rows = entries.map((entry) => [
			entry.id,
			entry.fullName,
			entry.email,
			entry.phone || '',
			entry.interest || '',
			entry.source || '',
			entry.status,
			(entry.notes || '').replace(/"/g, '""'), // Escape quotes
			new Date(entry.createdAt).toLocaleString('id-ID')
		]);

		const csvContent = [
			headers.join(','),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
		].join('\n');

		return new Response(csvContent, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': 'attachment; filename="waiting_list.csv"'
			}
		});
	}
};
