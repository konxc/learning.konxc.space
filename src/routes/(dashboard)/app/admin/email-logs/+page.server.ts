import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { desc, eq } from 'drizzle-orm';
import { actionSuccess } from '$lib/server/actions';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);

	const emailLogs = await db
		.select()
		.from(schema.emailLog)
		.orderBy(desc(schema.emailLog.createdAt))
		.limit(100);

	const whatsappLogs = await db
		.select()
		.from(schema.whatsappLog)
		.orderBy(desc(schema.whatsappLog.createdAt))
		.limit(100);

	return { emailLogs, whatsappLogs };
};

export const actions: Actions = {
	resendEmail: async (event) => {
		await requireAdmin(event);
		const formData = await event.request.formData();
		const emailId = formData.get('emailId') as string;

		if (!emailId) return actionSuccess();

		// Mark as pending for retry
		await db
			.update(schema.emailLog)
			.set({ status: 'pending', error: null })
			.where(eq(schema.emailLog.id, emailId));

		return actionSuccess();
	}
};
