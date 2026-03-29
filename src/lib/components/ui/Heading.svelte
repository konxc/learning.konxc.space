<script lang="ts">
	import { TEXT, COLOR } from '$lib/config/design';

	type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

	let {
		level = 'h1',
		class: className = '',
		children
	}: {
		level?: HeadingLevel;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	const headingClasses: Record<HeadingLevel, string> = {
		h1: `${TEXT.h1} ${COLOR.textPrimary}`,
		h2: `${TEXT.h2} ${COLOR.textPrimary}`,
		h3: `${TEXT.h3} ${COLOR.textPrimary}`,
		h4: `${TEXT.h4} ${COLOR.textPrimary}`
	};
</script>

{#if level === 'h1'}
	<h1 class={`${headingClasses.h1} ${className}`}>
		{@render children?.()}
	</h1>
{:else if level === 'h2'}
	<h2 class={`${headingClasses.h2} ${className}`}>
		{@render children?.()}
	</h2>
{:else if level === 'h3'}
	<h3 class={`${headingClasses.h3} ${className}`}>
		{@render children?.()}
	</h3>
{:else if level === 'h4'}
	<h4 class={`${headingClasses.h4} ${className}`}>
		{@render children?.()}
	</h4>
{/if}
