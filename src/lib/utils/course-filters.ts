/**
 * Utility functions for filtering courses
 */

export interface Course {
	id: string;
	title: string;
	description?: string;
	status: string;
	price: number;
	duration?: number | null;
	createdAt: Date | string;
}

/**
 * Check if a course matches the search query
 */
export function matchesCourseSearch(course: Course, query: string): boolean {
	if (!query) return true;
	const lowerQuery = query.toLowerCase();
	return (
		course.title.toLowerCase().includes(lowerQuery) ||
		(course.description?.toLowerCase().includes(lowerQuery) ?? false)
	);
}

/**
 * Check if a course matches the status filter
 */
export function matchesCourseStatus(course: Course, filter: string): boolean {
	return !filter || filter === 'all' || course.status === filter;
}

/**
 * Filter courses based on search query and status
 */
export function filterCourses<T extends Course>(
	courses: T[],
	searchQuery: string,
	statusFilter: string
): T[] {
	return courses.filter(
		(course) =>
			matchesCourseSearch(course, searchQuery) && matchesCourseStatus(course, statusFilter)
	);
}

/**
 * Count courses by status
 */
export function countCoursesByStatus<T extends { status: string }>(
	courses: T[],
	statuses: string[]
): Record<string, number> {
	const counts: Record<string, number> = {
		all: courses.length,
		...Object.fromEntries(statuses.map((status) => [status, 0]))
	};

	courses.forEach((course) => {
		if (course.status in counts) {
			counts[course.status]++;
		}
	});

	return counts;
}
