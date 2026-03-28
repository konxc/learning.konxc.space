import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/server/db/schema.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Modular seeders
import { seedUsers, seedMoreStudents } from './seed/users.js';
import { seedCourses, seedCoupons, seedEnrollments } from './seed/courses.js';
import { seedCourseContent } from './seed/content.ts';
import { seedPartners, seedCohorts } from './seed/partners.js';
import { seedMentorApplications, seedWaitingList } from './seed/applications.js';
import { seedBadges, seedUserXP, seedUserBadges } from './seed/gamification.js';
import { seedCheckpoints, seedCheckpointSubmissions, seedDiscussions, seedLessonNotes } from './seed/interactions.js';
import { seedNotifications, seedBroadcastMessages, seedCourseReviews } from './seed/notifications.js';
import { seedAffiliateLinks, seedAffiliateSales } from './seed/affiliates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
try {
	const dotenv = await import('dotenv');
	dotenv.config({ path: resolve(__dirname, '..', '.env') });
} catch (err) {
	console.log('Note: dotenv not available, using environment variables');
}

// Parse args
const args = process.argv.slice(2);
const isRemoteMode = args.includes('--remote') || args.includes('--turso');
const shouldReset = args.includes('--reset');
const skipConfirmation = args.includes('--yes');

const LOCAL_DB_URL = process.env.LOCAL_DB_URL || 'file:./local.db';
const REMOTE_DB_URL = process.env.DATABASE_URL;
const REMOTE_DB_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

let DATABASE_URL: string;
let DATABASE_AUTH_TOKEN: string | undefined;

if (isRemoteMode) {
	if (!REMOTE_DB_URL) throw new Error('DATABASE_URL not set.');
	DATABASE_URL = REMOTE_DB_URL;
	DATABASE_AUTH_TOKEN = REMOTE_DB_AUTH_TOKEN;
} else {
	DATABASE_URL = LOCAL_DB_URL;
}

const isRemote = DATABASE_URL.startsWith('libsql://') || DATABASE_URL.startsWith('https://');
const isLocal = !isRemote;

if (isRemote && !isRemoteMode) throw new Error('Use --remote to target remote DB.');
if (!skipConfirmation && isRemote) throw new Error('Remote seeding requires --yes flag.');

console.log(`\n📊 Seed Target: ${isLocal ? 'LOCAL' : 'REMOTE'} (${DATABASE_URL})\n`);

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
const db = drizzle(client, { schema });

async function resetTables() {
	console.log('🗑️  Resetting tables...');
	await db.delete(schema.affiliateSale);
	await db.delete(schema.affiliateLink);
	await db.delete(schema.courseReview);
	await db.delete(schema.notification);
	await db.delete(schema.broadcastMessage);
	await db.delete(schema.discussion);
	await db.delete(schema.lessonNote);
	await db.delete(schema.checkpointSubmission);
	await db.delete(schema.checkpoint);
	await db.delete(schema.userBadge);
	await db.delete(schema.badge);
	await db.delete(schema.userXP);
	await db.delete(schema.cohort);
	await db.delete(schema.partner);
	await db.delete(schema.material);
	await db.delete(schema.lesson);
	await db.delete(schema.module);
	await db.delete(schema.mentorApplication);
	await db.delete(schema.waitingList);
	await db.delete(schema.enrollment);
	await db.delete(schema.couponUsage);
	await db.delete(schema.coupon);
	await db.delete(schema.course);
	await db.delete(schema.session);
	await db.delete(schema.user);
	console.log('✅ Tables reset complete');
}

async function main() {
	try {
		if (shouldReset) await resetTables();

		const users = await seedUsers(db);
		const userIds = users.map(u => u.id);
		const adminId = userIds[0];
		const mentorId = userIds[2];

		const courses = await seedCourses(db, adminId, mentorId);
		const courseIds = courses.map(c => c.id);

		const coupons = await seedCoupons(db, adminId);
		const couponIds = coupons.map(c => c.id);

		await seedEnrollments(db, userIds, courseIds, couponIds);
		await seedMentorApplications(db, userIds.slice(4)); // student2
		await seedWaitingList(db);
		await seedCourseContent(db, courseIds);
		await seedPartners(db);
		
		const cohorts = await seedCohorts(db, [mentorId], courseIds);
		const cohortIds = cohorts.map(c => c.id);

		await seedCheckpoints(db, cohortIds);
		
		const moreStudents = await seedMoreStudents(db);
		const studentIds = moreStudents.map(u => u.id);
		
		await seedBadges(db);
		await seedUserXP(db, studentIds);
		await seedUserBadges(db, studentIds);
		
		const checkpointIds = (await db.select().from(schema.checkpoint)).map(c => c.id);
		await seedCheckpointSubmissions(db, studentIds, checkpointIds);
		
		const lessonIds = ['lesson-001', 'lesson-002', 'lesson-003'];
		await seedDiscussions(db, studentIds, courseIds, lessonIds);
		await seedLessonNotes(db, studentIds, lessonIds, courseIds);
		await seedNotifications(db, studentIds);
		await seedBroadcastMessages(db, adminId, mentorId);
		
		const links = await seedAffiliateLinks(db, studentIds);
		await seedAffiliateSales(db, studentIds, links.map(l => l.id));
		await seedCourseReviews(db, studentIds, courseIds);

		console.log('\n✨ Seeding completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Seeding failed:', error);
		process.exit(1);
	}
}

main();
