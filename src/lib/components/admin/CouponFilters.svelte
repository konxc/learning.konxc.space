<script lang="ts">
	import FilterButtonGroup from '$lib/components/ui/FilterButtonGroup.svelte';

	interface CouponFiltersProps {
		filter?: string;
		filterCounts: { all: number; active: number; expired: number };
		onFilterChange?: (value: string) => void;
	}

	let { filter = $bindable('all'), filterCounts, onFilterChange }: CouponFiltersProps = $props();

	const filters = [
		{ value: 'all', label: 'All', count: filterCounts.all },
		{ value: 'active', label: 'Active', count: filterCounts.active },
		{ value: 'expired', label: 'Expired', count: filterCounts.expired }
	];
</script>

<FilterButtonGroup {filters} bind:active={filter} onChange={onFilterChange} />
