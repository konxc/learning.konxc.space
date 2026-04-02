/**
 * ORGANIZATIONS SEED — Prinsip: 1 User = 1 Role yang Konsisten
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ROLE PLATFORM → ROLE ORG yang SESUAI:
 *   admin       → owner  (hanya di org utama: Koneksi Digital)
 *   user/mentor → mentor (hanya di 1 org sesuai spesialisasi)
 *   user/facil  → facilitator (hanya di 1 org)
 *   bd          → tidak masuk org (hanya akses CRM)
 *   user/student→ tidak masuk org (hanya belajar)
 *
 * PEMETAAN USER → ORG:
 *
 * org-koneksi  (Koneksi Digital Academy) — org utama platform
 *   owner      : admin-001   (Aditya Pratama — admin platform)
 *   creator    : mentor-001  (Budi Santoso — bisnis & affiliate)
 *   creator    : mentor-002  (Dewi Anggraini — content creator)
 *   facilitator: facil-001   (Irwan Setiawan)
 *   facilitator: facil-002   (Siti Nurhaliza)
 *
 * org-pondokit (Pondok IT Academy) — org teknis
 *   owner      : mentor-004  (Rina Kusuma — Python/DS)
 *   creator    : mentor-005  (Ahmad Fauzi — Full Stack/Video)
 *   facilitator: facil-003   (Joko Purnomo)
 *
 * org-marketinglab (Marketing Lab Indonesia) — org marketing
 *   owner      : mentor-006  (Maya Sari — branding/keuangan)
 *   creator    : mentor-003  (Hendra Wijaya — UI/UX/digital marketing)
 *
 * org-creatorhub (Creator Hub Indonesia) — tidak ada member khusus
 *   (org ini dikelola oleh Koneksi Digital, courses-nya di-assign ke sini)
 *   owner      : admin-001   (Aditya Pratama — dikelola platform)
 *
 * CATATAN:
 *   - mentor_dewi (Dewi) adalah creator di Koneksi Digital, BUKAN owner Creator Hub
 *   - Tidak ada user yang punya role berbeda di org berbeda
 *   - admin platform hanya jadi owner di org utama (Koneksi Digital)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as schema from '../../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { logSection, logSuccess, generateId } from './utils.js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function seedOrganizations(db: NeonHttpDatabase<typeof schema>, _unused: string[]) {
	logSection('Seeding organizations (4 orgs, 1 user = 1 role)');

	const organizations = [
		{
			id: 'org-koneksi',
			slug: 'koneksi-digital',
			name: 'Koneksi Digital Academy',
			logoUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop',
			brandColor: '#4f46e5',
			planType: 'enterprise',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01')
		},
		{
			id: 'org-pondokit',
			slug: 'pondokit-academy',
			name: 'Pondok IT Academy',
			logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop',
			brandColor: '#22c55e',
			planType: 'pro',
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-01-10')
		},
		{
			id: 'org-marketinglab',
			slug: 'marketing-lab-id',
			name: 'Marketing Lab Indonesia',
			logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop',
			brandColor: '#f59e0b',
			planType: 'pro',
			createdAt: new Date('2024-01-20'),
			updatedAt: new Date('2024-01-20')
		},
		{
			id: 'org-creatorhub',
			slug: 'creator-hub-id',
			name: 'Creator Hub Indonesia',
			logoUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop',
			brandColor: '#ec4899',
			planType: 'free',
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		}
	];

	for (const org of organizations) {
		await db.insert(schema.organization).values(org).onConflictDoNothing();
	}
	logSuccess(`Seeded ${organizations.length} organizations`);

	logSection('Seeding organization members (1 user = 1 role, no overlap)');

	const members = [
		// ── KONEKSI DIGITAL ACADEMY ─────────────────────────────────────────────
		// Admin platform = owner org utama
		// Mentor bisnis/content = creator
		// Facilitator = facilitator
		{
			id: 'mem-kd-001',
			orgId: 'org-koneksi',
			userId: 'admin-001',
			role: 'owner',
			createdAt: new Date('2024-01-01')
		},
		{
			id: 'mem-kd-002',
			orgId: 'org-koneksi',
			userId: 'mentor-001',
			role: 'mentor',
			createdAt: new Date('2024-01-03')
		},
		{
			id: 'mem-kd-003',
			orgId: 'org-koneksi',
			userId: 'mentor-002',
			role: 'mentor',
			createdAt: new Date('2024-01-03')
		},
		{
			id: 'mem-kd-004',
			orgId: 'org-koneksi',
			userId: 'facil-001',
			role: 'facilitator',
			createdAt: new Date('2024-01-05')
		},
		{
			id: 'mem-kd-005',
			orgId: 'org-koneksi',
			userId: 'facil-002',
			role: 'facilitator',
			createdAt: new Date('2024-01-05')
		},

		// ── PONDOK IT ACADEMY ────────────────────────────────────────────────────
		// mentor-004 (Rina) = owner org ini, sesuai role mentor-nya
		// mentor-005 (Ahmad) = creator di org ini saja
		// facil-003 (Joko) = facilitator di org ini saja
		{
			id: 'mem-pi-001',
			orgId: 'org-pondokit',
			userId: 'mentor-004',
			role: 'owner',
			createdAt: new Date('2024-01-10')
		},
		{
			id: 'mem-pi-002',
			orgId: 'org-pondokit',
			userId: 'mentor-005',
			role: 'mentor',
			createdAt: new Date('2024-01-10')
		},
		{
			id: 'mem-pi-003',
			orgId: 'org-pondokit',
			userId: 'facil-003',
			role: 'facilitator',
			createdAt: new Date('2024-01-12')
		},

		// ── MARKETING LAB INDONESIA ──────────────────────────────────────────────
		// mentor-006 (Maya) = owner org ini
		// mentor-003 (Hendra) = creator di org ini saja
		{
			id: 'mem-ml-001',
			orgId: 'org-marketinglab',
			userId: 'mentor-006',
			role: 'owner',
			createdAt: new Date('2024-01-20')
		},
		{
			id: 'mem-ml-002',
			orgId: 'org-marketinglab',
			userId: 'mentor-003',
			role: 'mentor',
			createdAt: new Date('2024-01-20')
		},

		// ── CREATOR HUB INDONESIA ────────────────────────────────────────────────
		// Dikelola platform (admin), tidak ada mentor/facilitator khusus
		// Courses di-assign ke sini tapi dikelola dari Koneksi Digital
		{
			id: 'mem-ch-001',
			orgId: 'org-creatorhub',
			userId: 'admin-001',
			role: 'owner',
			createdAt: new Date('2024-02-01')
		}
	];

	for (const m of members) {
		await db
			.insert(schema.organizationMember)
			.values({
				...m,
				updatedAt: m.createdAt
			})
			.onConflictDoNothing();
	}
	logSuccess(`Seeded ${members.length} organization members`);

	return organizations;
}

export async function assignCoursesToOrganizations(
	db: NeonHttpDatabase<typeof schema>,
	_courseIds: string[]
) {
	logSection('Assigning courses to organizations');

	// Sesuai mentor yang mengajar dan org tempat mereka bernaung
	const assignments: { courseId: string; orgId: string }[] = [
		// Koneksi Digital — mentor-001 (Budi) & mentor-002 (Dewi)
		{ courseId: 'course-001', orgId: 'org-koneksi' }, // Akselerasi Bisnis Digital (mentor-001)
		{ courseId: 'course-002', orgId: 'org-koneksi' }, // Content Creator Mastery (mentor-002)
		{ courseId: 'course-003', orgId: 'org-koneksi' }, // E-Commerce (mentor-003 → pindah ke marketinglab)
		{ courseId: 'course-004', orgId: 'org-koneksi' }, // Affiliate Marketing (mentor-001)

		// Pondok IT — mentor-004 (Rina) & mentor-005 (Ahmad)
		{ courseId: 'course-005', orgId: 'org-pondokit' }, // Python Data Science (mentor-004)
		{ courseId: 'course-006', orgId: 'org-pondokit' }, // Full Stack Web Dev (mentor-005)
		{ courseId: 'course-007', orgId: 'org-pondokit' }, // Mobile App Flutter (mentor-004)

		// Marketing Lab — mentor-006 (Maya) & mentor-003 (Hendra)
		{ courseId: 'course-008', orgId: 'org-marketinglab' }, // Digital Marketing (mentor-002 → marketinglab)
		{ courseId: 'course-009', orgId: 'org-marketinglab' }, // Brand Building (mentor-006)
		{ courseId: 'course-010', orgId: 'org-marketinglab' }, // Keuangan UMKM (mentor-006)

		// Creator Hub — dikelola admin, courses design & video
		{ courseId: 'course-011', orgId: 'org-creatorhub' }, // UI/UX Design (mentor-003)
		{ courseId: 'course-012', orgId: 'org-creatorhub' } // Video Production (mentor-005)
	];

	for (const a of assignments) {
		await db.update(schema.course).set({ orgId: a.orgId }).where(eq(schema.course.id, a.courseId));
	}
	logSuccess(`Assigned ${assignments.length} courses to organizations`);
}

export async function seedWorkspaces(db: NeonHttpDatabase<typeof schema>, _unused: string[]) {
	logSection('Seeding workspaces');

	const workspaces = [
		// Koneksi Digital — 2 tim sesuai spesialisasi
		{
			id: 'ws-kd-bisnis',
			orgId: 'org-koneksi',
			name: 'Tim Bisnis & Affiliate',
			description: 'Mentor dan fasilitator program bisnis digital dan affiliate',
			createdAt: new Date('2024-01-05')
		},
		{
			id: 'ws-kd-content',
			orgId: 'org-koneksi',
			name: 'Tim Content Creator',
			description: 'Mentor dan fasilitator program content creator',
			createdAt: new Date('2024-01-05')
		},
		// Pondok IT — 1 tim teknis
		{
			id: 'ws-pi-teknis',
			orgId: 'org-pondokit',
			name: 'Tim Teknis',
			description: 'Instruktur dan fasilitator kursus pemrograman',
			createdAt: new Date('2024-01-12')
		},
		// Marketing Lab — 1 tim
		{
			id: 'ws-ml-marketing',
			orgId: 'org-marketinglab',
			name: 'Tim Marketing & Desain',
			description: 'Instruktur digital marketing, brand, dan UI/UX',
			createdAt: new Date('2024-01-22')
		},
		// Creator Hub — 1 tim
		{
			id: 'ws-ch-creator',
			orgId: 'org-creatorhub',
			name: 'Tim Creator & Video',
			description: 'Instruktur desain dan produksi video',
			createdAt: new Date('2024-02-05')
		}
	];

	for (const ws of workspaces) {
		await db
			.insert(schema.workspace)
			.values({ ...ws, updatedAt: ws.createdAt })
			.onConflictDoNothing();
	}
	logSuccess(`Seeded ${workspaces.length} workspaces`);

	// Workspace members — sesuai org membership masing-masing user
	const wsMembers = [
		// Koneksi Digital — Tim Bisnis (Budi + Irwan)
		{
			id: generateId(),
			workspaceId: 'ws-kd-bisnis',
			userId: 'admin-001',
			role: 'admin',
			createdAt: new Date('2024-01-05')
		},
		{
			id: generateId(),
			workspaceId: 'ws-kd-bisnis',
			userId: 'mentor-001',
			role: 'member',
			createdAt: new Date('2024-01-05')
		},
		{
			id: generateId(),
			workspaceId: 'ws-kd-bisnis',
			userId: 'facil-001',
			role: 'member',
			createdAt: new Date('2024-01-05')
		},
		// Koneksi Digital — Tim Content (Dewi + Siti)
		{
			id: generateId(),
			workspaceId: 'ws-kd-content',
			userId: 'admin-001',
			role: 'admin',
			createdAt: new Date('2024-01-05')
		},
		{
			id: generateId(),
			workspaceId: 'ws-kd-content',
			userId: 'mentor-002',
			role: 'member',
			createdAt: new Date('2024-01-05')
		},
		{
			id: generateId(),
			workspaceId: 'ws-kd-content',
			userId: 'facil-002',
			role: 'member',
			createdAt: new Date('2024-01-05')
		},
		// Pondok IT (Rina + Ahmad + Joko)
		{
			id: generateId(),
			workspaceId: 'ws-pi-teknis',
			userId: 'mentor-004',
			role: 'admin',
			createdAt: new Date('2024-01-12')
		},
		{
			id: generateId(),
			workspaceId: 'ws-pi-teknis',
			userId: 'mentor-005',
			role: 'member',
			createdAt: new Date('2024-01-12')
		},
		{
			id: generateId(),
			workspaceId: 'ws-pi-teknis',
			userId: 'facil-003',
			role: 'member',
			createdAt: new Date('2024-01-12')
		},
		// Marketing Lab (Maya + Hendra)
		{
			id: generateId(),
			workspaceId: 'ws-ml-marketing',
			userId: 'mentor-006',
			role: 'admin',
			createdAt: new Date('2024-01-22')
		},
		{
			id: generateId(),
			workspaceId: 'ws-ml-marketing',
			userId: 'mentor-003',
			role: 'member',
			createdAt: new Date('2024-01-22')
		},
		// Creator Hub (admin platform)
		{
			id: generateId(),
			workspaceId: 'ws-ch-creator',
			userId: 'admin-001',
			role: 'admin',
			createdAt: new Date('2024-02-05')
		}
	];

	for (const m of wsMembers) {
		await db
			.insert(schema.workspaceMember)
			.values({ ...m, updatedAt: m.createdAt })
			.onConflictDoNothing();
	}
	logSuccess(`Seeded ${wsMembers.length} workspace members`);

	return workspaces;
}
