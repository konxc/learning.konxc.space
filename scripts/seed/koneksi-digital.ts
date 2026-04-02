import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function seedKoneksiDigital(
	db: NeonHttpDatabase<typeof schema>,
	adminId: string
) {
	logSection('Seeding Koneksi Digital Curriculum (3 Pillars)');

	const draftingPath = './naikkelas-agent/instances/koneksi-digital/drafting';

	// 1. Create the Main Course
	const courseId = 'kd-001';
	const course = {
		id: courseId,
		title: 'Akselerasi Bisnis Digital (Koneksi Digital)',
		description: 'Program akselerasi 3 pilar: Konten Kreator, Affiliator, dan Marketplace Seller. Action-based learning untuk kemandirian ekonomi.',
		thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
		price: 0, // Free/Scholarship for ASIB
		duration: 12,
		status: 'published',
		category: 'marketing',
		featuresConfig: JSON.stringify({ tracks: true, affiliate: true, performance: true }),
		mentorId: 'mentor-001', // Lead Mentor
		createdBy: adminId,
		createdAt: new Date(),
		updatedAt: new Date()
	};

	await db.insert(schema.course).values(course).onConflictDoNothing();

	// 2. Parse and Seed "Pondasi" (Common)
	await seedModuleFromMarkdown(db, courseId, path.join(draftingPath, '01_Modul_Pondasi_Digital_Marketing.md'), 'base');

	// 3. Parse and Seed specialized tracks
	await seedModuleFromMarkdown(db, courseId, path.join(draftingPath, '02_Syllabus_Affiliator.md'), 'affiliate');
	await seedModuleFromMarkdown(db, courseId, path.join(draftingPath, '03_Syllabus_Konten_Kreator.md'), 'creator');
	await seedModuleFromMarkdown(db, courseId, path.join(draftingPath, '04_Syllabus_Marketplace_Seller.md'), 'seller');

	logSuccess('Successfully synced Koneksi Digital curriculum from Markdown files.');
}

async function seedModuleFromMarkdown(
	db: NeonHttpDatabase<typeof schema>,
	courseId: string,
	filePath: string,
	track: string | null
) {
	try {
		const content = await fs.readFile(filePath, 'utf8');
		const lines = content.split('\n');

		let currentModuleId = '';
		let moduleOrder = 1;
		let lessonOrder = 1;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			// Detect Module Header (### Fase X: ...)
			if (line.startsWith('### **Fase') || line.startsWith('### Fase')) {
				const title = line.replace(/### \*\*|\*\*|### /g, '').trim();
				currentModuleId = generateId();
				
				try {
					await db.insert(schema.module).values({
						id: currentModuleId,
						courseId,
						title,
						order: moduleOrder++,
						createdAt: new Date(),
						updatedAt: new Date()
					}).onConflictDoNothing();
				} catch (e) {
					console.error(`Failed to insert module: ${title}`, e);
				}

				lessonOrder = 1; // Reset lesson order for new module
			}

			// Detect Lesson/Materi (* **Materi X.X: ...**)
			if (line.startsWith('* **Materi') || line.startsWith('* Materi')) {
				const title = line.replace(/\* \*\*|\*\*|\* /g, '').trim();
				const lessonId = generateId();
				
				try {
					await db.insert(schema.lesson).values({
						id: lessonId,
						moduleId: currentModuleId,
						title,
						order: lessonOrder++,
						weekNumber: Math.ceil(moduleOrder / 1),
						createdAt: new Date(),
						updatedAt: new Date()
					}).onConflictDoNothing();
				} catch (e) {
					console.error(`Failed to insert lesson: ${title}`, e);
				}

				// Add a text material for the lesson
				try {
					await db.insert(schema.material).values({
						id: generateId(),
						lessonId,
						type: 'text',
						content: `Materi untuk ${title}. (Isi materi lengkap ada di dokumen kurikulum).`,
						order: 1,
						createdAt: new Date(),
						updatedAt: new Date()
					}).onConflictDoNothing();
				} catch (e) {
					console.error(`Failed to insert material for: ${title}`, e);
				}

				// Check for Knowledge Check (KC) in the next lines
				let j = i + 1;
				while (j < lines.length && !lines[j].trim().startsWith('* **Materi') && !lines[j].trim().startsWith('* Materi') && !lines[j].trim().startsWith('###')) {
					const checkLine = lines[j].trim();
					if (checkLine.startsWith('- [ ]') || checkLine.startsWith('* [ ]')) {
						const questionText = checkLine.replace(/- \[ \]| \* \[ \]/g, '').trim();
						
						// Create a Quiz for this lesson if not exists
						const quizId = generateId();
						try {
							await db.insert(schema.quiz).values({
								id: quizId,
								lessonId,
								title: `Knowledge Check: ${title}`,
								passingScore: 100,
								createdAt: new Date()
							}).onConflictDoNothing();

							// Add assignment/question
							await db.insert(schema.quizQuestion).values({
								id: generateId(),
								quizId,
								type: 'assignment',
								question: questionText,
								order: 1
							}).onConflictDoNothing();
						} catch (e) {
							console.error(`Failed to insert quiz/question for: ${title}`, e);
						}
					}
					j++;
				}
			}
		}
	} catch (err) {
		console.error(`Error parsing ${filePath}:`, err);
	}
}
