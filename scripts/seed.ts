import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/server/db/schema.js';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { hashPassword } from '../src/lib/server/password.js';
import { eq } from 'drizzle-orm';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
// Try to use dotenv if available, otherwise rely on environment variables
try {
	const dotenv = await import('dotenv');
	dotenv.config({ path: resolve(__dirname, '..', '.env') });
} catch (err) {
	// dotenv not available, environment variables should be set externally
	console.log('Note: dotenv not available, using environment variables');
}

// Parse command line arguments
const args = process.argv.slice(2);
const isRemoteMode = args.includes('--remote') || args.includes('--turso');
const shouldReset = args.includes('--reset');
const skipConfirmation = args.includes('--yes');

// Database URL configuration
// Default to local database for development safety
const LOCAL_DB_URL = process.env.LOCAL_DB_URL || 'file:./local.db';
const REMOTE_DB_URL = process.env.DATABASE_URL;
const REMOTE_DB_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

// Determine database target
let DATABASE_URL: string;
let DATABASE_AUTH_TOKEN: string | undefined;

if (isRemoteMode) {
	// Remote mode: use Turso
	if (!REMOTE_DB_URL) {
		throw new Error('DATABASE_URL not set. Cannot seed to remote database.');
	}
	DATABASE_URL = REMOTE_DB_URL;
	DATABASE_AUTH_TOKEN = REMOTE_DB_AUTH_TOKEN;
} else {
	// Default: use local database
	DATABASE_URL = LOCAL_DB_URL;
	DATABASE_AUTH_TOKEN = undefined; // Local DB doesn't need auth token
}

// Detect database type
const isRemote = DATABASE_URL.startsWith('libsql://') || DATABASE_URL.startsWith('https://');
const isLocal = DATABASE_URL.startsWith('file:') || DATABASE_URL.endsWith('.db');

// Safety check for remote seeding
if (isRemote && !isRemoteMode) {
	console.warn('\n⚠️  WARNING: DATABASE_URL points to remote Turso database!');
	console.warn('⚠️  This could affect production/staging data.');
	console.warn('⚠️  Use --remote flag explicitly if you intend to seed to remote database.\n');
	throw new Error(
		'Refusing to seed remote database without --remote flag. Use --remote to confirm.'
	);
}

if (!skipConfirmation && isRemote) {
	console.log('\n⚠️  WARNING: You are about to seed to REMOTE Turso database!');
	console.log(`    URL: ${DATABASE_URL}`);
	console.log('\n    This will modify data in your remote database.');
	console.log('    Use --yes flag to skip this confirmation.\n');
	throw new Error('Remote seeding requires --yes flag for confirmation. Add --yes to proceed.');
}

// Log target database
console.log('\n📊 Database Target:');
if (isLocal) {
	console.log(`   ✅ LOCAL: ${DATABASE_URL}`);
} else {
	console.log(`   🌐 REMOTE: ${DATABASE_URL.replace(/\/\/[^@]+@/, '//***@')}`);
}
console.log('');

// Create database client
const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN
});

const db = drizzle(client, { schema });

// Helper functions
function generateId(): string {
	return encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
}

function now(): number {
	return Date.now();
}

async function seedUsers() {
	console.log('📝 Seeding users...');

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
		try {
			await db.insert(schema.user).values(user).onConflictDoNothing();
		} catch (err) {
			console.log(`User ${user.username} already exists, skipping...`);
		}
	}

	console.log(`✅ Seeded ${users.length} users`);
	return users;
}

