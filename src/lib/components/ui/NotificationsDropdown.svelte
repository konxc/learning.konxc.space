<script lang="ts">
	import { RADIUS, COLOR, TEXT, ELEVATION } from '$lib/config/design';

	export interface Notification {
		title: string;
		message: string;
		link?: string;
		read?: boolean;
		createdAt: string | Date;
	}

	export interface NotificationsDropdownProps {
		notifications?: Notification[];
		unreadCount?: number;
		show: boolean;
		onClose: () => void;
	}

	let {
		notifications = [],
		unreadCount = 0,
		show,
		onClose
	}: NotificationsDropdownProps = $props();

	function formatDate(date: string | Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if show}
	<div
		class={`absolute right-0 z-50 mt-2 w-80 ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.card} overflow-hidden`}
	>
		<div class="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
			<h3 class="font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
		</div>
		<div class="relative max-h-96 overflow-y-auto">
			{#if notifications && notifications.length > 0}
				{#each notifications as notif}
					<a
						href={notif.link || '#'}
						class="block border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50 {!notif.read
							? 'bg-blue-50/50 dark:bg-blue-900/10'
							: ''}"
					>
						<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
							{notif.title}
						</p>
						<p class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
							{notif.message}
						</p>
						<p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
							{formatDate(notif.createdAt)}
						</p>
					</a>
				{/each}
			{:else}
				<div class="px-4 py-10 text-center text-sm font-medium text-zinc-500">
					No notifications
				</div>
			{/if}
		</div>
		{#if notifications && notifications.length > 0}
			<a
				href="/app/notifications"
				class="block rounded-b-xl border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-center text-sm font-bold text-blue-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800"
			>
				View All Notifications
			</a>
		{/if}
	</div>
{/if}