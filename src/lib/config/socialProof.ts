/**
 * Social Proof Data
 * 
 * Metrics, statistics, dan partner information untuk Social Proof Section.
 */

export interface SocialProofMetric {
	label: string;
	value: string | number;
	icon?: string;
	suffix?: string;
}

export interface Partner {
	name: string;
	logo?: string;
	url?: string;
}

export interface MediaMention {
	source: string;
	logo?: string;
	url?: string;
	date?: string;
}

export const SOCIAL_PROOF_METRICS: SocialProofMetric[] = [
	{
		label: 'Total Students',
		value: '500+',
		icon: '👥',
		suffix: 'students'
	},
	{
		label: 'Success Rate',
		value: '85%',
		icon: '🎯',
		suffix: 'graduation rate'
	},
	{
		label: 'Alumni',
		value: '400+',
		icon: '🎓',
		suffix: 'alumni'
	},
	{
		label: 'Job Placement',
		value: '70%',
		icon: '💼',
		suffix: 'got jobs'
	}
];

export const PARTNERS: Partner[] = [
	{
		name: 'PT Koneksi Jaringan Indonesia',
		url: 'https://koneksi.id'
	},
	{
		name: 'Yayasan Klub Fisika',
		url: 'https://klubfisika.org'
	}
	// Add more partners as needed
];

export const MEDIA_MENTIONS: MediaMention[] = [
	// Add media mentions as needed
	// {
	// 	source: 'TechCrunch',
	// 	url: 'https://example.com',
	// 	date: '2025-01-15'
	// }
];

