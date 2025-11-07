<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	const assignments = [] as { id: string; title: string; due: string }[];
	let q = $state('');
	let loading = $state(true);
	$effect(() => {
		const t = setTimeout(() => (loading = false), 300);
		return () => clearTimeout(t);
	});
	const filtered = $derived(
		assignments.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<section class="rounded-lg border bg-white dark:bg-neutral-900">
	<div class="flex items-center justify-between border-b px-4 py-3">
		<h1 class="font-semibold">Tugas</h1>
		<input
			class="h-9 w-56 rounded border bg-transparent px-3 text-sm"
			placeholder={m.search_tasks()}
			bind:value={q}
		/>
	</div>
	<div class="divide-y">
		{#if loading}
			<SkeletonList rows={6} />
		{:else if filtered.length === 0}
			<div class="px-4 py-8 text-center text-sm text-neutral-500">{m.empty_tasks()}</div>
		{:else}
			{#each filtered as t}
				<a
					href={`/assignments/${t.id}`}
					class="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800">{t.title}</a
				>
			{/each}
		{/if}
	</div>
</section>
