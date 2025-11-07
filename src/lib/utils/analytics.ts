/**
 * Analytics Tracking Utilities
 * 
 * Centralized analytics tracking untuk events, conversions, dan user behavior.
 * Support untuk multiple analytics providers (Google Analytics, Plausible, dll).
 */

import { browser } from '$app/environment';

/**
 * Analytics Event Types
 */
export type AnalyticsEventType =
	| 'page_view'
	| 'cta_click'
	| 'section_view'
	| 'domain_change'
	| 'form_submit'
	| 'form_start'
	| 'scroll_depth'
	| 'video_play'
	| 'download'
	| 'search'
	| 'faq_open'
	| 'testimonial_view'
	| 'social_share';

/**
 * Analytics Event Interface
 */
export interface AnalyticsEvent {
	type: AnalyticsEventType;
	category?: string;
	action?: string;
	label?: string;
	value?: number;
	[key: string]: any; // Allow custom properties
}

/**
 * Scroll Depth Levels
 */
export const SCROLL_DEPTH_LEVELS = [25, 50, 75, 90, 100] as const;

/**
 * Tracked scroll depths untuk prevent duplicate tracking
 */
let trackedScrollDepths = new Set<number>();

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
	if (!browser) return false;
	// Check if analytics script is loaded (Google Analytics, Plausible, etc.)
	return (
		typeof window.gtag !== 'undefined' ||
		typeof window.plausible !== 'undefined' ||
		typeof window.dataLayer !== 'undefined'
	);
}

/**
 * Track event - Universal function untuk semua analytics providers
 */
export function trackEvent(event: AnalyticsEvent): void {
	if (!browser || !isAnalyticsEnabled()) {
		// Fallback: log to console in development
		if (import.meta.env.DEV) {
			console.log('[Analytics]', event);
		}
		return;
	}

	// Google Analytics 4
	if (typeof window.gtag !== 'undefined') {
		window.gtag('event', event.action || event.type, {
			event_category: event.category,
			event_label: event.label,
			value: event.value,
			...event
		});
	}

	// Plausible Analytics
	if (typeof window.plausible !== 'undefined') {
		window.plausible(event.type, {
			props: {
				category: event.category,
				action: event.action,
				label: event.label,
				value: event.value
			}
		});
	}

	// Generic dataLayer (for other providers)
	if (typeof window.dataLayer !== 'undefined') {
		window.dataLayer.push({
			event: event.type,
			...event
		});
	}
}

/**
 * Track page view
 */
export function trackPageView(page: string, title?: string): void {
	trackEvent({
		type: 'page_view',
		category: 'navigation',
		action: 'page_view',
		label: page,
		page_title: title,
		page_path: page
	});
}

/**
 * Track CTA click
 */
export function trackCTAClick(
	ctaLocation: string,
	ctaText: string,
	destination?: string
): void {
	trackEvent({
		type: 'cta_click',
		category: 'conversion',
		action: 'cta_click',
		label: ctaLocation,
		cta_text: ctaText,
		destination: destination
	});
}

/**
 * Track section view
 */
export function trackSectionView(sectionId: string, sectionName: string): void {
	trackEvent({
		type: 'section_view',
		category: 'engagement',
		action: 'section_view',
		label: sectionName,
		section_id: sectionId
	});
}

/**
 * Track domain/career change
 */
export function trackDomainChange(fromDomain: string, toDomain: string): void {
	trackEvent({
		type: 'domain_change',
		category: 'engagement',
		action: 'domain_change',
		label: `${fromDomain} → ${toDomain}`,
		from_domain: fromDomain,
		to_domain: toDomain
	});
}

/**
 * Track form interaction
 */
export function trackFormStart(formId: string, formName: string): void {
	trackEvent({
		type: 'form_start',
		category: 'conversion',
		action: 'form_start',
		label: formName,
		form_id: formId
	});
}

/**
 * Track form submission
 */
export function trackFormSubmit(formId: string, formName: string, success: boolean): void {
	trackEvent({
		type: 'form_submit',
		category: 'conversion',
		action: 'form_submit',
		label: formName,
		form_id: formId,
		success: success,
		value: success ? 1 : 0
	});
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number): void {
	if (trackedScrollDepths.has(depth)) return;

	// Only track specific depth levels
	if (SCROLL_DEPTH_LEVELS.includes(depth as any)) {
		trackedScrollDepth(depth);
		trackedScrollDepths.add(depth);
	}
}

/**
 * Internal function untuk track scroll depth
 */
function trackedScrollDepth(depth: number): void {
	trackEvent({
		type: 'scroll_depth',
		category: 'engagement',
		action: 'scroll',
		label: `${depth}%`,
		value: depth
	});
}

/**
 * Track FAQ open
 */
export function trackFAQOpen(faqId: string, question: string): void {
	trackEvent({
		type: 'faq_open',
		category: 'engagement',
		action: 'faq_open',
		label: question,
		faq_id: faqId
	});
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount: number): void {
	trackEvent({
		type: 'search',
		category: 'engagement',
		action: 'search',
		label: query,
		value: resultsCount
	});
}

/**
 * Track social share
 */
export function trackSocialShare(platform: string, url: string): void {
	trackEvent({
		type: 'social_share',
		category: 'engagement',
		action: 'share',
		label: platform,
		share_url: url
	});
}

/**
 * Initialize scroll depth tracking
 */
export function initScrollDepthTracking(): () => void {
	if (!browser) return () => {};

	let maxScrollDepth = 0;

	const handleScroll = () => {
		const scrollY = window.scrollY || window.pageYOffset;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollableHeight = documentHeight - windowHeight;

		if (scrollableHeight > 0) {
			const currentDepth = Math.round((scrollY / scrollableHeight) * 100);
			if (currentDepth > maxScrollDepth) {
				maxScrollDepth = currentDepth;
				trackScrollDepth(currentDepth);
			}
		}
	};

	window.addEventListener('scroll', handleScroll, { passive: true });
	return () => {
		window.removeEventListener('scroll', handleScroll);
	};
}

/**
 * Reset scroll depth tracking (untuk page navigation)
 */
export function resetScrollDepthTracking(): void {
	trackedScrollDepths.clear();
}

/**
 * Track video play
 */
export function trackVideoPlay(videoId: string, videoTitle: string): void {
	trackEvent({
		type: 'video_play',
		category: 'engagement',
		action: 'video_play',
		label: videoTitle,
		video_id: videoId
	});
}

/**
 * Track download
 */
export function trackDownload(fileName: string, fileType: string): void {
	trackEvent({
		type: 'download',
		category: 'engagement',
		action: 'download',
		label: fileName,
		file_type: fileType
	});
}

// Type declarations untuk window object
declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
		dataLayer?: any[];
	}
}

