import { writable } from 'svelte/store';
import type { BrandMode } from '$lib/config/brandCampaigns';
import { getScheduledBrandMode } from '$lib/config/brandCampaigns';

function getInitialMode(): BrandMode {
	if (typeof window !== 'undefined') {
		const saved = window.localStorage.getItem('brandMode') as BrandMode | null;
		if (saved === 'chill' || saved === 'hardcore') return saved;
	}
	const scheduled = getScheduledBrandMode(new Date());
	return scheduled ?? 'chill';
}

export const brandMode = writable<BrandMode>(getInitialMode());

// Persist changes and set up auto-update at midnight
if (typeof window !== 'undefined') {
	brandMode.subscribe((value) => {
		try {
			window.localStorage.setItem('brandMode', value);
		} catch {}
	});

	const scheduleMidnightCheck = () => {
		const now = new Date();
		const next = new Date(now);
		next.setHours(24, 0, 0, 0);
		const ms = next.getTime() - now.getTime();
		window.setTimeout(() => {
			const scheduled = getScheduledBrandMode(new Date());
			if (scheduled) {
				brandMode.set(scheduled);
			} else {
				// Only revert to chill if user has not explicitly set a preference
				const saved = window.localStorage.getItem('brandMode');
				if (!saved) brandMode.set('chill');
			}
			scheduleMidnightCheck();
		}, ms);
	};
	scheduleMidnightCheck();
}

export function toggleBrandMode() {
	brandMode.update((m) => (m === 'chill' ? 'hardcore' : 'chill'));
}
