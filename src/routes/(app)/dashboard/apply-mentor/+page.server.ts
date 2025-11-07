import { requireAuth } from '$lib/server/middleware';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const user = await requireAuth(event);

    // Check if user is already mentor or admin
    if (user.role === 'mentor' || user.role === 'admin') {
        throw redirect(303, '/dashboard');
    }

    // Get existing application if any
    const applications = await db
        .select()
        .from(schema.mentorApplication)
        .where(eq(schema.mentorApplication.userId, user.id))
        .orderBy(desc(schema.mentorApplication.createdAt))
        .limit(1);

    return {
        user,
        existingApplication: applications[0] || null
    };
};

export const actions: Actions = {
    default: async (event) => {
        const user = await requireAuth(event);

        // Check if user is already mentor/admin
        if (user.role === 'mentor' || user.role === 'admin') {
            return fail(403, { message: 'Anda sudah menjadi mentor atau admin' });
        }

        const formData = await event.request.formData();
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const bio = formData.get('bio');
        const expertise = formData.get('expertise');
        const yearsExperience = formData.get('yearsExperience');
        const portfolioUrl = formData.get('portfolioUrl');
        const githubUrl = formData.get('githubUrl');
        const linkedinUrl = formData.get('linkedinUrl');
        const motivation = formData.get('motivation');

        // Validation
        if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
            return fail(400, { message: 'Nama lengkap wajib diisi' });
        }

        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            return fail(400, { message: 'Email wajib diisi' });
        }

        if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
            return fail(400, { message: 'Nomor telepon wajib diisi' });
        }

        if (!bio || typeof bio !== 'string' || bio.trim().length === 0) {
            return fail(400, { message: 'Bio wajib diisi' });
        }

        if (!expertise || typeof expertise !== 'string' || expertise.trim().length === 0) {
            return fail(400, { message: 'Bidang keahlian wajib diisi' });
        }

        const yearsExp = yearsExperience ? parseInt(yearsExperience as string) : 0;
        if (!yearsExperience || isNaN(yearsExp) || yearsExp < 0) {
            return fail(400, { message: 'Tahun pengalaman wajib diisi dengan angka valid' });
        }

        if (!motivation || typeof motivation !== 'string' || motivation.trim().length === 0) {
            return fail(400, { message: 'Motivasi wajib diisi' });
        }

        // Check if user already has pending application
        const pendingApps = await db
            .select()
            .from(schema.mentorApplication)
            .where(
                and(
                    eq(schema.mentorApplication.userId, user.id),
                    eq(schema.mentorApplication.status, 'pending')
                )
            )
            .limit(1);

        if (pendingApps.length > 0) {
            return fail(400, {
                message: 'Anda sudah memiliki aplikasi yang sedang dalam review'
            });
        }

        // Create application
        const applicationId = crypto.randomUUID();

        await db.insert(schema.mentorApplication).values({
            id: applicationId,
            userId: user.id,
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            bio: bio.trim(),
            expertise: expertise.trim(),
            yearsExperience: yearsExp,
            portfolioUrl:
                portfolioUrl && typeof portfolioUrl === 'string' && portfolioUrl.trim()
                    ? portfolioUrl.trim()
                    : null,
            githubUrl:
                githubUrl && typeof githubUrl === 'string' && githubUrl.trim() ? githubUrl.trim() : null,
            linkedinUrl:
                linkedinUrl && typeof linkedinUrl === 'string' && linkedinUrl.trim()
                    ? linkedinUrl.trim()
                    : null,
            motivation: motivation.trim(),
            status: 'pending'
        });

        throw redirect(303, '/dashboard/my-mentor-application');
    }
};
