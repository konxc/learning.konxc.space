import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedMentorApplications(db: LibSQLDatabase<typeof schema>, userIds: string[]) {
	logSection('Seeding mentor applications');

	const applications = [
		{
			id: generateId(),
			userId: userIds[0],
			fullName: 'Sari Dewi',
			email: 'sari@example.com',
			phone: '081234567894',
			bio: 'Full stack developer dengan pengalaman 5 tahun di industri teknologi. Spesialisasi di React dan Node.js.',
			expertise: 'Web Development, React, Node.js',
			yearsExperience: 5,
			portfolioUrl: 'https://portfolio-sari.dev',
			githubUrl: 'https://github.com/saridewi',
			linkedinUrl: 'https://linkedin.com/in/saridewi',
			motivation:
				'Ingin berbagi pengetahuan dan membantu developer baru untuk berkembang di industri tech.',
			status: 'pending',
			adminNotes: null,
			createdAt: new Date('2024-01-25'),
			reviewedAt: null,
			reviewedBy: null
		}
	];

	for (const app of applications) {
		await db.insert(schema.mentorApplication).values(app).onConflictDoNothing();
	}

	logSuccess(`Seeded ${applications.length} mentor applications`);
}

export async function seedWaitingList(db: LibSQLDatabase<typeof schema>) {
	logSection('Seeding waiting list');

	const waitingListEntries = [
		{
			id: generateId(),
			fullName: 'Rizki Ahmad',
			email: 'rizki.ahmad@email.com',
			phone: '081111111111',
			interest: 'web',
			source: 'landing-cta',
			status: 'new',
			notes: 'Sangat antusias belajar web dev',
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-16')
		},
		{
			id: generateId(),
			fullName: 'Andi Pratama',
			email: 'andi.pratama@email.com',
			phone: '081222222222',
			interest: 'web',
			source: 'landing-cta',
			status: 'contacted',
			notes: 'Sudah dihubungi via WhatsApp',
			createdAt: new Date('2024-01-17'),
			updatedAt: new Date('2024-01-18')
		},
		{
			id: generateId(),
			fullName: 'Maya Sari',
			email: 'maya.sari@email.com',
			phone: '081333333333',
			interest: 'career-switch',
			source: 'ads',
			status: 'qualified',
			notes: 'Minat tinggi, budget ready',
			createdAt: new Date('2024-01-18'),
			updatedAt: new Date('2024-01-19')
		},
		{
			id: generateId(),
			fullName: 'Bambang Setiawan',
			email: 'bambang.setiawan@email.com',
			phone: '081444444444',
			interest: 'fullstack',
			source: 'referral',
			status: 'qualified',
			notes: 'Referred by student1',
			createdAt: new Date('2024-01-19'),
			updatedAt: new Date('2024-01-20')
		},
		{
			id: generateId(),
			fullName: 'Dewi Lestari',
			email: 'dewi.lestari@email.com',
			phone: '081555555555',
			interest: 'python',
			source: 'landing-cta',
			status: 'converted',
			notes: 'Sudah enroll ke Python course',
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-21')
		},
		{
			id: generateId(),
			fullName: 'Fajar Nugroho',
			email: 'fajar.nugroho@email.com',
			phone: null,
			interest: 'web',
			source: 'landing-cta',
			status: 'new',
			notes: null,
			createdAt: new Date('2024-01-22'),
			updatedAt: new Date('2024-01-22')
		},
		{
			id: generateId(),
			fullName: 'Gita Permata',
			email: 'gita.permata@email.com',
			phone: '081666666666',
			interest: 'upskill',
			source: 'ads',
			status: 'contacted',
			notes: 'Follow-up required',
			createdAt: new Date('2024-01-23'),
			updatedAt: new Date('2024-01-24')
		},
		{
			id: generateId(),
			fullName: 'Hendra Kurniawan',
			email: 'hendra.kurniawan@email.com',
			phone: '081777777777',
			interest: 'career-switch',
			source: 'landing-cta',
			status: 'new',
			notes: null,
			createdAt: new Date('2024-01-24'),
			updatedAt: new Date('2024-01-24')
		},
		{
			id: generateId(),
			fullName: 'Indah Sari',
			email: 'indah.sari@email.com',
			phone: '081888888888',
			interest: 'python',
			source: 'referral',
			status: 'qualified',
			notes: 'Budget confirmed',
			createdAt: new Date('2024-01-20'),
			updatedAt: new Date('2024-01-25')
		},
		{
			id: generateId(),
			fullName: 'Joko Widodo',
			email: 'joko.widodo@email.com',
			phone: null,
			interest: 'web',
			source: 'landing-cta',
			status: 'archived',
			notes: 'No response after 3 follow-ups',
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-01-20')
		},
		{
			id: generateId(),
			fullName: 'Kartika Dewi',
			email: 'kartika.dewi@email.com',
			phone: '081999999999',
			interest: 'fullstack',
			source: 'ads',
			status: 'new',
			notes: null,
			createdAt: new Date('2024-01-25'),
			updatedAt: new Date('2024-01-25')
		},
		{
			id: generateId(),
			fullName: 'Lukman Hakim',
			email: 'lukman.hakim@email.com',
			phone: '081010101010',
			interest: 'career-switch',
			source: 'landing-cta',
			status: 'contacted',
			notes: 'Interested in Python course',
			createdAt: new Date('2024-01-26'),
			updatedAt: new Date('2024-01-27')
		}
	];

	for (const entry of waitingListEntries) {
		await db.insert(schema.waitingList).values(entry).onConflictDoNothing();
	}

	logSuccess(`Seeded ${waitingListEntries.length} waiting list entries`);
}
