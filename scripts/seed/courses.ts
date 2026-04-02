import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

const THUMBNAILS = {
	marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
	technical: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
	business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
	design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
	finance: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
	content: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=500&fit=crop',
	ecommerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
	affiliate: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=500&fit=crop',
	video: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=500&fit=crop',
	branding: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=500&fit=crop'
};

export async function seedCourses(db: NeonHttpDatabase<typeof schema>, adminId: string) {
	logSection('Seeding courses (15 courses)');

	const courses = [
		// ===== MARKETING TRACK COURSES (enable tracks) =====
		{
			id: 'course-001',
			orgId: 'org-koneksi', // Koneksi Digital Academy
			title: 'Akselerasi Bisnis Digital (Naik Kelas)',
			description:
				'Program akselerasi bisnis untuk UMKM dan Content Creator. Praktek langsung membangun bisnis dari nol hingga profit. Cocok untuk yang ingin memulai bisnis digital.',
			thumbnailUrl: THUMBNAILS.marketing,
			price: 1500000,
			duration: 8,
			status: 'published',
			visibility: 'public',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: true, affiliate: true, performance: true }),
			mentorId: 'mentor-001',
			createdBy: adminId,
			createdAt: new Date('2024-01-10'),
			updatedAt: new Date('2024-01-10')
		},
		{
			id: 'course-002',
			orgId: 'org-koneksi', // Koneksi Digital Academy
			title: 'Content Creator Mastery',
			description:
				'Kuasai seni membuat konten yang menarik dan menghasilkan. Pelajari strategi growth hacking, editing video profesional, dan monetisasi konten di platform YouTube, TikTok, dan Instagram.',
			thumbnailUrl: THUMBNAILS.content,
			price: 1200000,
			duration: 6,
			status: 'published',
			visibility: 'public',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: true, affiliate: true, performance: true }),
			mentorId: 'mentor-002',
			createdBy: adminId,
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15')
		},
		{
			id: 'course-003',
			orgId: 'org-marketinglab', // Marketing Lab Indonesia
			title: 'E-Commerce Success Blueprint',
			description:
				'Pelajari cara membangun dan mengembangkan bisnis e-commerce dari nol. Strategi marketplace, manajemen inventori, customer service, dan optimasi konversi penjualan.',
			thumbnailUrl: THUMBNAILS.ecommerce,
			price: 1300000,
			duration: 7,
			status: 'published',
			visibility: 'public',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: true, affiliate: true, performance: true }),
			mentorId: 'mentor-003',
			createdBy: adminId,
			createdAt: new Date('2024-01-20'),
			updatedAt: new Date('2024-01-20')
		},
		{
			id: 'course-004',
			orgId: 'org-koneksi', // Koneksi Digital Academy
			title: 'Affiliate Marketing Pro',
			description:
				'Menjadi affiliate marketer profesional. Pelajari cara memilih produk, membangun audience, create high-converting content, dan optimasi komisi affiliate secara konsisten.',
			thumbnailUrl: THUMBNAILS.affiliate,
			price: 950000,
			duration: 5,
			status: 'published',
			visibility: 'public',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: true, affiliate: true, performance: true }),
			mentorId: 'mentor-001',
			createdBy: adminId,
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01')
		},

		// ===== TECHNICAL COURSES =====
		{
			id: 'course-005',
			title: 'Python untuk Data Science',
			description:
				'Belajar Python dari dasar hingga mahir untuk data science. Termasuk NumPy, Pandas, Matplotlib, dan machine learning basics dengan scikit-learn.',
			thumbnailUrl: THUMBNAILS.technical,
			price: 1800000,
			duration: 10,
			status: 'published',
			visibility: 'public',
			category: 'technical',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-004',
			createdBy: adminId,
			createdAt: new Date('2024-02-05'),
			updatedAt: new Date('2024-02-05')
		},
		{
			id: 'course-006',
			title: 'Full Stack Web Development',
			description:
				'Jadi full stack developer lengkap. Pelajari HTML, CSS, JavaScript, React, Node.js, dan database. Bangun portfolio proyek nyata dari frontend hingga backend.',
			thumbnailUrl: THUMBNAILS.technical,
			price: 2500000,
			duration: 12,
			status: 'published',
			visibility: 'public',
			category: 'technical',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-005',
			createdBy: adminId,
			createdAt: new Date('2024-02-10'),
			updatedAt: new Date('2024-02-10')
		},
		{
			id: 'course-007',
			title: 'Mobile App Development dengan Flutter',
			description:
				'Kembangkan aplikasi mobile cross-platform dengan Flutter dan Dart. Dari design UI hingga publish di Google Play dan App Store.',
			thumbnailUrl: THUMBNAILS.technical,
			price: 2200000,
			duration: 10,
			status: 'published',
			visibility: 'public',
			category: 'technical',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-004',
			createdBy: adminId,
			createdAt: new Date('2024-02-15'),
			updatedAt: new Date('2024-02-15')
		},

		// ===== BUSINESS COURSES =====
		{
			id: 'course-008',
			title: 'Digital Marketing Lengkap',
			description:
				'Kuasai seluruh aspek digital marketing: SEO, SEM, Social Media Marketing, Email Marketing, dan Analytics. Strategi terbukti untuk meningkatkan penjualan online.',
			thumbnailUrl: THUMBNAILS.marketing,
			price: 1500000,
			duration: 8,
			status: 'published',
			visibility: 'public',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-002',
			createdBy: adminId,
			createdAt: new Date('2024-02-20'),
			updatedAt: new Date('2024-02-20')
		},
		{
			id: 'course-009',
			title: 'Brand Building & Strategy',
			description:
				'Pelajari cara membangun brand yang kuat dan berkesan. Dari brand identity, positioning, storytelling, hingga brand management jangka panjang.',
			thumbnailUrl: THUMBNAILS.branding,
			price: 1100000,
			duration: 5,
			status: 'published',
			visibility: 'public',
			category: 'business',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-006',
			createdBy: adminId,
			createdAt: new Date('2024-03-01'),
			updatedAt: new Date('2024-03-01')
		},
		{
			id: 'course-010',
			title: 'Keuangan untuk UMKM',
			description:
				'Kelola keuangan bisnis dengan benar. Pelajari accounting dasar, cash flow management, budgeting, dan financial planning untuk pertumbuhan bisnis.',
			thumbnailUrl: THUMBNAILS.finance,
			price: 950000,
			duration: 6,
			status: 'published',
			visibility: 'public',
			category: 'business',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-006',
			createdBy: adminId,
			createdAt: new Date('2024-03-05'),
			updatedAt: new Date('2024-03-05')
		},

		// ===== DESIGN COURSES =====
		{
			id: 'course-011',
			title: 'UI/UX Design Fundamentals',
			description:
				'Kuasai dasar-dasar UI/UX design. Pelajari design thinking, wireframing, prototyping dengan Figma, dan user research untuk menciptakan produk digital yang user-friendly.',
			thumbnailUrl: THUMBNAILS.design,
			price: 1400000,
			duration: 7,
			status: 'published',
			visibility: 'public',
			category: 'design',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-003',
			createdBy: adminId,
			createdAt: new Date('2024-03-10'),
			updatedAt: new Date('2024-03-10')
		},
		{
			id: 'course-012',
			title: 'Video Production Professional',
			description:
				'Dari ide hingga upload. Pelajari pre-production, shooting techniques, lighting, audio, editing dengan Adobe Premiere Pro, dan color grading.',
			thumbnailUrl: THUMBNAILS.video,
			price: 1600000,
			duration: 8,
			status: 'published',
			visibility: 'public',
			category: 'design',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-005',
			createdBy: adminId,
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-03-15')
		},

		// ===== DRAFT COURSES (upcoming) =====
		{
			id: 'course-013',
			title: 'Social Media Growth Hacking',
			description:
				'Strategi advanced untuk pertumbuhan akun social media yang eksponensial. Organic growth, paid ads, dan community building.',
			thumbnailUrl: THUMBNAILS.marketing,
			price: 850000,
			duration: 4,
			status: 'draft',
			visibility: 'private',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: true, affiliate: true, performance: true }),
			mentorId: 'mentor-002',
			createdBy: adminId,
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-04-01')
		},
		{
			id: 'course-014',
			title: 'SEO Mastery',
			description:
				'Kuasai teknik SEO terkini. Keyword research, on-page optimization, link building, technical SEO, dan local SEO untuk ranking #1 Google.',
			thumbnailUrl: THUMBNAILS.technical,
			price: 1100000,
			duration: 6,
			status: 'draft',
			visibility: 'private',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-004',
			createdBy: adminId,
			createdAt: new Date('2024-04-05'),
			updatedAt: new Date('2024-04-05')
		},
		{
			id: 'course-015',
			title: 'Email Marketing untuk Penjualan',
			description:
				'Bangun dan kelola database email. Buat sequence email yang converting, automation, dan optimasi open rate & click-through rate.',
			thumbnailUrl: THUMBNAILS.marketing,
			price: 750000,
			duration: 4,
			status: 'draft',
			visibility: 'private',
			category: 'marketing',
			featuresConfig: JSON.stringify({ tracks: false, affiliate: true, performance: true }),
			mentorId: 'mentor-001',
			createdBy: adminId,
			createdAt: new Date('2024-04-10'),
			updatedAt: new Date('2024-04-10')
		}
	];

	for (const course of courses) {
		await db.insert(schema.course).values(course).onConflictDoNothing();
	}

	logSuccess(`Seeded ${courses.length} courses`);
	return courses;
}

