<script lang="ts">
	import '$lib/styles/timeline-dot.css';
	import '$lib/styles/timeline-hover.css';

	interface Props {
		/** ID untuk group hover effects */
		groupId?: string;
	}
	let { groupId }: Props = $props();
</script>

<div class="timeline-dot" data-group-id={groupId}></div>

<style>
	/* Shared CSS di-import dari timeline-dot.css dan timeline-hover.css */
	/* Tidak ada component-specific styles di sini */
</style>
