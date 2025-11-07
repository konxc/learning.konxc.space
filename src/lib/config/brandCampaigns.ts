export type BrandMode = 'chill' | 'hardcore';

export interface BrandModeWindow {
	start: string; // ISO date 'YYYY-MM-DD' inclusive (local time)
	end: string; // ISO date 'YYYY-MM-DD' inclusive (local time)
	mode: BrandMode; // typically 'hardcore'
}

// Edit this list to schedule automatic brand modes.
// Example windows provided as placeholders; replace with real dates.
export const BRAND_MODE_WINDOWS: BrandModeWindow[] = [
	{ start: '2025-11-01', end: '2025-11-07', mode: 'hardcore' },
	{ start: '2025-12-20', end: '2025-12-31', mode: 'hardcore' }
];

export function isDateWithinWindow(date: Date, window: BrandModeWindow): boolean {
	const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const [ys, ms, ds] = window.start.split('-').map((v) => parseInt(v, 10));
	const [ye, me, de] = window.end.split('-').map((v) => parseInt(v, 10));
	const start = new Date(ys, (ms ?? 1) - 1, ds ?? 1);
	const end = new Date(ye, (me ?? 1) - 1, de ?? 1);
	return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

export function getScheduledBrandMode(now: Date = new Date()): BrandMode | null {
	for (const w of BRAND_MODE_WINDOWS) {
		if (isDateWithinWindow(now, w)) return w.mode;
	}
	return null;
}
