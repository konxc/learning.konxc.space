<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import type { TableColumn } from '$lib/types/table';

	let {
		searchQuery = $bindable(''),
		columns,
		columnFilterRef = $bindable<any>(null),
		onVisibilityChange,
		storageKey,
		placeholder = 'Cari nama, email, atau HP...'
	}: {
		searchQuery?: string;
		columns: TableColumn[];
		columnFilterRef?: any;
		onVisibilityChange?: (visibleColumns: Set<string>) => void;
		storageKey: string;
		placeholder?: string;
	} = $props();
</script>

<SearchBar
	{searchQuery}
	{columns}
	bind:columnFilterRef
	{onVisibilityChange}
	{storageKey}
	{placeholder}
/>
