import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    // Get all users
    const users = await db
        .select({
            id: schema.user.id,
            username: schema.user.username,
            email: schema.user.email,
            fullName: schema.user.fullName,
            role: schema.user.role,
            phone: schema.user.phone,
            onboardingCompleted: schema.user.onboardingCompleted,
            createdAt: schema.user.createdAt
        })
        .from(schema.user)
        .orderBy(schema.user.createdAt);

    return {
        users
    };
};
