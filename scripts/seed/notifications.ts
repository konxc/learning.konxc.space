import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedNotifications(db: LibSQLDatabase<typeof schema>, userIds: string[]) {
	logSection('Seeding notifications');

	const notifications = [
		{
			id: generateId(),
			userId: userIds[0],
			type: 'welcome',
			title: 'Selamat datang di Naik Kelas!',
			message: 'Halo Ahmad Rizki, selamat datang di platform pembelajaran digital marketing dari Koneksi dan Yayasan ASIB.',
			link: '/app/onboarding',
			read: true,
			createdAt: new Date('2024-01-20')
		},
		{
			id: generateId(),
			userId: userIds[0],
			type: 'enrollment',
			title: 'Anda berhasil enroll ke Python Programming',
			message: 'Selamat! Anda telah terdaftar di course Python Programming Fundamentals.',
			link: '/app/courses/course-001',
			read: true,
			createdAt: new Date('2024-01-20')
		},
		{
			id: generateId(),
			userId: userIds[0],
			type: 'reminder',
			title: 'Checkpoint deadline minggu ini',
			message: 'Jangan lupa menyelesaikan checkpoint minggu pertama sebelum tanggal 7 Feb 2024!',
			link: '/app/checkpoints',
			read: false,
			createdAt: new Date('2024-02-05')
		},
		{
			id: generateId(),
			userId: userIds[1],
			type: 'welcome',
			title: 'Selamat datang di Naik Kelas!',
			message: 'Halo Sari Dewi, selamat datang di platform pembelajaran digital marketing dari Koneksi dan Yayasan ASIB.',
			link: '/app/onboarding',
			read: true,
			createdAt: new Date('2024-01-21')
		},
		{
			id: generateId(),
			userId: userIds[1],
			type: 'certificate',
			title: 'Selamat! Anda menyelesaikan course',
			message: 'Felicidades! Anda telah menyelesaikan course React.js Advanced dengan nilai memuaskan.',
			link: '/app/certificates',
			read: true,
			createdAt: new Date('2024-01-28')
		},
		{
			id: generateId(),
			userId: userIds[2],
			type: 'action_required',
			title: 'Lengkapi onboarding Anda',
			message: 'Silakan lengkapi profil dan preferensi belajar Anda untuk memulai perjalanan belajar.',
			link: '/app/onboarding',
			read: false,
			createdAt: new Date('2024-01-27')
		}
	];

	for (const notif of notifications) {
		await db.insert(schema.notification).values(notif).onConflictDoNothing();
	}

	logSuccess(`Seeded ${notifications.length} notifications`);
}

export async function seedBroadcastMessages(db: LibSQLDatabase<typeof schema>, adminId: string, mentorId: string) {
	logSection('Seeding broadcast messages');

	const broadcasts = [
		{
			id: generateId(),
			senderId: adminId,
			title: '📢 Pengumuman: Platform Naik Kelas Resmi Launch!',
			content: 'Halo pebbles! Dengan penuh kebahagiaan kami mengumumkan bahwa platform Naik Kelas by Koneksi resmi launch hari ini. Mari bersama-sama belajar dan berkembang!',
			targetRole: 'user',
			targetCohortId: null,
			targetCourseId: null,
			sentVia: 'all',
			status: 'sent',
			recipientCount: 45,
			createdAt: new Date('2024-01-15')
		},
		{
			id: generateId(),
			senderId: mentorId,
			title: '📚 Tips Belajar Minggu Ini',
			content: 'Hai pebbles! Jangan lupa untuk selalu praktik langsung setelah menonton video lesson. Karena belajar coding itu perlu latihan, bukan hanya teori!',
			targetRole: 'user',
			targetCohortId: null,
			targetCourseId: null,
			sentVia: 'notification',
			status: 'sent',
			recipientCount: 45,
			createdAt: new Date('2024-01-25')
		},
		{
			id: generateId(),
			senderId: adminId,
			title: '🎯 Reminder: Checkpoint Deadline',
			content: 'Pebbles Batch 1 dan Batch 2, besok adalah deadline checkpoint minggu pertama. Pastikan semua tugas sudah dikumpulkan ya!',
			targetRole: null,
			targetCohortId: 'cohort-001',
			targetCourseId: null,
			sentVia: 'whatsapp',
			status: 'sent',
			recipientCount: 28,
			createdAt: new Date('2024-02-06')
		}
	];

	for (const bcast of broadcasts) {
		await db.insert(schema.broadcastMessage).values(bcast).onConflictDoNothing();
	}

	logSuccess(`Seeded ${broadcasts.length} broadcast messages`);
}

export async function seedCourseReviews(db: LibSQLDatabase<typeof schema>, userIds: string[], courseIds: string[]) {
	logSection('Seeding course reviews');

	const reviews = [
		{
			id: generateId(),
			userId: userIds[1],
			courseId: courseIds[2],
			rating: 5,
			comment: 'Course yang sangat bagus! Penjelasannya jelas dan mudah dipahami. Mentor juga sangat helpful.',
			moderationStatus: 'approved',
			createdAt: new Date('2024-01-28')
		},
		{
			id: generateId(),
			userId: userIds[0],
			courseId: courseIds[0],
			rating: 4,
			comment: 'Bagus untuk pemula. Beberapa bagian mungkin perlu contoh lebih banyak.',
			moderationStatus: 'approved',
			createdAt: new Date('2024-01-25')
		}
	];

	for (const review of reviews) {
		await db.insert(schema.courseReview).values(review).onConflictDoNothing();
	}

	logSuccess(`Seeded ${reviews.length} course reviews`);
}
