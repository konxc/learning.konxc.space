<script lang="ts">
	import { COLOR, FOCUS, INPUT, RADIUS, SPACING, TEXT, TRANSITION } from '$lib/config/design';

	export interface StatusFilterOption {
		value: string;
		label: string;
		count: number;
	}

	export interface StatusFilterProps {
		options: StatusFilterOption[];
		active?: string;
		onChange?: (value: string) => void;
	}

	let { options, active = $bindable(), onChange }: StatusFilterProps = $props();

	function handleClick(value: string) {
		active = value;
		onChange?.(value);
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each options as option}
		<button
			type="button"
			onclick={() => handleClick(option.value)}
			class={`cursor-pointer ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} ${
				active === option.value
					? `${COLOR.accentBg} border-transparent text-white shadow-sm hover:opacity-90`
					: `${INPUT.border} ${COLOR.textPrimary} ${INPUT.bg} ${INPUT.hover} ${COLOR.neutralHover}`
			} focus:outline-none focus-visible:ring-2 ${FOCUS.accent} focus-visible:ring-offset-1`}
		>
			{option.label}
			{#if option.count !== undefined}
				<span class="ml-1.5 opacity-70">({option.count})</span>
			{/if}
		</button>
	{/each}
</div>
