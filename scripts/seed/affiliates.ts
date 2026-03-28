import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export async function seedAffiliateLinks(db: LibSQLDatabase<typeof schema>, userIds: string[]) {
	logSection('Seeding affiliate links');

	const links = [
		{
			id: 'afflink-001',
			userId: userIds[0],
			name: 'Kursus Python Premium',
			platform: 'udemy',
			url: 'https://udemy.com/course/python-master',
			productPrice: 1500000,
			commissionRate: 30,
			status: 'active',
			createdAt: new Date('2024-02-01')
		},
		{
			id: 'afflink-002',
			userId: userIds[0],
			name: 'Ebook Digital Marketing',
			platform: 'digistore24',
			url: 'https://digistore24.com/product/12345',
			productPrice: 99000,
			commissionRate: 50,
			status: 'active',
			createdAt: new Date('2024-02-05')
		},
		{
			id: 'afflink-003',
			userId: userIds[1],
			name: 'Tools Desain Grafis',
			platform: 'creative_market',
			url: 'https://creativemarket.com/toolsdesign',
			productPrice: 250000,
			commissionRate: 25,
			status: 'active',
			createdAt: new Date('2024-02-10')
		},
		{
			id: 'afflink-004',
			userId: userIds[2],
			name: 'Hosting Unlimited',
			platform: 'hostinger',
			url: 'https://hostinger.com/affiliate/xyz',
			productPrice: 360000,
			commissionRate: 20,
			status: 'active',
			createdAt: new Date('2024-02-15')
		}
	];

	for (const link of links) {
		await db.insert(schema.affiliateLink).values(link).onConflictDoNothing();
	}

	logSuccess(`Seeded ${links.length} affiliate links`);
	return links;
}

export async function seedAffiliateSales(db: LibSQLDatabase<typeof schema>, userIds: string[], linkIds: string[]) {
	logSection('Seeding affiliate sales');

	const sales = [
		{
			id: generateId(),
			affiliateLinkId: linkIds[0],
			userId: userIds[0],
			productName: 'Kursus Python Premium',
			platform: 'udemy',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-001',
			status: 'paid',
			createdAt: new Date('2024-02-10')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[0],
			userId: userIds[0],
			productName: 'Kursus Python Premium',
			platform: 'udemy',
			saleAmount: 1500000,
			commissionAmount: 450000,
			transactionId: 'TRX-2024-002',
			status: 'paid',
			createdAt: new Date('2024-02-15')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[1],
			userId: userIds[0],
			productName: 'Ebook Digital Marketing',
			platform: 'digistore24',
			saleAmount: 99000,
			commissionAmount: 49500,
			transactionId: 'TRX-2024-003',
			status: 'paid',
			createdAt: new Date('2024-02-18')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[1],
			userId: userIds[0],
			productName: 'Ebook Digital Marketing',
			platform: 'digistore24',
			saleAmount: 99000,
			commissionAmount: 49500,
			transactionId: 'TRX-2024-004',
			status: 'pending',
			createdAt: new Date('2024-02-20')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[2],
			userId: userIds[1],
			productName: 'Tools Desain Grafis',
			platform: 'creative_market',
			saleAmount: 250000,
			commissionAmount: 62500,
			transactionId: 'TRX-2024-005',
			status: 'paid',
			createdAt: new Date('2024-02-12')
		},
		{
			id: generateId(),
			affiliateLinkId: linkIds[3],
			userId: userIds[2],
			productName: 'Hosting Unlimited',
			platform: 'hostinger',
			saleAmount: 360000,
			commissionAmount: 72000,
			transactionId: 'TRX-2024-006',
			status: 'paid',
			createdAt: new Date('2024-02-16')
		}
	];

	for (const sale of sales) {
		await db.insert(schema.affiliateSale).values(sale).onConflictDoNothing();
	}

	logSuccess(`Seeded ${sales.length} affiliate sales`);
}
