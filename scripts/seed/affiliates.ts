import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedAffiliateLinks(db: LibSQLDatabase<typeof schema>, studentIds: string[]) {
	logSection('Seeding affiliate links (15 links)');

	const links = [
		// Student 1 - Active affiliate
		{
			id: 'afflink-001',
			userId: studentIds[0],
			name: 'Kursus Python Naik Kelas',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/python',
			productPrice: 1800000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-02-15')
		},
		{
			id: 'afflink-002',
			userId: studentIds[0],
			name: 'Akselerasi Bisnis Digital',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/akselerasi-bisnis',
			productPrice: 1500000,
			commissionRate: 30,
			status: 'active',
			createdAt: new Date('2024-02-20')
		},
		// Student 2
		{
			id: 'afflink-003',
			userId: studentIds[1],
			name: 'Content Creator Mastery',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/content-creator',
			productPrice: 1200000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-03-01')
		},
		// Student 3
		{
			id: 'afflink-004',
			userId: studentIds[2],
			name: 'E-Commerce Success',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/ecommerce',
			productPrice: 1300000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-03-05')
		},
		{
			id: 'afflink-005',
			userId: studentIds[2],
			name: 'Affiliate Marketing Pro',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/affiliate-pro',
			productPrice: 950000,
			commissionRate: 35,
			status: 'active',
			createdAt: new Date('2024-03-10')
		},
		// Student 4
		{
			id: 'afflink-006',
			userId: studentIds[3],
			name: 'Full Stack Web Dev',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/fullstack',
			productPrice: 2500000,
			commissionRate: 20,
			status: 'active',
			createdAt: new Date('2024-03-15')
		},
		// Student 5
		{
			id: 'afflink-007',
			userId: studentIds[4],
			name: 'Digital Marketing Lengkap',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/digital-marketing',
			productPrice: 1500000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-03-20')
		},
		// Student 10
		{
			id: 'afflink-008',
			userId: studentIds[9],
			name: 'Akselerasi Bisnis Digital',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/akselerasi-bisnis',
			productPrice: 1500000,
			commissionRate: 30,
			status: 'active',
			createdAt: new Date('2024-04-01')
		},
		// Student 15
		{
			id: 'afflink-009',
			userId: studentIds[14],
			name: 'Content Creator Mastery',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/content-creator',
			productPrice: 1200000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-04-05')
		},
		// Student 20
		{
			id: 'afflink-010',
			userId: studentIds[19],
			name: 'UI/UX Design',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/uiux-design',
			productPrice: 1400000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-04-10')
		},
		// Student 25
		{
			id: 'afflink-011',
			userId: studentIds[24],
			name: 'Python Data Science',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/python-data',
			productPrice: 1800000,
			commissionRate: 20,
			status: 'active',
			createdAt: new Date('2024-04-15')
		},
		// Student 30
		{
			id: 'afflink-012',
			userId: studentIds[29],
			name: 'Brand Building',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/brand-building',
			productPrice: 1100000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-05-01')
		},
		// Student 35
		{
			id: 'afflink-013',
			userId: studentIds[34],
			name: 'Video Production',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/video-production',
			productPrice: 1600000,
			commissionRate: 20,
			status: 'active',
			createdAt: new Date('2024-05-05')
		},
		// Student 40
		{
			id: 'afflink-014',
			userId: studentIds[39],
			name: 'Mobile App Flutter',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/mobile-flutter',
			productPrice: 2200000,
			commissionRate: 20,
			status: 'active',
			createdAt: new Date('2024-05-10')
		},
		// Student 45 - inactive
		{
			id: 'afflink-015',
			userId: studentIds[44],
			name: 'Keuangan UMKM',
			platform: 'naikkelas',
			url: 'https://naikkelas.id/course/keuangan-umkm',
			productPrice: 950000,
			commissionRate: 25,
			status: 'inactive',
			createdAt: new Date('2024-05-15')
		}
	];

	for (const link of links) {
		await db.insert(schema.affiliateLink).values(link).onConflictDoNothing();
	}

	logSuccess(`Seeded ${links.length} affiliate links`);
	return links;
}

