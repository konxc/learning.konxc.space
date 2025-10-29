import { requireAdmin } from '$lib/server/middleware';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    await requireAdmin(event);

    const applicationId = event.params.id;

    // Get application with user info
    const applications = await db
        .select({
            application: {
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
                reviewedBy: schema.mentorApplication.reviewedBy
            },
            user: {
                id: schema.user.id,
                username: schema.user.username,
                role: schema.user.role,
                email: schema.user.email
            }
        })
        .from(schema.mentorApplication)
        .innerJoin(schema.user, eq(schema.mentorApplication.userId, schema.user.id))
        .where(eq(schema.mentorApplication.id, applicationId))
        .limit(1);

    if (applications.length === 0) {
        throw redirect(303, '/dashboard/admin/mentor-applications');
    }

    return {
        application: applications[0].application,
        user: applications[0].user,
        currentUser: event.locals.user
    };
};

export const actions: Actions = {
    approve: async (event) => {
        await requireAdmin(event);

        const applicationId = event.params.id;
        const formData = await event.request.formData();
        const adminNotes = formData.get('adminNotes');

        // Get application
        const applications = await db
            .select()
            .from(schema.mentorApplication)
            .where(eq(schema.mentorApplication.id, applicationId))
            .limit(1);

        if (applications.length === 0) {
            return fail(404, { message: 'Application not found' });
        }

        const application = applications[0];

        // Update application status
        await db
            .update(schema.mentorApplication)
            .set({
                status: 'approved',
                reviewedBy: event.locals.user!.id,
                reviewedAt: new Date(),
                adminNotes:
                    adminNotes && typeof adminNotes === 'string' ? adminNotes.trim() : null
            })
            .where(eq(schema.mentorApplication.id, applicationId));

        // Update user role to mentor
        await db
            .update(schema.user)
            .set({
                role: 'mentor'
            })
            .where(eq(schema.user.id, application.userId));

        throw redirect(303, '/dashboard/admin/mentor-applications');
    },

    reject: async (event) => {
        await requireAdmin(event);

        const applicationId = event.params.id;
        const formData = await event.request.formData();
        const adminNotes = formData.get('adminNotes');

        if (!adminNotes || typeof adminNotes !== 'string' || adminNotes.trim().length === 0) {
            return fail(400, { message: 'Admin notes is required when rejecting' });
        }

        // Get application
        const applications = await db
            .select()
            .from(schema.mentorApplication)
            .where(eq(schema.mentorApplication.id, applicationId))
            .limit(1);

        if (applications.length === 0) {
            return fail(404, { message: 'Application not found' });
        }

        // Update application status
        await db
            .update(schema.mentorApplication)
            .set({
                status: 'rejected',
                reviewedBy: event.locals.user!.id,
                reviewedAt: new Date(),
                adminNotes: adminNotes.trim()
            })
            .where(eq(schema.mentorApplication.id, applicationId));

        throw redirect(303, '/dashboard/admin/mentor-applications');
    }
};
