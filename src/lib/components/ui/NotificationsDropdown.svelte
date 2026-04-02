<script lang="ts">
	import { RADIUS, COLOR, TEXT, ELEVATION } from '$lib/config/design';

	interface Notification {
		id: string;
		title: string;
		message: string;
		link?: string | null;
		read?: boolean | null;
		createdAt: string | Date;
		type?: string | null;
	}

	interface NotificationsDropdownProps {
		notifications?: Notification[];
		unreadCount?: number;
		show: boolean;
		onClose: () => void;
	}

	let { notifications = [], unreadCount = 0, show, onClose }: NotificationsDropdownProps = $props();

	function formatDate(date: string | Date): string {
		const now = new Date();
		const notifDate = new Date(date);
		const diffMs = now.getTime() - notifDate.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'Baru saja';
		if (diffMins < 60) return `${diffMins} menit lalu`;
		if (diffHours < 24) return `${diffHours} jam lalu`;
		if (diffDays < 7) return `${diffDays} hari lalu`;

		return notifDate.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short'
		});
	}

	function getTypeIcon(type: string | null | undefined): string {
		switch (type) {
			case 'enrollment':
				return '📚';
			case 'grade':
				return '📝';
			case 'system':
				return '⚙️';
			case 'payment':
				return '💳';
			case 'affiliate':
				return '💰';
			default:
				return '🔔';
		}
	}

	async function markAsRead(id: string) {
		try {
			await fetch('/api/notifications/read', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
		} catch (e) {
			console.error('Failed to mark as read:', e);
		}
	}

	async function handleNotificationClick(notif: Notification) {
		if (!notif.read) {
			await markAsRead(notif.id);
		}
		onClose();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40"
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		role="button"
		tabindex="-1"
		aria-label="Tutup notifikasi"
	></div>

	<div
		class={`absolute top-full right-0 z-50 mt-2 w-80 ${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.card} overflow-hidden`}
	>
		<div class={`flex items-center justify-between border-b ${COLOR.cardBorder} px-4 py-3`}>
			<h3 class={`font-bold ${COLOR.textPrimary}`}>Notifikasi</h3>
			{#if unreadCount > 0}
				<span class="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
					{unreadCount > 99 ? '99+' : unreadCount}
				</span>
			{/if}
		</div>

		<div class="relative max-h-96 overflow-y-auto">
			{#if notifications && notifications.length > 0}
				{#each notifications as notif}
					<a
						href={notif.link || '/app/notifications'}
						onclick={() => handleNotificationClick(notif)}
						class={`block border-b px-4 py-3 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 ${COLOR.cardBorder} ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
					>
						<div class="flex items-start gap-3">
							{#if !notif.read}
								<div class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500"></div>
							{:else}
								<div class="mt-1.5 h-2 w-2 shrink-0"></div>
							{/if}
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<span class="text-sm">{getTypeIcon(notif.type)}</span>
									<p class={`text-sm font-medium ${COLOR.textPrimary} flex-1 truncate`}>
										{notif.title}
									</p>
								</div>
								<p class={`mt-0.5 text-xs ${COLOR.textMuted} line-clamp-2`}>
									{notif.message}
								</p>
								<p class={`mt-1 text-xs ${COLOR.textMuted}`}>
									{formatDate(notif.createdAt)}
								</p>
							</div>
						</div>
					</a>
				{/each}
			{:else}
				<div class={`px-4 py-10 text-center text-sm font-medium ${COLOR.textMuted}`}>
					Tidak ada notifikasi
				</div>
			{/if}
		</div>

		<a
			href="/app/notifications"
			onclick={onClose}
			class={`block border-t ${COLOR.cardBorder} bg-zinc-50/50 px-4 py-3 text-center text-sm font-bold ${COLOR.accent} transition-colors hover:bg-zinc-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800`}
		>
			Lihat Semua Notifikasi →
		</a>
	</div>
{/if}
