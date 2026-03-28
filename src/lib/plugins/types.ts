/**
 * Naik Kelas Plugin System Types
 * 
 * This module defines the core types for the LMS plugin architecture.
 * Plugins allow courses to have customizable features like discussions,
 * quizzes, gamification, etc.
 */

// Plugin Types
export type PluginType = 'social' | 'assessment' | 'gamification' | 'content' | 'analytics' | 'communication';

// Plugin Configuration Schema (JSON Schema subset)
export interface PluginConfigSchema {
	type: 'object';
	properties: Record<string, {
		type: 'string' | 'number' | 'boolean';
		default?: any;
		description?: string;
		options?: any[];
	}>;
	required?: string[];
}

// Course Tab Extension
export interface PluginTab {
	id: string;
	label: string;
	icon: string;
	Component?: any; // Svelte component - loaded dynamically
	order?: number;
	requiresAuth?: boolean;
	requiresEnrollment?: boolean;
}

// Sidebar Item Extension
export interface PluginNavExtension {
	label: string;
	href: string;
	icon: string;
	category?: string;
	roles?: string[]; // Which roles can see this
}

// API Route Extension
export interface PluginAPIRoute {
	path: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	handler: Function;
}

// Main Plugin Interface
export interface LMSPlugin {
	// Identity
	readonly id: string;
	readonly name: string;
	readonly version: string;
	readonly type: PluginType;
	readonly description: string;
	readonly icon: string;

	// Dependencies (plugin IDs that must be enabled first)
	readonly dependencies?: string[];

	// Default configuration
	readonly defaultConfig?: Record<string, any>;

	// Configuration schema (for admin UI)
	readonly configSchema?: PluginConfigSchema;

	// UI Extensions
	readonly courseTabs?: PluginTab[];
	readonly learningTabs?: PluginTab[];
	readonly navExtensions?: PluginNavExtension[];

	// API Extensions
	readonly apiRoutes?: PluginAPIRoute[];

	// Lifecycle Hooks
	init?(): Promise<void>;
	onEnable?(courseId: string): Promise<void>;
	onDisable?(courseId: string): Promise<void>;
}

// Course Plugin Configuration (from database)
export interface CoursePluginConfig {
	id: string;
	courseId: string;
	pluginId: string;
	isEnabled: boolean;
	config: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
}

// Plugin Registry Entry (from database)
export interface PluginRegistryEntry {
	id: string;
	name: string;
	version: string;
	type: PluginType;
	description: string;
	icon: string;
	dependencies: string[];
	defaultConfig: Record<string, any>;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Helper function to check if plugin is enabled
export function isPluginEnabled(config: CoursePluginConfig | null): boolean {
	return config?.isEnabled ?? false;
}

// Plugin type labels and colors for UI
export const PLUGIN_TYPE_INFO: Record<PluginType, { label: string; color: string; icon: string }> = {
	social: { label: 'Social', color: 'bg-blue-100 text-blue-700', icon: '💬' },
	assessment: { label: 'Assessment', color: 'bg-green-100 text-green-700', icon: '📝' },
	gamification: { label: 'Gamification', color: 'bg-yellow-100 text-yellow-700', icon: '🏆' },
	content: { label: 'Content', color: 'bg-purple-100 text-purple-700', icon: '📚' },
	analytics: { label: 'Analytics', color: 'bg-orange-100 text-orange-700', icon: '📊' },
	communication: { label: 'Communication', color: 'bg-pink-100 text-pink-700', icon: '📢' }
};
