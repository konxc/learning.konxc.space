-- Migration: Workspace (Sub-division within Organization)
-- Created: 2026-03-29

--> statement-breakpoint

-- Workspace Table (sub-division within organization)
CREATE TABLE IF NOT EXISTS `workspace` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL REFERENCES `organization`(`id`),
	`name` text NOT NULL,
	`description` text,
	`logo_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

-- Workspace Member Table
CREATE TABLE IF NOT EXISTS `workspace_member` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL REFERENCES `workspace`(`id`),
	`user_id` text NOT NULL REFERENCES `user`(`id`),
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

-- Unique constraint for workspace-member pair
CREATE UNIQUE INDEX IF NOT EXISTS `workspace_member_ws_user_unique` ON `workspace_member` (`workspace_id`, `user_id`);
--> statement-breakpoint

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS `workspace_org_id_idx` ON `workspace` (`org_id`);
CREATE INDEX IF NOT EXISTS `workspace_member_ws_idx` ON `workspace_member` (`workspace_id`);
CREATE INDEX IF NOT EXISTS `workspace_member_user_idx` ON `workspace_member` (`user_id`);
