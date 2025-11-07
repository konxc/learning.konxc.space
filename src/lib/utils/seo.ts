/**
 * SEO Utility Functions
 * 
 * Helper functions untuk generate dynamic meta tags dan structured data
 * berdasarkan domain selection.
 */

import type { CareerOption } from '$lib/stores/career';
import { DOMAIN_CONTENT } from '$lib/config/contentConfig';

/**
 * SEO Configuration per Domain
 */
export interface SEOConfig {
	title: string;
	description: string;
	keywords: string[];
	ogTitle: string;
	ogDescription: string;
	twitterTitle: string;
	twitterDescription: string;
}

/**
 * Default domain keywords mapping
 */
const DOMAIN_KEYWORDS: Record<CareerOption, string[]> = {
	Developer: [
		'pelatihan developer',
		'bootcamp coding',
		'belajar programming',
		'python',
		'web development',
		'javascript',
		'html css',
		'git',
		'terminal',
		'vscode',
		'koneksi'
	],
	Akademik: [
		'les akademik',
		'les IPA',
		'les matematika',
		'les IPS',
		'les bahasa indonesia',
		'les bahasa inggris',
		'bimbingan belajar',
		'tutoring',
		'naik kelas',
		'koneksi'
	],
	'Bisnis & UMKM': [
		'pelatihan bisnis',
		'pelatihan UMKM',
		'manajemen keuangan',
		'digital marketing',
		'strategi bisnis',
		'entrepreneurship',
		'startup',
		'koneksi'
	],
	'UI/UX Design': [
		'pelatihan UI/UX',
		'belajar design',
		'design thinking',
		'figma',
		'adobe xd',
		'creative skills',
		'portfolio design',
		'koneksi'
	],
	'Outdoor Adventure': [
		'pelatihan outdoor',
		'rafting',
		'climbing',
		'hiking',
		'survival skills',
		'adventure',
		'outdoor activities',
		'koneksi'
	]
};

/**
 * Generate SEO configuration untuk domain tertentu
 */
export function getSEOConfig(domain: CareerOption): SEOConfig {
	const content = DOMAIN_CONTENT[domain];
	const keywords = DOMAIN_KEYWORDS[domain];

	return {
		title: `Naik Kelas - ${domain === 'Developer' ? 'Pelatihan Developer' : `Pelatihan ${domain}`} by Koneksi`,
		description: content.hero.description,
		keywords,
		ogTitle: `Naik Kelas - ${domain === 'Developer' ? 'Pelatihan Developer' : `Pelatihan ${domain}`} by Koneksi`,
		ogDescription: content.hero.description,
		twitterTitle: `Naik Kelas - ${domain === 'Developer' ? 'Pelatihan Developer' : `Pelatihan ${domain}`} by Koneksi`,
		twitterDescription: content.hero.description
	};
}

/**
 * Generate default SEO config (untuk Developer domain)
 */
export function getDefaultSEOConfig(): SEOConfig {
	return getSEOConfig('Developer');
}

/**
 * Generate keywords string untuk meta tag
 */
export function getKeywordsString(keywords: string[]): string {
	return keywords.join(', ');
}

/**
 * Generate Course structured data untuk domain tertentu
 */
export function getCourseStructuredData(domain: CareerOption) {
	const content = DOMAIN_CONTENT[domain];
	const keywords = DOMAIN_KEYWORDS[domain];

	return {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: `Program Naik Kelas - ${domain}`,
		description: content.hero.description,
		provider: {
			'@type': 'EducationalOrganization',
			name: 'Naik Kelas by Koneksi',
			url: 'https://learning.konxc.space',
			logo: 'https://learning.konxc.space/apple-icon-180x180.png'
		},
		educationalCredentialAwarded: 'Certificate of Completion',
		timeRequired: 'P2M',
		keywords: keywords.join(', '),
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'IDR',
			availability: 'https://schema.org/PreOrder'
		},
		hasCourseInstance: {
			'@type': 'CourseInstance',
			courseMode: 'online',
			educationalLevel: 'Beginner'
		}
	};
}

/**
 * Generate AggregateRating structured data
 * (untuk testimonials section)
 */
export function getAggregateRatingStructuredData(
	ratingValue: number = 4.8,
	reviewCount: number = 150
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'AggregateRating',
		ratingValue,
		reviewCount,
		bestRating: 5,
		worstRating: 1
	};
}

/**
 * Generate FAQPage structured data
 * (akan diisi dengan actual FAQ data nanti)
 */
export function getFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
}

/**
 * Generate complete structured data untuk landing page
 */
export function getLandingPageStructuredData(domain: CareerOption = 'Developer') {
	const content = DOMAIN_CONTENT[domain];

	return {
		'@context': 'https://schema.org',
		'@type': 'EducationalOrganization',
		name: 'Naik Kelas by Koneksi',
		description: content.hero.description,
		url: 'https://learning.konxc.space',
		logo: 'https://learning.konxc.space/apple-icon-180x180.png',
		provider: {
			'@type': 'Organization',
			name: 'PT Koneksi Jaringan Indonesia',
			partner: {
				'@type': 'Organization',
				name: 'Yayasan Klub Fisika'
			}
		},
		educationalCredentialAwarded: 'Certificate of Completion',
		timeRequired: 'P2M',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'IDR',
			availability: 'https://schema.org/PreOrder'
		},
		hasCourse: getCourseStructuredData(domain)
	};
}

