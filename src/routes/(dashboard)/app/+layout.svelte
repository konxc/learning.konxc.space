<script lang="ts">
	import type { PageData } from './$types';
	import type { Snippet } from 'svelte';
	import AddToHomeScreen from '$lib/components/AddToHomeScreen.svelte';

	let { data, children }: { data: PageData; children: Snippet } = $props();
</script>

<AddToHomeScreen />

{@render children?.()}
