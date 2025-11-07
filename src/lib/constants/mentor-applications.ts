/**
 * Mentor Application Status Types
 */

export const MENTOR_APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type MentorApplicationStatus = typeof MENTOR_APPLICATION_STATUSES[number];
export type MentorApplicationFilterType = 'all' | MentorApplicationStatus;

export const MENTOR_APPLICATION_STATUS_LABELS: Record<
	'all' | MentorApplicationStatus,
	string
> = {
	all: 'All',
	pending: 'Pending',
	approved: 'Approved',
	rejected: 'Rejected'
};

