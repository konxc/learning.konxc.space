import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedCheckpoints(db: LibSQLDatabase<typeof schema>, cohortIds: string[]) {
	logSection('Seeding checkpoints');

	const checkpoints = [
		{
			id: 'checkpoint-001',
			cohortId: cohortIds[0],
			weekNumber: 1,
			title: 'Checkpoint Minggu 1: Python Basics',
			description: 'Tes pemahaman dasar Python',
			dueDate: new Date('2024-02-07'),
			isActive: true,
			createdAt: new Date('2024-01-20')
		},
		{
			id: 'checkpoint-002',
			cohortId: cohortIds[0],
			weekNumber: 2,
			title: 'Checkpoint Minggu 2: Data Types',
			description: 'Tes pemahaman tipe data dan variabel',
			dueDate: new Date('2024-02-14'),
			isActive: true,
			createdAt: new Date('2024-01-27')
		},
		{
			id: 'checkpoint-003',
			cohortId: cohortIds[1],
			weekNumber: 1,
			title: 'Checkpoint Minggu 1: HTML & CSS',
			description: 'Tes pemahaman dasar HTML dan CSS',
			dueDate: new Date('2024-03-07'),
			isActive: true,
			createdAt: new Date('2024-02-20')
		}
	];

	for (const cp of checkpoints) {
		await db.insert(schema.checkpoint).values(cp).onConflictDoNothing();
	}

	logSuccess(`Seeded ${checkpoints.length} checkpoints`);
	return checkpoints;
}

export async function seedCheckpointSubmissions(db: LibSQLDatabase<typeof schema>, userIds: string[], checkpointIds: string[]) {
	logSection('Seeding checkpoint submissions');

	const submissions = [
		{
			id: 'cps-001',
			checkpointId: checkpointIds[0],
			userId: userIds[0],
			notes: 'Jawaban saya:\n1. Python adalah bahasa pemrograman interpret\n2. Variabel di Python tidak perlu deklarasi tipe\n3. List menggunakan tanda []',
			completed: true,
			submittedAt: new Date('2024-02-05'),
			createdAt: new Date('2024-02-05')
		},
		{
			id: 'cps-002',
			checkpointId: checkpointIds[0],
			userId: userIds[1],
			notes: 'Jawaban:\n1. Bahasa pemrograman tingkat tinggi\n2. Dynamic typing\n3. Tuple, List, Dict',
			completed: true,
			submittedAt: new Date('2024-02-06'),
			createdAt: new Date('2024-02-06')
		},
		{
			id: 'cps-003',
			checkpointId: checkpointIds[1],
			userId: userIds[0],
			notes: 'Sedang dikerjakann...',
			completed: false,
			submittedAt: null,
			createdAt: new Date('2024-02-10')
		}
	];

	for (const sub of submissions) {
		await db.insert(schema.checkpointSubmission).values(sub).onConflictDoNothing();
	}

	logSuccess(`Seeded ${submissions.length} checkpoint submissions`);
}

export async function seedDiscussions(db: LibSQLDatabase<typeof schema>, userIds: string[], courseIds: string[], lessonIds: string[]) {
	logSection('Seeding discussions');

	const discussions = [
		{
			id: 'disc-001',
			userId: userIds[0],
			courseId: courseIds[0],
			lessonId: lessonIds[0],
			parentId: null,
			title: 'Pertanyaan tentang Python',
			content: 'Apakah Python sulit untuk dipelajari bagi pemula?',
			upvotes: 5,
			isPinned: true,
			createdAt: new Date('2024-01-25'),
			updatedAt: new Date('2024-01-25')
		},
		{
			id: 'disc-002',
			userId: userIds[1],
			courseId: courseIds[0],
			lessonId: lessonIds[0],
			parentId: 'disc-001',
			title: null,
			content: 'Tidak sulit! Python punya syntax yang bersih dan mudah dibaca.',
			upvotes: 3,
			isPinned: false,
			createdAt: new Date('2024-01-26'),
			updatedAt: new Date('2024-01-26')
		},
		{
			id: 'disc-003',
			userId: userIds[2],
			courseId: courseIds[0],
			lessonId: lessonIds[2],
			parentId: null,
			title: 'Bingung dengan tipe data',
			content: 'Apa perbedaan antara list dan tuple?',
			upvotes: 2,
			isPinned: false,
			createdAt: new Date('2024-01-28'),
			updatedAt: new Date('2024-01-28')
		},
		{
			id: 'disc-004',
			userId: userIds[0],
			courseId: courseIds[1],
			lessonId: null,
			parentId: null,
			title: 'Tips belajar HTML',
			content: 'Saya rekomendasi gunakan CodePen untuk latihan HTML dasar.',
			upvotes: 4,
			isPinned: false,
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		}
	];

	for (const disc of discussions) {
		await db.insert(schema.discussion).values(disc).onConflictDoNothing();
	}

	logSuccess(`Seeded ${discussions.length} discussions`);
}

export async function seedLessonNotes(db: LibSQLDatabase<typeof schema>, userIds: string[], lessonIds: string[], courseIds: string[]) {
	logSection('Seeding lesson notes');

	const notes = [
		{
			id: 'note-001',
			userId: userIds[0],
			courseId: courseIds[0],
			lessonId: lessonIds[0],
			content: '# Catatan: Apa itu Python?\n\nPython adalah bahasa pemrograman yang:\n- Interpret\n- Multi-paradigma\n- Easy to learn\n\nDibuat oleh Guido van Rossum tahun 1991.',
			createdAt: new Date('2024-01-25'),
			updatedAt: new Date('2024-01-25')
		},
		{
			id: 'note-002',
			userId: userIds[0],
			courseId: courseIds[0],
			lessonId: lessonIds[2],
			content: '# Tipe Data Python\n\n- int: 1, 2, 3\n- float: 1.5, 2.7\n- str: "hello"\n- list: [1, 2, 3]\n- dict: {"key": "value"}',
			createdAt: new Date('2024-01-27'),
			updatedAt: new Date('2024-01-27')
		},
		{
			id: 'note-003',
			userId: userIds[1],
			courseId: courseIds[0],
			lessonId: lessonIds[0],
			content: 'Python basics: bahasa pemrograman serbaguna.',
			createdAt: new Date('2024-01-26'),
			updatedAt: new Date('2024-01-26')
		}
	];

	for (const note of notes) {
		await db.insert(schema.lessonNote).values(note).onConflictDoNothing();
	}

	logSuccess(`Seeded ${notes.length} lesson notes`);
}
