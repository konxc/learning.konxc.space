import { requireAuth } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    const user = await requireAuth(event);

    // Get latest application by user
    const applications = await db
        .select()
        .from(schema.mentorApplication)
        .where(eq(schema.mentorApplication.userId, user.id))
        .orderBy(desc(schema.mentorApplication.createdAt))
        .limit(1);

    const application = applications[0] || null;

    return {
        user,
        application,
        isMentor: user.role === 'mentor' || user.role === 'admin'
    };
};