export async function seedAffiliateSales(
	db: LibSQLDatabase<typeof schema>,
	studentIds: string[],
	linkIds: string[]
) {
	logSection('Seeding affiliate sales (20 sales)');

	const sales = [
		// Sales from link 1 (Student 0)
		{
			id: generateId(),
			affiliateLinkId: linkIds[0],
			userId: studentIds[5],
			productName: 'Kursus Python Naik Kelas',
			platform: 'naikkelas',
			saleAmount: 1800000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-0001',
			status: 'paid',
			createdAt: new Date('2024-02-20')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[0],
			userId: studentIds[6],
			productName: 'Kursus Python Naik Kelas',
			platform: 'naikkelas',
			saleAmount: 1800000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-0002',
			status: 'paid',
			createdAt: new Date('2024-02-25')
		},
		// Sales from link 2 (Student 0)
		{
			id: generateId(),
			affiliateLinkId: linkIds[1],
			userId: studentIds[10],
			productName: 'Akselerasi Bisnis Digital',
			platform: 'naikkelas',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-0003',
			status: 'paid',
			createdAt: new Date('2024-03-01')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[1],
			userId: studentIds[11],
			productName: 'Akselerasi Bisnis Digital',
			platform: 'naikkelas',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-0004',
			status: 'pending',
			createdAt: new Date('2024-03-05')
		},
		// Sales from link 3 (Student 1)
		{
			id: generateId(),
			affiliateLinkId: linkIds[2],
			userId: studentIds[15],
			productName: 'Content Creator Mastery',
			platform: 'naikkelas',
			saleAmount: 1200000,
			commissionAmount: 300000,
			transactionId: 'TRX-2024-0005',
			status: 'paid',
			createdAt: new Date('2024-03-10')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[2],
			userId: studentIds[16],
			productName: 'Content Creator Mastery',
			platform: 'naikkelas',
			saleAmount: 1200000,
			commissionAmount: 300000,
			transactionId: 'TRX-2024-0006',
			status: 'paid',
			createdAt: new Date('2024-03-15')
		},
		// Sales from link 4 (Student 2)
		{
			id: generateId(),
			affiliateLinkId: linkIds[3],
			userId: studentIds[17],
			productName: 'E-Commerce Success',
			platform: 'naikkelas',
			saleAmount: 1300000,
			commissionAmount: 325000,
			transactionId: 'TRX-2024-0007',
			status: 'paid',
			createdAt: new Date('2024-03-20')
		},
		// Sales from link 5 (Student 2)
		{
			id: generateId(),
			affiliateLinkId: linkIds[4],
			userId: studentIds[18],
			productName: 'Affiliate Marketing Pro',
			platform: 'naikkelas',
			saleAmount: 950000,
			commissionAmount: 332500,
			transactionId: 'TRX-2024-0008',
			status: 'paid',
			createdAt: new Date('2024-03-25')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[4],
			userId: studentIds[20],
			productName: 'Affiliate Marketing Pro',
			platform: 'naikkelas',
			saleAmount: 950000,
			commissionAmount: 332500,
			transactionId: 'TRX-2024-0009',
			status: 'pending',
			createdAt: new Date('2024-03-28')
		},
		// Sales from link 7 (Student 4)
		{
			id: generateId(),
			affiliateLinkId: linkIds[6],
			userId: studentIds[21],
			productName: 'Digital Marketing Lengkap',
			platform: 'naikkelas',
			saleAmount: 1500000,
			commissionAmount: 375000,
			transactionId: 'TRX-2024-0010',
			status: 'paid',
			createdAt: new Date('2024-04-01')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[6],
			userId: studentIds[22],
			productName: 'Digital Marketing Lengkap',
			platform: 'naikkelas',
			saleAmount: 1500000,
			commissionAmount: 375000,
			transactionId: 'TRX-2024-0011',
			status: 'paid',
			createdAt: new Date('2024-04-05')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[6],
			userId: studentIds[23],
			productName: 'Digital Marketing Lengkap',
			platform: 'naikkelas',
			saleAmount: 1500000,
			commissionAmount: 375000,
			transactionId: 'TRX-2024-0012',
			status: 'rejected',
			createdAt: new Date('2024-04-08')
		},
		// Sales from link 8 (Student 9)
		{
			id: generateId(),
			affiliateLinkId: linkIds[7],
			userId: studentIds[25],
			productName: 'Akselerasi Bisnis Digital',
			platform: 'naikkelas',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-0013',
			status: 'paid',
			createdAt: new Date('2024-04-15')
		},
		// Sales from link 9 (Student 14)
		{
			id: generateId(),
			affiliateLinkId: linkIds[8],
			userId: studentIds[26],
			productName: 'Content Creator Mastery',
			platform: 'naikkelas',
			saleAmount: 1200000,
			commissionAmount: 300000,
			transactionId: 'TRX-2024-0014',
			status: 'paid',
			createdAt: new Date('2024-04-20')
		},
		// Sales from link 10 (Student 19)
		{
			id: generateId(),
			affiliateLinkId: linkIds[9],
			userId: studentIds[27],
			productName: 'UI/UX Design',
			platform: 'naikkelas',
			saleAmount: 1400000,
			commissionAmount: 350000,
			transactionId: 'TRX-2024-0015',
			status: 'paid',
			createdAt: new Date('2024-05-01')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[9],
			userId: studentIds[28],
			productName: 'UI/UX Design',
			platform: 'naikkelas',
			saleAmount: 1400000,
			commissionAmount: 350000,
			transactionId: 'TRX-2024-0016',
			status: 'pending',
			createdAt: new Date('2024-05-05')
		},
		// Sales from link 11 (Student 24)
		{
			id: generateId(),
			affiliateLinkId: linkIds[10],
			userId: studentIds[30],
			productName: 'Python Data Science',
			platform: 'naikkelas',
			saleAmount: 1800000,
			commissionAmount: 360000,
			transactionId: 'TRX-2024-0017',
			status: 'paid',
			createdAt: new Date('2024-05-10')
		},
		// Sales from link 12 (Student 29)
		{
			id: generateId(),
			affiliateLinkId: linkIds[11],
			userId: studentIds[31],
			productName: 'Brand Building',
			platform: 'naikkelas',
			saleAmount: 1100000,
			commissionAmount: 275000,
			transactionId: 'TRX-2024-0018',
			status: 'paid',
			createdAt: new Date('2024-05-15')
		},
		// Sales from link 13 (Student 34)
		{
			id: generateId(),
			affiliateLinkId: linkIds[12],
			userId: studentIds[32],
			productName: 'Video Production',
			platform: 'naikkelas',
			saleAmount: 1600000,
			commissionAmount: 320000,
			transactionId: 'TRX-2024-0019',
			status: 'paid',
			createdAt: new Date('2024-05-20')
		},
		// Sales from link 14 (Student 39)
		{
			id: generateId(),
			affiliateLinkId: linkIds[13],
			userId: studentIds[33],
			productName: 'Mobile App Flutter',
			platform: 'naikkelas',
			saleAmount: 2200000,
			commissionAmount: 440000,
			transactionId: 'TRX-2024-0020',
			status: 'pending',
			createdAt: new Date('2024-05-25')
		}
	];

	for (const sale of sales) {
		await db.insert(schema.affiliateSale).values(sale).onConflictDoNothing();
	}

	logSuccess(`Seeded ${sales.length} affiliate sales`);
}
