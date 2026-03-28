import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedPartners(db: LibSQLDatabase<typeof schema>) {
	logSection('Seeding partners');

	const partners = [
		{
			id: 'partner-001',
			name: 'Yayasan ASIB',
			description: 'Partner pemberdayaan ekonomi umat.',
			contactEmail: 'info@asib.org',
			status: 'active',
			createdAt: new Date()
		},
		{
			id: 'partner-002',
			name: 'Koneksi Digital',
			description: 'Platform akselerasi bisnis digital.',
			contactEmail: 'hello@koneksi.id',
			status: 'active',
			createdAt: new Date()
		}
	];

	for (const partner of partners) {
		await db.insert(schema.partner).values(partner).onConflictDoNothing();
	}

	logSuccess(`Seeded ${partners.length} partners`);
}

export async function seedCohorts(
	db: LibSQLDatabase<typeof schema>,
	mentorIds: string[],
	courseIds: string[]
) {
	logSection('Seeding cohorts');

	const cohorts = [
		{
			id: 'cohort-001',
			name: 'Naik Kelas Batch 1 - Python',
			courseId: courseIds[0],
			facilitatorId: mentorIds[0],
			startDate: new Date('2024-02-01'),
			endDate: new Date('2024-04-30'),
			status: 'active',
			createdAt: new Date('2024-01-15')
		},
		{
			id: 'cohort-002',
			name: 'Naik Kelas Batch 2 - Full Stack',
			courseId: courseIds[1],
			facilitatorId: mentorIds[0],
			startDate: new Date('2024-03-01'),
			endDate: new Date('2024-05-31'),
			status: 'active',
			createdAt: new Date('2024-02-15')
		},
		{
			id: 'cohort-003',
			name: 'Naik Kelas Batch 3 - React',
			courseId: courseIds[2],
			facilitatorId: mentorIds[0],
			startDate: new Date('2024-04-01'),
			endDate: new Date('2024-06-30'),
			status: 'active',
			createdAt: new Date('2024-03-15')
		}
	];

	for (const cohort of cohorts) {
		await db.insert(schema.cohort).values(cohort).onConflictDoNothing();
	}

	logSuccess(`Seeded ${cohorts.length} cohorts`);
	return cohorts;
}
