<script lang="ts">
	import { MAIN_ROUTES } from '$lib/constants/routes';
	import type { Snippet } from 'svelte';

	const {
		brand = 'Naik Kelas',
		actions,
		children
	} = $props<{
		brand?: string;
		actions?: Snippet;
		children?: Snippet;
	}>();
</script>

<header class="glass-surface sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-4 md:px-6">
		<a href={MAIN_ROUTES.dashboard} class="text-base font-semibold tracking-tight">{brand}</a>
		<div class="ml-auto flex items-center gap-2">
			{@render actions?.()}
		</div>
	</div>
	{@render children?.()}
</header>