export async function seedCoupons(db: NeonHttpDatabase<typeof schema>, adminId: string) {
	logSection('Seeding coupons');

	const coupons = [
		{
			id: 'coupon-001',
			code: 'WELCOME50',
			type: 'discount',
			discountType: 'percentage',
			discountValue: 50,
			maxUses: 100,
			currentUses: 23,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2025-12-31'),
			description: 'Diskon 50% untuk semua course - Welcome offer!',
			applicableCourses: null,
			minPurchaseAmount: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		},
		{
			id: 'coupon-002',
			code: 'DISKON200K',
			type: 'discount',
			discountType: 'fixed',
			discountValue: 200000,
			maxUses: 50,
			currentUses: 12,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2025-06-30'),
			description: 'Potongan harga tetap Rp 200.000 untuk minimal pembelian Rp 1.000.000',
			applicableCourses: null,
			minPurchaseAmount: 1000000,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		},
		{
			id: 'coupon-003',
			code: 'GRATISKELAS',
			type: 'free',
			discountType: null,
			discountValue: null,
			maxUses: 20,
			currentUses: 5,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2024-12-31'),
			description: 'Kelas gratis untuk course tertentu - Sponsorship program',
			applicableCourses: null,
			minPurchaseAmount: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		},
		{
			id: 'coupon-004',
			code: 'RAMADHAN2024',
			type: 'discount',
			discountType: 'percentage',
			discountValue: 30,
			maxUses: 200,
			currentUses: 87,
			validFrom: new Date('2024-03-10'),
			validUntil: new Date('2024-04-10'),
			description: 'Diskon spesial bulan Ramadhan 30% semua course',
			applicableCourses: null,
			minPurchaseAmount: null,
			createdBy: adminId,
			createdAt: new Date('2024-03-01'),
			isActive: true
		},
		{
			id: 'coupon-005',
			code: 'REFERENSI',
			type: 'discount',
			discountType: 'fixed',
			discountValue: 150000,
			maxUses: 500,
			currentUses: 34,
			validFrom: new Date('2024-01-01'),
			validUntil: new Date('2025-12-31'),
			description: 'Diskon referral untuk teman yang direferensikan',
			applicableCourses: null,
			minPurchaseAmount: null,
			createdBy: adminId,
			createdAt: new Date('2024-01-01'),
			isActive: true
		}
	];

	for (const coupon of coupons) {
		await db.insert(schema.coupon).values(coupon).onConflictDoNothing();
	}

	logSuccess(`Seeded ${coupons.length} coupons`);
	return coupons;
}

