<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import type { Snippet } from 'svelte';

	const { data, children } = $props<{
		data: {
			user: { id: string; username: string; fullName: string; email: string; role: string } | null;
			roles: string[];
			activeRole: string | null;
		};
		children: Snippet;
	}>();

	const isAdmin = data.activeRole === 'admin';
	const isAuthed = Boolean(data.user);
</script>

<a
	href="#content"
	class="sr-only rounded border bg-white px-3 py-2 text-sm focus:not-sr-only focus:absolute focus:top-2 focus:left-2 dark:bg-neutral-900"
	>Skip to content</a
>
<div class="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
	<Toaster />
	<div class="flex">
		{#if isAuthed}
			<Sidebar {data} />
		{/if}
		<div class="flex min-w-0 flex-1 flex-col">
			<Header {data} {isAdmin} />
			<main id="content" class="space-y-4 px-4 py-4 md:px-6">
				<Breadcrumb />
				{@render children()}
			</main>
		</div>
	</div>
	<footer class="border-t px-4 py-3 text-xs text-neutral-500 md:px-6">Naik Kelas — v0</footer>
</div>
