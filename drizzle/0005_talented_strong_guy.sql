CREATE TABLE `cohort` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`course_id` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_type` text,
	`snap_token` text,
	`snap_url` text,
	`payload` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `enrollment` ADD `cohort_id` text REFERENCES cohort(id);--> statement-breakpoint
ALTER TABLE `enrollment` ADD `track` text;--> statement-breakpoint
ALTER TABLE `submission` ADD `metadata` text;--> statement-breakpoint
CREATE UNIQUE INDEX `waiting_list_email_unique` ON `waiting_list` (`email`);