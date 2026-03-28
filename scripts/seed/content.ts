import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedCourseContent(db: LibSQLDatabase<typeof schema>, courseIds: string[]) {
	logSection('Seeding course content');

	const modules = [
		{ id: 'module-001', courseId: courseIds[0], title: 'Introduction to Python', order: 1, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'module-002', courseId: courseIds[0], title: 'Data Types and Variables', order: 2, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'module-003', courseId: courseIds[0], title: 'Control Flow', order: 3, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'module-004', courseId: courseIds[0], title: 'Functions and Modules', order: 4, createdAt: new Date(), updatedAt: new Date() }
	];

	for (const m of modules) {
		await db.insert(schema.module).values(m).onConflictDoNothing();
	}

	const lessons = [
		{ id: 'lesson-001', moduleId: 'module-001', title: 'What is Python?', order: 1, weekNumber: 1, isFree: true, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'lesson-002', moduleId: 'module-001', title: 'Setting up Environment', order: 2, weekNumber: 1, isFree: false, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'lesson-003', moduleId: 'module-002', title: 'Numbers and Strings', order: 1, weekNumber: 2, isFree: false, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'lesson-004', moduleId: 'module-002', title: 'Lists and Dictionaries', order: 2, weekNumber: 2, isFree: false, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'lesson-005', moduleId: 'module-003', title: 'If-Else Statement', order: 1, weekNumber: 3, isFree: false, createdAt: new Date(), updatedAt: new Date() },
		{ id: 'lesson-006', moduleId: 'module-003', title: 'Loops (For & While)', order: 2, weekNumber: 3, isFree: false, createdAt: new Date(), updatedAt: new Date() }
	];

	for (const l of lessons) {
		await db.insert(schema.lesson).values(l).onConflictDoNothing();
	}

	const materials = [
		{
			id: 'mat-001',
			lessonId: 'lesson-001',
			type: 'video',
			url: 'https://vimeo.com/83614660',
			order: 1,
			durationMs: 600000,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: 'mat-002',
			lessonId: 'lesson-001',
			type: 'text',
			content: 'Python adalah bahasa pemrograman yang serbaguna dan mudah dipelajari. Diciptakan oleh Guido van Rossum dan pertama kali dirilis pada tahun 1991.',
			order: 2,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: 'mat-003',
			lessonId: 'lesson-002',
			type: 'text',
			content: '**Instalasi Python:** \n1. Download Python dari python.org\n2. Jalankan installer dan jangan lupa centang "Add Python to PATH"\n3. Cek instalasi dengan mengetik `python --version` di terminal.',
			order: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: 'mat-004',
			lessonId: 'lesson-003',
			type: 'text',
			content: 'Di Python, angka bisa berupa integer (bilangan bulat) atau float (bilangan desimal). String adalah urutan karakter yang diapit tanda kutip.',
			order: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	];

	for (const m of materials) {
		await db.insert(schema.material).values(m).onConflictDoNothing();
	}

	logSuccess('Seeded modules, lessons, and materials');
}
