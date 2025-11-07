<script lang="ts">
	import HeaderNavigation from '$lib/components/HeaderNavigation.svelte';

	let { children, showHeader = true }: { children?: any; showHeader?: boolean } = $props();
</script>

{#if showHeader}
	<HeaderNavigation />
{/if}

{@render children?.()}
