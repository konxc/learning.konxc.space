<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	let {
		rows = 5,
		cols = 5
	}: {
		rows?: number;
		cols?: number;
	} = $props();
</script>

<div class="animate-pulse space-y-3">
	{#each Array(rows) as _}
		<div class="flex gap-3">
			{#each Array(cols) as _}
				<Skeleton class="h-8 flex-1" />
			{/each}
		</div>
	{/each}
</div>
