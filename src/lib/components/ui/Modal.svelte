<script lang="ts">
	import { RADIUS, COLOR, SPACING, ELEVATION, TRANSITION, FOCUS } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface ModalProps {
		show?: boolean;
		isOpen?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		closeOnOverlayClick?: boolean;
		closeOnEscape?: boolean;
		onClose?: () => void;
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		show = $bindable(false),
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

	const modalOpen = $derived(isOpen ?? show);

	function handleClose() {
		show = false;
		onClose?.();
	}

	let contentRef: HTMLDivElement | undefined = $state(undefined);

	// Handle escape key
	$effect(() => {
		if (!modalOpen || !closeOnEscape) return;

		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				handleClose();
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

{#if modalOpen}
	<!-- Modal Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
		role="presentation"
		onclick={() => {
			if (closeOnOverlayClick) {
				handleClose();
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
					handleClose();
				}
			}}
		>
			<!-- Header -->
			{#if title || header}
				<div class="mb-5 flex items-center justify-between border-b pb-4 ${COLOR.cardBorder}">
					{#if header}
						{@render header()}
					{:else if title}
						<h2 id="modal-title" class={`text-xl font-semibold ${COLOR.textPrimary}`}>
							{title}
						</h2>
					{/if}
					<button
						type="button"
						class={`inline-flex h-8 w-8 items-center justify-center ${RADIUS.badge} ${COLOR.textSecondary} ${TRANSITION.all} ${COLOR.surfaceHover} ${COLOR.textPrimary} focus:outline-none focus-visible:ring-2 ${FOCUS.accent} focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-900`}
						aria-label="Close modal"
						onclick={handleClose}
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
				<div class="mt-5 border-t pt-4 ${COLOR.cardBorder}">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
