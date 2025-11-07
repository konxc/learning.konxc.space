<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: PageData; children: Snippet } = $props();

	function segments(pathname: string) {
		const parts = pathname.split('/').filter(Boolean);
		const items: { name: string; href: string }[] = [];
		let acc = '';
		for (const part of parts) {
			acc += '/' + part;
			items.push({ name: part.charAt(0).toUpperCase() + part.slice(1), href: acc });
		}
		return items;
	}
</script>

{@render children?.()}
