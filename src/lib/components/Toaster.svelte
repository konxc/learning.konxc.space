<script lang="ts">
	import { toasts, type Toast } from '$lib/stores/toastStore';
	import { RADIUS, ELEVATION, TEXT } from '$lib/config/design';

	interface Props {
		messages?: Toast[];
	}

	let { messages }: Props = $props();

	// Use prop if provided, otherwise use store
	let toastList = $derived(messages ?? $toasts);
</script>

<div
	aria-live="polite"
	class="pointer-events-none fixed right-4 bottom-4 z-[9999] flex flex-col gap-3 md:right-6 md:bottom-6"
>
	{#each toastList as toast (toast.id)}
		<div
			class="animate-in slide-in-from-right-8 fade-in pointer-events-auto w-full max-w-sm duration-300"
			role="alert"
		>
			<div
				class={`flex items-start gap-3 p-4 ${RADIUS.card} ${ELEVATION.card} border backdrop-blur-xl
				${
					toast.type === 'error'
						? 'border-red-200/80 bg-red-50/95 dark:border-red-900/50 dark:bg-red-950/90'
						: toast.type === 'success'
							? 'border-green-200/80 bg-green-50/95 dark:border-green-900/50 dark:bg-green-950/90'
							: toast.type === 'warning'
								? 'border-amber-200/80 bg-amber-50/95 dark:border-amber-900/50 dark:bg-amber-950/90'
								: 'border-blue-200/80 bg-blue-50/95 dark:border-blue-900/50 dark:bg-blue-950/90'
				}`}
			>
				<div class="min-w-0 flex-1">
					<p
						class={`${TEXT.small} mb-1 font-bold
						${
							toast.type === 'error'
								? 'text-red-800 dark:text-red-300'
								: toast.type === 'success'
									? 'text-green-800 dark:text-green-300'
									: toast.type === 'warning'
										? 'text-amber-800 dark:text-amber-300'
										: 'text-blue-800 dark:text-blue-300'
						}`}
					>
						{toast.type === 'error'
							? 'Kesalahan Sistem'
							: toast.type === 'success'
								? 'Berhasil'
								: toast.type === 'warning'
									? 'Peringatan'
									: 'Informasi'}
					</p>
					<p
						class={`text-sm leading-relaxed
						${
							toast.type === 'error'
								? 'text-red-700/90 dark:text-red-400/90'
								: toast.type === 'success'
									? 'text-green-700/90 dark:text-green-400/90'
									: toast.type === 'warning'
										? 'text-amber-700/90 dark:text-amber-400/90'
										: 'text-blue-700/90 dark:text-blue-400/90'
						}`}
					>
						{toast.text}
					</p>
				</div>
				<button
					onclick={() => toasts.dismiss(toast.id)}
					class="shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
					aria-label="Dismiss"
				>
					<svg class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	@keyframes slide-in-from-right-8 {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-in {
		animation: slide-in-from-right-8 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-in {
			animation: none;
		}
	}
</style>