export async function seedEnrollments(
	db: NeonHttpDatabase<typeof schema>,
	studentIds: string[],
	courseIds: string[],
	couponIds: string[],
	cohortIds: string[]
) {
	logSection('Seeding enrollments with tracks (80 enrollments)');

	const tracks = ['creator', 'seller', 'affiliate'] as const;
	const statuses = ['active', 'active', 'active', 'active', 'completed', 'pending'] as const;

	const enrollments = [];

	// Course 0 (Akselerasi Bisnis Digital) - Popular, many enrollments with tracks
	for (let i = 0; i < 20; i++) {
		const studentIdx = i % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[0],
			cohortId: cohortIds[0],
			couponId: i % 5 === 0 ? couponIds[0] : null,
			track: tracks[i % 3],
			status: statuses[i % statuses.length],
			enrolledAt: new Date(2024, 0, 15 + (i % 14)),
			activatedAt: new Date(2024, 0, 15 + (i % 14)),
			completedAt: statuses[i % statuses.length] === 'completed' ? new Date(2024, 3, 1 + i) : null
		});
	}

	// Course 1 (Content Creator) - Many enrollments with creator track
	for (let i = 0; i < 15; i++) {
		const studentIdx = (i + 10) % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[1],
			cohortId: cohortIds[1],
			couponId: i % 4 === 0 ? couponIds[1] : null,
			track: i < 10 ? 'creator' : tracks[i % 3],
			status: i < 12 ? 'active' : 'completed',
			enrolledAt: new Date(2024, 1, 1 + (i % 10)),
			activatedAt: new Date(2024, 1, 1 + (i % 10)),
			completedAt: i >= 12 ? new Date(2024, 4, 1 + i) : null
		});
	}

	// Course 2 (E-Commerce) - Seller track focus
	for (let i = 0; i < 12; i++) {
		const studentIdx = (i + 20) % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[2],
			cohortId: cohortIds[2],
			couponId: null,
			track: i < 8 ? 'seller' : tracks[i % 3],
			status: i < 10 ? 'active' : 'completed',
			enrolledAt: new Date(2024, 2, 1 + (i % 8)),
			activatedAt: new Date(2024, 2, 1 + (i % 8)),
			completedAt: i >= 10 ? new Date(2024, 5, 1 + i) : null
		});
	}

	// Course 3 (Affiliate Marketing) - Affiliate track focus
	for (let i = 0; i < 10; i++) {
		const studentIdx = (i + 30) % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[3],
			cohortId: cohortIds[3],
			couponId: i % 3 === 0 ? couponIds[4] : null,
			track: i < 7 ? 'affiliate' : tracks[i % 3],
			status: i < 8 ? 'active' : 'completed',
			enrolledAt: new Date(2024, 3, 1 + (i % 8)),
			activatedAt: new Date(2024, 3, 1 + (i % 8)),
			completedAt: i >= 8 ? new Date(2024, 6, 1 + i) : null
		});
	}

	// Course 4 (Python) - Technical, no track
	for (let i = 0; i < 8; i++) {
		const studentIdx = (i + 40) % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[4],
			cohortId: null,
			couponId: null,
			track: null,
			status: i < 6 ? 'active' : 'completed',
			enrolledAt: new Date(2024, 4, 1 + (i % 8)),
			activatedAt: new Date(2024, 4, 1 + (i % 8)),
			completedAt: i >= 6 ? new Date(2024, 7, 1 + i) : null
		});
	}

	// Course 5 (Full Stack) - Technical, no track
	for (let i = 0; i < 8; i++) {
		const studentIdx = (i + 45) % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[5],
			cohortId: null,
			couponId: null,
			track: null,
			status: i < 7 ? 'active' : 'completed',
			enrolledAt: new Date(2024, 5, 1 + (i % 8)),
			activatedAt: new Date(2024, 5, 1 + (i % 8)),
			completedAt: i >= 7 ? new Date(2024, 8, 1 + i) : null
		});
	}

	// Course 8 (Digital Marketing) - Mixed
	for (let i = 0; i < 7; i++) {
		const studentIdx = (i + 50) % studentIds.length;
		enrollments.push({
			id: generateId(),
			userId: studentIds[studentIdx],
			courseId: courseIds[8],
			cohortId: null,
			couponId: i % 5 === 0 ? couponIds[3] : null,
			track: tracks[i % 3],
			status: 'active',
			enrolledAt: new Date(2024, 6, 1 + (i % 7)),
			activatedAt: new Date(2024, 6, 1 + (i % 7)),
			completedAt: null
		});
	}

	for (const enrollment of enrollments) {
		await db.insert(schema.enrollment).values(enrollment).onConflictDoNothing();
	}

	logSuccess(`Seeded ${enrollments.length} enrollments`);
}
