<script lang="ts">
	interface SkeletonListProps {
		rows?: number;
	}

	let { rows = 5 }: SkeletonListProps = $props();
</script>

<div class="divide-y">
	{#each Array(rows) as _, i}
		<div class="px-4 py-3">
			<div class="h-4 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
			<div class="mt-2 h-3 w-1/5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
		</div>
	{/each}
</div>
