<script lang="ts">
	import { RADIUS, COLOR, SPACING, ELEVATION, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface ModalProps {
		isOpen: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		closeOnOverlayClick?: boolean;
		closeOnEscape?: boolean;
		onClose: () => void;
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		isOpen,
		title,
		size = 'md',
		closeOnOverlayClick = true,
		closeOnEscape = true,
		onClose,
		children,
		header,
		footer
	}: ModalProps = $props();

	let contentRef: HTMLDivElement | undefined = $state(undefined);

	// Handle escape key
	$effect(() => {
		if (!isOpen || !closeOnEscape) return;

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				onClose();
			}
		}

		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	});

	// Focus management
	$effect(() => {
		if (isOpen && contentRef) {
			contentRef.focus();
		}
	});

	// Size classes
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl'
	};
</script>

{#if isOpen}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
		role="presentation"
		onclick={() => {
			if (closeOnOverlayClick) {
				onClose();
			}
		}}
	>
		<!-- Modal Content -->
		<div
			bind:this={contentRef}
			class={`relative max-h-[90vh] w-full ${sizeClasses[size]} overflow-hidden ${RADIUS.card} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card} shadow-xl transition-transform`}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					e.stopPropagation();
					onClose();
				}
			}}
		>
			<!-- Header -->
			{#if title || header}
				<div
					class="mb-5 flex items-center justify-between border-b border-gray-200/60 pb-4 dark:border-neutral-700/60"
				>
					{#if header}
						{@render header()}
					{:else if title}
						<h2 id="modal-title" class={`text-xl font-semibold ${COLOR.textPrimary}`}>
							{title}
						</h2>
					{/if}
					<button
						type="button"
						class={`inline-flex h-8 w-8 items-center justify-center ${RADIUS.badge} ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:bg-neutral-800 dark:hover:text-gray-100 dark:focus-visible:ring-offset-neutral-900`}
						aria-label="Close modal"
						onclick={onClose}
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="overflow-y-auto">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="mt-5 border-t border-gray-200/60 pt-4 dark:border-neutral-700/60">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
