<script lang="ts">
	import TimelineDot from './TimelineDot.svelte';
	import TimelineCardBase from './TimelineCardBase.svelte';
	import type { TimelineItemProps } from '$lib/types/timeline';
	import '$lib/styles/timeline-hover.css';

	let { title, subtitle, description, index = 0 }: TimelineItemProps = $props();

	const isEven = index % 2 === 0;
	const alignment = $derived(isEven ? 'left' : 'right');
</script>

<div class="timeline-item relative mb-12 md:mb-[50px]">
	<!-- Timeline Dot -->
	<TimelineDot />

	<!-- Card Wrapper -->
	<div class="timeline-card-wrapper">
		<!-- Timeline Content Card -->
		<TimelineCardBase
			{title}
			{subtitle}
			{description}
			{alignment}
			classPrefix="timeline-content"
			class="timeline-content-desktop {isEven ? 'timeline-left' : 'timeline-right'}"
		/>
	</div>
</div>

<style>
	/* Card Wrapper - hanya untuk positioning */
	.timeline-card-wrapper {
		position: relative;
	}

	/* Group hover effects di-handle oleh shared CSS (timeline-hover.css) */
	/* Import di script tag */
</style>
