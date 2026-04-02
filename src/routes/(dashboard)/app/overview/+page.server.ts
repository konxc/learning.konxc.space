import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, inArray, gte, desc } from 'drizzle-orm';

// Build 12-week activity graph from trackerActivity
async function buildActivityGraph(userId: string): Promise<number[]> {
	const twelveWeeksAgo = new Date();
	twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

	const activities = await db
		.select({ points: schema.trackerActivity.points, createdAt: schema.trackerActivity.createdAt })
		.from(schema.trackerActivity)
		.where(
			and(
				eq(schema.trackerActivity.userId, userId),
				gte(schema.trackerActivity.createdAt, twelveWeeksAgo)
			)
		)
		.orderBy(schema.trackerActivity.createdAt);

	// Bucket into 12 weekly slots
	const buckets = new Array(12).fill(0);
	const now = Date.now();
	for (const a of activities) {
		const msAgo = now - new Date(a.createdAt).getTime();
		const weekIndex = 11 - Math.min(11, Math.floor(msAgo / (7 * 24 * 60 * 60 * 1000)));
		buckets[weekIndex] += a.points;
	}
	return buckets;
}

export const load: PageServerLoad = async (event) => {
	const user = await requireAuth(event);
	const parentData = await event.parent();
	const activeWorkspaceId = parentData.workspaces?.activeId || 'personal';
	const activeOrg = parentData.workspaces?.activeOrg;

	const roleInContext = parentData.effectiveRole || user.role;

	// Role-specific statistics
	if (roleInContext === 'user' || roleInContext === 'learner') {
		// Handle both aliases
		// Get user's enrollment stats
		const activeEnrollments = await db
			.select()
			.from(schema.enrollment)
			.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.status, 'active')));

		const pendingEnrollments = await db
			.select()
			.from(schema.enrollment)
			.where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.status, 'pending')));

		const certificates = await db
			.select()
			.from(schema.certificate)
			.where(eq(schema.certificate.userId, user.id));

		// Calculate progress and streaks
		let completedLessons = 0;
		let totalLessons = 0;
		let dailyCompletedCount = 0;
		let weeklyCompletedCount = 0;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const sevenDaysAgo = new Date(today);
		sevenDaysAgo.setDate(today.getDate() - 7);

		const enrolledCourses = [];
		for (const enrollment of activeEnrollments) {
			const course = await db.query.course.findFirst({
				where: eq(schema.course.id, enrollment.courseId)
			});

			if (course) {
				const modules = (await db.query.module.findMany({
					where: eq(schema.module.courseId, course.id),
					orderBy: (m: any, { asc }: any) => [asc(m.order)],
					with: {
						lessons: {
							orderBy: (l: any, { asc }: any) => [asc(l.order)]
						}
					}
				})) as Array<{ id: string; order: number | null; lessons: Array<{ id: string }> }>;

				const allCourseLessons = modules.flatMap((m) => m.lessons);
				totalLessons += allCourseLessons.length;

				const courseProgress = await db
					.select()
					.from(schema.lessonProgress)
					.where(
						and(
							eq(schema.lessonProgress.userId, user.id),
							eq(schema.lessonProgress.courseId, course.id)
						)
					);

				completedLessons += courseProgress.length;

				// Calculate daily/weekly from progress timestamps
				for (const p of courseProgress) {
					if (p.completedAt) {
						const compDate = new Date(p.completedAt);
						if (compDate >= today) dailyCompletedCount++;
						if (compDate >= sevenDaysAgo) weeklyCompletedCount++;
					}
				}

				// Find current unit (module)
				const completedLessonIds = new Set(courseProgress.map((p) => p.lessonId));
				let currentUnitOrder = 1;
				for (const mod of modules) {
					const hasIncomplete = mod.lessons.some((l) => !completedLessonIds.has(l.id));
					if (hasIncomplete) {
						currentUnitOrder = mod.order || 1;
						break;
					}
				}

				enrolledCourses.push({
					...course,
					progress:
						allCourseLessons.length > 0
							? Math.round((courseProgress.length / allCourseLessons.length) * 100)
							: 0,
					currentUnit: currentUnitOrder
				});
			}
		}

		const avgProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

		// Get real streak from userTracker
		const tracker = await db
			.select()
			.from(schema.userTracker)
			.where(eq(schema.userTracker.userId, user.id))
			.limit(1);
		const streak = tracker[0]?.currentStreak ?? 0;

		return {
			stats: {
				myCourses: activeEnrollments.length,
				progress: avgProgress,
				completedLessons,
				totalLessons,
				dailyProgress: Math.min(Math.round((dailyCompletedCount / 1) * 100), 100), // Target 1 lesson/day
				dailyRemaining: Math.max(1 - dailyCompletedCount, 0),
				weeklyProgress: Math.min(Math.round((weeklyCompletedCount / 5) * 100), 100), // Target 5 lessons/week
				streak,
				certificates: certificates.length,
				pendingPayments: pendingEnrollments.length
			},
			courses: enrolledCourses,
			activityGraph: await buildActivityGraph(user.id),
			user: user,
			workspace: { id: activeWorkspaceId, org: activeOrg }
		};
	} else if (roleInContext === 'admin') {
		// Get platform-wide stats for admin
		const allUsers = await db.select().from(schema.user);
		const allCourses = await db.select().from(schema.course);
		const allEnrollments = await db.select().from(schema.enrollment);
		const allCohorts = await db.select().from(schema.cohort);

		// Count users by role
		const userCounts = {
			total: allUsers.length,
			admin: allUsers.filter((u) => u.role === 'admin').length,
			mentor: allUsers.filter((u) => u.role === 'mentor').length,
			user: allUsers.filter((u) => u.role === 'user').length
		};

		// Count active enrollments
		const activeEnrollments = allEnrollments.filter((e) => e.status === 'active').length;
		const pendingEnrollments = allEnrollments.filter((e) => e.status === 'pending').length;

		// Count courses by status
		const courseCounts = {
			total: allCourses.length,
			published: allCourses.filter((c) => c.status === 'published').length,
			draft: allCourses.filter((c) => c.status === 'draft').length
		};

		// Count cohorts by status
		const cohortCounts = {
			total: allCohorts.length,
			active: allCohorts.filter((c) => c.status === 'active').length
		};

		// Get pending mentor applications
		const pendingApplications = await db
			.select()
			.from(schema.mentorApplication)
			.where(eq(schema.mentorApplication.status, 'pending'));

		// Count global tracks from enrollments
		const trackCounts = { creator: 0, seller: 0, affiliate: 0, student: userCounts.user };
		for (const enrollment of allEnrollments) {
			if (enrollment.status === 'active') {
				if (enrollment.track === 'creator') trackCounts.creator++;
				else if (enrollment.track === 'seller') trackCounts.seller++;
				else if (enrollment.track === 'affiliate') trackCounts.affiliate++;
			}
		}

		return {
			stats: {
				totalUsers: userCounts.total,
				totalMentors: userCounts.mentor,
				totalStudents: userCounts.user,
				activeEnrollments,
				pendingPayments: pendingEnrollments,
				totalCourses: courseCounts.total,
				publishedCourses: courseCounts.published,
				activeCohorts: cohortCounts.active,
				pendingApplications: pendingApplications.length,
				trackCounts
			},
			pendingApplicationsList: pendingApplications.slice(0, 10),
			activityGraph: await buildActivityGraph(user.id),
			user: user,
			workspace: { id: activeWorkspaceId, org: activeOrg }
		};
	} else if (roleInContext === 'mentor' || roleInContext === 'facilitator') {
		// Get mentor's courses filtered by workspace
		let mentorCoursesQuery = db
			.select()
			.from(schema.course)
			.where(eq(schema.course.mentorId, user.id));

		if (activeWorkspaceId !== 'personal') {
			mentorCoursesQuery = db
				.select()
				.from(schema.course)
				.where(
					and(eq(schema.course.orgId, activeWorkspaceId), eq(schema.course.mentorId, user.id))
				);
		}

		const mentorCourses = await mentorCoursesQuery;

		// Get total students across mentor's courses
		const courseIds = mentorCourses.map((c) => c.id);
		let totalStudents = 0;
		let trackCounts = { creator: 0, seller: 0, affiliate: 0, unassigned: 0 };

		if (courseIds.length > 0) {
			for (const courseId of courseIds) {
				const students = await db
					.select()
					.from(schema.enrollment)
					.where(
						and(eq(schema.enrollment.courseId, courseId), eq(schema.enrollment.status, 'active'))
					);
				totalStudents += students.length;

				// Count tracks
				for (const s of students) {
					if (s.track === 'creator') trackCounts.creator++;
					else if (s.track === 'seller') trackCounts.seller++;
					else if (s.track === 'affiliate') trackCounts.affiliate++;
					else trackCounts.unassigned++;
				}
			}
		}

		// Get pending submissions and average scores
		let pendingSubmissions = 0;
		let totalActionSubmissions = 0;
		let totalApproved = 0;
		let totalScore = 0;
		let gradedCount = 0;

		if (courseIds.length > 0) {
			for (const courseId of courseIds) {
				const submissions = await db
					.select()
					.from(schema.submission)
					.where(
						and(eq(schema.submission.courseId, courseId), eq(schema.submission.type, 'assignment'))
					);

				totalActionSubmissions += submissions.length;

				for (const submission of submissions) {
					const grade = await db
						.select()
						.from(schema.submissionGrade)
						.where(eq(schema.submissionGrade.submissionId, submission.id))
						.limit(1);

					if (grade.length === 0) {
						pendingSubmissions++;
					} else {
						gradedCount++;
						totalScore += grade[0].score;
						if (grade[0].score >= 70) totalApproved++;
					}
				}
			}
		}

		// Calculate performance metrics
		const approvalRate = gradedCount > 0 ? Math.round((totalApproved / gradedCount) * 100) : 0;
		const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0;

		// Get Mid-Term Review Candidates (Week 6)
		let midTermReviews = 0;
		if (courseIds.length > 0) {
			const activeEnrollmentsByMentor = await db
				.select()
				.from(schema.enrollment)
				.where(
					and(
						inArray(schema.enrollment.courseId, courseIds),
						eq(schema.enrollment.status, 'active')
					)
				);

			for (const enrollment of activeEnrollmentsByMentor) {
				const diffDays = Math.floor(
					(new Date().getTime() - new Date(enrollment.enrolledAt).getTime()) / (1000 * 60 * 60 * 24)
				);
				const weekNumber = Math.ceil(diffDays / 7);
				if (weekNumber === 6) {
					midTermReviews++;
				}
			}
		}

		// Get active cohorts filtered by workspace if in org
		let cohortsQuery = db.select().from(schema.cohort).where(eq(schema.cohort.status, 'active'));

		const cohorts = await cohortsQuery;

		return {
			stats: {
				myCourses: mentorCourses.length,
				totalStudents: totalStudents,
				pendingSubmissions: pendingSubmissions,
				totalActionSubmissions: totalActionSubmissions,
				midTermReviews: midTermReviews,
				trackCounts: trackCounts,
				activeCohorts: cohorts.length,
				approvalRate,
				avgScore
			},
			activityGraph: await buildActivityGraph(user.id),
			user: user,
			workspace: { id: activeWorkspaceId, org: activeOrg }
		};
	}

	// Default empty stats
	return {
		stats: {
			myCourses: 0,
			progress: 0,
			certificates: 0,
			pendingPayments: 0
		},
		user: user,
		workspace: { id: activeWorkspaceId, org: activeOrg }
	};
};
