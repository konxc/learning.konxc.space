<script lang="ts">
	import { SPACING } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class={`mx-auto max-w-screen-2xl ${SPACING.page} ${SPACING.section}`}>
	{@render children?.()}
</div>
