<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let {
		isOpen = $bindable(false),
		label,
		ariaLabel,
		badge,
		showArrow = true,
		fullWidth = true,
		children
	}: {
		isOpen?: boolean;
		label?: string;
		ariaLabel?: string;
		badge?: string | number;
		showArrow?: boolean;
		fullWidth?: boolean;
		children?: Snippet;
	} = $props();
</script>

<button
	type="button"
	onclick={() => {
		isOpen = !isOpen;
	}}
	aria-label={ariaLabel || label}
	aria-expanded={isOpen}
	class={`flex ${fullWidth ? 'w-full' : ''} cursor-pointer list-none items-center justify-between no-underline ${RADIUS.button} px-2 py-1.5 ${TEXT.button} ${COLOR.textPrimary} bg-gray-100 dark:bg-neutral-800/70 ${TRANSITION.all} hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-neutral-700/80 dark:focus-visible:ring-offset-neutral-900`}
>
	<div class="mr-2 flex min-w-0 flex-1 items-center gap-2">
		{@render children?.()}
		{#if label}
			<span class="hidden max-w-[120px] truncate md:inline ${COLOR.textPrimary} font-medium">
				{label}
			</span>
		{/if}
		{#if badge !== undefined}
			<span class="text-xs opacity-60">{badge}</span>
		{/if}
	</div>
	{#if showArrow}
		<svg
			class={`hidden h-4 w-4 shrink-0 md:block ${COLOR.textSecondary} transition-transform ${
				isOpen ? 'rotate-180' : ''
			}`}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	{/if}
</button>
