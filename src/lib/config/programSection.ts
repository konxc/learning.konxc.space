/**
 * Configuration untuk Program Section
 */

export const PROGRAM_BACKGROUND_GRADIENT = `
	background:
		linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.1) 5%,
			rgba(255, 255, 255, 0.3) 15%,
			rgba(255, 255, 255, 0.5) 30%,
			rgba(255, 255, 255, 0.7) 50%,
			rgba(102, 126, 234, 0.1) 75%,
			rgba(102, 126, 234, 0.4) 90%,
			var(--color-gradient-purple-start) 100%
		),
		linear-gradient(to bottom, #ffffff 0%, var(--color-bg-lighter) 100%);
` as const;

