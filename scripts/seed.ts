import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/server/db/schema.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Modular seeders
import { seedUsers, seedStudents } from './seed/users.js';
import { seedCourses, seedCoupons, seedEnrollments } from './seed/courses.js';
import { seedCourseContent } from './seed/content.ts';
import { seedPartners, seedCohorts } from './seed/partners.js';
import { seedMentorApplications, seedWaitingList } from './seed/applications.js';
import { seedBadges, seedUserXP, seedUserBadges } from './seed/gamification.js';
import {
	seedCheckpoints,
	seedCheckpointSubmissions,
	seedDiscussions,
	seedLessonNotes
} from './seed/interactions.js';
import {
	seedNotifications,
	seedBroadcastMessages,
	seedCourseReviews
} from './seed/notifications.js';
import { seedAffiliateLinks, seedAffiliateSales } from './seed/affiliates.js';
import { seedOrganizations, assignCoursesToOrganizations, seedWorkspaces } from './seed/organizations.js';
import { seedPlugins } from './seed/plugins.js';
import { seedKoneksiDigital } from './seed/koneksi-digital.js';

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

async function safeDelete(table: any, tableName: string) {
	try {
		await db.delete(table);
		console.log(`  ✓ Cleared ${tableName}`);
	} catch (err: any) {
		if (err?.cause?.code === 'SQLITE_ERROR' && err?.cause?.message?.includes('no such table')) {
			console.log(`  ⊘ Skipped ${tableName} (table doesn't exist yet)`);
		} else {
			throw err;
		}
	}
}

async function resetTables() {
	console.log('🗑️  Resetting tables...');

	// Delete in correct order: child tables first, then parent tables
	// Level 1: Tables with no dependencies or only user dependencies
	await safeDelete(schema.affiliateSale, 'affiliateSale');
	await safeDelete(schema.affiliateLink, 'affiliateLink');
	await safeDelete(schema.courseReview, 'courseReview');
	await safeDelete(schema.notification, 'notification');
	await safeDelete(schema.broadcastMessage, 'broadcastMessage');
	await safeDelete(schema.discussion, 'discussion');
	await safeDelete(schema.lessonNote, 'lessonNote');
	await safeDelete(schema.lessonProgress, 'lessonProgress');
	await safeDelete(schema.checkpointSubmission, 'checkpointSubmission');
	await safeDelete(schema.checkpoint, 'checkpoint');
	await safeDelete(schema.userBadge, 'userBadge');
	await safeDelete(schema.badge, 'badge');
	await safeDelete(schema.userXP, 'userXP');
	await safeDelete(schema.couponUsage, 'couponUsage');
	await safeDelete(schema.mentorApplication, 'mentorApplication');
	await safeDelete(schema.waitingList, 'waitingList');
	await safeDelete(schema.paymentProof, 'paymentProof');
	await safeDelete(schema.transaction, 'transaction');
	await safeDelete(schema.certificate, 'certificate');
	await safeDelete(schema.coursePlugin, 'coursePlugin');
	await safeDelete(schema.submissionGrade, 'submissionGrade');
	await safeDelete(schema.submission, 'submission');
	await safeDelete(schema.quizChoice, 'quizChoice');
	await safeDelete(schema.quizQuestion, 'quizQuestion');
	await safeDelete(schema.quiz, 'quiz');
	
	// Level 2: Tables that depend on course
	await safeDelete(schema.enrollment, 'enrollment');
	await safeDelete(schema.material, 'material');
	await safeDelete(schema.lesson, 'lesson');
	await safeDelete(schema.module, 'module');
	await safeDelete(schema.cohort, 'cohort');
	
	// Level 3: Course and coupon (after enrollments)
	await safeDelete(schema.course, 'course');
	await safeDelete(schema.coupon, 'coupon');
	await safeDelete(schema.pluginRegistry, 'pluginRegistry');
	
	// Level 4: Organization related
	await safeDelete(schema.organizationMember, 'organizationMember');
	await safeDelete(schema.organizationInvitation, 'organizationInvitation');
	await safeDelete(schema.workspaceMember, 'workspaceMember');
	await safeDelete(schema.workspace, 'workspace');
	await safeDelete(schema.organization, 'organization');
	
	// Level 5: Partners
	await safeDelete(schema.partner, 'partner');
	
	// Level 6: Session and user (must be last)
	await safeDelete(schema.session, 'session');
	await safeDelete(schema.user, 'user');

	console.log('✅ Tables reset complete');
}

