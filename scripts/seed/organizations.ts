import * as schema from '../../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedOrganizations(db: LibSQLDatabase<typeof schema>, adminIds: string[]) {
	console.log('🏢 Seeding organizations...');

	const organizations = [
		{
			id: 'org-yayasan-asib',
			slug: 'yayasan-asib',
			name: 'Yayasan ASIB',
			logoUrl: null,
			brandColor: '#22c55e',
			planType: 'enterprise',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		},
		{
			id: 'org-koneksi',
			slug: 'koneksi-digital',
			name: 'Koneksi Digital Academy',
			logoUrl: null,
			brandColor: '#4f46e5',
			planType: 'pro',
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15')
		},
		{
			id: 'org-marketing-lab',
			slug: 'marketing-lab',
			name: 'Marketing Lab Indonesia',
			logoUrl: null,
			brandColor: '#f59e0b',
			planType: 'free',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		}
	];

	for (const org of organizations) {
		await db.insert(schema.organization).values(org).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${organizations.length} organizations`);

	// Seed organization members
	console.log('👥 Seeding organization members...');

	const members = [
		// Yayasan ASIB - Admin is owner
		{
			id: 'mem-asib-001',
			orgId: 'org-yayasan-asib',
			userId: adminIds[0], // admin
			role: 'owner',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		},
		{
			id: 'mem-asib-002',
			orgId: 'org-yayasan-asib',
			userId: adminIds[1], // bd_user
			role: 'admin',
			createdAt: new Date('2024-01-02'),
			updatedAt: new Date('2024-01-02')
		},
		{
			id: 'mem-asib-003',
			orgId: 'org-yayasan-asib',
			userId: adminIds[2], // mentor1
			role: 'facilitator',
			createdAt: new Date('2024-01-03'),
			updatedAt: new Date('2024-01-03')
		},
		// Koneksi Digital - Admin is owner
		{
			id: 'mem-koneksi-001',
			orgId: 'org-koneksi',
			userId: adminIds[0], // admin
			role: 'owner',
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15')
		},
		{
			id: 'mem-koneksi-002',
			orgId: 'org-koneksi',
			userId: adminIds[2], // mentor1
			role: 'creator',
			createdAt: new Date('2024-01-16'),
			updatedAt: new Date('2024-01-16')
		},
		// Marketing Lab - Admin is owner
		{
			id: 'mem-marketing-001',
			orgId: 'org-marketing-lab',
			userId: adminIds[0], // admin
			role: 'owner',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		}
	];

	for (const member of members) {
		await db.insert(schema.organizationMember).values(member).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${members.length} organization members`);

	return organizations;
}

export async function assignCoursesToOrganizations(db: LibSQLDatabase<typeof schema>, courseIds: string[]) {
	console.log('📚 Assigning courses to organizations...');

	// Assign some courses to organizations
	const assignments = [
		{ courseId: courseIds[0], orgId: 'org-koneksi' }, // Python -> Koneksi
		{ courseId: courseIds[1], orgId: 'org-koneksi' }, // Full Stack -> Koneksi
		{ courseId: courseIds[2], orgId: 'org-marketing-lab' }, // React -> Marketing Lab
	];

	for (const assignment of assignments) {
		await db.update(schema.course)
			.set({ orgId: assignment.orgId })
			.where(eq(schema.course.id, assignment.courseId));
	}

	console.log(`✅ Assigned ${assignments.length} courses to organizations`);
}
