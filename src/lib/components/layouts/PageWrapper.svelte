<script lang="ts">
	import { SPACING } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class={`${SPACING.page} ${SPACING.section}`}>
	{@render children?.()}
</div>
