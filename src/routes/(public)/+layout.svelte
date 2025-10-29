<script lang="ts">
	import '../../app.css';
	import HeaderNavigation from '$lib/components/HeaderNavigation.svelte';

	let { children } = $props();
</script>

<HeaderNavigation />

{@render children?.()}
