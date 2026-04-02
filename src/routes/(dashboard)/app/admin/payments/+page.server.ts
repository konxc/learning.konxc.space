import type { Actions, PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/middleware';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { actionFailure, actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const url = event.url;
	const statusFilter = url.searchParams.get('status') || 'pending';
	const dateFrom = url.searchParams.get('dateFrom');
	const dateTo = url.searchParams.get('dateTo');

	const conditions = [];

	if (statusFilter !== 'all') {
		conditions.push(eq(schema.paymentProof.status, statusFilter));
	}

	if (dateFrom) {
		conditions.push(gte(schema.paymentProof.createdAt, new Date(dateFrom)));
	}

	if (dateTo) {
		const dateToEnd = new Date(dateTo);
		dateToEnd.setHours(23, 59, 59, 999);
		conditions.push(lte(schema.paymentProof.createdAt, dateToEnd));
	}

	const proofs = await db
		.select({
id: schema.paymentProof.id,
status: schema.paymentProof.status,
notes: schema.paymentProof.notes,
dataBase64: schema.paymentProof.dataBase64,
mime: schema.paymentProof.mime,
createdAt: schema.paymentProof.createdAt,
user: {
id: schema.user.id,
username: schema.user.username,
fullName: schema.user.fullName,
email: schema.user.email
},
course: {
id: schema.course.id,
title: schema.course.title,
price: schema.course.price
}
})
		.from(schema.paymentProof)
		.innerJoin(schema.user, eq(schema.paymentProof.userId, schema.user.id))
		.innerJoin(schema.course, eq(schema.paymentProof.courseId, schema.course.id))
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(schema.paymentProof.createdAt);

	const pendingResult = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.status, 'pending'));

	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const todayEnd = new Date();
	todayEnd.setHours(23, 59, 59, 999);

	const approvedTodayResult = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(schema.paymentProof)
		.where(
and(
eq(schema.paymentProof.status, 'approved'),
gte(schema.paymentProof.createdAt, todayStart),
lte(schema.paymentProof.createdAt, todayEnd)
)
);

	const rejectedTodayResult = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(schema.paymentProof)
		.where(
and(
eq(schema.paymentProof.status, 'rejected'),
gte(schema.paymentProof.createdAt, todayStart),
lte(schema.paymentProof.createdAt, todayEnd)
)
);

	// Daily revenue summary (Task 5)
	const revenueManualResult = await db
		.select({ total: sql<number>`coalesce(sum(${schema.course.price}), 0)::int` })
		.from(schema.paymentProof)
		.innerJoin(schema.course, eq(schema.paymentProof.courseId, schema.course.id))
		.where(
and(
eq(schema.paymentProof.status, 'approved'),
gte(schema.paymentProof.createdAt, todayStart),
lte(schema.paymentProof.createdAt, todayEnd)
)
);

	const revenueMidtransResult = await db
		.select({ total: sql<number>`coalesce(sum(${schema.transaction.amount}), 0)::int` })
		.from(schema.transaction)
		.where(
and(
eq(schema.transaction.status, 'settlement'),
gte(schema.transaction.createdAt, todayStart),
lte(schema.transaction.createdAt, todayEnd)
)
);

	const stats = {
		totalPending: pendingResult[0]?.count ?? 0,
		approvedToday: approvedTodayResult[0]?.count ?? 0,
		rejectedToday: rejectedTodayResult[0]?.count ?? 0,
		revenueToday: (revenueManualResult[0]?.total ?? 0) + (revenueMidtransResult[0]?.total ?? 0),
		revenueManual: revenueManualResult[0]?.total ?? 0,
		revenueMidtrans: revenueMidtransResult[0]?.total ?? 0
	};

	return {
		proofs,
		stats,
		filters: {
			status: statusFilter,
			dateFrom: dateFrom ?? '',
			dateTo: dateTo ?? ''
		}
	};
};

async function approveProofById(proofId: string): Promise<boolean> {
	const proof = await db
		.select()
		.from(schema.paymentProof)
		.where(eq(schema.paymentProof.id, proofId))
		.limit(1);

	if (proof.length === 0) return false;

	await db
		.update(schema.paymentProof)
		.set({ status: 'approved' })
		.where(eq(schema.paymentProof.id, proofId));

	await db
		.update(schema.enrollment)
		.set({ status: 'active', activatedAt: new Date() })
		.where(
and(
eq(schema.enrollment.userId, proof[0].userId),
eq(schema.enrollment.courseId, proof[0].courseId)
)
);

	const courseResult = await db
		.select({ title: schema.course.title })
		.from(schema.course)
		.where(eq(schema.course.id, proof[0].courseId))
		.limit(1);

	const courseTitle = courseResult[0]?.title ?? proof[0].courseId;

	await db.insert(schema.notification).values({
id: crypto.randomUUID(),
		userId: proof[0].userId,
		type: 'enrollment',
		title: 'Pembayaran Dikonfirmasi \u2705',
		message: `Pembayaran kamu untuk course "${courseTitle}" telah dikonfirmasi. Selamat belajar!`,
		link: '/app/learning',
		read: false
	});

	return true;
}

