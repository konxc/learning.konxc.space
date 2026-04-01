<script lang="ts">
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';

	interface CouponFiltersProps {
		filter?: string;
		filterCounts: { all: number; active: number; expired: number };
		onFilterChange?: (value: string) => void;
	}

	let { filter = $bindable('all'), filterCounts, onFilterChange }: CouponFiltersProps = $props();

	const options = [
		{ value: 'all', label: 'All', count: filterCounts.all },
		{ value: 'active', label: 'Active', count: filterCounts.active },
		{ value: 'expired', label: 'Expired', count: filterCounts.expired }
	];
</script>

<StatusFilter {options} bind:active={filter} onChange={onFilterChange} />
