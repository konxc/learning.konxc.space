import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

// Disable prerendering because this page has server actions
export const prerender = false;

export const load: PageServerLoad = async () => {
    return {};
};

export const actions: Actions = {
    join: async ({ request }) => {
        const formData = await request.formData();
        const fullName = String(formData.get('fullName') || '').trim();
        const email = String(formData.get('email') || '').trim().toLowerCase();
        const phone = String(formData.get('phone') || '').trim();
        const interest = String(formData.get('interest') || '').trim();
        const source = String(formData.get('source') || 'landing-cta').trim();

        // Validation
        if (!fullName || fullName.length < 2) {
            return fail(400, { error: 'Nama lengkap minimal 2 karakter' });
        }

        if (!email) {
            return fail(400, { error: 'Email wajib diisi' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return fail(400, { error: 'Format email tidak valid' });
        }

        // Check if email already exists
        const existing = await db
            .select()
            .from(schema.waitingList)
            .where(eq(schema.waitingList.email, email))
            .limit(1);

        if (existing.length > 0) {
            return fail(400, {
                error: 'Email ini sudah terdaftar di waiting list. Kami akan menghubungi kamu segera!'
            });
        }

        try {
            const id = encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
            const now = Date.now();

            await db.insert(schema.waitingList).values({
                id,
                fullName,
                email,
                phone: phone || null,
                interest: interest || null,
                source: source || 'landing-cta',
                status: 'new',
                notes: null,
                createdAt: now,
                updatedAt: now
            });

            return { success: true };
        } catch (err) {
            console.error('Error saving to waiting list:', err);
            return fail(500, { error: 'Terjadi kesalahan. Silakan coba lagi nanti.' });
        }
    }
};

