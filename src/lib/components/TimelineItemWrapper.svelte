<script lang="ts">
	import TimelineDot from './TimelineDot.svelte';
	import TimelineCard from './TimelineCard.svelte';
	import type { TimelineItemData } from '$lib/types/timeline';
	import type { Snippet } from 'svelte';

	interface Props extends TimelineItemData {
		index: number;
		/** Apakah menggunakan TimelineCard (true) atau slot untuk TimelineItem (false) */
		useCard?: boolean;
		/** Card ID untuk tracking */
		cardId?: string;
		children?: Snippet;
	}

	let { title, subtitle, description, index, useCard = false, cardId, children }: Props = $props();

	const alignment = $derived(index % 2 === 0 ? 'left' : 'right');
</script>

<div class="timeline-item relative mb-12 md:mb-[50px]">
	<!-- Timeline Dot -->
	<TimelineDot />

	<!-- Card Wrapper -->
	<div class="timeline-card-wrapper">
		{#if useCard}
			<TimelineCard {title} {subtitle} {description} {alignment} {cardId} />
		{:else}
			<!-- Render konten custom melalui children snippet -->
			{@render children?.()}
		{/if}
	</div>
</div>
