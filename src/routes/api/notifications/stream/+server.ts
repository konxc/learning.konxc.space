import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, count, gt } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const userId = locals.user.id;

	const stream = new ReadableStream({
		start(controller) {
			let lastChecked = new Date();
			let closed = false;

			function send(data: Record<string, unknown>) {
				if (closed) return;
				try {
					controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
				} catch {
					closed = true;
				}
			}

			// Send initial unread count immediately
			async function sendInitial() {
				try {
					const result = await db
						.select({ count: count() })
						.from(schema.notification)
						.where(
							and(eq(schema.notification.userId, userId), eq(schema.notification.read, false))
						);
					send({ unreadCount: Number(result[0]?.count ?? 0) });
				} catch {
					send({ unreadCount: 0 });
				}
			}

			// Poll for new notifications every 8 seconds
			async function poll() {
				if (closed) return;
				try {
					const newNotifs = await db
						.select()
						.from(schema.notification)
						.where(
							and(
								eq(schema.notification.userId, userId),
								gt(schema.notification.createdAt, lastChecked)
							)
						)
						.limit(5);

					if (newNotifs.length > 0) {
						lastChecked = new Date();
						// Get fresh unread count
						const result = await db
							.select({ count: count() })
							.from(schema.notification)
							.where(
								and(eq(schema.notification.userId, userId), eq(schema.notification.read, false))
							);
						const unreadCount = Number(result[0]?.count ?? 0);
						send({
							unreadCount,
							newNotifications: newNotifs.map((n) => ({
								id: n.id,
								type: n.type,
								title: n.title,
								message: n.message,
								link: n.link
							}))
						});
					}
				} catch {
					// DB error — skip this poll cycle
				}
			}

			sendInitial();

			// Heartbeat every 25 seconds to keep connection alive
			const heartbeatInterval = setInterval(() => {
				if (closed) {
					clearInterval(heartbeatInterval);
					clearInterval(pollInterval);
					return;
				}
				try {
					controller.enqueue(': heartbeat\n\n');
				} catch {
					closed = true;
					clearInterval(heartbeatInterval);
					clearInterval(pollInterval);
				}
			}, 25000);

			const pollInterval = setInterval(() => {
				poll();
			}, 8000);

			// Cleanup on stream cancel
			return () => {
				closed = true;
				clearInterval(heartbeatInterval);
				clearInterval(pollInterval);
			};
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no'
		}
	});
};