export const actions: Actions = {
	approve: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const proofId = formData.get('proofId') as string;

		if (!proofId) return actionFailure(400, 'Missing proof ID');

		const ok = await approveProofById(proofId);
		if (!ok) return actionFailure(404, 'Payment proof not found');

		return actionSuccess({ message: 'Payment proof approved and enrollment activated' });
	},

	reject: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const proofId = formData.get('proofId') as string;
		const notes = formData.get('notes') as string;

		if (!proofId) return actionFailure(400, 'Missing proof ID');

		const proof = await db
			.select()
			.from(schema.paymentProof)
			.where(eq(schema.paymentProof.id, proofId))
			.limit(1);

		await db
			.update(schema.paymentProof)
			.set({ status: 'rejected', notes: notes || null })
			.where(eq(schema.paymentProof.id, proofId));

		if (proof[0]) {
			await db.insert(schema.notification).values({
id: crypto.randomUUID(),
				userId: proof[0].userId,
				type: 'system',
				title: 'Bukti Pembayaran Ditolak',
				message: `Bukti pembayaran kamu ditolak.${notes ? ` Alasan: ${notes}` : ' Silakan upload ulang bukti yang valid.'}`,
				link: '/app/payments',
				read: false
			});
		}

		return actionSuccess({ message: 'Payment proof rejected' });
	},

	bulkApprove: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const proofIdsRaw = formData.get('proofIds') as string;

		if (!proofIdsRaw) return actionFailure(400, 'No proof IDs provided');

		const proofIds = proofIdsRaw
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);

		if (proofIds.length === 0) return actionFailure(400, 'No valid proof IDs');

		let approvedCount = 0;
		for (const proofId of proofIds) {
			const ok = await approveProofById(proofId);
			if (ok) approvedCount++;
		}

		return actionSuccess({
message: `${approvedCount} bukti pembayaran berhasil di-approve`,
data: { approvedCount }
});
	},

	exportCSV: async (event) => {
		await requireAdmin(event);

		const formData = await event.request.formData();
		const dateFrom = formData.get('dateFrom') as string;
		const dateTo = formData.get('dateTo') as string;

		const proofConditions = [];
		const txConditions = [];

		if (dateFrom) {
			proofConditions.push(gte(schema.paymentProof.createdAt, new Date(dateFrom)));
			txConditions.push(gte(schema.transaction.createdAt, new Date(dateFrom)));
		}
		if (dateTo) {
			const end = new Date(dateTo);
			end.setHours(23, 59, 59, 999);
			proofConditions.push(lte(schema.paymentProof.createdAt, end));
			txConditions.push(lte(schema.transaction.createdAt, end));
		}

		const proofs = await db
			.select({
createdAt: schema.paymentProof.createdAt,
status: schema.paymentProof.status,
userFullName: schema.user.fullName,
userUsername: schema.user.username,
courseTitle: schema.course.title,
coursePrice: schema.course.price
})
			.from(schema.paymentProof)
			.innerJoin(schema.user, eq(schema.paymentProof.userId, schema.user.id))
			.innerJoin(schema.course, eq(schema.paymentProof.courseId, schema.course.id))
			.where(proofConditions.length > 0 ? and(...proofConditions) : undefined)
			.orderBy(schema.paymentProof.createdAt);

		const transactions = await db
			.select({
createdAt: schema.transaction.createdAt,
status: schema.transaction.status,
amount: schema.transaction.amount,
userFullName: schema.user.fullName,
userUsername: schema.user.username,
courseTitle: schema.course.title
})
			.from(schema.transaction)
			.innerJoin(schema.user, eq(schema.transaction.userId, schema.user.id))
			.leftJoin(schema.course, eq(schema.transaction.courseId, schema.course.id))
			.where(txConditions.length > 0 ? and(...txConditions) : undefined)
			.orderBy(schema.transaction.createdAt);

		const rows: string[] = ['Date,Student,Course,Method,Amount,Status'];

		for (const p of proofs) {
			const date = new Date(p.createdAt).toISOString().split('T')[0];
			const student = (p.userFullName || p.userUsername || '').replace(/,/g, ';');
			const course = p.courseTitle.replace(/,/g, ';');
			rows.push(`${date},${student},${course},Manual,${p.coursePrice},${p.status}`);
		}

		for (const t of transactions) {
			const date = new Date(t.createdAt).toISOString().split('T')[0];
			const student = (t.userFullName || t.userUsername || '').replace(/,/g, ';');
			const course = (t.courseTitle ?? '').replace(/,/g, ';');
			rows.push(`${date},${student},${course},Midtrans,${t.amount},${t.status}`);
		}

		const csv = rows.join('\n');
		const today = new Date().toISOString().split('T')[0];

		return new Response(csv, {
headers: {
'Content-Type': 'text/csv',
'Content-Disposition': `attachment; filename="payments-${today}.csv"`
}
});
	}
} satisfies Actions;
