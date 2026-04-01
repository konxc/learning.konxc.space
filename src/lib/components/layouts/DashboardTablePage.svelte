<script lang="ts">
	import PageWrapper from './PageWrapper.svelte';
	import PageHeader from './PageHeader.svelte';
	import PageQuick from './PageQuick.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import ResultsSummary from '$lib/components/crm/ResultsSummary.svelte';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';
	import TableSkeleton from '$lib/components/ui/TableSkeleton.svelte';
	import { COLOR } from '$lib/config/design';
	import type { TableColumn } from '$lib/types/table';
	import type { Snippet } from 'svelte';

	interface Props {
		// Page metadata
		title: string;
		description?: string;
		headTitle?: string;

		// Search & columns
		searchQuery?: string;
		searchPlaceholder?: string;
		columns: TableColumn[];
		onVisibilityChange?: (visibleColumns: Set<string>) => void;
		storageKey: string;

		// Results
		filteredCount: number;
		totalCount: number;
		emptyMessage?: string;

		// Slots
		filters?: Snippet;
		actions?: Snippet;
		children: Snippet;

		// State
		showColumnFilter?: boolean;
		loading?: boolean;
	}

	let {
		title,
		description,
		headTitle,
		searchQuery = $bindable(''),
		searchPlaceholder = 'Search...',
		columns,
		onVisibilityChange,
		storageKey,
		filteredCount,
		totalCount,
		emptyMessage = 'Tidak ada data yang sesuai dengan filter.',
		filters,
		actions,
		children,
		showColumnFilter = true,
		loading = false
	}: Props = $props();

	let columnFilterRef: ColumnFilter | null = $state(null);
</script>

<svelte:head>
	<title>{headTitle || title}</title>
</svelte:head>

{#if filters}
	<PageQuick padding={true}>
		{@render filters()}
	</PageQuick>
{/if}

<PageWrapper>
	<PageHeader {title} {description} />

	<!-- Results Summary + Search + Actions -->
	<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div class="min-w-0 flex-1 md:max-w-xs">
			<ResultsSummary {filteredCount} {totalCount} />
		</div>

		<div class="flex items-center gap-3">
			{@render actions?.()}

			<SearchBar
				bind:searchQuery
				{columns}
				bind:columnFilterRef
				{storageKey}
				{onVisibilityChange}
				placeholder={searchPlaceholder}
				{showColumnFilter}
			/>
		</div>
	</div>

	<!-- Table Content -->
	{#if loading}
		<TableSkeleton rows={5} cols={columns.length} />
	{:else if filteredCount === 0 && totalCount === 0}
		<div
			class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900"
		>
			<p class={COLOR.textSecondary}>{emptyMessage}</p>
		</div>
	{:else}
		{@render children()}
	{/if}
</PageWrapper>
