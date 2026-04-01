<script lang="ts">
	import { RADIUS, COLOR, TEXT, ELEVATION, SPACING, STATUS, FOCUS } from '$lib/config/design';
	import { fade, scale } from 'svelte/transition';

	export interface ConfirmDialogProps {
		isOpen: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: 'danger' | 'warning' | 'info' | 'default';
		onConfirm: () => void;
		onCancel: () => void;
		loading?: boolean;
	}

	let {
		isOpen,
		title,
		message,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		variant = 'default',
		onConfirm,
		onCancel,
		loading = false
	}: ConfirmDialogProps = $props();

	const variantConfig = $derived({
		danger: {
			buttonClass: `${STATUS.error.bg.replace(/bg-rose-100/, 'bg-red-600').replace(/\/50/, '')} text-white hover:bg-red-700`,
			iconBg: STATUS.error.bg,
			iconColor: STATUS.error.text
		},
		warning: {
			buttonClass: `${STATUS.warning.bg.replace(/bg-amber-100/, 'bg-amber-600').replace(/\/50/, '')} text-white hover:bg-amber-700`,
			iconBg: STATUS.warning.bg,
			iconColor: STATUS.warning.text
		},
		info: {
			buttonClass: `${STATUS.info.bg.replace(/bg-blue-100/, 'bg-blue-600').replace(/\/50/, '')} text-white hover:bg-blue-700`,
			iconBg: STATUS.info.bg,
			iconColor: STATUS.info.text
		},
		default: {
			buttonClass: `${STATUS.info.bg.replace(/bg-blue-100/, 'bg-blue-600').replace(/\/50/, '')} text-white hover:bg-blue-700`,
			iconBg: STATUS.info.bg,
			iconColor: STATUS.info.text
		}
	});
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
		transition:fade={{ duration: 150 }}
		onclick={onCancel}
		role="dialog"
		aria-modal="true"
		aria-labelledby="confirm-dialog-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class={`w-full max-w-md ${RADIUS.card} ${COLOR.card} ${ELEVATION.card} overflow-hidden`}
			transition:scale={{ duration: 200, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="flex flex-col gap-4 p-6">
				<div class="flex items-start gap-4">
					<div
						class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${variantConfig[variant].iconBg}`}
					>
						{#if variant === 'danger'}
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						{:else if variant === 'warning'}
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						{:else}
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						{/if}
					</div>
					<div class="flex-1">
						<h3
							id="confirm-dialog-title"
							class={`${TEXT.h3} font-bold text-zinc-900 dark:text-zinc-100`}
						>
							{title}
						</h3>
						<p class={`mt-1 ${TEXT.body} ${COLOR.textSecondary}`}>
							{message}
						</p>
					</div>
				</div>

				<div class="flex justify-end gap-3">
					<button
						type="button"
						onclick={onCancel}
						disabled={loading}
						class={`${RADIUS.button} ${SPACING.button} ${TEXT.button} border font-semibold ${COLOR.cardBorder} bg-transparent ${COLOR.textSecondary} ${COLOR.surfaceHover} disabled:opacity-50`}
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onclick={onConfirm}
						disabled={loading}
						class={`${RADIUS.button} ${SPACING.button} ${TEXT.button} font-semibold disabled:opacity-50 ${variantConfig[variant].buttonClass}`}
					>
						{#if loading}
							<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						{/if}
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
