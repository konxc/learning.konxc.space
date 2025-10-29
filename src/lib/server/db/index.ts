import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Create client based on environment
// For development, use local client
// For production (Cloudflare), use HTTP client
let dbClient;

if (dev) {
	// Development: use local file connection
	dbClient = createClient({
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN
	});
} else {
	// Production: use HTTP for Cloudflare Workers compatibility
	// Note: syncUrl is not needed for remote Turso databases
	dbClient = createClient({
		url: env.DATABASE_URL || '',
		authToken: env.DATABASE_AUTH_TOKEN || undefined
	});
}

export const db = drizzle(dbClient, { schema });
