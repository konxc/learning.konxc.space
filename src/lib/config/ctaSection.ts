/**
 * Configuration untuk CTA Section
 */

export const CTA_CONTENT = {
	badge: '🚀 Batch Pertama - Segera Dibuka!',
	title: 'Ready to Level Up?',
	description:
		'Jangan lewatkan kesempatan belajar langsung dari industry practitioners. Daftar sekarang dan mulai journey kamu jadi developer profesional!',
	primaryButton: {
		text: '🎯 Join Waiting List - Gratis!',
		href: '/waiting-list'
	},
	note: {
		text: 'Sudah punya akun?',
		linkText: 'Masuk di sini',
		href: '/auth/signin'
	}
} as const;

export const CTA_OVERLAY_CONFIG = {
	aurora: {
		intensity: 0.08,
		blurPx: 60,
		speedSec: 18,
		insetPercent: 20,
		zIndex: 0
	},
	glowOrbs: {
		hardcore: [
			{
				size: 260,
				x: '-80px',
				y: 'calc(100% - 80px)',
				color: 'rgba(251, 146, 60, 0.30)',
				hideOnMobile: true
			},
			{
				size: 200,
				x: 'calc(100% - 60px)',
				y: '-60px',
				color: 'rgba(59, 130, 246, 0.28)',
				delaySec: 2.5,
				hideOnMobile: true
			},
			{
				size: 160,
				x: '10%',
				y: '80%',
				color: 'rgba(124, 58, 237, 0.26)',
				delaySec: 5,
				hideOnMobile: true
			}
		],
		chill: [
			{
				size: 260,
				x: '-80px',
				y: 'calc(100% - 80px)',
				color: 'rgba(20, 184, 166, 0.32)',
				hideOnMobile: true
			},
			{
				size: 200,
				x: 'calc(100% - 60px)',
				y: '-60px',
				color: 'rgba(45, 212, 191, 0.30)',
				delaySec: 2.5,
				hideOnMobile: true
			},
			{
				size: 160,
				x: '10%',
				y: '80%',
				color: 'rgba(20, 184, 166, 0.28)',
				delaySec: 5,
				hideOnMobile: true
			}
		]
	}
} as const;

