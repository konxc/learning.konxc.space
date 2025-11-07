<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages.js';
	function segments(pathname: string) {
		const parts = pathname.split('/').filter(Boolean);
		const items = [] as { name: string; href: string }[];
		let acc = '';
		for (const part of parts) {
			acc += '/' + part;
			items.push({ name: part.charAt(0).toUpperCase() + part.slice(1), href: acc });
		}
		return items;
	}
</script>

<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-neutral-500">
	<a href="/dashboard" class="hover:underline">{m.home()}</a>
	<span>/</span>
	{#if $page}
		{#each segments($page.url.pathname).slice(0, -1) as s}
			<a href={s.href} class="hover:underline">{s.name}</a>
			<span>/</span>
		{/each}
		{#if segments($page.url.pathname).length}
			<span class="text-neutral-800 dark:text-neutral-200"
				>{segments($page.url.pathname).at(-1)?.name}</span
			>
		{/if}
	{/if}
</nav>
