<script lang="ts">
	import { COLOR } from '$lib/config/design';

	let { fallback = 'Memuat...' }: { fallback?: string } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-4 py-12">
	<div
		class={`h-8 w-8 animate-spin rounded-full border-2 ${COLOR.neutral} border-t-current ${COLOR.accent}`}
	></div>
	<p class={`text-xs font-medium ${COLOR.textMuted}`}>{fallback}</p>
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
