<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from '$lib/stores/toastStore';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, STATUS, TABLE } from '$lib/config/design';
	import { fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	const unreadCount = $derived(data.notifications.filter((n) => !n.read).length);

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
			case 'enrollment_activated':
				return 'book-open';
			case 'grade':
			case 'submission_graded':
				return 'award';
			case 'certificate':
				return 'trophy';
			case 'welcome':
				return 'star';
			case 'broadcast':
			case 'broadcast_received':
				return 'megaphone';
			case 'badge_earned':
				return 'award';
			case 'payment_confirmed':
				return 'credit-card';
			case 'checkpoint_due':
				return 'clock';
			default:
				return 'bell';
		}
	}

	function buildUrl(params: Record<string, string>) {
		const url = new URL($page.url);
		for (const [k, v] of Object.entries(params)) {
			if (v) {
				url.searchParams.set(k, v);
			} else {
				url.searchParams.delete(k);
			}
		}
		return url.toString();
	}

	function setFilter(key: string, value: string) {
		goto(buildUrl({ [key]: value, page: '1' }));
	}

	function goToPage(p: number) {
		goto(buildUrl({ page: String(p) }));
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
			<div class="flex items-center gap-3">
				{#if unreadCount > 0}
					<form
						method="POST"
						action="?/markAllAsRead"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									toast.success('Semua notifikasi ditandai sudah dibaca');
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
									toast.success('Semua notifikasi dihapus');
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

		<!-- Filter Bar -->
		<div
			class={`mt-6 flex flex-wrap items-center gap-3 ${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4`}
		>
			<span class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>Filter:</span>

			<!-- Type filter -->
			<select
				value={data.filters.type}
				onchange={(e) => setFilter('type', (e.currentTarget as HTMLSelectElement).value)}
				class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-1.5 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
				aria-label="Filter by type"
			>
				<option value="">Semua Tipe</option>
				{#each data.distinctTypes as t}
					<option value={t}>{t}</option>
				{/each}
			</select>

			<!-- Read filter -->
			<select
				value={data.filters.read}
				onchange={(e) => setFilter('read', (e.currentTarget as HTMLSelectElement).value)}
				class={`${RADIUS.input} border ${COLOR.cardBorder} px-3 py-1.5 text-sm ${COLOR.textPrimary} outline-none focus:border-blue-500`}
				aria-label="Filter by read status"
			>
				<option value="">Semua Status</option>
				<option value="false">Belum Dibaca</option>
				<option value="true">Sudah Dibaca</option>
			</select>

			<span class={`ml-auto text-xs ${COLOR.textMuted}`}>
				{data.pagination.total} notifikasi
			</span>
		</div>

		<!-- Notifications List -->
		<div class="mt-4 space-y-3">
			{#if data.notifications.length === 0}
				<div
					class={`${RADIUS.card} border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/50`}
				>
					<div
						class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-4xl dark:bg-zinc-800"
					>
						📭
					</div>
					<h3 class="text-xl font-black text-zinc-900 dark:text-white">Tidak ada notifikasi</h3>
					<p class="mt-2 text-xs font-medium text-zinc-500">
						{data.filters.type || data.filters.read
							? 'Coba ubah filter di atas.'
							: 'Kami akan memberitahu kamu saat ada yang terjadi!'}
					</p>
				</div>
			{:else}
				{#each data.notifications as item}
					<div
						class={`${COLOR.card} ${RADIUS.card} ${COLOR.cardBorder} flex items-start gap-5 border p-5 transition-all ${item.read ? 'opacity-70' : `border-blue-500/30 shadow-md`}`}
						in:fly={{ y: 16, duration: 300 }}
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
												toast.success('Notifikasi dihapus');
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
								class="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
							></div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Pagination -->
		{#if data.pagination.totalPages > 1}
			<div class="mt-6 flex items-center justify-center gap-2">
				<button
					onclick={() => goToPage(data.pagination.page - 1)}
					disabled={data.pagination.page <= 1}
					class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800`}
					aria-label="Halaman sebelumnya"
				>
					← Prev
				</button>

				{#each Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1) as p}
					{#if Math.abs(p - data.pagination.page) <= 2 || p === 1 || p === data.pagination.totalPages}
						<button
							onclick={() => goToPage(p)}
							class={`h-9 w-9 ${RADIUS.button} text-sm font-bold ${TRANSITION.colors} ${
								p === data.pagination.page
									? 'bg-blue-600 text-white'
									: `border ${COLOR.cardBorder} ${COLOR.textSecondary} hover:bg-zinc-100 dark:hover:bg-zinc-800`
							}`}
							aria-label={`Halaman ${p}`}
							aria-current={p === data.pagination.page ? 'page' : undefined}
						>
							{p}
						</button>
					{:else if Math.abs(p - data.pagination.page) === 3}
						<span class={`text-sm ${COLOR.textMuted}`}>…</span>
					{/if}
				{/each}

				<button
					onclick={() => goToPage(data.pagination.page + 1)}
					disabled={data.pagination.page >= data.pagination.totalPages}
					class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800`}
					aria-label="Halaman berikutnya"
				>
					Next →
				</button>
			</div>
			<p class={`mt-2 text-center text-xs ${COLOR.textMuted}`}>
				Halaman {data.pagination.page} dari {data.pagination.totalPages} ({data.pagination.total} total)
			</p>
		{/if}
	</div>
</PageWrapper>