async function seedCourses(adminId: string, mentorId: string) {
	console.log('📚 Seeding courses...');

	const courses = [
		{
			id: 'course-001',
			title: 'Python Programming Fundamentals',
			description:
				'Belajar Python dari dasar hingga mahir. Kursus lengkap untuk pemula yang ingin menguasai programming dengan Python.',
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
			description:
				'Pelajari HTML, CSS, JavaScript, dan framework modern untuk menjadi full stack developer yang handal.',
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
			description:
				'Materi advanced React.js dengan hooks, context API, dan best practices untuk production.',
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
			description:
				'Pelajari database design, normalization, dan SQL queries untuk database management yang efektif.',
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
			description:
				'Bangun RESTful API dengan Node.js, Express, dan best practices untuk scalable backend applications.',
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
			description:
				'Kembangkan aplikasi mobile dengan React Native dan Flutter untuk iOS dan Android.',
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
		try {
			await db.insert(schema.course).values(course).onConflictDoNothing();
		} catch (err) {
			console.log(`Course ${course.id} already exists, skipping...`);
		}
	}

	console.log(`✅ Seeded ${courses.length} courses`);
	return courses;
}

async function seedCoupons(adminId: string) {
	console.log('🎫 Seeding coupons...');

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
		try {
			await db.insert(schema.coupon).values(coupon).onConflictDoNothing();
		} catch (err) {
			console.log(`Coupon ${coupon.code} already exists, skipping...`);
		}
	}

	console.log(`✅ Seeded ${coupons.length} coupons`);
	return coupons;
}

async function seedEnrollments(userIds: string[], courseIds: string[], couponIds: string[]) {
	console.log('📝 Seeding enrollments...');

	const enrollments = [
		{
			id: generateId(),
			userId: userIds[3], // student1
			courseId: courseIds[0], // Python
			couponId: couponIds[0], // WELCOME50
			status: 'active',
			enrolledAt: new Date('2024-01-20'),
			completedAt: null
		},
		{
			id: generateId(),
			userId: userIds[3], // student1
			courseId: courseIds[1], // Full Stack
			couponId: null,
			status: 'active',
			enrolledAt: new Date('2024-01-21'),
			completedAt: null
		},
		{
			id: generateId(),
			userId: userIds[4], // student2
			courseId: courseIds[0], // Python
			couponId: couponIds[1], // FIXED100K
			status: 'active',
			enrolledAt: new Date('2024-01-22'),
			completedAt: null
		},
		{
			id: generateId(),
			userId: userIds[4], // student2
			courseId: courseIds[2], // React Advanced
			couponId: null,
			status: 'completed',
			enrolledAt: new Date('2024-01-10'),
			completedAt: new Date('2024-01-28')
		},
		{
			id: generateId(),
			userId: userIds[5], // student3 (no onboarding)
			courseId: courseIds[3], // Database Design
			couponId: couponIds[2], // FREECOURSE
			status: 'active',
			enrolledAt: new Date('2024-01-23'),
			completedAt: null
		}
	];

	for (const enrollment of enrollments) {
		try {
			await db.insert(schema.enrollment).values(enrollment).onConflictDoNothing();
		} catch (err) {
			// Skip if exists
		}
	}

	console.log(`✅ Seeded ${enrollments.length} enrollments`);
}

