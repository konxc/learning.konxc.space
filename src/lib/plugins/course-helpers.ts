/**
 * Course Plugin Helpers
 * 
 * Helper functions for integrating plugins with course pages.
 */

import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { builtInPlugins } from './built-in';
import type { LMSPlugin } from './types';

// Get enabled plugins for a course
export async function getEnabledPluginsForCourse(courseId: string): Promise<LMSPlugin[]> {
	// Get course plugin configs from database
	const coursePlugins = await db
		.select()
		.from(schema.coursePlugin)
		.where(
			and(
				eq(schema.coursePlugin.courseId, courseId),
				eq(schema.coursePlugin.isEnabled, true)
			)
		);

	const enabledPluginIds = coursePlugins.map(cp => cp.pluginId);

	// If no plugins configured, return defaults
	if (enabledPluginIds.length === 0) {
		// Return default enabled plugins (all except affiliate)
		return builtInPlugins.filter((p: LMSPlugin) => p.id !== 'affiliate');
	}

	// Return matching built-in plugins
	return builtInPlugins.filter((p: LMSPlugin) => enabledPluginIds.includes(p.id));
}

// Get enabled plugin IDs for a course
export async function getEnabledPluginIdsForCourse(courseId: string): Promise<string[]> {
	const plugins = await getEnabledPluginsForCourse(courseId);
	return plugins.map(p => p.id);
}

// Get plugin config for a course
export async function getPluginConfigForCourse(courseId: string, pluginId: string): Promise<Record<string, any>> {
	const coursePlugin = await db
		.select()
		.from(schema.coursePlugin)
		.where(
			and(
				eq(schema.coursePlugin.courseId, courseId),
				eq(schema.coursePlugin.pluginId, pluginId)
			)
		)
		.limit(1);

	if (coursePlugin.length === 0) {
		// Return default config from plugin
		const plugin = builtInPlugins.find(p => p.id === pluginId);
		return plugin?.defaultConfig ?? {};
	}

	try {
		return JSON.parse(coursePlugin[0].config || '{}') as Record<string, any>;
	} catch {
		return {};
	}
}

// Check if a specific plugin is enabled for a course
export async function isPluginEnabledForCourse(courseId: string, pluginId: string): Promise<boolean> {
	const coursePlugin = await db
		.select()
		.from(schema.coursePlugin)
		.where(
			and(
				eq(schema.coursePlugin.courseId, courseId),
				eq(schema.coursePlugin.pluginId, pluginId),
				eq(schema.coursePlugin.isEnabled, true)
			)
		)
		.limit(1);

	return coursePlugin.length > 0;
}

// Enable plugin for course
export async function enablePluginForCourse(courseId: string, pluginId: string): Promise<void> {
	const existing = await db
		.select()
		.from(schema.coursePlugin)
		.where(
			and(
				eq(schema.coursePlugin.courseId, courseId),
				eq(schema.coursePlugin.pluginId, pluginId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		// Update existing
		await db
			.update(schema.coursePlugin)
			.set({ isEnabled: true, updatedAt: new Date() })
			.where(eq(schema.coursePlugin.id, existing[0].id));
	} else {
		// Create new
		await db.insert(schema.coursePlugin).values({
			id: `cp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			courseId,
			pluginId,
			isEnabled: true,
			config: '{}',
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}
}

// Disable plugin for course
export async function disablePluginForCourse(courseId: string, pluginId: string): Promise<void> {
	const existing = await db
		.select()
		.from(schema.coursePlugin)
		.where(
			and(
				eq(schema.coursePlugin.courseId, courseId),
				eq(schema.coursePlugin.pluginId, pluginId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(schema.coursePlugin)
			.set({ isEnabled: false, updatedAt: new Date() })
			.where(eq(schema.coursePlugin.id, existing[0].id));
	}
}

// Get course tabs from enabled plugins
export async function getCourseTabsForCourse(courseId: string): Promise<Array<{id: string, label: string, icon: string, order: number}>> {
	const plugins = await getEnabledPluginsForCourse(courseId);
	const tabs = plugins.flatMap((p: LMSPlugin) => p.courseTabs || []);
	return tabs.map(t => ({ ...t, order: t.order ?? 999 })).sort((a, b) => a.order - b.order);
}

// Get learning tabs from enabled plugins
export async function getLearningTabsForCourse(courseId: string): Promise<Array<{id: string, label: string, icon: string, order: number}>> {
	const plugins = await getEnabledPluginsForCourse(courseId);
	const tabs = plugins.flatMap((p: LMSPlugin) => p.learningTabs || []);
	return tabs.map(t => ({ ...t, order: t.order ?? 999 })).sort((a, b) => a.order - b.order);
}

// Initialize default plugins for a new course
export async function initializePluginsForCourse(courseId: string): Promise<void> {
	// Enable default plugins (all except affiliate)
	const defaultPlugins = builtInPlugins.filter((p: LMSPlugin) => p.id !== 'affiliate');
	
	for (const plugin of defaultPlugins) {
		await enablePluginForCourse(courseId, plugin.id);
	}
}
