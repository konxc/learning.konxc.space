<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	const unreadCount = $derived(data.notifications.filter((n: any) => !n.read).length);

	function formatDate(date: Date) {
		return new Date(date).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getNotificationIcon(type: string) {
		switch (type) {
			case 'enrollment':
				return 'book-open';
			case 'grade':
				return 'award';
			case 'certificate':
				return 'trophy';
			case 'welcome':
				return 'star';
			case 'broadcast':
				return 'megaphone';
			default:
				return 'bell';
		}
	}
</script>

<svelte:head>
	<title>Notifikasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl">
		<PageHeader
			title="Notification Center"
			description="Stay updated with your learning journey and platform announcements."
		>
			<div class="flex items-center gap-4">
				{#if unreadCount > 0}
					<form
						method="POST"
						action="?/markAllAsRead"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									toast.success('All notifications marked as read');
									await invalidateAll();
								}
							};
						}}
					>
						<Button variant="ghost" type="submit">Mark all as read</Button>
					</form>
				{/if}
				{#if data.notifications.length > 0}
					<form
						method="POST"
						action="?/deleteAll"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									toast.success('All notifications deleted');
									await invalidateAll();
								}
							};
						}}
					>
						<Button variant="ghost" type="submit" class="text-red-500">Delete all</Button>
					</form>
				{/if}
			</div>
		</PageHeader>

		<div class="mt-8 space-y-4">
			{#if data.notifications.length === 0}
				<div
					class={`${RADIUS.card} border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/50`}
				>
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl dark:bg-zinc-800"
					>
						📭
					</div>
					<h3 class="text-xl font-black text-zinc-900 dark:text-white">Your inbox is empty</h3>
					<p class="mt-2 text-xs font-medium text-zinc-500">We'll notify you when things happen!</p>
				</div>
			{:else}
				{#each data.notifications as item}
					<div
						class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} flex items-start gap-5 border p-5 transition-all ${item.read ? 'opacity-70 grayscale-[0.5]' : `shadow-md ${ELEVATION.cardHover} border-blue-500/30`}`}
						in:fly={{ y: 20, duration: 400 }}
					>
						<div
							class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${item.read ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800' : 'bg-blue-50 text-blue-600 shadow-inner dark:bg-blue-900/20'}`}
						>
							<Icon name={getNotificationIcon(item.type)} size={20} />
						</div>

						<div class="min-w-0 flex-1">
							<div class="mb-1 flex items-center justify-between gap-4">
								<h3
									class={`text-base font-black tracking-tight ${item.read ? 'text-zinc-600' : 'text-zinc-900 dark:text-white'}`}
								>
									{item.title}
								</h3>
								<span class="text-[10px] font-bold whitespace-nowrap text-zinc-400">
									{formatDate(item.createdAt)}
								</span>
							</div>
							<p class="mb-3 line-clamp-2 text-sm leading-relaxed text-zinc-500">
								{item.message}
							</p>

							<div class="flex items-center gap-4">
								{#if item.link}
									<a
										href={item.link}
										class="text-xs font-black tracking-widest text-blue-600 uppercase hover:underline"
									>
										View Details →
									</a>
								{/if}

								{#if !item.read}
									<form
										method="POST"
										action="?/markAsRead"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													await invalidateAll();
												}
											};
										}}
									>
										<input type="hidden" name="id" value={item.id} />
										<button
											type="submit"
											class="text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase transition-colors hover:text-zinc-900"
										>
											Mark as read
										</button>
									</form>
								{/if}

								<form
									method="POST"
									action="?/delete"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												toast.success('Notification deleted');
												await invalidateAll();
											}
										};
									}}
								>
									<input type="hidden" name="id" value={item.id} />
									<button
										type="submit"
										class="text-[9px] font-black tracking-[0.2em] text-red-400 uppercase transition-colors hover:text-red-600"
									>
										Delete
									</button>
								</form>
							</div>
						</div>

						{#if !item.read}
							<div
								class="mt-2 h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
							></div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</PageWrapper>
