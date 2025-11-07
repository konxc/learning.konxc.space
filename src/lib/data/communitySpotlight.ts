import type { CareerOption } from '$lib/stores/career';

export type SpotlightStatus = 'published' | 'coming-soon';

export interface CommunitySpotlightEntry {
	id: string;
	name: string;
	domain: CareerOption;
	role: string;
	story: string;
	highlight: string;
	socialLinks: { label: string; url: string }[];
	status: SpotlightStatus;
}

export const communitySpotlight: CommunitySpotlightEntry[] = [
	{
		id: 'placeholder-1',
		name: 'Alumni Cohort 2025',
		domain: 'Developer',
		role: 'Full Stack Developer',
		story:
			'Profil lengkap akan dirilis setelah peserta menyelesaikan sertifikasi dan kampanye komunitas.',
		highlight: 'Sedang dalam proses kurasi.',
		socialLinks: [],
		status: 'coming-soon'
	},
	{
		id: 'placeholder-2',
		name: 'Community Lab Project',
		domain: 'UI/UX Design',
		role: 'Design Lead',
		story:
			'Data project dan dokumentasi akan ditambahkan bersamaan dengan rilis resmi studio komunitas.',
		highlight: 'Menunggu publikasi resmi.',
		socialLinks: [],
		status: 'coming-soon'
	}
];
