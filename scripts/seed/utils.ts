import { encodeBase32LowerCase } from '@oslojs/encoding';

/**
 * Generates a unique ID for database records.
 * @returns A base32 encoded random string.
 */
export function generateId(): string {
	return encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
}

/**
 * Returns the current timestamp in milliseconds.
 * @returns Current timestamp.
 */
export function now(): number {
	return Date.now();
}

/**
 * Utility to log sections in the seeding process.
 * @param title Section title
 */
export function logSection(title: string) {
	console.log(`\n📦 ${title}...`);
}

/**
 * Utility to log completion of a section.
 * @param message Success message
 */
export function logSuccess(message: string) {
	console.log(` ✅ ${message}`);
}
