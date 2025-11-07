<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	// Placeholder users table; integrate Drizzle query later
	const users = [] as { id: string; fullName: string; role: string }[];
	let q = $state('');
	let role = $state('');
	let loading = $state(true);
	const filtered = $derived(
		users.filter((u) => (!q || u.fullName.toLowerCase().includes(q.toLowerCase())) && (!role || u.role === role))
	);
	$effect(() => {
		const t = setTimeout(() => (loading = false), 300);
		return () => clearTimeout(t);
	});
</script>

<section class="rounded-lg border bg-white dark:bg-neutral-900">
	<div class="flex items-center justify-between border-b px-4 py-3">
		<h1 class="font-semibold">Pengguna</h1>
		<div class="flex items-center gap-2">
			<input
				class="h-9 w-56 rounded border bg-transparent px-3 text-sm"
				placeholder={m.search_users()}
				bind:value={q}
			/>
			<select class="h-9 rounded border bg-transparent px-3 text-sm" bind:value={role}>
				<option value="">Semua peran</option>
				<option value="admin">Admin</option>
				<option value="mentor">Mentor</option>
				<option value="siswa">Siswa</option>
			</select>
			<a
				href="/admin/users/new"
				class="rounded border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
				>Tambah</a
			>
		</div>
	</div>
	<div class="divide-y">
		{#if loading}
			<SkeletonList rows={8} />
		{:else if filtered.length === 0}
			<div class="px-4 py-8 text-center text-sm text-neutral-500">{m.empty_users()}</div>
		{:else}
			{#each filtered as u}
				<div class="flex items-center justify-between px-4 py-3">
					<div>
						<div class="font-medium">{u.fullName}</div>
						<div class="text-xs text-neutral-500">{u.id}</div>
					</div>
					<div class="text-sm">{u.role}</div>
				</div>
			{/each}
		{/if}
	</div>
</section>
