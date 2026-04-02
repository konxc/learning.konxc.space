import * as schema from '../../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { builtInPlugins } from '../../src/lib/plugins/built-in/index.js';

export async function seedPlugins(db: NeonHttpDatabase<typeof schema>) {
	console.log('🧩 Seeding plugins...');

	for (const plugin of builtInPlugins) {
		const existing = await db
			.select()
			.from(schema.pluginRegistry)
			.where(eq(schema.pluginRegistry.id, plugin.id))
			.limit(1);

		if (existing.length === 0) {
			await db.insert(schema.pluginRegistry).values({
				id: plugin.id,
				name: plugin.name,
				version: plugin.version,
				type: plugin.type,
				description: plugin.description,
				icon: plugin.icon,
				dependencies: JSON.stringify(plugin.dependencies || []),
				defaultConfig: JSON.stringify(plugin.defaultConfig || {}),
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}
	}

	console.log(`✅ Seeded ${builtInPlugins.length} plugins`);

	// Enable default plugins for existing courses
	console.log('📚 Enabling plugins for existing courses...');
	
	const courses = await db.select({ id: schema.course.id }).from(schema.course);
	
	for (const course of courses) {
		// Check if plugins already configured
		const existingPlugins = await db
			.select()
			.from(schema.coursePlugin)
			.where(eq(schema.coursePlugin.courseId, course.id));

		if (existingPlugins.length === 0) {
			// Enable default plugins (all except affiliate)
			const defaultPlugins = builtInPlugins.filter(p => p.id !== 'affiliate');
			
			for (const plugin of defaultPlugins) {
				await db.insert(schema.coursePlugin).values({
					id: `cp-${course.id}-${plugin.id}`,
					courseId: course.id,
					pluginId: plugin.id,
					isEnabled: true,
					config: JSON.stringify(plugin.defaultConfig || {}),
					createdAt: new Date(),
					updatedAt: new Date()
				});
			}
		}
	}

	console.log(`✅ Enabled plugins for ${courses.length} courses`);
}
