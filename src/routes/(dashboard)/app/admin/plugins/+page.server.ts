import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { builtInPlugins, PLUGIN_TYPE_INFO } from '$lib/plugins';
import { actionSuccess, actionFailure } from '$lib/server/actions';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user || user.role !== 'admin') {
		return { plugins: [], registrations: [] };
	}

	// Get registered plugins from database
	const registrations = await db.select().from(schema.pluginRegistry);

	// Combine built-in plugin info with DB registration status
	const plugins = builtInPlugins.map((plugin) => {
		const reg = registrations.find((r) => r.id === plugin.id);
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

export const actions: Actions = {
	toggle: async ({ request, locals }) => {
		const user = locals.user;
		if (!user || user.role !== 'admin') {
			return actionFailure(403, 'Unauthorized');
		}

		const formData = await request.formData();
		const pluginId = formData.get('pluginId') as string;
		const isActive = formData.get('isActive') === 'true';

		if (!pluginId) {
			return actionFailure(400, 'Plugin ID required');
		}

		// Get the plugin definition
		const plugin = builtInPlugins.find((p) => p.id === pluginId);
		if (!plugin) {
			return actionFailure(404, 'Plugin not found');
		}

		// Get currently enabled plugins
		const enabledPlugins = await db
			.select({ id: schema.pluginRegistry.id })
			.from(schema.pluginRegistry)
			.where(eq(schema.pluginRegistry.isActive, true));

		const enabledIds = enabledPlugins.map((p) => p.id);

		if (isActive) {
			// Check dependencies when enabling
			const dependencies = plugin.dependencies ?? [];
			const missingDeps = dependencies.filter((dep) => !enabledIds.includes(dep));

			if (missingDeps.length > 0) {
				return actionFailure(
					400,
					`Cannot enable: missing dependencies - ${missingDeps.join(', ')}`
				);
			}
		} else {
			// Check if other plugins depend on this one when disabling
			const dependentPlugins = builtInPlugins.filter((p) =>
				(p.dependencies ?? []).includes(pluginId)
			);
			const enabledDependents = dependentPlugins
				.filter((p) => enabledIds.includes(p.id))
				.map((p) => p.name);

			if (enabledDependents.length > 0) {
				return actionFailure(400, `Cannot disable: required by ${enabledDependents.join(', ')}`);
			}
		}

		const existing = await db
			.select()
			.from(schema.pluginRegistry)
			.where(eq(schema.pluginRegistry.id, pluginId))
			.limit(1);

		if (existing[0]) {
			await db
				.update(schema.pluginRegistry)
				.set({ isActive, updatedAt: new Date() })
				.where(eq(schema.pluginRegistry.id, pluginId));
		} else {
			await db.insert(schema.pluginRegistry).values({
				id: pluginId,
				name: plugin.name,
				version: plugin.version,
				type: plugin.type,
				isActive
			});
		}

		return actionSuccess({
			message: `Plugin ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`
		});
	}
} satisfies Actions;
