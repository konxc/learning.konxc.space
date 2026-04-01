<script lang="ts">
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import ColumnFilter from '$lib/components/crm/ColumnFilter.svelte';
	import { debounce } from '$lib/utils/debounce';
	import type { TableColumn } from '$lib/types/table';

	export interface SearchBarProps {
		searchQuery?: string;
		columns: TableColumn[];
		columnFilterRef?: ColumnFilter | null;
		onVisibilityChange?: (visibleColumns: Set<string>) => void;
		storageKey: string;
		placeholder?: string;
		showColumnFilter?: boolean;
	}

	let {
		searchQuery = $bindable(''),
		columns,
		columnFilterRef = $bindable<ColumnFilter | null>(null),
		onVisibilityChange,
		storageKey,
		placeholder = 'Search...',
		showColumnFilter = true
	}: SearchBarProps = $props();

	const setSearchDebounced = debounce((v: string) => {
		searchQuery = v;
	}, 250);
</script>

<div class="flex items-center gap-4">
	<input
		type="text"
		{placeholder}
		value={searchQuery}
		class={`${RADIUS.button} border border-gray-300 px-2 py-1.5 dark:border-neutral-600 ${TEXT.button} ${COLOR.textPrimary} bg-white outline-none dark:bg-neutral-800 ${TRANSITION.all} placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-64 dark:placeholder:text-neutral-500 dark:hover:border-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/50`}
		oninput={(e) => setSearchDebounced((e.target as HTMLInputElement).value)}
	/>
	{#if showColumnFilter}
		<ColumnFilter bind:this={columnFilterRef} {columns} {storageKey} {onVisibilityChange} />
	{/if}
</div>
