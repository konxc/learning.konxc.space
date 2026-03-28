import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedCourses(db: LibSQLDatabase<typeof schema>, adminId: string, mentorId: string) {
	logSection('Seeding courses');

	const courses = [
		{
			id: 'course-001',
			title: 'Python Programming Fundamentals',
			description: 'Belajar Python dari dasar hingga mahir. Kursus lengkap untuk pemula yang ingin menguasai programming dengan Python.',
			thumbnailUrl: null,
			price: 1500000,
			duration: 8,
			status: 'published',
			mentorId: mentorId,
			createdBy: adminId,
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-01-10')
		},
		{
			id: 'course-002',
			title: 'Full Stack Web Development',
			description: 'Pelajari HTML, CSS, JavaScript, dan framework modern untuk menjadi full stack developer yang handal.',
			thumbnailUrl: null,
			price: 2500000,
			duration: 12,
			status: 'published',
			mentorId: mentorId,
			createdBy: adminId,
			createdAt: new Date('2024-01-11'),
			updatedAt: new Date('2024-01-11')
		},
		{
			id: 'course-003',
			title: 'React.js Advanced',
			description: 'Materi advanced React.js dengan hooks, context API, dan best practices untuk production.',
			thumbnailUrl: null,
			price: 1800000,
			duration: 6,
			status: 'published',
			mentorId: mentorId,
			createdBy: adminId,
			createdAt: new Date('2024-01-12'),
			updatedAt: new Date('2024-01-12')
		},
		{
			id: 'course-004',
			title: 'Database Design & SQL',
			description: 'Pelajari database design, normalization, dan SQL queries untuk database management yang efektif.',
			thumbnailUrl: null,
			price: 1200000,
			duration: 6,
			status: 'published',
			mentorId: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-13'),
			updatedAt: new Date('2024-01-13')
		},
		{
			id: 'course-005',
			title: 'Backend API Development',
			description: 'Bangun RESTful API dengan Node.js, Express, dan best practices untuk scalable backend applications.',
			thumbnailUrl: null,
			price: 2000000,
			duration: 10,
			status: 'draft',
			mentorId: mentorId,
			createdBy: adminId,
			createdAt: new Date('2024-01-14'),
			updatedAt: new Date('2024-01-14')
		},
		{
			id: 'course-006',
			title: 'Mobile App Development',
			description: 'Kembangkan aplikasi mobile dengan React Native dan Flutter untuk iOS dan Android.',
			thumbnailUrl: null,
			price: 2200000,
			duration: 10,
			status: 'draft',
			mentorId: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15')
		}
	];

	for (const course of courses) {
		await db.insert(schema.course).values(course).onConflictDoNothing();
	}

	logSuccess(`Seeded ${courses.length} courses`);
	return courses;
}

export async function seedCoupons(db: LibSQLDatabase<typeof schema>, adminId: string) {
	logSection('Seeding coupons');

	const coupons = [
		{
			id: 'coupon-001',
			code: 'WELCOME50',
			type: 'discount',
			discountType: 'percentage',
			discountValue: 50,
			maxUses: 100,
			currentUses: 15,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2024-12-31'),
			description: 'Discount 50% untuk semua course',
			applicableCourses: null,
			minPurchaseAmount: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		},
		{
			id: 'coupon-002',
			code: 'FIXED100K',
			type: 'discount',
			discountType: 'fixed',
			discountValue: 100000,
			maxUses: 50,
			currentUses: 8,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2024-06-30'),
			description: 'Potongan harga tetap Rp 100.000',
			applicableCourses: null,
			minPurchaseAmount: 500000,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		},
		{
			id: 'coupon-003',
			code: 'FREECOURSE',
			type: 'free',
			discountType: null,
			discountValue: null,
			maxUses: 10,
			currentUses: 2,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2024-03-31'),
			description: 'Gratis sepenuhnya untuk course apapun',
			applicableCourses: null,
			minPurchaseAmount: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		}
	];

	for (const coupon of coupons) {
		await db.insert(schema.coupon).values(coupon).onConflictDoNothing();
	}

	logSuccess(`Seeded ${coupons.length} coupons`);
	return coupons;
}

export async function seedEnrollments(db: LibSQLDatabase<typeof schema>, userIds: string[], courseIds: string[], couponIds: string[]) {
	logSection('Seeding enrollments');

	const enrollments = [
		{
			id: generateId(),
			userId: userIds[3],
			courseId: courseIds[0],
			couponId: couponIds[0],
			status: 'active',
			enrolledAt: new Date('2024-01-20'),
			completedAt: null
		},
		{
			id: generateId(),
			userId: userIds[3],
			courseId: courseIds[1],
			couponId: null,
			status: 'active',
			enrolledAt: new Date('2024-01-21'),
			completedAt: null
		},
		{
			id: generateId(),
			userId: userIds[4],
			courseId: courseIds[0],
			couponId: couponIds[1],
			status: 'active',
			enrolledAt: new Date('2024-01-22'),
			completedAt: null
		},
		{
			id: generateId(),
			userId: userIds[4],
			courseId: courseIds[2],
			couponId: null,
			status: 'completed',
			enrolledAt: new Date('2024-01-10'),
			completedAt: new Date('2024-01-28')
		},
		{
			id: generateId(),
			userId: userIds[5],
			courseId: courseIds[3],
			couponId: couponIds[2],
			status: 'active',
			enrolledAt: new Date('2024-01-23'),
			completedAt: null
		}
	];

	for (const enrollment of enrollments) {
		await db.insert(schema.enrollment).values(enrollment).onConflictDoNothing();
	}

	logSuccess(`Seeded ${enrollments.length} enrollments`);
}
