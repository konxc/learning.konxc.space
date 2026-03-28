import { hashPassword } from '../../src/lib/server/password.js';
import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedUsers(db: LibSQLDatabase<typeof schema>) {
	logSection('Seeding users');

	const users = [
		{
			id: 'admin-001',
			username: 'admin',
			passwordHash: await hashPassword('admin123'),
			role: 'admin',
			fullName: 'Administrator',
			email: 'admin@naikkelas.id',
			phone: '081234567890',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-01')
		},
		{
			id: 'bd-001',
			username: 'bd_user',
			passwordHash: await hashPassword('bd123'),
			role: 'bd',
			fullName: 'Business Development',
			email: 'bd@naikkelas.id',
			phone: '081234567891',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-02')
		},
		{
			id: 'mentor-001',
			username: 'mentor1',
			passwordHash: await hashPassword('mentor123'),
			role: 'mentor',
			fullName: 'John Doe',
			email: 'mentor@naikkelas.id',
			phone: '081234567892',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-03')
		},
		{
			id: 'user-001',
			username: 'student1',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Ahmad Rizki',
			email: 'ahmad@example.com',
			phone: '081234567893',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-04')
		},
		{
			id: 'user-002',
			username: 'student2',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Sari Dewi',
			email: 'sari@example.com',
			phone: '081234567894',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-05')
		},
		{
			id: 'user-003',
			username: 'student3',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Budi Santoso',
			email: 'budi@example.com',
			phone: '081234567895',
			onboardingCompleted: false,
			createdAt: new Date('2024-01-06')
		}
	];

	for (const user of users) {
		await db.insert(schema.user).values(user).onConflictDoNothing();
	}

	logSuccess(`Seeded ${users.length} users`);
	return users;
}

export async function seedMoreStudents(db: LibSQLDatabase<typeof schema>) {
	logSection('Seeding more students');

	const students = [
		{
			id: 'user-010',
			username: 'rina_wijaya',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Rina Wijaya',
			email: 'rina.wijaya@example.com',
			phone: '081234567901',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-18')
		},
		{
			id: 'user-011',
			username: 'andi_pratama',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Andi Pratama',
			email: 'andi.pratama@example.com',
			phone: '081234567902',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-19')
		},
		{
			id: 'user-012',
			username: 'maya_sari',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Maya Sari',
			email: 'maya.sari@example.com',
			phone: '081234567903',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-20')
		},
		{
			id: 'user-013',
			username: 'budi_utama',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Budi Utama',
			email: 'budi.utama@example.com',
			phone: '081234567904',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-21')
		},
		{
			id: 'user-014',
			username: 'dewi_lestari',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Dewi Lestari',
			email: 'dewi.lestari@example.com',
			phone: '081234567905',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-22')
		},
		{
			id: 'user-015',
			username: 'fajar_nugroho',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Fajar Nugroho',
			email: 'fajar.nugroho@example.com',
			phone: '081234567906',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-23')
		},
		{
			id: 'user-016',
			username: 'gita_permata',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Gita Permata',
			email: 'gita.permata@example.com',
			phone: '081234567907',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-24')
		},
		{
			id: 'user-017',
			username: 'hendra_kurnia',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Hendra Kurniawan',
			email: 'hendra.kurnia@example.com',
			phone: '081234567908',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-25')
		},
		{
			id: 'user-018',
			username: 'indah_sari',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Indah Sari',
			email: 'indah.sari@example.com',
			phone: '081234567909',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-26')
		},
		{
			id: 'user-019',
			username: 'joko_widodo',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Joko Widodo',
			email: 'joko.widodo@example.com',
			phone: '081234567910',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-27')
		},
		{
			id: 'user-020',
			username: 'kartu_dewi',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Kartika Dewi',
			email: 'kartu.dewi@example.com',
			phone: '081234567911',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-28')
		},
		{
			id: 'user-021',
			username: 'lukman_hakim',
			passwordHash: await hashPassword('student123'),
			role: 'user',
			fullName: 'Lukman Hakim',
			email: 'lukman.hakim@example.com',
			phone: '081234567912',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-29')
		},
		{
			id: 'user-022',
			username: 'mentor_02',
			passwordHash: await hashPassword('mentor123'),
			role: 'mentor',
			fullName: 'Diana Putri',
			email: 'diana@naikkelas.id',
			phone: '081234567913',
			onboardingCompleted: true,
			createdAt: new Date('2024-02-01')
		},
		{
			id: 'user-023',
			username: 'mentor_03',
			passwordHash: await hashPassword('mentor123'),
			role: 'mentor',
			fullName: 'Ahmad Fauzi',
			email: 'fauzi@naikkelas.id',
			phone: '081234567914',
			onboardingCompleted: true,
			createdAt: new Date('2024-02-05')
		}
	];

	for (const student of students) {
		await db.insert(schema.user).values(student).onConflictDoNothing();
	}

	logSuccess(`Seeded ${students.length} additional users`);
	return students;
}
