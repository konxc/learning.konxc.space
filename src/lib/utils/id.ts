import { encodeBase32LowerCase } from '@oslojs/encoding';

/**
 * Generates a unique ID for database records.
 * @returns A base32 encoded random string.
 */
export function generateId(): string {
	return encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(10)));
}
