<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		/** Image source URL */
		src: string;
		/** Alt text (required for accessibility) */
		alt: string;
		/** Image width (required for CLS prevention) */
		width: number;
		/** Image height (required for CLS prevention) */
		height: number;
		/** Loading strategy: 'lazy' (default) or 'eager' */
		loading?: 'lazy' | 'eager';
		/** Fetch priority: 'high', 'low', or 'auto' */
		fetchpriority?: 'high' | 'low' | 'auto';
		/** Decoding strategy: 'async' (default), 'sync', or 'auto' */
		decoding?: 'async' | 'sync' | 'auto';
		/** Additional CSS classes */
		class?: string;
		/** Additional CSS styles */
		style?: string;
		/** Object fit: 'cover', 'contain', 'fill', etc. */
		objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
		/** Srcset for responsive images */
		srcset?: string;
		/** Sizes attribute for responsive images */
		sizes?: string;
		/** Picture element sources (for art direction) */
		sources?: Array<{
			srcset: string;
			media?: string;
			type?: string;
		}>;
	}

	let {
		src,
		alt,
		width,
		height,
		loading = 'lazy',
		fetchpriority,
		decoding = 'async',
		class: className = '',
		style: inlineStyle = '',
		objectFit = 'cover',
		srcset,
		sizes,
		sources
	}: Props = $props();

	// Error state untuk fallback
	let hasError = $state(false);
	let isLoaded = $state(false);

	function handleError() {
		hasError = true;
	}

	function handleLoad() {
		isLoaded = true;
	}

	// Calculate aspect ratio untuk placeholder
	const aspectRatio = $derived((height / width) * 100);
</script>

{#if sources && sources.length > 0}
	<!-- Picture element untuk art direction -->
	<picture>
		{#each sources as source}
			<source
				srcset={source.srcset}
				{...source.media && { media: source.media }}
				{...source.type && { type: source.type }}
			/>
		{/each}
		<img
			{src}
			{alt}
			{width}
			{height}
			{loading}
			{...fetchpriority && { fetchpriority }}
			{decoding}
			{...srcset && { srcset }}
			{...sizes && { sizes }}
			class={className ? `${className} optimized-image` : 'optimized-image'}
			class:loaded={isLoaded}
			class:error={hasError}
			style="object-fit: {objectFit}; {inlineStyle}"
			onerror={handleError}
			onload={handleLoad}
		/>
	</picture>
{:else}
	<!-- Standard img element -->
	<div
		class="image-wrapper"
		style="aspect-ratio: {width} / {height}; padding-bottom: {aspectRatio}%"
	>
		{#if hasError}
			<div class="image-error" role="img" aria-label={alt}>
				<span class="error-icon" aria-hidden="true">🖼️</span>
				<span class="error-text">{alt}</span>
			</div>
		{:else}
			<img
				{src}
				{alt}
				{width}
				{height}
				{loading}
				{...fetchpriority && { fetchpriority }}
				{decoding}
				{...srcset && { srcset }}
				{...sizes && { sizes }}
				class={className ? `${className} optimized-image` : 'optimized-image'}
				class:loaded={isLoaded}
				style="object-fit: {objectFit}; {inlineStyle}"
				onerror={handleError}
				onload={handleLoad}
			/>
		{/if}
	</div>
{/if}

<style>
	.image-wrapper {
		position: relative;
		overflow: hidden;
		background: var(--color-bg-hero-end, rgba(0, 0, 0, 0.05));
		display: block;
	}

	.optimized-image {
		width: 100%;
		height: 100%;
		transition: opacity 0.3s ease;
		opacity: 0;
	}

	.optimized-image.loaded {
		opacity: 1;
	}

	.image-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: var(--color-bg-hero-end, rgba(0, 0, 0, 0.05));
		color: var(--color-primary-medium, #718096);
		text-align: center;
		padding: 20px;
	}

	.error-icon {
		font-size: 2em;
		margin-bottom: 10px;
	}

	.error-text {
		font-size: 0.9em;
	}

	/* Reduce motion */
	@media (prefers-reduced-motion: reduce) {
		.optimized-image {
			transition: none;
		}
	}
</style>
