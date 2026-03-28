<script lang="ts">
	interface StatCardProps {
		label: string;
		value: string | number;
		hint?: string;
	}

	let { label, value, hint }: StatCardProps = $props();
</script>

<div class="rounded-lg border bg-white p-4 shadow-sm">
	<div class="text-xs text-neutral-500">{label}</div>
	<div class="mt-1 text-2xl font-semibold">{value}</div>
	{#if hint}
		<div class="mt-1 text-xs text-neutral-500">{hint}</div>
	{/if}
</div>
