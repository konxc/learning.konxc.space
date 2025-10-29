import { requireAdmin } from '$lib/server/middleware';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    // Get all mentor applications with user info
    const applications = await db
        .select({
            id: schema.mentorApplication.id,
            userId: schema.mentorApplication.userId,
            fullName: schema.mentorApplication.fullName,
            email: schema.mentorApplication.email,
            phone: schema.mentorApplication.phone,
            bio: schema.mentorApplication.bio,
            expertise: schema.mentorApplication.expertise,
            yearsExperience: schema.mentorApplication.yearsExperience,
            portfolioUrl: schema.mentorApplication.portfolioUrl,
            githubUrl: schema.mentorApplication.githubUrl,
            linkedinUrl: schema.mentorApplication.linkedinUrl,
            motivation: schema.mentorApplication.motivation,
            status: schema.mentorApplication.status,
            adminNotes: schema.mentorApplication.adminNotes,
            createdAt: schema.mentorApplication.createdAt,
            reviewedAt: schema.mentorApplication.reviewedAt,
            reviewedBy: schema.mentorApplication.reviewedBy,
            user: {
                username: schema.user.username,
                role: schema.user.role
            }
        })
        .from(schema.mentorApplication)
        .innerJoin(schema.user, eq(schema.mentorApplication.userId, schema.user.id))
        .orderBy(schema.mentorApplication.createdAt);

    return {
        applications
    };
};
