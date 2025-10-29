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
    throw new Error('Refusing to seed remote database without --remote flag. Use --remote to confirm.');
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
        const mentorId = userIds[2]; // mentor1

        const courses = await seedCourses(adminId, mentorId);
        const courseIds = courses.map((c) => c.id);

        const coupons = await seedCoupons(adminId);
        const couponIds = coupons.map((c) => c.id);

        await seedEnrollments(userIds.slice(3), courseIds, couponIds); // Only students
        await seedMentorApplications(userIds);
        await seedWaitingList();

        console.log('\n✨ Seeding completed successfully!');
        console.log(`\n📊 Seeded to: ${isLocal ? 'LOCAL database' : 'REMOTE Turso database'}`);
        console.log('\n📋 Test Credentials:');
        console.log('Admin: username=admin, password=admin123');
        console.log('BD: username=bd_user, password=bd123');
        console.log('Mentor: username=mentor1, password=mentor123');
        console.log('Students: username=student1/2/3, password=student123');

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

