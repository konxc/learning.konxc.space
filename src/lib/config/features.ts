/**
 * Feature Flags Configuration
 *
 * Toggle features on/off for the application.
 * These can be modified by the dev team to enable/disable functionality.
 */

export const FEATURES = {
	/**
	 * PWA (Progressive Web App) settings
	 * When disabled: removes manifest link, service worker registration, and PWA meta tags
	 */
	PWA: {
		enabled: false, // Toggle this to enable/disable PWA

		// PWA Configuration
		name: 'Naik Kelas by Koneksi',
		shortName: 'Naik Kelas',
		description: 'Program pelatihan intensif developer',
		themeColor: '#667eea',
		backgroundColor: '#ffffff'
	},

	/**
	 * Analytics (Umami)
	 */
	ANALYTICS: {
		enabled: true,
		websiteId: '7af81a1a-5d3d-4355-af3b-31d9076f74ae'
	},

	/**
	 * Service Worker for caching
	 */
	SERVICE_WORKER: {
		enabled: false // Toggle this to enable/disable service worker
	}
} as const;

export type FeatureFlags = typeof FEATURES;

/**
 * Helper to check if PWA is enabled
 */
export const isPWAEnabled = FEATURES.PWA.enabled;

/**
 * Helper to check if analytics is enabled
 */
export const isAnalyticsEnabled = FEATURES.ANALYTICS.enabled;

/**
 * Helper to check if service worker is enabled
 */
export const isServiceWorkerEnabled = FEATURES.SERVICE_WORKER.enabled;
