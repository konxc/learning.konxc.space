/**
 * Headline Variants Data
 * 
 * Variasi headline untuk berbagai bidang pembelajaran di Hero Section.
 * Digunakan untuk rotating headlines dan descriptions.
 * 
 * Data ini diambil dari contentConfig untuk konsistensi.
 */

import { DOMAIN_CONTENT } from '$lib/config/contentConfig';

export interface HeadlineVariant {
    headline: string;
    headlinePart2: string;
    description: string;
}

/**
 * Generate headline variants dari domain content configuration
 * Ini memastikan konsistensi antara hero content dan rotating text
 */
export const headlineVariants: HeadlineVariant[] = Object.values(DOMAIN_CONTENT).map((content) => ({
    headline: content.hero.headline,
    headlinePart2: content.hero.headlinePart2,
    description: content.hero.description
}));

