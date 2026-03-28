/**
 * Naik Kelas Plugin System
 * 
 * Main entry point for the plugin architecture.
 * Import from this file to use the plugin system.
 */

// Types
export type { LMSPlugin, PluginType, PluginTab, PluginConfigSchema, CoursePluginConfig, PluginNavExtension, PluginAPIRoute, PluginRegistryEntry } from './types';
export { PLUGIN_TYPE_INFO, isPluginEnabled } from './types';

// Registry
export { PluginRegistry } from './registry';

// Built-in plugins
export {
	builtInPlugins,
	discussionPlugin,
	quizPlugin,
	submissionPlugin,
	gamificationPlugin,
	notesPlugin,
	certificatePlugin,
	analyticsPlugin,
	affiliatePlugin
} from './built-in';

// Plugin IDs constant for type-safe references
export const PLUGIN_IDS = {
	DISCUSSION: 'discussion',
	QUIZ: 'quiz',
	SUBMISSION: 'submission',
	GAMIFICATION: 'gamification',
	NOTES: 'notes',
	CERTIFICATE: 'certificate',
	ANALYTICS: 'analytics',
	AFFILIATE: 'affiliate'
} as const;

export type PluginId = typeof PLUGIN_IDS[keyof typeof PLUGIN_IDS];
