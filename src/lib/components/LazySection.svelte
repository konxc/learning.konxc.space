<script lang="ts">
	import { onMount } from 'svelte';
	import { lazyLoadOnIntersect, type LazyComponent } from '$lib/utils/lazyLoading';
	import type { ComponentType } from 'svelte';

	interface Props {
		/** Component import function */
		component: LazyComponent;
		/** Root margin untuk IntersectionObserver (default: '50px') */
		rootMargin?: string;
		/** Threshold untuk IntersectionObserver (default: 0.1) */
		threshold?: number;
		/** Show skeleton loader saat loading */
		showSkeleton?: boolean;
		/** Custom skeleton component */
		skeletonComponent?: LazyComponent;
		/** Props untuk component yang akan di-load */
		componentProps?: Record<string, any>;
	}

	let {
		component,
		rootMargin = '50px',
		threshold = 0.1,
		showSkeleton = true,
		skeletonComponent,
		componentProps = {}
	}: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let loadedComponent: ComponentType | null = $state(null);
	let skeletonRenderer: ComponentType | null = $state(null);
	let isLoading = $state(false);
	let error: Error | null = $state(null);
	let isVisible = $state(false);
	let skeletonLoadStarted = false;

	onMount(() => {
		if (!container) return;

		const cleanup = lazyLoadOnIntersect(
			container,
			async () => {
				isVisible = true;
				isLoading = true;
				error = null;

				try {
					const module = await component();
					loadedComponent = module.default as ComponentType;
					isLoading = false;
				} catch (err) {
					error = err instanceof Error ? err : new Error('Failed to load component');
					isLoading = false;
				}
			},
			{ rootMargin, threshold }
		);

		return cleanup;
	});

	$effect(() => {
		if (
			isLoading &&
			showSkeleton &&
			skeletonComponent &&
			!skeletonRenderer &&
			!skeletonLoadStarted
		) {
			skeletonLoadStarted = true;
			skeletonComponent()
				.then((module) => {
					skeletonRenderer = module.default as ComponentType;
				})
				.catch((err) => {
					console.warn('Failed to load skeleton component', err);
					skeletonLoadStarted = false;
				});
		}
	});
</script>

<div bind:this={container} class="lazy-section">
	{#if error}
		<div class="lazy-error" role="alert">
			<p>Failed to load section. Please refresh the page.</p>
		</div>
	{:else if isLoading && showSkeleton}
		{#if skeletonRenderer}
			{@const Skeleton = skeletonRenderer}
			<Skeleton />
		{:else}
			<div class="lazy-skeleton" aria-label="Loading section">
				<div class="skeleton-item"></div>
				<div class="skeleton-item"></div>
				<div class="skeleton-item"></div>
			</div>
		{/if}
	{:else if loadedComponent}
		{@const Component = loadedComponent}
		<Component {...componentProps} />
	{:else}
		<!-- Placeholder untuk trigger IntersectionObserver -->
		<div class="lazy-placeholder" style="min-height: 200px;"></div>
	{/if}
</div>

<style>
	.lazy-section {
		min-height: 200px;
	}

	.lazy-skeleton {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2rem;
	}

	.skeleton-item {
		height: 60px;
		background: linear-gradient(
			90deg,
			var(--color-bg-lighter) 0%,
			var(--color-bg-light) 50%,
			var(--color-bg-lighter) 100%
		);
		background-size: 200% 100%;
		animation: skeleton-loading 1.5s ease-in-out infinite;
		border-radius: 8px;
	}

	.skeleton-item:nth-child(1) {
		width: 100%;
	}

	.skeleton-item:nth-child(2) {
		width: 80%;
	}

	.skeleton-item:nth-child(3) {
		width: 90%;
	}

	@keyframes skeleton-loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.lazy-error {
		padding: 2rem;
		text-align: center;
		color: var(--color-error, #ef4444);
		background: var(--color-bg-lighter, #f8f9fa);
		border-radius: 8px;
		border: 1px solid var(--color-error, #ef4444);
	}

	.lazy-placeholder {
		opacity: 0;
		pointer-events: none;
	}

	/* Reduce motion untuk accessibility */
	@media (prefers-reduced-motion: reduce) {
		.skeleton-item {
			animation: none;
			background: var(--color-bg-lighter);
		}
	}
</style>
