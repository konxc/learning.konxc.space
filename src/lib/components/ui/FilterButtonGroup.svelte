<script lang="ts">
	import { COLOR, RADIUS, TRANSITION, SPACING, TEXT } from '$lib/config/design';

	interface FilterOption {
		label: string;
		value: string;
		count?: number;
	}

	let {
		filters,
		active = $bindable(),
		onChange,
		variant = 'default'
	}: {
		filters: FilterOption[];
		active?: string;
		onChange?: (value: string) => void;
		variant?: 'default' | 'pilled';
	} = $props();

	function handleClick(value: string) {
		active = value;
		onChange?.(value);
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each filters as filter}
		<button
			type="button"
			onclick={() => handleClick(filter.value)}
			class={`cursor-pointer ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} ${
				active === filter.value
					? `${COLOR.accentBg} border-transparent text-white shadow-sm hover:opacity-90`
					: `border border-gray-300 dark:border-neutral-600 ${COLOR.textPrimary} bg-white hover:border-gray-400 hover:bg-gray-50 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:hover:bg-neutral-700`
			} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-500/70`}
		>
			{filter.label}
			{#if filter.count !== undefined}
				<span class="ml-1.5 opacity-70">({filter.count})</span>
			{/if}
		</button>
	{/each}
</div>
