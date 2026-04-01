<script lang="ts">
	import { COLOR, INPUT, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
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
		class={`${RADIUS.button} ${INPUT.border} px-2 py-1.5 ${TEXT.button} ${COLOR.textPrimary} ${INPUT.bg} outline-none ${TRANSITION.all} ${INPUT.placeholder} ${INPUT.hover} ${INPUT.focus} focus:ring-2 md:w-64`}
		oninput={(e) => setSearchDebounced((e.target as HTMLInputElement).value)}
	/>
	{#if showColumnFilter}
		<ColumnFilter bind:this={columnFilterRef} {columns} {storageKey} {onVisibilityChange} />
	{/if}
</div>
