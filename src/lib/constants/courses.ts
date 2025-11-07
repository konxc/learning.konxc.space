/**
 * Constants for Course Management
 */

export type CourseStatus = 'draft' | 'published';

export const COURSE_STATUSES: CourseStatus[] = ['draft', 'published'];

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
	draft: 'Draft',
	published: 'Published'
};

