/**
 * Background Pattern Types untuk CTA Section
 */

export type CTAPatternType =
	| 'diagonal-stripes' // Current default
	| 'hexagonal-grid'
	| 'code-brackets'
	| 'dot-matrix'
	| 'wave-flow'
	| 'mesh-gradient'
	| 'circuit-board'
	| 'matrix-rain' // Matrix rain effect (cmatrix style)
	| 'none'; // No pattern

export interface PatternConfig {
	type: CTAPatternType;
	intensity?: number; // 0-1 untuk opacity
	size?: number; // Size pattern
}

/**
 * Generate CSS background pattern berdasarkan type
 */
export function getPatternCSS(
	pattern: CTAPatternType,
	intensity = 0.03,
	size = 20
): string {
	const opacity = intensity;
	const color = `rgba(255, 255, 255, ${opacity})`;

	switch (pattern) {
		case 'diagonal-stripes':
			return `repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${size / 2}px,
        ${color} ${size / 2}px,
        ${color} ${size}px
      )`;

		case 'hexagonal-grid':
			return `
        repeating-linear-gradient(
          30deg,
          transparent,
          transparent ${size}px,
          ${color} ${size}px,
          ${color} ${size + 2}px
        ),
        repeating-linear-gradient(
          -30deg,
          transparent,
          transparent ${size}px,
          ${color} ${size}px,
          ${color} ${size + 2}px
        )
      `;

		case 'code-brackets':
			return `
        radial-gradient(circle at 15% 25%, ${color} 1px, transparent 1px),
        radial-gradient(circle at 85% 75%, ${color} 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, ${color} 0.5px, transparent 1px)
      `;

		case 'dot-matrix':
			return `radial-gradient(circle, ${color} 1px, transparent 1px)`;

		case 'wave-flow':
			return `
        radial-gradient(ellipse at 0% 0%, ${color} 0%, transparent 50%),
        radial-gradient(ellipse at 100% 100%, ${color} 0%, transparent 50%)
      `;

		case 'mesh-gradient':
			return `
        radial-gradient(at 0% 0%, ${color} 0%, transparent 50%),
        radial-gradient(at 100% 100%, ${color} 0%, transparent 50%),
        radial-gradient(at 50% 50%, ${color} 0%, transparent 70%)
      `;

		case 'circuit-board':
			return `
        linear-gradient(90deg, transparent 0%, ${color} 1px, transparent 1px),
        linear-gradient(0deg, transparent 0%, ${color} 1px, transparent 1px)
      `;

		case 'matrix-rain':
			// Matrix rain menggunakan CSS animation, return base untuk styling
			return `linear-gradient(
        to bottom,
        transparent 0%,
        ${color} 1px,
        transparent 1px
      )`;

		case 'none':
		default:
			return 'none';
	}
}

/**
 * Get default size untuk setiap pattern type
 */
export function getPatternSize(pattern: CTAPatternType): number {
	switch (pattern) {
		case 'dot-matrix':
			return 30;
		case 'code-brackets':
			return 200;
		case 'hexagonal-grid':
			return 50;
		case 'wave-flow':
			return 400;
		case 'mesh-gradient':
			return 600;
		case 'circuit-board':
			return 40;
		case 'matrix-rain':
			return 20; // Column width untuk matrix rain
		default:
			return 20;
	}
}

