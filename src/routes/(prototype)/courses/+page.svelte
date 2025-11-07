<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	// Placeholder list; add pagination/sort later
	const courses = [] as { id: string; title: string }[];
	let q = $state('');
	let loading = $state(true);
	$effect(() => {
		const t = setTimeout(() => (loading = false), 300);
		return () => clearTimeout(t);
	});
	const filtered = $derived(courses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase())));
</script>

<section class="rounded-lg border bg-white dark:bg-neutral-900">
	<div class="flex items-center justify-between border-b px-4 py-3">
		<h1 class="font-semibold">Kelas</h1>
		<div class="flex items-center gap-2">
			<input
				class="h-9 w-48 rounded border bg-transparent px-3 text-sm"
				placeholder={m.search_courses()}
				bind:value={q}
			/>
			<a
				href="/courses/new"
				class="rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
				>Tambah</a
			>
		</div>
	</div>
	<div class="divide-y">
		{#if loading}
			<SkeletonList rows={6} />
		{:else if filtered.length === 0}
			<div class="px-4 py-8 text-center text-sm text-neutral-500">{m.empty_courses()}</div>
		{:else}
			{#each filtered as c}
				<a
					href={`/courses/${c.id}`}
					class="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800">{c.title}</a
				>
			{/each}
		{/if}
	</div>
</section>
