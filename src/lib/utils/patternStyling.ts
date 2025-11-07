/**
 * Pattern Styling Utilities
 * 
 * Helper functions untuk generate pattern styling
 */

import { getPatternCSS, getPatternSize, type CTAPatternType } from '$lib/types/ctaPatterns';

/**
 * Generate pattern background style string
 */
export function getPatternBackgroundStyle(
	pattern: CTAPatternType,
	intensity: number
): string {
	if (pattern === 'none') {
		return 'background: none;';
	}

	const patternCSS = getPatternCSS(pattern, intensity, getPatternSize(pattern));
	const patternSize = getPatternSize(pattern);

	return `background: ${patternCSS}; background-size: ${patternSize}px ${patternSize}px;`;
}

/**
 * Get pattern overlay class name
 */
export function getPatternOverlayClass(pattern: CTAPatternType): string {
	return pattern === 'matrix-rain' ? 'cta-pattern-overlay matrix-rain' : 'cta-pattern-overlay';
}

/**
 * Check if pattern needs special handling (like matrix-rain)
 */
export function isSpecialPattern(pattern: CTAPatternType): boolean {
	return pattern === 'matrix-rain';
}

