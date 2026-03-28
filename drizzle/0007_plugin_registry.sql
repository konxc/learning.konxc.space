-- Migration: Plugin Registry System
-- Created: 2026-03-29

--> statement-breakpoint

-- Plugin Registry Table
CREATE TABLE IF NOT EXISTS `plugin_registry` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`version` text DEFAULT '1.0.0' NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`icon` text DEFAULT '📦',
	`dependencies` text DEFAULT '[]',
	`default_config` text DEFAULT '{}',
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

-- Course Plugin Configuration Table
CREATE TABLE IF NOT EXISTS `course_plugin` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL REFERENCES `course`(`id`),
	`plugin_id` text NOT NULL REFERENCES `plugin_registry`(`id`),
	`is_enabled` integer DEFAULT 1 NOT NULL,
	`config` text DEFAULT '{}',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

-- Unique constraint for course-plugin pair
CREATE UNIQUE INDEX IF NOT EXISTS `course_plugin_course_plugin_unique` ON `course_plugin` (`course_id`, `plugin_id`);
--> statement-breakpoint

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS `course_plugin_course_id_idx` ON `course_plugin` (`course_id`);
CREATE INDEX IF NOT EXISTS `course_plugin_plugin_id_idx` ON `course_plugin` (`plugin_id`);
