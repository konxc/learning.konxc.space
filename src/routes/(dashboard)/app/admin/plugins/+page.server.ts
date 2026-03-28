import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { builtInPlugins, PLUGIN_TYPE_INFO } from '$lib/plugins';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user || user.role !== 'admin') {
		return { plugins: [], registrations: [] };
	}

	// Get registered plugins from database
	const registrations = await db
		.select()
		.from(schema.pluginRegistry);

	// Combine built-in plugin info with DB registration status
	const plugins = builtInPlugins.map(plugin => {
		const reg = registrations.find(r => r.id === plugin.id);
		return {
			id: plugin.id,
			name: plugin.name,
			version: plugin.version,
			type: plugin.type,
			description: plugin.description,
			icon: plugin.icon,
			dependencies: plugin.dependencies ?? [],
			isActive: reg?.isActive ?? true,
			isRegistered: !!reg,
			typeInfo: PLUGIN_TYPE_INFO[plugin.type]
		};
	});

	return {
		plugins,
		registrations
	};
};
