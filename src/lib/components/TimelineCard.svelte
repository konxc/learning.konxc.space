<script lang="ts">
	import TimelineCardBase from './TimelineCardBase.svelte';
	import type { TimelineCardProps } from '$lib/types/timeline';

	let {
		title,
		subtitle,
		description,
		alignment = 'left',
		cardId
	}: TimelineCardProps = $props();
</script>

<TimelineCardBase
	{title}
	{subtitle}
	{description}
	{alignment}
	{cardId}
	classPrefix="timeline-card"
/>
