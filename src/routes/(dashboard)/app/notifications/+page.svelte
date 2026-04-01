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
			case 'enrollment': return 'book-open';
			case 'grade': return 'award';
			case 'certificate': return 'trophy';
			case 'welcome': return 'star';
			case 'broadcast': return 'megaphone';
			default: return 'bell';
		}
	}
</script>

<svelte:head>
	<title>Notifikasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="max-w-4xl mx-auto">
		<PageHeader title="Notification Center" description="Stay updated with your learning journey and platform announcements.">
			<div class="flex items-center gap-4">
				{#if unreadCount > 0}
					<form method="POST" action="?/markAllAsRead" use:enhance>
						<Button variant="ghost" type="submit">
							Mark all as read
						</Button>
					</form>
				{/if}
			</div>
		</PageHeader>

		<div class="mt-8 space-y-4">
			{#if data.notifications.length === 0}
				<div class={`${RADIUS.card} bg-zinc-50 border-2 border-dashed border-zinc-200 py-20 text-center dark:bg-zinc-900/50 dark:border-zinc-800`}>
					<div class="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📭</div>
					<h3 class="text-xl font-black text-zinc-900 dark:text-white">Your inbox is empty</h3>
					<p class="text-xs font-medium text-zinc-500 mt-2">We'll notify you when things happen!</p>
				</div>
			{:else}
				{#each data.notifications as item}
					<div
						class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} border p-5 flex items-start gap-5 transition-all ${item.read ? 'opacity-70 grayscale-[0.5]' : `shadow-md ${ELEVATION.cardHover} border-blue-500/30`}`}
						in:fly={{ y: 20, duration: 400 }}
					>
						<div class={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${item.read ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 shadow-inner'}`}>
							<Icon name={getNotificationIcon(item.type)} size={20} />
						</div>

						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between gap-4 mb-1">
								<h3 class={`text-base font-black tracking-tight ${item.read ? 'text-zinc-600' : 'text-zinc-900 dark:text-white'}`}>
									{item.title}
								</h3>
								<span class="text-[10px] font-bold text-zinc-400 whitespace-nowrap">
									{formatDate(item.createdAt)}
								</span>
							</div>
							<p class="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-3">
								{item.message}
							</p>
							
							<div class="flex items-center gap-4">
								{#if item.link}
									<a href={item.link} class="text-xs font-black tracking-widest text-blue-600 uppercase hover:underline">
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
										<button type="submit" class="text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase hover:text-zinc-900 transition-colors">
											Mark as read
										</button>
									</form>
								{/if}
							</div>
						</div>

						{#if !item.read}
							<div class="h-2 w-2 rounded-full bg-blue-600 mt-2 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</PageWrapper>
