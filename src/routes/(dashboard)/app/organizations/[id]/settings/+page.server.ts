import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { actionFailure, actionSuccess } from '$lib/server/actions';
import { requireOrgAdmin } from '$lib/server/middleware';

export const load: PageServerLoad = async (event) => {
	const { organization } = await event.parent();
	const orgId = event.params.id;

	const membership = await requireOrgAdmin(event, orgId);

	return {
		organization,
		membership
	};
};

export const actions: Actions = {
	updateSettings: async (event) => {
		const { params, request } = event;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const name = (formData.get('name') as string) ?? '';
		const slug = (formData.get('slug') as string) ?? '';
		const brandColor = (formData.get('brandColor') as string) ?? '';

		if (name.trim().length < 3) {
			return actionFailure(400, 'Nama minimal 3 karakter');
		}

		if (slug) {
			if (!/^[a-z0-9-]+$/.test(slug)) {
				return actionFailure(400, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung');
			}

			const conflict = await db
				.select({ id: schema.organization.id })
				.from(schema.organization)
				.where(and(eq(schema.organization.slug, slug), ne(schema.organization.id, orgId)))
				.limit(1);

			if (conflict.length) {
				return actionFailure(409, 'Slug sudah digunakan');
			}
		}

		await db
			.update(schema.organization)
			.set({
				name: name.trim(),
				slug: slug || undefined,
				brandColor: brandColor || undefined,
				updatedAt: new Date()
			})
			.where(eq(schema.organization.id, orgId));

		return actionSuccess({ message: 'Pengaturan berhasil disimpan' });
	},

	updateLogo: async (event) => {
		const { params, request } = event;
		const orgId = params.id;

		// Verify membership via centralized helper
		const membership = await requireOrgAdmin(event, orgId);

		const formData = await request.formData();
		const logoBase64 = (formData.get('logoBase64') as string) ?? '';

		if (logoBase64 && logoBase64.length > 682667) {
			return actionFailure(400, 'Ukuran logo maksimal 500KB');
		}

		await db
			.update(schema.organization)
			.set({ logoUrl: logoBase64 || null, updatedAt: new Date() })
			.where(eq(schema.organization.id, orgId));

		return actionSuccess({ message: 'Logo berhasil diperbarui' });
	}
};
