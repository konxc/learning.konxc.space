import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    // Get all users for mentor selection
    const users = await db.select().from(schema.user);

    return {
        users
    };
};

export const actions = {
    default: async (event) => {
        const user = await requireAdmin(event);

        const formData = await event.request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const price = formData.get('price');
        const duration = formData.get('duration');
        const thumbnailUrl = formData.get('thumbnailUrl');
        const mentorId = formData.get('mentorId');

        // Validation
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return fail(400, { error: 'Title is required' });
        }

        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return fail(400, { error: 'Description is required' });
        }

        const priceNum = price ? parseInt(price as string) : 0;
        if (isNaN(priceNum) || priceNum < 0) {
            return fail(400, { error: 'Valid price is required' });
        }

        const durationNum = duration ? parseInt(duration as string) : null;
        if (duration && isNaN(durationNum!)) {
            return fail(400, { error: 'Valid duration is required' });
        }

        // Generate ID
        const id = crypto.randomUUID();

        // Insert course
        await db.insert(schema.course).values({
            id,
            title: title.trim(),
            description: description.trim(),
            price: priceNum,
            duration: durationNum,
            thumbnailUrl: thumbnailUrl && typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : null,
            mentorId: mentorId && typeof mentorId === 'string' && mentorId !== 'none' ? mentorId : null,
            status: 'draft',
            createdBy: user.id
        });

        throw redirect(303, '/dashboard/admin/courses');
    }
} satisfies Actions;
