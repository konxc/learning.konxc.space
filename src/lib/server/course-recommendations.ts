import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, notInArray, sql } from 'drizzle-orm';

// Interest to category mapping for matching
const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
	creator: ['content-creator', 'video', 'design'],
	seller: ['ecommerce', 'marketplace', 'jualan'],
	affiliate: ['affiliate', 'marketing', 'penjualan'],
	developer: ['programming', 'web', 'app'],
	marketing: ['digital-marketing', 'social-media', 'seo']
};

/**
 * Get course recommendations based on user preferences
 */
export async function getRecommendedCourses(
	userId: string,
	limit: number = 6
): Promise<
	Array<{
		id: string;
		title: string;
		description: string | null;
		thumbnailUrl: string | null;
		price: number;
		category: string | null;
		reason: string;
	}>
> {
	// Get user preferences
	const preferences = await db.query.userPreferences.findFirst({
		where: eq(schema.userPreferences.userId, userId)
	});

	// Get already enrolled course IDs
	const enrollments = await db
		.select({ courseId: schema.enrollment.courseId })
		.from(schema.enrollment)
		.where(eq(schema.enrollment.userId, userId));

	const enrolledCourseIds = enrollments.map((e) => e.courseId);

	// Get all available courses not yet enrolled
	let availableCourses = await db
		.select({
			id: schema.course.id,
			title: schema.course.title,
			description: schema.course.description,
			thumbnailUrl: schema.course.thumbnailUrl,
			price: schema.course.price,
			category: schema.course.category
		})
		.from(schema.course)
		.where(
			and(
				eq(schema.course.status, 'published'),
				enrolledCourseIds.length > 0 ? notInArray(schema.course.id, enrolledCourseIds) : sql`1 = 1`
			)
		)
		.limit(limit * 2); // Get more to filter

	// If no preferences, return popular courses
	if (!preferences) {
		return availableCourses.slice(0, limit).map((course) => ({
			...course,
			reason: 'Popular course'
		}));
	}

	// Parse user interests and goals
	const userInterests: string[] = JSON.parse(preferences.interests || '[]');
	const userGoals: string[] = JSON.parse(preferences.goals || '[]');

	// Score courses based on matching
	const scoredCourses = availableCourses.map((course) => {
		let score = 0;
		let reason = '';

		// Match by category
		if (course.category) {
			for (const interest of userInterests) {
				const mappedCategories = INTEREST_CATEGORY_MAP[interest] || [];
				if (mappedCategories.includes(course.category)) {
					score += 10;
					reason = `Matches your interest in ${interest}`;
				}
			}
		}

		// Match by title/description keywords
		const searchText = `${course.title} ${course.description || ''}`.toLowerCase();
		for (const interest of userInterests) {
			if (searchText.includes(interest)) {
				score += 5;
				if (!reason) reason = `Related to ${interest}`;
			}
		}

		// Prefer free courses for beginners
		if (preferences.experienceLevel === 'beginner' && course.price === 0) {
			score += 3;
			if (!reason) reason = 'Free course for beginners';
		}

		// Prefer paid courses for advanced users
		if (preferences.experienceLevel === 'advanced' && course.price > 0) {
			score += 2;
			if (!reason) reason = 'Advanced course';
		}

		return {
			...course,
			score,
			reason: reason || 'Recommended for you'
		};
	});

	// Sort by score and return top results
	return scoredCourses
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ score, ...course }) => course);
}

/**
 * Get course recommendations for dashboard display
 */
export async function getDashboardRecommendations(userId: string) {
	const recommendations = await getRecommendedCourses(userId, 4);

	if (recommendations.length === 0) {
		return {
			hasRecommendations: false,
			courses: []
		};
	}

	return {
		hasRecommendations: true,
		courses: recommendations
	};
}
