import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function seedPartners(db: NeonHttpDatabase<typeof schema>) {
	logSection('Seeding partners');

	const partners = [
		{
			id: 'partner-001',
			name: 'Yayasan Pondok IT',
			description: 'Yayasan pengembangan talenta digital untuk masyarakat pinggiran kota.',
			contactEmail: 'info@pondokit.org',
			status: 'active',
			createdAt: new Date('2024-01-01')
		},
		{
			id: 'partner-002',
			name: 'Koneksi Digital Academy',
			description: 'Platform akselerasi bisnis digital untuk UMKM Indonesia.',
			contactEmail: 'partnership@koneksi.id',
			status: 'active',
			createdAt: new Date('2024-01-15')
		},
		{
			id: 'partner-003',
			name: 'Komunitas Creator Indonesia',
			description: 'Komunitas content creator dan influencer Indonesia.',
			contactEmail: 'kolaborasi@kci.id',
			status: 'active',
			createdAt: new Date('2024-02-01')
		},
		{
			id: 'partner-004',
			name: 'Asosiasi UMKM Digital',
			description: 'Asosiasi untuk pengembangan UMKM go-digital di seluruh Indonesia.',
			contactEmail: 'kerjasama@umkmdigital.id',
			status: 'active',
			createdAt: new Date('2024-02-15')
		},
		{
			id: 'partner-005',
			name: 'Kampus Merdeka Hub',
			description: 'Program kolaborasi dengan universitas untuk program magang dan pelatihan.',
			contactEmail: 'akademik@kampusmerdeka.edu',
			status: 'active',
			createdAt: new Date('2024-03-01')
		}
	];

	for (const partner of partners) {
		await db.insert(schema.partner).values(partner).onConflictDoNothing();
	}

	logSuccess(`Seeded ${partners.length} partners`);
	return partners;
}

export async function seedCohorts(
	db: NeonHttpDatabase<typeof schema>,
	mentorIds: string[],
	facilitatorIds: string[],
	courseIds: string[]
) {
	logSection('Seeding cohorts (6 cohorts)');

	const cohorts = [
		// Course 0: Akselerasi Bisnis Digital - 2 batches
		{
			id: 'cohort-001',
			name: 'Akselerasi Bisnis Digital - Batch Januari 2024',
			courseId: courseIds[0],
			facilitatorId: facilitatorIds[0],
			startDate: new Date('2024-01-15'),
			endDate: new Date('2024-03-15'),
			status: 'completed',
			createdAt: new Date('2024-01-10')
		},
		{
			id: 'cohort-002',
			name: 'Akselerasi Bisnis Digital - Batch Maret 2024',
			courseId: courseIds[0],
			facilitatorId: facilitatorIds[1],
			startDate: new Date('2024-03-15'),
			endDate: new Date('2024-05-15'),
			status: 'active',
			createdAt: new Date('2024-03-10')
		},
		// Course 1: Content Creator Mastery - 1 batch
		{
			id: 'cohort-003',
			name: 'Content Creator Mastery - Batch Februari 2024',
			courseId: courseIds[1],
			facilitatorId: facilitatorIds[1],
			startDate: new Date('2024-02-01'),
			endDate: new Date('2024-04-01'),
			status: 'active',
			createdAt: new Date('2024-01-20')
		},
		// Course 2: E-Commerce - 1 batch
		{
			id: 'cohort-004',
			name: 'E-Commerce Success Blueprint - Batch Maret 2024',
			courseId: courseIds[2],
			facilitatorId: facilitatorIds[2],
			startDate: new Date('2024-03-01'),
			endDate: new Date('2024-04-15'),
			status: 'active',
			createdAt: new Date('2024-02-20')
		},
		// Course 3: Affiliate Marketing - 1 batch
		{
			id: 'cohort-005',
			name: 'Affiliate Marketing Pro - Batch April 2024',
			courseId: courseIds[3],
			facilitatorId: facilitatorIds[0],
			startDate: new Date('2024-04-01'),
			endDate: new Date('2024-05-01'),
			status: 'active',
			createdAt: new Date('2024-03-25')
		},
		// Course 4: Python Data Science - 1 batch
		{
			id: 'cohort-006',
			name: 'Python untuk Data Science - Batch Mei 2024',
			courseId: courseIds[4],
			facilitatorId: facilitatorIds[1],
			startDate: new Date('2024-05-01'),
			endDate: new Date('2024-07-15'),
			status: 'active',
			createdAt: new Date('2024-04-20')
		}
	];

	for (const cohort of cohorts) {
		await db.insert(schema.cohort).values(cohort).onConflictDoNothing();
	}

	logSuccess(`Seeded ${cohorts.length} cohorts`);
	return cohorts;
}
