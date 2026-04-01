/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for auth endpoints
 */

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of store.entries()) {
			if (entry.resetAt < now) {
				store.delete(key);
			}
		}
	},
	5 * 60 * 1000
);

export interface RateLimitConfig {
	windowMs: number;
	maxRequests: number;
}

export interface RateLimitResult {
	success: boolean;
	remaining: number;
	resetAt: Date;
}

/**
 * Check if a request is within rate limits
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || entry.resetAt < now) {
		const newEntry: RateLimitEntry = {
			count: 1,
			resetAt: now + config.windowMs
		};
		store.set(key, newEntry);
		return {
			success: true,
			remaining: config.maxRequests - 1,
			resetAt: new Date(newEntry.resetAt)
		};
	}

	entry.count++;
	store.set(key, entry);

	return {
		success: entry.count <= config.maxRequests,
		remaining: Math.max(0, config.maxRequests - entry.count),
		resetAt: new Date(entry.resetAt)
	};
}

/**
 * Preset configurations
 */
export const RATE_LIMITS = {
	login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15 min
	register: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
	waitlist: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
	api: { windowMs: 60 * 1000, maxRequests: 30 } // 30 per min
} as const;
