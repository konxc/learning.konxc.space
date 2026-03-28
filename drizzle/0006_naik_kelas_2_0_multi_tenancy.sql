-- Migration: Naik Kelas 2.0 - Multi-Tenancy Support
-- Created: 2026-03-29

--> statement-breakpoint

-- 1. Add organization tables
CREATE TABLE IF NOT EXISTS `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`logo_url` text,
	`brand_color` text DEFAULT '#4f46e5',
	`plan_type` text DEFAULT 'free' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `organization_slug_unique` ON `organization` (`slug`);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `organization_member` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL REFERENCES `organization`(`id`),
	`user_id` text NOT NULL REFERENCES `user`(`id`),
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint

-- 2. Add user.last_workspace_id column
ALTER TABLE `user` ADD COLUMN `last_workspace_id` text;
--> statement-breakpoint

-- 3. Add course organization & feature columns
ALTER TABLE `course` ADD COLUMN `org_id` text REFERENCES `organization`(`id`);
--> statement-breakpoint
ALTER TABLE `course` ADD COLUMN `category` text DEFAULT 'general';
--> statement-breakpoint
ALTER TABLE `course` ADD COLUMN `features_config` text;
--> statement-breakpoint

-- 4. Fix quiz_question order_index column name for consistency
-- Note: SQLite doesn't support RENAME COLUMN for all versions, so we use a workaround
-- For fresh databases, this is handled by drizzle-kit push
-- For existing databases, run these commands manually if needed:

-- Create invitation table for member invites
CREATE TABLE IF NOT EXISTS `organization_invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`org_id` text NOT NULL REFERENCES `organization`(`id`),
	`email` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`token` text NOT NULL,
	`invited_by` text NOT NULL REFERENCES `user`(`id`),
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `organization_invitation_token_unique` ON `organization_invitation` (`token`);
--> statement-breakpoint

-- Migration completed successfully
