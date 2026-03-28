/**
 * Plugin Registry - Core service for managing LMS plugins
 * 
 * This service manages plugin registration, course-plugin configurations,
 * and provides methods to query and toggle plugins.
 */

import type { LMSPlugin, PluginType, PluginTab, CoursePluginConfig } from './types';

// In-memory plugin registry
const plugins: Map<string, LMSPlugin> = new Map();

// Course plugin config cache (courseId -> pluginId -> config)
const courseConfigCache: Map<string, Map<string, CoursePluginConfig>> = new Map();

export const PluginRegistry = {
	/**
	 * Register a new plugin
	 */
	register(plugin: LMSPlugin): void {
		plugins.set(plugin.id, plugin);
		console.log(`[Plugin] Registered: ${plugin.name} (${plugin.id})`);
	},

	/**
	 * Get a plugin by ID
	 */
	get(pluginId: string): LMSPlugin | undefined {
		return plugins.get(pluginId);
	},

	/**
	 * Get all registered plugins
	 */
	getAll(): LMSPlugin[] {
		return Array.from(plugins.values());
	},

	/**
	 * Get plugins by type
	 */
	getByType(type: PluginType): LMSPlugin[] {
		return Array.from(plugins.values()).filter(p => p.type === type);
	},

	/**
	 * Get plugin IDs
	 */
	getIds(): string[] {
		return Array.from(plugins.keys());
	},

	/**
	 * Check if a plugin is registered
	 */
	has(pluginId: string): boolean {
		return plugins.has(pluginId);
	},

	/**
	 * Get course tabs from all enabled plugins
	 */
	getCourseTabs(enabledPluginIds: string[]): PluginTab[] {
		const tabs: PluginTab[] = [];

		for (const pluginId of enabledPluginIds) {
			const plugin = plugins.get(pluginId);
			if (plugin?.courseTabs) {
				tabs.push(...plugin.courseTabs);
			}
		}

		return tabs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
	},

	/**
	 * Get learning tabs from all enabled plugins
	 */
	getLearningTabs(enabledPluginIds: string[]): PluginTab[] {
		const tabs: PluginTab[] = [];

		for (const pluginId of enabledPluginIds) {
			const plugin = plugins.get(pluginId);
			if (plugin?.learningTabs) {
				tabs.push(...plugin.learningTabs);
			}
		}

		return tabs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
	},

	/**
	 * Get dependencies for a plugin
	 */
	getDependencies(pluginId: string): string[] {
		const plugin = plugins.get(pluginId);
		return plugin?.dependencies ?? [];
	},

	/**
	 * Check if all dependencies are satisfied
	 */
	areDependenciesMet(pluginId: string, enabledPluginIds: string[]): boolean {
		const deps = this.getDependencies(pluginId);
		return deps.every(dep => enabledPluginIds.includes(dep));
	},

	/**
	 * Get plugins that depend on a given plugin
	 */
	getDependents(pluginId: string): string[] {
		const dependents: string[] = [];
		for (const [id, plugin] of plugins) {
			if (plugin.dependencies?.includes(pluginId)) {
				dependents.push(id);
			}
		}
		return dependents;
	},

	/**
	 * Clear cache (for testing)
	 */
	clearCache(): void {
		courseConfigCache.clear();
	},

	/**
	 * Get default config for a plugin
	 */
	getDefaultConfig(pluginId: string): Record<string, any> {
		const plugin = plugins.get(pluginId);
		return plugin?.defaultConfig ?? {};
	},

	/**
	 * Get plugin info for display
	 */
	getPluginInfo(pluginId: string): {
		id: string;
		name: string;
		version: string;
		type: PluginType;
		description: string;
		icon: string;
		dependencies: string[];
		defaultConfig: Record<string, any>;
	} | null {
		const plugin = plugins.get(pluginId);
		if (!plugin) return null;

		return {
			id: plugin.id,
			name: plugin.name,
			version: plugin.version,
			type: plugin.type,
			description: plugin.description,
			icon: plugin.icon,
			dependencies: plugin.dependencies ?? [],
			defaultConfig: plugin.defaultConfig ?? {}
		};
	},

	/**
	 * Get all plugin info for admin listing
	 */
	getAllPluginInfo(): Array<{
		id: string;
		name: string;
		version: string;
		type: PluginType;
		description: string;
		icon: string;
		dependencies: string[];
	}> {
		return Array.from(plugins.values()).map(p => ({
			id: p.id,
			name: p.name,
			version: p.version,
			type: p.type,
			description: p.description,
			icon: p.icon,
			dependencies: p.dependencies ?? []
		}));
	}
};

export type { LMSPlugin, PluginType, PluginTab, CoursePluginConfig };
