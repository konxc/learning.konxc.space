<script lang="ts">
	import { RADIUS, COLOR, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface TooltipProps {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		delay?: number;
		children: Snippet;
	}

	let { content, position = 'top', delay = 200, children }: TooltipProps = $props();

	let show = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	function handleMouseEnter() {
		timer = setTimeout(() => {
			show = true;
		}, delay);
	}

	function handleMouseLeave() {
		clearTimeout(timer);
		show = false;
	}

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};
</script>

<div
	class="relative inline-flex"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="tooltip"
>
	{@render children()}

	{#if show}
		<div
			class={`absolute z-50 ${positionClasses[position]} ${RADIUS.badge} ${COLOR.card} ${COLOR.cardBorder} ${ELEVATION.card} px-3 py-1.5 text-xs ${COLOR.textPrimary} whitespace-nowrap ${TRANSITION.all}`}
			role="tooltip"
		>
			{content}
		</div>
	{/if}
</div>
