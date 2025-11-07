<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION } from '$lib/config/design';

	export interface CouponFiltersProps {
		filter?: string;
		filterCounts: { all: number; active: number; expired: number };
		onFilterChange?: (value: string) => void;
	}

	let { filter = $bindable('all'), filterCounts, onFilterChange }: CouponFiltersProps = $props();

	// Filter options for buttons
	const filterOptions: Array<{
		value: string;
		label: string;
		countKey: keyof typeof filterCounts;
	}> = [
		{ value: 'all', label: 'All', countKey: 'all' },
		{ value: 'active', label: 'Active', countKey: 'active' },
		{ value: 'expired', label: 'Expired', countKey: 'expired' }
	];
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each filterOptions as option}
		<button
			type="button"
			class={`cursor-pointer ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} ${
				filter === option.value
					? `${COLOR.accentBg} border-transparent text-white shadow-sm hover:opacity-90`
					: `border border-gray-300 dark:border-neutral-600 ${COLOR.textPrimary} bg-white hover:border-gray-400 hover:bg-gray-50 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:hover:bg-neutral-700`
			} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-500/70`}
			onclick={() => {
				filter = option.value;
				onFilterChange?.(option.value);
			}}
		>
			{option.label} ({filterCounts[option.countKey]})
		</button>
	{/each}
</div>
