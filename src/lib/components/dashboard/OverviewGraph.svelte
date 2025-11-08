<script lang="ts">
	// Placeholder grafik overview (bisa diganti chart lib)
	interface OverviewGraphProps {
		title?: string;
		description?: string;
	}

	let { title = 'Overview', description }: OverviewGraphProps = $props();
</script>

<div class="rounded-lg border bg-white p-4 shadow-sm">
	<div class="mb-2 text-sm font-semibold">{title}</div>
	{#if description}
		<div class="mb-2 text-xs text-neutral-500">{description}</div>
	{/if}
	<div class="grid h-36 place-items-center text-xs text-neutral-400">
		<span>Graph Placeholder</span>
	</div>
</div>
