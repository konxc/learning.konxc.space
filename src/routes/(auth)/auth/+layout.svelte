<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	// Prevent header from showing in auth pages
	onMount(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<slot />

<style>
	:global(body) {
		margin: 0;
	}
</style>

