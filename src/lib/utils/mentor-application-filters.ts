/**
 * Utility functions for filtering mentor applications
 */

export interface MentorApplication {
	id: string;
	fullName: string;
	email: string;
	expertise: string;
	yearsExperience: number;
	status: string;
	createdAt: Date | string;
	user?: {
		username: string;
		role: string;
	};
}

/**
 * Check if a mentor application matches the search query
 */
export function matchesMentorApplicationSearch(
	application: MentorApplication,
	query: string
): boolean {
	if (!query) return true;
	const lowerQuery = query.toLowerCase();
	return (
		application.fullName.toLowerCase().includes(lowerQuery) ||
		application.email.toLowerCase().includes(lowerQuery) ||
		application.expertise.toLowerCase().includes(lowerQuery) ||
		(application.user?.username.toLowerCase().includes(lowerQuery) ?? false)
	);
}

/**
 * Check if a mentor application matches the status filter
 */
export function matchesMentorApplicationStatus(
	application: MentorApplication,
	filter: string
): boolean {
	return !filter || filter === 'all' || application.status === filter;
}

/**
 * Filter mentor applications based on search query and status filter
 */
export function filterMentorApplications<T extends MentorApplication>(
	applications: T[],
	searchQuery: string,
	statusFilter: string
): T[] {
	return applications.filter(
		(app) =>
			matchesMentorApplicationSearch(app, searchQuery) &&
			matchesMentorApplicationStatus(app, statusFilter)
	);
}

/**
 * Count mentor applications by status
 */
export function countMentorApplicationsByStatus<T extends { status: string }>(
	applications: T[],
	statuses: readonly string[]
): Record<string, number> {
	const counts: Record<string, number> = {
		all: applications.length,
		...Object.fromEntries(statuses.map((status) => [status, 0]))
	};

	applications.forEach((app) => {
		if (app.status in counts) {
			counts[app.status]++;
		}
	});

	return counts;
}

