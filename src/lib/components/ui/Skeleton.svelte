<script lang="ts">
	import { RADIUS } from '$lib/config/design';

	let {
		class: className = '',
		rounded = RADIUS.small
	}: {
		class?: string;
		rounded?: string;
	} = $props();
</script>

<div
	class={`animate-pulse bg-zinc-200/50 dark:bg-zinc-800/50 ${rounded} ${className}`}
	aria-hidden="true"
></div>

<style>
	/* Make the pulse a bit more refined and less aggressive */
	@keyframes refined-pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}
	div.animate-pulse {
		animation: refined-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
