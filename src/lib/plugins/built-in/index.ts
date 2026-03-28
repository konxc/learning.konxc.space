/**
 * Built-in LMS Plugins
 * 
 * These are the core plugins that come with the Naik Kelas LMS.
 * Each plugin wraps an existing feature module.
 */

import type { LMSPlugin } from '../types';

// 1. Discussion Plugin
export const discussionPlugin: LMSPlugin = {
	id: 'discussion',
	name: 'Course Discussions',
	version: '1.0.0',
	type: 'social',
	description: 'Enable forum-style discussions for each course. Students and mentors can post questions, answers, and engage in conversations.',
	icon: '💬',
	defaultConfig: {
		allowStudentPosts: true,
		allowReplies: true,
		moderationEnabled: false,
		maxPostLength: 5000
	},
	courseTabs: [{
		id: 'discussions',
		label: 'Discussions',
		icon: '💬',
		order: 10,
		requiresAuth: true,
		requiresEnrollment: true
	}]
};

// 2. Quiz Plugin
export const quizPlugin: LMSPlugin = {
	id: 'quiz',
	name: 'Quizzes & Assessments',
	version: '1.0.0',
	type: 'assessment',
	description: 'Interactive quizzes with multiple-choice questions attached to lessons. Auto-grading and score tracking.',
	icon: '📝',
	defaultConfig: {
		showCorrectAnswers: true,
		allowRetakes: true,
		maxAttempts: 3,
		timeLimitMinutes: 0 // 0 = no limit
	},
	dependencies: [],
	courseTabs: [],
	learningTabs: [{
		id: 'quiz',
		label: 'Quiz',
		icon: '📝',
		order: 5,
		requiresAuth: true,
		requiresEnrollment: true
	}]
};

// 3. Submission Plugin
export const submissionPlugin: LMSPlugin = {
	id: 'submission',
	name: 'Action Submissions',
	version: '1.0.0',
	type: 'assessment',
	description: 'Students can submit action tasks (URLs, files, text) for mentor review and grading.',
	icon: '📤',
	defaultConfig: {
		allowUrlSubmission: true,
		allowFileSubmission: false,
		requireApproval: true,
		maxFileSizeMB: 10
	},
	courseTabs: [{
		id: 'submissions',
		label: 'Submissions',
		icon: '📤',
		order: 15,
		requiresAuth: true,
		requiresEnrollment: true
	}]
};

// 4. Gamification Plugin
export const gamificationPlugin: LMSPlugin = {
	id: 'gamification',
	name: 'Gamification & XP',
	version: '1.0.0',
	type: 'gamification',
	description: 'Points, levels, badges, and leaderboards to motivate learners. Track progress and reward achievements.',
	icon: '🏆',
	defaultConfig: {
		enableXP: true,
		enableBadges: true,
		enableLeaderboard: true,
		xpPerLesson: 10,
		xpPerQuiz: 25,
		xpPerCourse: 100
	},
	courseTabs: [{
		id: 'leaderboard',
		label: 'Leaderboard',
		icon: '🏆',
		order: 20,
		requiresAuth: true
	}]
};

// 5. Notes Plugin
export const notesPlugin: LMSPlugin = {
	id: 'notes',
	name: 'Lesson Notes',
	version: '1.0.0',
	type: 'content',
	description: 'Personal note-taking for each lesson. Notes are saved per user per lesson and synced across devices.',
	icon: '📝',
	defaultConfig: {
		enableCloudSync: true,
		autoSave: true,
		autoSaveDelayMs: 1000,
		maxNoteLength: 50000
	},
	learningTabs: [{
		id: 'notes',
		label: 'Notes',
		icon: '📝',
		order: 10,
		requiresAuth: true,
		requiresEnrollment: true
	}]
};

// 6. Certificate Plugin
export const certificatePlugin: LMSPlugin = {
	id: 'certificate',
	name: 'Certificates',
	version: '1.0.0',
	type: 'content',
	description: 'Auto-generate certificates upon course completion. Includes verification URL and student name.',
	icon: '🎓',
	defaultConfig: {
		template: 'default',
		includeCompletionDate: true,
		includeGrade: true,
		verifyUrl: true
	},
	courseTabs: [{
		id: 'certificate',
		label: 'Certificate',
		icon: '🎓',
		order: 25,
		requiresAuth: true,
		requiresEnrollment: true
	}]
};

// 7. Analytics Plugin
export const analyticsPlugin: LMSPlugin = {
	id: 'analytics',
	name: 'Performance Analytics',
	version: '1.0.0',
	type: 'analytics',
	description: 'Track student progress, completion rates, quiz scores, and time spent. Insights for both students and mentors.',
	icon: '📊',
	defaultConfig: {
		trackTimeSpent: true,
		trackQuizScores: true,
		showProgressChart: true,
		showComparisons: false
	},
	courseTabs: [{
		id: 'analytics',
		label: 'Analytics',
		icon: '📊',
		order: 30,
		requiresAuth: true
	}]
};

// 8. Affiliate Plugin
export const affiliatePlugin: LMSPlugin = {
	id: 'affiliate',
	name: 'Affiliate System',
	version: '1.0.0',
	type: 'content',
	description: 'Track affiliate links and sales. Students can earn commissions by promoting courses.',
	icon: '💰',
	defaultConfig: {
		enabled: false, // Disabled by default - opt-in per course
		defaultCommissionRate: 20,
		minimumPayout: 100000,
		trackCookies: true
	},
	courseTabs: [{
		id: 'affiliate',
		label: 'Affiliate',
		icon: '💰',
		order: 35,
		requiresAuth: true
	}]
};

// Export all built-in plugins
export const builtInPlugins: LMSPlugin[] = [
	discussionPlugin,
	quizPlugin,
	submissionPlugin,
	gamificationPlugin,
	notesPlugin,
	certificatePlugin,
	analyticsPlugin,
	affiliatePlugin
];

// Helper to register all built-in plugins
export function registerBuiltInPlugins(): void {
	const { PluginRegistry } = require('../registry');
	
	for (const plugin of builtInPlugins) {
		PluginRegistry.register(plugin);
	}
}
