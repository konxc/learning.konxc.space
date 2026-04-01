import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/middleware';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const couponId = event.params.id;

	const [coupon] = await db
		.select()
		.from(schema.coupon)
		.where(eq(schema.coupon.id, couponId))
		.limit(1);

	if (!coupon) throw error(404, 'Kupon tidak ditemukan');

	// Get coupon usage records
	const usages = await db
		.select({
			id: schema.couponUsage.id,
			userId: schema.couponUsage.userId,
			userName: schema.user.fullName,
			userEmail: schema.user.email,
			courseId: schema.couponUsage.courseId,
			courseTitle: schema.course.title,
			discountAmount: schema.couponUsage.discountAmount,
			orderAmount: schema.couponUsage.orderAmount,
			finalAmount: schema.couponUsage.finalAmount,
			usedAt: schema.couponUsage.usedAt
		})
		.from(schema.couponUsage)
		.innerJoin(schema.user, eq(schema.couponUsage.userId, schema.user.id))
		.leftJoin(schema.course, eq(schema.couponUsage.courseId, schema.course.id))
		.where(eq(schema.couponUsage.couponId, couponId))
		.orderBy(desc(schema.couponUsage.usedAt));

	// Aggregate stats
	const totalUsages = usages.length;
	const totalDiscount = usages.reduce((sum, u) => sum + (u.discountAmount ?? 0), 0);
	const totalRevenue = usages.reduce((sum, u) => sum + (u.finalAmount ?? 0), 0);

	return {
		coupon,
		usages,
		stats: {
			totalUsages,
			totalDiscount,
			totalRevenue,
			remainingUses: coupon.maxUses ? coupon.maxUses - coupon.currentUses : null
		}
	};
};
