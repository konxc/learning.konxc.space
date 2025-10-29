CREATE TABLE `coupon` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`discount_type` text,
	`discount_value` integer,
	`max_uses` integer,
	`current_uses` integer DEFAULT 0 NOT NULL,
	`valid_from` integer NOT NULL,
	`valid_until` integer,
	`description` text,
	`applicable_courses` text,
	`min_purchase_amount` integer,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupon_code_unique` ON `coupon` (`code`);--> statement-breakpoint
CREATE TABLE `coupon_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`coupon_id` text NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text,
	`discount_amount` integer NOT NULL,
	`order_amount` integer NOT NULL,
	`final_amount` integer NOT NULL,
	`used_at` integer NOT NULL,
	FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `course` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail_url` text,
	`price` integer NOT NULL,
	`duration` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`mentor_id` text,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`mentor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `enrollment` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`coupon_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`enrolled_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mentor_application` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`bio` text NOT NULL,
	`expertise` text NOT NULL,
	`years_experience` integer NOT NULL,
	`portfolio_url` text,
	`github_url` text,
	`linkedin_url` text,
	`motivation` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`created_at` integer NOT NULL,
	`reviewed_at` integer,
	`reviewed_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `full_name` text;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text;--> statement-breakpoint
ALTER TABLE `user` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `user` ADD `onboarding_completed` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `age`;