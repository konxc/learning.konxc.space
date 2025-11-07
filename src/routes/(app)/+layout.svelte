<script lang="ts">
	import '../../app.css';
	import type { LayoutData } from './$types';
	import AppShell from '$lib/components/layouts/AppShell.svelte';
	import type { Snippet } from 'svelte';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<AppShell {data}>
	{@render children?.()}
</AppShell>

<style>
</style>
