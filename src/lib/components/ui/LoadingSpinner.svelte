<script lang="ts">
	import { page } from '$app/stores';

	let { fallback = 'Memuat...' }: { fallback?: string } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-4 py-12">
	<div class="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600"></div>
	<p class="text-xs font-medium text-zinc-500">{fallback}</p>
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
