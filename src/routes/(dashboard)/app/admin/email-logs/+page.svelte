<script lang="ts">
	import type { PageData } from './$types';
	import DashboardTablePage from '$lib/components/layouts/DashboardTablePage.svelte';
	import { useDashboardListState } from '$lib/utils/useDashboardListState';
	import { filterEntities, countByField, buildFilterOptions } from '$lib/utils/filter';
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { COLOR } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let activeTab = $state<'email' | 'whatsapp'>('email');

	const COLUMNS = [
		{ key: 'to', label: 'Penerima' },
		{ key: 'type', label: 'Tipe' },
		{ key: 'status', label: 'Status' },
		{ key: 'createdAt', label: 'Waktu' }
	];

	const listState = useDashboardListState({
		columns: COLUMNS as any,
		storageKey: 'admin-email-logs',
		filterParam: 'status',
		defaultFilter: 'all',
		filterStatusField: 'status',
		searchFields: ['to', 'type']
	});

	const filteredEmailLogs = $derived(
		filterEntities(data.emailLogs, listState.searchQuery, listState.filter, {
			searchFields: ['to', 'type'],
			statusField: 'status'
		})
	);

	const emailStatusCounts = $derived(countByField(data.emailLogs, 'status'));
	const emailFilterOptions = $derived(
		buildFilterOptions(emailStatusCounts, {
			all: 'All',
			sent: 'Sent',
			pending: 'Pending',
			failed: 'Failed'
		})
	);

	const filteredWhatsAppLogs = $derived(
		filterEntities(data.whatsappLogs, listState.searchQuery, listState.filter, {
			searchFields: ['to', 'type'],
			statusField: 'status'
		})
	);

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleString('id-ID', {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Email & WA Logs - Admin</title>
</svelte:head>

<DashboardTablePage
	title="Email & WhatsApp Logs"
	description="Monitor email dan WhatsApp delivery status"
	headTitle="Email & WA Logs - Admin"
	bind:searchQuery={listState.searchQuery}
	columns={COLUMNS as any}
	onVisibilityChange={listState.handleVisibilityChange}
	storageKey="admin-email-logs"
	filteredCount={activeTab === 'email' ? filteredEmailLogs.length : filteredWhatsAppLogs.length}
	totalCount={activeTab === 'email' ? data.emailLogs.length : data.whatsappLogs.length}
	searchPlaceholder="Cari berdasarkan penerima atau tipe..."
>
	{#snippet filters()}
		<div class="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-2">
				<button
					class={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'email' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'}`}
					onclick={() => (activeTab = 'email')}
				>
					Email ({data.emailLogs.length})
				</button>
				<button
					class={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === 'whatsapp' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'}`}
					onclick={() => (activeTab = 'whatsapp')}
				>
					WhatsApp ({data.whatsappLogs.length})
				</button>
			</div>
			<StatusFilter
				options={emailFilterOptions}
				bind:active={listState.filter}
				onChange={listState.setFilter}
			/>
		</div>
	{/snippet}

	{#snippet children()}
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class={`border-b ${COLOR.cardBorder}`}>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Penerima</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Tipe</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Status</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Waktu</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Error</th>
					</tr>
				</thead>
				<tbody>
					{#each activeTab === 'email' ? filteredEmailLogs : filteredWhatsAppLogs as log}
						<tr class={`border-b ${COLOR.cardBorder} ${COLOR.surfaceHover}`}>
							<td class={`px-4 py-3 ${COLOR.textPrimary}`}>{log.to}</td>
							<td class={`px-4 py-3`}>
								<span class={`text-xs font-medium ${COLOR.accent}`}>{log.type}</span>
							</td>
							<td class="px-4 py-3">
								<StatusBadge status={log.status} />
							</td>
							<td class={`px-4 py-3 ${COLOR.textMuted}`}>{formatDate(log.createdAt)}</td>
							<td class={`px-4 py-3 text-xs text-red-500`}>{log.error ?? '-'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/snippet}
</DashboardTablePage>