async function seedMentorApplications(userIds: string[]) {
	console.log('👨‍🏫 Seeding mentor applications...');

	const applications = [
		{
			id: generateId(),
			userId: userIds[4], // student2 applying to be mentor
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
		try {
			await db.insert(schema.mentorApplication).values(app).onConflictDoNothing();
		} catch (err) {
			// Skip if exists
		}
	}

	console.log(`✅ Seeded ${applications.length} mentor applications`);
}

async function seedWaitingList() {
	console.log('📋 Seeding waiting list...');

	const waitingListEntries = [
		{
			id: generateId(),
			fullName: 'Rina Wijaya',
			email: 'rina.wijaya@email.com',
			phone: '081111111111',
			interest: 'python',
			source: 'landing-cta',
			status: 'new',
			notes: null,
			createdAt: new Date('2024-01-16'),
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
		try {
			await db.insert(schema.waitingList).values(entry).onConflictDoNothing();
		} catch (err) {
			// Skip if exists
		}
	}

	console.log(`✅ Seeded ${waitingListEntries.length} waiting list entries`);
}

async function seedCourseContent(courseIds: string[]) {
	console.log('📚 Seeding modules, lessons, and materials...');

	const modules = [
		{ id: 'module-001', courseId: courseIds[0], title: 'Introduction to Python', order: 1 },
		{ id: 'module-002', courseId: courseIds[0], title: 'Data Types and Variables', order: 2 },
		{ id: 'module-003', courseId: courseIds[0], title: 'Control Flow', order: 3 },
		{ id: 'module-004', courseId: courseIds[0], title: 'Functions and Modules', order: 4 }
	];

	for (const m of modules) {
		await db.insert(schema.module).values(m).onConflictDoNothing();
	}

	const lessons = [
		{ id: 'lesson-001', moduleId: 'module-001', title: 'What is Python?', order: 1, weekNumber: 1, isFree: true },
		{ id: 'lesson-002', moduleId: 'module-001', title: 'Setting up Environment', order: 2, weekNumber: 1, isFree: false },
		{ id: 'lesson-003', moduleId: 'module-002', title: 'Numbers and Strings', order: 1, weekNumber: 2, isFree: false },
		{ id: 'lesson-004', moduleId: 'module-002', title: 'Lists and Dictionaries', order: 2, weekNumber: 2, isFree: false },
		{ id: 'lesson-005', moduleId: 'module-003', title: 'If-Else Statement', order: 1, weekNumber: 3, isFree: false },
		{ id: 'lesson-006', moduleId: 'module-003', title: 'Loops (For & While)', order: 2, weekNumber: 3, isFree: false }
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
			durationMs: 600000
		},
		{
			id: 'mat-002',
			lessonId: 'lesson-001',
			type: 'text',
			content:
				'Python adalah bahasa pemrograman yang serbaguna dan mudah dipelajari. Diciptakan oleh Guido van Rossum dan pertama kali dirilis pada tahun 1991.',
			order: 2
		},
		{
			id: 'mat-003',
			lessonId: 'lesson-002',
			type: 'text',
			content:
				'**Instalasi Python:** \n1. Download Python dari python.org\n2. Jalankan installer dan jangan lupa centang "Add Python to PATH"\n3. Cek instalasi dengan mengetik `python --version` di terminal.',
			order: 1
		},
		{
			id: 'mat-004',
			lessonId: 'lesson-003',
			type: 'text',
			content:
				'Di Python, angka bisa berupa integer (bilangan bulat) atau float (bilangan desimal). String adalah urutan karakter yang diapit tanda kutip.',
			order: 1
		}
	];

	for (const m of materials) {
		await db.insert(schema.material).values(m).onConflictDoNothing();
	}

	console.log(`✅ Seeded course content`);
}

async function seedCohorts(adminId: string, mentorIds: string[], courseIds: string[]) {
	console.log('🏫 Seeding cohorts...');

	const cohorts = [
		{
			id: 'cohort-001',
			name: 'Naik Kelas Batch 1 - Python',
			courseId: courseIds[0],
			facilitatorId: mentorIds[0],
			startDate: new Date('2024-02-01'),
			endDate: new Date('2024-04-30'),
			status: 'completed',
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

	console.log(`✅ Seeded ${cohorts.length} cohorts`);
	return cohorts;
}

async function seedPartners() {
	console.log('🤝 Seeding partners...');

	const partners = [
		{
			id: 'partner-001',
			name: 'Yayasan ASIB',
			type: 'nonprofit',
			email: 'info@asib.org',
			phone: '021-1234567',
			address: 'Jakarta Selatan',
			website: 'https://asib.org',
			status: 'active',
			createdAt: new Date('2024-01-01')
		},
		{
			id: 'partner-002',
			name: 'Koneksi Digital',
			type: 'corporate',
			email: 'hello@koneksi.id',
			phone: '021-7654321',
			address: 'Jakarta Pusat',
			website: 'https://koneksi.id',
			status: 'active',
			createdAt: new Date('2024-01-01')
		}
	];

	for (const partner of partners) {
		await db.insert(schema.partner).values(partner).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${partners.length} partners`);
}

async function seedBadges() {
	console.log('🏆 Seeding badges...');

	const badges = [
		{
			id: 'badge-001',
			name: 'First Steps',
			description: 'Menelesaikan lesson pertama',
			icon: '🎯',
			criteria: JSON.stringify({ type: 'complete_lesson', count: 1 })
		},
		{
			id: 'badge-002',
			name: 'Dedicated Learner',
			description: 'Login 7 hari berturut-turut',
			icon: '🔥',
			criteria: JSON.stringify({ type: 'streak', days: 7 })
		},
		{
			id: 'badge-003',
			name: 'Course Master',
			description: 'Menelesaikan satu course lengkap',
			icon: '🎓',
			criteria: JSON.stringify({ type: 'complete_course', count: 1 })
		},
		{
			id: 'badge-004',
			name: 'Quiz Ace',
			description: 'Mendapat nilai 100 di kuis',
			icon: '⭐',
			criteria: JSON.stringify({ type: 'perfect_quiz', score: 100 })
		},
		{
			id: 'badge-005',
			name: 'Helping Hand',
			description: 'Membantu pebbles lain di forum',
			icon: '🤝',
			criteria: JSON.stringify({ type: 'forum_helpful', count: 1 })
		},
		{
			id: 'badge-006',
			name: 'Weekend Warrior',
			description: 'Menyelesaikan checkpoint mingguan',
			icon: '💪',
			criteria: JSON.stringify({ type: 'checkpoint_completed', count: 1 })
		},
		{
			id: 'badge-007',
			name: 'Content Creator',
			description: 'Mengupload 5 karya',
			icon: '📸',
			criteria: JSON.stringify({ type: 'upload_work', count: 5 })
		},
		{
			id: 'badge-008',
			name: 'Affiliate Pro',
			description: 'Mendapat 10 penjualan affiliate',
			icon: '💰',
			criteria: JSON.stringify({ type: 'affiliate_sales', count: 10 })
		}
	];

	for (const badge of badges) {
		await db.insert(schema.badge).values(badge).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${badges.length} badges`);
}

async function seedUserXP(userIds: string[]) {
	console.log('✨ Seeding user XP...');

	const xpData = [
		{ userId: userIds[3], points: 1250, level: 5, streakDays: 7, lastActiveAt: new Date() },
		{ userId: userIds[4], points: 2100, level: 7, streakDays: 14, lastActiveAt: new Date() },
		{ userId: userIds[5], points: 450, level: 2, streakDays: 3, lastActiveAt: new Date() }
	];

	for (const xp of xpData) {
		await db.insert(schema.userXP).values(xp).onConflictDoNothing();
	}

	console.log(`✅ Seeded user XP for ${xpData.length} users`);
}

async function seedUserBadges(userIds: string[]) {
	console.log('🏅 Seeding user badges...');

	const userBadges = [
		{ id: 'ub-001', userId: userIds[3], badgeId: 'badge-001', earnedAt: new Date('2024-01-25') },
		{ id: 'ub-002', userId: userIds[3], badgeId: 'badge-002', earnedAt: new Date('2024-02-01') },
		{ id: 'ub-003', userId: userIds[3], badgeId: 'badge-004', earnedAt: new Date('2024-02-10') },
		{ id: 'ub-004', userId: userIds[4], badgeId: 'badge-001', earnedAt: new Date('2024-01-22') },
		{ id: 'ub-005', userId: userIds[4], badgeId: 'badge-002', earnedAt: new Date('2024-01-29') },
		{ id: 'ub-006', userId: userIds[4], badgeId: 'badge-003', earnedAt: new Date('2024-02-15') },
		{ id: 'ub-007', userId: userIds[4], badgeId: 'badge-004', earnedAt: new Date('2024-02-08') },
		{ id: 'ub-008', userId: userIds[5], badgeId: 'badge-001', earnedAt: new Date('2024-01-28') }
	];

	for (const ub of userBadges) {
		await db.insert(schema.userBadge).values(ub).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${userBadges.length} user badges`);
}

async function seedCheckpoints(courseIds: string[], mentorIds: string[], cohortIds: string[]) {
	console.log('📋 Seeding checkpoints...');

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

	console.log(`✅ Seeded ${checkpoints.length} checkpoints`);
	return checkpoints;
}

async function seedCheckpointSubmissions(userIds: string[], checkpointIds: string[]) {
	console.log('📝 Seeding checkpoint submissions...');

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

	console.log(`✅ Seeded ${submissions.length} checkpoint submissions`);
}

async function seedDiscussions(userIds: string[], courseIds: string[], lessonIds: string[]) {
	console.log('💬 Seeding discussions...');

	const discussions = [
		{
			id: 'disc-001',
			userId: userIds[3],
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
			userId: userIds[4],
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
			userId: userIds[5],
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
			userId: userIds[3],
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

	console.log(`✅ Seeded ${discussions.length} discussions`);
}

async function seedLessonNotes(userIds: string[], lessonIds: string[], courseIds: string[]) {
	console.log('📝 Seeding lesson notes...');

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

	console.log(`✅ Seeded ${notes.length} lesson notes`);
}

async function seedNotifications(userIds: string[]) {
	console.log('🔔 Seeding notifications...');

	const notifications = [
		{
			id: generateId(),
			userId: userIds[3],
			type: 'welcome',
			title: 'Selamat datang di Naik Kelas!',
			message: 'Halo Ahmad Rizki, selamat datang di platform pembelajaran digital marketing dari Koneksi dan Yayasan ASIB.',
			link: '/app/onboarding',
			read: true,
			createdAt: new Date('2024-01-20')
		},
		{
			id: generateId(),
			userId: userIds[3],
			type: 'enrollment',
			title: 'Anda berhasil enroll ke Python Programming',
			message: 'Selamat! Anda telah terdaftar di course Python Programming Fundamentals.',
			link: '/app/courses/course-001',
			read: true,
			createdAt: new Date('2024-01-20')
		},
		{
			id: generateId(),
			userId: userIds[3],
			type: 'reminder',
			title: 'Checkpoint deadline minggu ini',
			message: 'Jangan lupa menyelesaikan checkpoint minggu pertama sebelum tanggal 7 Feb 2024!',
			link: '/app/checkpoints',
			read: false,
			createdAt: new Date('2024-02-05')
		},
		{
			id: generateId(),
			userId: userIds[4],
			type: 'welcome',
			title: 'Selamat datang di Naik Kelas!',
			message: 'Halo Sari Dewi, selamat datang di platform pembelajaran digital marketing dari Koneksi dan Yayasan ASIB.',
			link: '/app/onboarding',
			read: true,
			createdAt: new Date('2024-01-21')
		},
		{
			id: generateId(),
			userId: userIds[4],
			type: 'certificate',
			title: 'Selamat! Anda menyelesaikan course',
			message: 'Felicidades! Anda telah menyelesaikan course React.js Advanced dengan nilai memuaskan.',
			link: '/app/certificates',
			read: true,
			createdAt: new Date('2024-01-28')
		},
		{
			id: generateId(),
			userId: userIds[5],
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

	console.log(`✅ Seeded ${notifications.length} notifications`);
}

async function seedBroadcastMessages(adminId: string, mentorId: string) {
	console.log('📢 Seeding broadcast messages...');

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

	console.log(`✅ Seeded ${broadcasts.length} broadcast messages`);
}

async function seedAffiliateLinks(userIds: string[]) {
	console.log('🔗 Seeding affiliate links...');

	const links = [
		{
			id: 'afflink-001',
			userId: userIds[3],
			name: 'Kursus Python Premium',
			platform: 'udemy',
			url: 'https://udemy.com/course/python-master',
			productPrice: 1500000,
			commissionRate: 30,
			status: 'active',
			createdAt: new Date('2024-02-01')
		},
		{
			id: 'afflink-002',
			userId: userIds[3],
			name: ' Ebook Digital Marketing',
			platform: 'digim认真地',
			url: 'https://digistore24.com/product/12345',
			productPrice: 99000,
			commissionRate: 50,
			status: 'active',
			createdAt: new Date('2024-02-05')
		},
		{
			id: 'afflink-003',
			userId: userIds[4],
			name: 'Tools Desain Grafis',
			platform: 'creative_market',
			url: 'https://creativemarket.com/toolsdesign',
			productPrice: 250000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-02-10')
		},
		{
			id: 'afflink-004',
			userId: userIds[5],
			name: 'Hosting Unlimited',
			platform: 'hostinger',
			url: 'https://hostinger.com/affiliate/xyz',
			productPrice: 360000,
			commissionRate: 20,
			status: 'active',
			createdAt: new Date('2024-02-15')
		}
	];

	for (const link of links) {
		await db.insert(schema.affiliateLink).values(link).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${links.length} affiliate links`);
	return links;
}

async function seedAffiliateSales(userIds: string[], linkIds: string[]) {
	console.log('💰 Seeding affiliate sales...');

	const sales = [
		{
			affiliateLinkId: linkIds[0],
			userId: userIds[3],
			buyerEmail: 'buyer1@email.com',
			buyerName: 'Rina Wijaya',
			platform: 'udemy',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-001',
			status: 'paid',
			createdAt: new Date('2024-02-10')
		},
		{
			affiliateLinkId: linkIds[0],
			userId: userIds[3],
			buyerEmail: 'buyer2@email.com',
			buyerName: 'Andi Pratama',
			platform: 'udemy',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-002',
			status: 'paid',
			createdAt: new Date('2024-02-15')
		},
		{
			affiliateLinkId: linkIds[1],
			userId: userIds[3],
			buyerEmail: 'buyer3@email.com',
			buyerName: 'Maya Sari',
			platform: 'digistore24',
			saleAmount: 99000,
			commissionAmount: 49500,
			transactionId: 'TRX-2024-003',
			status: 'paid',
			createdAt: new Date('2024-02-18')
		},
		{
			affiliateLinkId: linkIds[1],
			userId: userIds[3],
			buyerEmail: 'buyer4@email.com',
			buyerName: 'Budi Hartono',
			platform: 'digistore24',
			saleAmount: 99000,
			commissionAmount: 49500,
			transactionId: 'TRX-2024-004',
			status: 'pending',
			createdAt: new Date('2024-02-20')
		},
		{
			affiliateLinkId: linkIds[2],
			userId: userIds[4],
			buyerEmail: 'buyer5@email.com',
			buyerName: 'Dewi Lestari',
			platform: 'creative_market',
			saleAmount: 250000,
			commissionAmount: 62500,
			transactionId: 'TRX-2024-005',
			status: 'paid',
			createdAt: new Date('2024-02-12')
		},
		{
			affiliateLinkId: linkIds[3],
			userId: userIds[5],
			buyerEmail: 'buyer6@email.com',
			buyerName: 'Fajar Nugroho',
			platform: 'hostinger',
			saleAmount: 360000,
			commissionAmount: 72000,
			transactionId: 'TRX-2024-006',
			status: 'paid',
			createdAt: new Date('2024-02-16')
		}
	];

	for (const sale of sales) {
		await db.insert(schema.affiliateSale).values(sale).onConflictDoNothing();
	}

	console.log(`✅ Seeded ${sales.length} affiliate sales`);
}

async function seedCourseReviews(userIds: string[], courseIds: string[]) {
	console.log('⭐ Seeding course reviews...');

	const reviews = [
		{
			id: generateId(),
			userId: userIds[4],
			courseId: courseIds[2],
			rating: 5,
			comment: 'Course yang sangat bagus! Penjelasannya jelas dan mudah dipahami. Mentor juga sangat helpful.',
			moderationStatus: 'approved',
			createdAt: new Date('2024-01-28')
		},
		{
			id: generateId(),
			userId: userIds[3],
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

	console.log(`✅ Seeded ${reviews.length} course reviews`);
}

async function seedMoreStudents(adminId: string) {
	console.log('👨‍🎓 Seeding more students...');

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
		try {
			await db.insert(schema.user).values(student).onConflictDoNothing();
		} catch (err) {
			console.log(`User ${student.username} already exists, skipping...`);
		}
	}

	console.log(`✅ Seeded ${students.length} additional users`);
	return students;
}

async function resetTables() {
	console.log('🗑️  Resetting tables...');

	// Delete in order respecting foreign keys
	await db.delete(schema.couponUsage);
	await db.delete(schema.enrollment);
	await db.delete(schema.coupon);
	await db.delete(schema.course);
	await db.delete(schema.mentorApplication);
	await db.delete(schema.waitingList);
	await db.delete(schema.session);
	await db.delete(schema.user);

	console.log('✅ Tables reset complete');
}

async function main() {
	try {
		if (shouldReset) {
			if (isRemote && !skipConfirmation) {
				console.log('\n⚠️  WARNING: Reset will DELETE ALL DATA in remote database!');
				console.log('    Use --yes flag to confirm reset operation.\n');
				throw new Error('Reset remote database requires --yes flag. Add --yes to proceed.');
			}
			await resetTables();
		}

		const users = await seedUsers();
		const userIds = users.map((u) => u.id);
		const adminId = userIds[0]; // admin
		const bdId = userIds[1];
		const mentorId = userIds[2]; // mentor1

		const courses = await seedCourses(adminId, mentorId);
		const courseIds = courses.map((c) => c.id);

		const coupons = await seedCoupons(adminId);
		const couponIds = coupons.map((c) => c.id);

		await seedEnrollments(userIds.slice(3), courseIds, couponIds); // Only students
		await seedMentorApplications(userIds);
		await seedWaitingList();
		await seedCourseContent(courseIds);

		// New seeding functions
		await seedPartners();
		const cohorts = await seedCohorts(adminId, [mentorId], courseIds);
		const cohortIds = cohorts.map((c) => c.id);
		
		const allMentors = [mentorId];
		await seedCheckpoints(courseIds, allMentors, cohortIds);
		
		const moreUsers = await seedMoreStudents(adminId);
		const allUserIds = [...userIds, ...moreUsers.map(u => u.id)];
		
		await seedBadges();
		await seedUserXP(allUserIds.slice(3)); // Only students
		await seedUserBadges(allUserIds.slice(3));
		
		// Get checkpoint IDs
		const checkpoints = await db.select().from(schema.checkpoint);
		const checkpointIds = checkpoints.map(c => c.id);
		
		await seedCheckpointSubmissions(allUserIds.slice(3, 6), checkpointIds.slice(0, 2));
		
		await seedDiscussions(allUserIds.slice(3), courseIds, ['lesson-001', 'lesson-002', 'lesson-003']);
		await seedLessonNotes(allUserIds.slice(3), ['lesson-001', 'lesson-002', 'lesson-003'], courseIds);
		await seedNotifications(allUserIds.slice(3));
		await seedBroadcastMessages(adminId, mentorId);
		
		const links = await db.select().from(schema.affiliateLink);
		const linkIds = links.map(l => l.id);
		
		if (linkIds.length > 0) {
			await seedAffiliateSales(allUserIds.slice(3), linkIds);
		}
		
		await seedCourseReviews(allUserIds.slice(3), courseIds);

		console.log('\n✨ Seeding completed successfully!');
		console.log(`\n📊 Seeded to: ${isLocal ? 'LOCAL database' : 'REMOTE Turso database'}`);
		console.log('\n📋 Test Credentials:');
		console.log('Admin: username=admin, password=admin123');
		console.log('BD: username=bd_user, password=bd123');
		console.log('Mentor: username=mentor1, password=mentor123');
		console.log('Students: username=student1/2/3, password=student123');
		console.log('\n🏆 Tracks Available:');
		console.log('- Creator Track');
		console.log('- Seller Track');
		console.log('- Affiliator Track');

		if (isLocal) {
			console.log('\n💡 Note: This was seeded to LOCAL database.');
			console.log('   To seed to remote Turso, use: pnpm run db:seed:remote');
		} else {
			console.log('\n💡 Note: This was seeded to REMOTE Turso database.');
			console.log('   For local development, use: pnpm run db:seed');
		}
	} catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

main();
