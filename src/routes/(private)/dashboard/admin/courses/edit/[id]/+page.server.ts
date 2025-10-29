import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    const courseId = event.params.id;

    // Get course
    const courses = await db.select().from(schema.course).where(eq(schema.course.id, courseId)).limit(1);

    if (courses.length === 0) {
        throw redirect(303, '/dashboard/admin/courses');
    }

    // Get all users for mentor selection
    const users = await db.select().from(schema.user);

    return {
        course: courses[0],
        users
    };
};

export const actions = {
    default: async (event) => {
        await requireAdmin(event);

        const formData = await event.request.formData();
        const courseId = event.params.id;
        const title = formData.get('title');
        const description = formData.get('description');
        const price = formData.get('price');
        const duration = formData.get('duration');
        const thumbnailUrl = formData.get('thumbnailUrl');
        const mentorId = formData.get('mentorId');
        const status = formData.get('status');

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

        // Update course
        await db
            .update(schema.course)
            .set({
                title: title.trim(),
                description: description.trim(),
                price: priceNum,
                duration: durationNum,
                thumbnailUrl: thumbnailUrl && typeof thumbnailUrl === 'string' ? thumbnailUrl.trim() : null,
                mentorId: mentorId && typeof mentorId === 'string' && mentorId !== 'none' ? mentorId : null,
                status: (status as string) || 'draft',
                updatedAt: new Date()
            })
            .where(eq(schema.course.id, courseId));

        throw redirect(303, '/dashboard/admin/courses');
    }
} satisfies Actions;
