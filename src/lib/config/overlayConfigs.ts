/**
 * Shared Overlay Configurations untuk semua Sections
 * 
 * Centralized configuration untuk AuroraOverlay dan GlowOrbs
 */

export interface GlowOrbConfig {
	size: number;
	x: string;
	y: string;
	color: string;
	blurPx?: number;
	opacity?: number;
	delaySec?: number;
	hideOnMobile?: boolean;
}

export interface AuroraConfig {
	intensity: number;
	blurPx: number;
	speedSec: number;
	insetPercent: number;
	zIndex: number;
}

export interface GlowOrbsConfig {
	hardcore: GlowOrbConfig[];
	chill: GlowOrbConfig[];
}

/**
 * Helper function untuk create glow orbs config
 */
export function createGlowOrbsConfig(
	orbs: Array<{
		size: number;
		x: string;
		y: string;
		hardcoreColor: string;
		chillColor: string;
		delaySec?: number;
		hideOnMobile?: boolean;
	}>
): GlowOrbsConfig {
	return {
		hardcore: orbs.map((orb) => ({
			size: orb.size,
			x: orb.x,
			y: orb.y,
			color: orb.hardcoreColor,
			delaySec: orb.delaySec,
			hideOnMobile: orb.hideOnMobile ?? true
		})),
		chill: orbs.map((orb) => ({
			size: orb.size,
			x: orb.x,
			y: orb.y,
			color: orb.chillColor,
			delaySec: orb.delaySec,
			hideOnMobile: orb.hideOnMobile ?? true
		}))
	};
}

/**
 * Hero Section Overlay Config
 */
export const HERO_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.06,
		blurPx: 70,
		speedSec: 24,
		insetPercent: 16,
		zIndex: 0
	} satisfies AuroraConfig,
	glowOrbs: createGlowOrbsConfig([
		{
			size: 320,
			x: '-100px',
			y: '85%',
			hardcoreColor: 'rgba(251, 146, 60, 0.28)',
			chillColor: 'rgba(20, 184, 166, 0.28)'
		},
		{
			size: 220,
			x: '90%',
			y: '-70px',
			hardcoreColor: 'rgba(59, 130, 246, 0.26)',
			chillColor: 'rgba(45, 212, 191, 0.26)',
			delaySec: 2.8
		},
		{
			size: 180,
			x: '12%',
			y: '18%',
			hardcoreColor: 'rgba(124, 58, 237, 0.22)',
			chillColor: 'rgba(20, 184, 166, 0.22)',
			delaySec: 4.5
		}
	])
};

/**
 * Benefits Section Overlay Config
 */
export const BENEFITS_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.05,
		blurPx: 55,
		speedSec: 23,
		insetPercent: 15,
		zIndex: 0
	} satisfies AuroraConfig,
	glowOrbs: createGlowOrbsConfig([
		{
			size: 280,
			x: '-80px',
			y: '-60px',
			hardcoreColor: 'rgba(251, 146, 60, 0.20)',
			chillColor: 'rgba(20, 184, 166, 0.20)'
		},
		{
			size: 360,
			x: 'calc(100% - 100px)',
			y: 'calc(100% - 120px)',
			hardcoreColor: 'rgba(59, 130, 246, 0.18)',
			chillColor: 'rgba(45, 212, 191, 0.18)',
			delaySec: 2
		},
		{
			size: 200,
			x: '10%',
			y: '80%',
			hardcoreColor: 'rgba(124, 58, 237, 0.16)',
			chillColor: 'rgba(20, 184, 166, 0.16)',
			delaySec: 4
		}
	])
};

/**
 * About Section Overlay Config
 */
export const ABOUT_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.05,
		blurPx: 50,
		speedSec: 22,
		insetPercent: 14,
		zIndex: 0
	} satisfies AuroraConfig,
	glowOrbs: createGlowOrbsConfig([
		{
			size: 220,
			x: '-70px',
			y: '85%',
			hardcoreColor: 'rgba(251, 146, 60, 0.22)',
			chillColor: 'rgba(20, 184, 166, 0.22)'
		},
		{
			size: 180,
			x: '88%',
			y: '-50px',
			hardcoreColor: 'rgba(59, 130, 246, 0.20)',
			chillColor: 'rgba(45, 212, 191, 0.20)',
			delaySec: 2.2
		}
	])
};

/**
 * Program Section Overlay Config
 */
export const PROGRAM_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.06,
		blurPx: 50,
		speedSec: 20,
		insetPercent: 18,
		zIndex: 0
	} satisfies AuroraConfig,
	glowOrbs: createGlowOrbsConfig([
		{
			size: 260,
			x: 'calc(100% - 60px)',
			y: '-80px',
			hardcoreColor: 'rgba(251, 146, 60, 0.25)',
			chillColor: 'rgba(20, 184, 166, 0.25)'
		},
		{
			size: 200,
			x: '-40px',
			y: 'calc(100% - 60px)',
			hardcoreColor: 'rgba(59, 130, 246, 0.22)',
			chillColor: 'rgba(45, 212, 191, 0.22)',
			delaySec: 2.5
		}
	])
};

/**
 * Footer Section Overlay Config
 */
export const FOOTER_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.04,
		blurPx: 40,
		speedSec: 26,
		insetPercent: 10,
		zIndex: 0
	} satisfies AuroraConfig,
	glowOrbs: createGlowOrbsConfig([
		{
			size: 200,
			x: '-60px',
			y: 'calc(100% - 60px)',
			hardcoreColor: 'rgba(251, 146, 60, 0.20)',
			chillColor: 'rgba(20, 184, 166, 0.20)',
			hideOnMobile: true
		},
		{
			size: 160,
			x: 'calc(100% - 50px)',
			y: '-50px',
			hardcoreColor: 'rgba(59, 130, 246, 0.18)',
			chillColor: 'rgba(45, 212, 191, 0.18)',
			delaySec: 2,
			hideOnMobile: true
		}
	])
};

/**
 * Testimonials Section Overlay Config
 */
export const TESTIMONIALS_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.05,
		blurPx: 55,
		speedSec: 24,
		insetPercent: 15,
		zIndex: 0
	} satisfies AuroraConfig,
	glowOrbs: createGlowOrbsConfig([
		{
			size: 300,
			x: '-100px',
			y: '-80px',
			hardcoreColor: 'rgba(251, 146, 60, 0.22)',
			chillColor: 'rgba(20, 184, 166, 0.22)'
		},
		{
			size: 280,
			x: 'calc(100% - 80px)',
			y: 'calc(100% - 100px)',
			hardcoreColor: 'rgba(59, 130, 246, 0.20)',
			chillColor: 'rgba(45, 212, 191, 0.20)',
			delaySec: 2.5
		},
		{
			size: 240,
			x: '15%',
			y: '75%',
			hardcoreColor: 'rgba(124, 58, 237, 0.18)',
			chillColor: 'rgba(20, 184, 166, 0.18)',
			delaySec: 4.2
		}
	])
};

