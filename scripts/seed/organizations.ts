import * as schema from '../../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

function generateId() {
	return 'ws-' + Math.random().toString(36).substring(2, 11);
}

export async function seedOrganizations(db: LibSQLDatabase<typeof schema>, adminIds: string[]) {
	console.log('🏢 Seeding organizations...');

	const organizations = [
		{
			id: 'org-pondokit',
			slug: 'pondokit-academy',
			name: 'Pondok IT Academy',
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
			id: 'org-marketinglab',
			slug: 'marketing-lab-id',
			name: 'Marketing Lab Indonesia',
			logoUrl: null,
			brandColor: '#f59e0b',
			planType: 'free',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		},
		{
			id: 'org-creatorhub',
			slug: 'creator-hub-id',
			name: 'Creator Hub Indonesia',
			logoUrl: null,
			brandColor: '#ec4899',
			planType: 'pro',
			createdAt: new Date('2024-02-15'),
			updatedAt: new Date('2024-02-15')
		}
	];

	for (const org of organizations) {
		await db.insert(schema.organization).values(org).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${organizations.length} organizations`);

	// Seed organization members
	console.log('👥 Seeding organization members...');

	const members = [
		// Pondok IT Academy - Admin is owner
		{
			id: 'mem-pondokit-001',
			orgId: 'org-pondokit',
			userId: adminIds[0],
			role: 'owner',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		},
		{
			id: 'mem-pondokit-002',
			orgId: 'org-pondokit',
			userId: adminIds[1],
			role: 'admin',
			createdAt: new Date('2024-01-02'),
			updatedAt: new Date('2024-01-02')
		},
		{
			id: 'mem-pondokit-003',
			orgId: 'org-pondokit',
			userId: adminIds[2],
			role: 'facilitator',
			createdAt: new Date('2024-01-03'),
			updatedAt: new Date('2024-01-03')
		},
		// Koneksi Digital - Admin is owner
		{
			id: 'mem-koneksi-001',
			orgId: 'org-koneksi',
			userId: adminIds[0],
			role: 'owner',
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15')
		},
		{
			id: 'mem-koneksi-002',
			orgId: 'org-koneksi',
			userId: adminIds[2],
			role: 'creator',
			createdAt: new Date('2024-01-16'),
			updatedAt: new Date('2024-01-16')
		},
		// Marketing Lab - Admin is owner
		{
			id: 'mem-marketinglab-001',
			orgId: 'org-marketinglab',
			userId: adminIds[0],
			role: 'owner',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		},
		// Creator Hub - Admin is owner
		{
			id: 'mem-creatorhub-001',
			orgId: 'org-creatorhub',
			userId: adminIds[0],
			role: 'owner',
			createdAt: new Date('2024-02-15'),
			updatedAt: new Date('2024-02-15')
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

	// Assign courses to organizations based on category and relevance
	const assignments = [
		{ courseId: courseIds[0], orgId: 'org-koneksi' }, // Akselerasi Bisnis Digital -> Koneksi
		{ courseId: courseIds[1], orgId: 'org-creatorhub' }, // Content Creator -> Creator Hub
		{ courseId: courseIds[2], orgId: 'org-koneksi' }, // E-Commerce -> Koneksi
		{ courseId: courseIds[3], orgId: 'org-koneksi' }, // Affiliate -> Koneksi
		{ courseId: courseIds[4], orgId: 'org-pondokit' }, // Python -> Pondok IT
		{ courseId: courseIds[5], orgId: 'org-pondokit' }, // Full Stack -> Pondok IT
		{ courseId: courseIds[6], orgId: 'org-pondokit' }, // Mobile App -> Pondok IT
		{ courseId: courseIds[7], orgId: 'org-marketinglab' }, // Digital Marketing -> Marketing Lab
		{ courseId: courseIds[8], orgId: 'org-marketinglab' }, // Brand Building -> Marketing Lab
	];

	for (const assignment of assignments) {
		await db.update(schema.course)
			.set({ orgId: assignment.orgId })
			.where(eq(schema.course.id, assignment.courseId));
	}

	console.log(`✅ Assigned ${assignments.length} courses to organizations`);
}

export async function seedWorkspaces(db: LibSQLDatabase<typeof schema>, userIds: string[]) {
	console.log('🏢 Seeding workspaces...');

	const workspaces = [
		// Workspaces for Pondok IT Academy
		{
			id: 'ws-pondokit-001',
			orgId: 'org-pondokit',
			name: 'Tim Pengajar Teknis',
			description: 'Tim mentor dan instruktur kursus teknis',
			createdAt: new Date('2024-01-02'),
			updatedAt: new Date('2024-01-02')
		},
		{
			id: 'ws-pondokit-002',
			orgId: 'org-pondokit',
			name: 'Tim Konten',
			description: 'Tim pengembangan materi dan konten pembelajaran',
			createdAt: new Date('2024-01-02'),
			updatedAt: new Date('2024-01-02')
		},
		// Workspaces for Koneksi Digital
		{
			id: 'ws-koneksi-001',
			orgId: 'org-koneksi',
			name: 'Tim Bisnis Digital',
			description: 'Tim pengembangan program akselerasi bisnis',
			createdAt: new Date('2024-01-16'),
			updatedAt: new Date('2024-01-16')
		},
		{
			id: 'ws-koneksi-002',
			orgId: 'org-koneksi',
			name: 'Tim Marketing',
			description: 'Tim marketing dan pertumbuhan komunitas',
			createdAt: new Date('2024-01-16'),
			updatedAt: new Date('2024-01-16')
		},
		// Workspaces for Creator Hub
		{
			id: 'ws-creatorhub-001',
			orgId: 'org-creatorhub',
			name: 'Tim Creator',
			description: 'Tim creator dan content developer',
			createdAt: new Date('2024-02-16'),
			updatedAt: new Date('2024-02-16')
		}
	];

	for (const ws of workspaces) {
		await db.insert(schema.workspace).values(ws).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${workspaces.length} workspaces`);

	// Seed workspace members
	console.log('👥 Seeding workspace members...');

	const workspaceMembers = [
		// Pondok IT - Tim Pengajar
		{ id: generateId(), workspaceId: 'ws-pondokit-001', userId: userIds[0], role: 'admin' },
		{ id: generateId(), workspaceId: 'ws-pondokit-001', userId: userIds[2], role: 'member' },
		// Pondok IT - Tim Konten
		{ id: generateId(), workspaceId: 'ws-pondokit-002', userId: userIds[0], role: 'admin' },
		{ id: generateId(), workspaceId: 'ws-pondokit-002', userId: userIds[1], role: 'member' },
		// Koneksi - Tim Bisnis
		{ id: generateId(), workspaceId: 'ws-koneksi-001', userId: userIds[0], role: 'admin' },
		{ id: generateId(), workspaceId: 'ws-koneksi-001', userId: userIds[2], role: 'member' },
		// Koneksi - Tim Marketing
		{ id: generateId(), workspaceId: 'ws-koneksi-002', userId: userIds[0], role: 'admin' },
		{ id: generateId(), workspaceId: 'ws-koneksi-002', userId: userIds[1], role: 'member' },
		// Creator Hub
		{ id: generateId(), workspaceId: 'ws-creatorhub-001', userId: userIds[0], role: 'admin' },
		{ id: generateId(), workspaceId: 'ws-creatorhub-001', userId: userIds[2], role: 'member' }
	];

	for (const member of workspaceMembers) {
		await db.insert(schema.workspaceMember).values(member).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${workspaceMembers.length} workspace members`);

	return workspaces;
}
