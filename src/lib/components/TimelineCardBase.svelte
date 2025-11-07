<script lang="ts">
	import type { TimelineItemData } from '$lib/types/timeline';
	import '$lib/styles/timeline-card.css';

	interface Props extends TimelineItemData {
		alignment?: 'left' | 'right';
		/** Prefix untuk class names (default: 'timeline-card') */
		classPrefix?: string;
		/** ID untuk card (optional) */
		cardId?: string;
		/** Additional classes untuk card container */
		class?: string;
	}

	let {
		title,
		subtitle,
		description,
		alignment = 'left',
		classPrefix = 'timeline-card',
		cardId,
		class: className = ''
	}: Props = $props();

	const cardClasses = $derived.by(() => {
		const base = `${classPrefix} relative overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]`;
		const alignmentClass = alignment === 'left' ? `${classPrefix}-left` : `${classPrefix}-right`;
		return `${base} ${alignmentClass} ${className}`;
	});

	const titleClass = $derived(`${classPrefix}-title`);
	const bulletItemClass = $derived(`${classPrefix}-bullet-item`);
	const bulletClass = $derived(`${classPrefix}-bullet`);
</script>

<div class={cardClasses} data-card-id={cardId}>
	<h3
		class="{titleClass} relative z-[1] mb-2.5 text-lg font-semibold text-(--color-primary-dark) transition-colors duration-300 ease-in-out md:text-xl lg:text-2xl"
	>
		{title}
	</h3>
	{#if subtitle}
		<p class="relative z-[1] mb-3 text-base text-(--color-primary-dark) md:text-lg">
			<strong>{subtitle}</strong>
		</p>
	{/if}
	<ul class="relative z-[1] m-0 list-none p-0">
		{#each description as bullet (bullet)}
			<li
				class="{bulletItemClass} relative mb-2 text-sm leading-relaxed text-(--color-primary-medium) transition-all duration-200 last:mb-0 hover:text-(--color-primary-dark) md:mb-2 md:text-base"
			>
				<span class={bulletClass}>{bullet}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	/* Shared CSS di-import dari timeline-card.css */
	/* Tidak ada component-specific styles di sini */
</style>