async function main() {
	try {
		if (shouldReset) await resetTables();

		// ===== STEP 1: Core Users (Admin, BD, Mentors, Facilitators) =====
		console.log('\n📋 STEP 1: Creating core users...');
		const coreUsers = await seedUsers(db);
		const adminId = coreUsers[0].id; // admin
		const bdId = coreUsers[1].id; // bd_salsabila
		const mentorIds = coreUsers.slice(2, 8).map(u => u.id); // 6 mentors
		const facilitatorIds = coreUsers.slice(8, 11).map(u => u.id); // 3 facilitators

		// ===== STEP 2: Students =====
		console.log('\n📋 STEP 2: Creating students...');
		const students = await seedStudents(db);
		const studentIds = students.map(s => s.id);

		// ===== STEP 3: Organizations =====
		console.log('\n📋 STEP 3: Creating organizations...');
		const orgIds = [adminId, bdId, mentorIds[0]];
		await seedOrganizations(db, orgIds);

		// ===== STEP 4: Courses =====
		console.log('\n📋 STEP 4: Creating courses...');
		const courses = await seedCourses(db, adminId);
		const courseIds = courses.map(c => c.id);

		// ===== STEP 5: Partners & Cohorts =====
		console.log('\n📋 STEP 5: Creating partners and cohorts...');
		await seedPartners(db);
		const cohorts = await seedCohorts(db, mentorIds, facilitatorIds, courseIds);
		const cohortIds = cohorts.map(c => c.id);

		// ===== STEP 6: Coupons =====
		console.log('\n📋 STEP 6: Creating coupons...');
		const coupons = await seedCoupons(db, adminId);
		const couponIds = coupons.map(c => c.id);

		// ===== STEP 7: Enrollments with Tracks =====
		console.log('\n📋 STEP 7: Creating enrollments with tracks...');
		await seedEnrollments(db, studentIds, courseIds, couponIds, cohortIds);

		// ===== STEP 8: Course Content =====
		console.log('\n📋 STEP 8: Creating course content...');
		await seedCourseContent(db, courseIds);

		// ===== STEP 9: Mentor Applications & Waiting List =====
		console.log('\n📋 STEP 9: Creating mentor applications and waiting list...');
		await seedMentorApplications(db, studentIds.slice(0, 5));
		await seedWaitingList(db);

		// ===== STEP 10: Workspaces =====
		console.log('\n📋 STEP 10: Creating workspaces...');
		const workspaceAdminIds = [adminId, bdId, mentorIds[0]];
		await seedWorkspaces(db, workspaceAdminIds);

		// ===== STEP 11: Plugins =====
		console.log('\n📋 STEP 11: Creating plugins...');
		await seedPlugins(db);

		// ===== STEP 11.5: Koneksi Digital (Drafting Sync) =====
		console.log('\n📋 STEP 11.5: Syncing Koneksi Digital curriculum...');
		await seedKoneksiDigital(db, adminId);

		// ===== STEP 12: Checkpoints =====
		console.log('\n📋 STEP 12: Creating checkpoints...');
		await seedCheckpoints(db, cohortIds);

		// ===== STEP 13: Gamification =====
		console.log('\n📋 STEP 13: Creating gamification data...');
		await seedBadges(db);
		await seedUserXP(db, studentIds);
		await seedUserBadges(db, studentIds);

		// ===== STEP 14: Checkpoint Submissions =====
		console.log('\n📋 STEP 14: Creating checkpoint submissions...');
		const checkpointIds = (await db.select().from(schema.checkpoint)).map(c => c.id);
		await seedCheckpointSubmissions(db, studentIds, checkpointIds);

		// ===== STEP 15: Discussions & Notes =====
		console.log('\n📋 STEP 15: Creating discussions and notes...');
		const lessonIds = ['lesson-001', 'lesson-002', 'lesson-003', 'lesson-004', 'lesson-005'];
		await seedDiscussions(db, studentIds, courseIds, lessonIds);
		await seedLessonNotes(db, studentIds, lessonIds, courseIds);

		// ===== STEP 16: Notifications =====
		console.log('\n📋 STEP 16: Creating notifications...');
		await seedNotifications(db, studentIds);
		await seedBroadcastMessages(db, adminId, mentorIds[0]);

		// ===== STEP 17: Affiliates =====
		console.log('\n📋 STEP 17: Creating affiliate data...');
		const links = await seedAffiliateLinks(db, studentIds);
		await seedAffiliateSales(
			db,
			studentIds,
			links.map((l: any) => l.id)
		);

		// ===== STEP 18: Reviews =====
		console.log('\n📋 STEP 18: Creating course reviews...');
		await seedCourseReviews(db, studentIds, courseIds);

		// ===== SUMMARY =====
		console.log('\n' + '='.repeat(60));
		console.log('✨ SEEDING COMPLETED SUCCESSFULLY!');
		console.log('='.repeat(60));
		console.log(`📊 Summary:`);
		console.log(`   - Core Users: ${coreUsers.length} (admin, bd, mentors, facilitators)`);
		console.log(`   - Students: ${students.length}`);
		console.log(`   - Courses: ${courses.length}`);
		console.log(`   - Cohorts: ${cohorts.length}`);
		console.log(`   - Coupons: ${coupons.length}`);
		console.log(`   - Enrollments: ~80 (with tracks)`);
		console.log('\n🔑 Login Credentials:');
		console.log('   Admin: admin / naikkelas2024');
		console.log('   BD: bd_salsabila / naikkelas2024');
		console.log('   Mentor: mentor_budi / naikkelas2024');
		console.log('   Facilitator: facil_irwan / naikkelas2024');
		console.log('   Student: ahmad_rizki / naikkelas2024');
		console.log('='.repeat(60));
		
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Seeding failed:', error);
		process.exit(1);
	}
}

main();
