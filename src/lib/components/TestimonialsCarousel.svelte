<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import OptimizedImage from './OptimizedImage.svelte';
	import type { Testimonial } from '$lib/config/testimonials';
	import { trackEvent } from '$lib/utils/analytics';

	interface Props {
		testimonials: Testimonial[];
	}

	let { testimonials }: Props = $props();

	let currentIndex = $state(0);
	let carouselContainer: HTMLElement | null = $state(null);
	let windowWidth = $state(0);
	let isDragging = $state(false);
	let dragOffset = $state(0);

	let pointerStartX = 0;
	let activePointerId: number | null = null;
	let containerWidth = 0;

	const totalSlides = $derived(testimonials.length);
	const slidesPerView = $derived(
		!browser ? 1 : windowWidth >= 1280 ? 4 : windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1
	);
	const maxVisibleStart = $derived(Math.max(totalSlides - slidesPerView, 0));
	const visibleStart = $derived(
		totalSlides <= slidesPerView ? 0 : Math.min(currentIndex, maxVisibleStart)
	);
	const baseTranslatePercent = $derived(visibleStart * (100 / slidesPerView));
	const hasMultipleSlides = $derived(totalSlides > 1);
	const activeTestimonial = $derived(
		totalSlides ? testimonials[((currentIndex % totalSlides) + totalSlides) % totalSlides] : null
	);
	const activeStars = $derived(
		activeTestimonial ? Array.from({ length: 5 }, (_, i) => i < activeTestimonial.rating) : []
	);
	const activeSlideId = $derived(
		activeTestimonial ? `carousel-slide-${activeTestimonial.id}` : undefined
	);
	const slideCounter = $derived(
		totalSlides
			? `${(((currentIndex % totalSlides) + totalSlides) % totalSlides) + 1} / ${totalSlides}`
			: '0 / 0'
	);

	let lastTrackedTestimonialId = '';

	$effect(() => {
		if (!totalSlides) {
			currentIndex = 0;
			return;
		}
		currentIndex = ((currentIndex % totalSlides) + totalSlides) % totalSlides;
	});

	$effect(() => {
		const testimonial = activeTestimonial;
		if (!testimonial || testimonial.id === lastTrackedTestimonialId) return;
		lastTrackedTestimonialId = testimonial.id;
		trackEvent({
			type: 'testimonial_view',
			category: 'engagement',
			action: 'testimonial_view',
			label: testimonial.name,
			testimonial_id: testimonial.id,
			domain: testimonial.domain,
			current_index: currentIndex
		});
	});

	function updateMeasurements() {
		if (!browser) return;
		windowWidth = window.innerWidth;
		containerWidth = carouselContainer?.clientWidth ?? containerWidth;
	}

	onMount(() => {
		if (!browser) return;

		updateMeasurements();

		const resizeObserver = new ResizeObserver(() => updateMeasurements());
		window.addEventListener('resize', updateMeasurements);

		if (carouselContainer) {
			resizeObserver.observe(carouselContainer);
			carouselContainer.addEventListener('keydown', handleKeydown);
		}

		return () => {
			window.removeEventListener('resize', updateMeasurements);
			resizeObserver.disconnect();
			carouselContainer?.removeEventListener('keydown', handleKeydown);
		};
	});

	function nextSlide() {
		if (!hasMultipleSlides || !totalSlides) return;
		currentIndex = (currentIndex + 1) % totalSlides;
	}

	function prevSlide() {
		if (!hasMultipleSlides || !totalSlides) return;
		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
	}

	function goToIndex(index: number) {
		if (!totalSlides) return;
		currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
	}

	function handlePointerDown(e: PointerEvent) {
		if (!hasMultipleSlides) return;
		const target = e.target as HTMLElement | null;
		if (
			target?.closest('.carousel-nav') ||
			target?.closest('.carousel-dot') ||
			target?.closest('.testimonial-accordion') ||
			target?.closest('a, button')
		)
			return;
		if (e.pointerType === 'mouse' && e.button !== 0) return;

		activePointerId = e.pointerId;
		pointerStartX = e.clientX;
		dragOffset = 0;
		isDragging = true;
		containerWidth = carouselContainer?.clientWidth ?? containerWidth;

		carouselContainer?.setPointerCapture?.(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || activePointerId !== e.pointerId) return;
		dragOffset = e.clientX - pointerStartX;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging || activePointerId !== e.pointerId) return;
		carouselContainer?.releasePointerCapture?.(e.pointerId);
		finalizeSwipe();
	}

	function handlePointerCancel(e: PointerEvent) {
		if (!isDragging || activePointerId !== e.pointerId) return;
		carouselContainer?.releasePointerCapture?.(e.pointerId);
		resetDragState();
	}

	function handlePointerLeave(e: PointerEvent) {
		if (!isDragging || activePointerId !== e.pointerId) return;
		finalizeSwipe();
	}

	function finalizeSwipe() {
		if (!isDragging) return;
		const threshold = Math.max(containerWidth * 0.12, 40);
		if (!hasMultipleSlides) {
			resetDragState();
			return;
		}
		if (dragOffset <= -threshold) {
			nextSlide();
		} else if (dragOffset >= threshold) {
			prevSlide();
		}
		resetDragState();
	}

	function resetDragState() {
		isDragging = false;
		dragOffset = 0;
		pointerStartX = 0;
		activePointerId = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevSlide();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			nextSlide();
		}
	}

	function getInitials(name: string) {
		return name
			.split(' ')
			.filter(Boolean)
			.map((part) => part[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<div
	class="testimonials-carousel"
	class:dragging={isDragging}
	bind:this={carouselContainer}
	tabindex="0"
	role="listbox"
	aria-label="Testimonials carousel"
	aria-live="polite"
	aria-activedescendant={activeSlideId}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerCancel}
	onpointerleave={handlePointerLeave}
	onkeydown={handleKeydown}
>
	{#if activeTestimonial}
		<div class="carousel-status">
			<span class="status-pill"
				>Testimonial {(((currentIndex % totalSlides) + totalSlides) % totalSlides) + 1} dari {totalSlides}</span
			>
		</div>
	{/if}

	{#if activeTestimonial}
		<div class="carousel-content" aria-live="polite">
			<section class="main-card">
				<div class="main-rating">
					{#each activeStars as filled, index}
						<span class="rating-star" class:filled aria-hidden="true">★</span>
					{/each}
					<span class="rating-score">{activeTestimonial.rating}.0</span>
				</div>

				<blockquote class="main-quote">
					<p>“{activeTestimonial.text}”</p>
				</blockquote>

				<div class="author">
					{#if activeTestimonial.image}
						<OptimizedImage
							src={activeTestimonial.image}
							alt={activeTestimonial.name}
							width={80}
							height={80}
							objectFit="cover"
							loading="lazy"
							decoding="async"
							class="author-avatar"
						/>
					{:else}
						<div class="author-avatar placeholder" aria-hidden="true">
							{getInitials(activeTestimonial.name)}
						</div>
					{/if}
					<div class="author-info">
						<div class="author-name">{activeTestimonial.name}</div>
						{#if activeTestimonial.role || activeTestimonial.company}
							<div class="author-role">
								{activeTestimonial.role}
								{#if activeTestimonial.company}
									<span class="author-company"> · {activeTestimonial.company}</span>
								{/if}
							</div>
						{/if}
						<div class="author-tags">
							<span class="domain-pill">{activeTestimonial.domain}</span>
						</div>
					</div>
				</div>
			</section>

			<aside class="detail-panel" aria-label="Detail testimonial">
				<h3 class="detail-title">Insight Peserta</h3>

				<div class="detail-grid">
					{#if activeTestimonial.role}
						<div class="detail-item">
							<span class="detail-label">Peran</span>
							<span class="detail-value">{activeTestimonial.role}</span>
						</div>
					{/if}
					{#if activeTestimonial.company}
						<div class="detail-item">
							<span class="detail-label">Perusahaan</span>
							<span class="detail-value">{activeTestimonial.company}</span>
						</div>
					{/if}
					<div class="detail-item">
						<span class="detail-label">Rating</span>
						<span class="detail-value highlight">{activeTestimonial.rating}.0 / 5.0</span>
					</div>
					<div class="detail-item">
						<span class="detail-label">Domain</span>
						<span class="detail-value">{activeTestimonial.domain}</span>
					</div>
				</div>

				{#if activeTestimonial.beforeAfter}
					<div class="before-after-block" aria-label="Perubahan peserta">
						<div class="before-card">
							<span class="before-label">Sebelum</span>
							<p>{activeTestimonial.beforeAfter.before}</p>
						</div>
						<div class="progress-arrow" aria-hidden="true">→</div>
						<div class="after-card">
							<span class="after-label">Sesudah</span>
							<p>{activeTestimonial.beforeAfter.after}</p>
						</div>
					</div>
				{/if}

				{#if activeTestimonial.videoUrl}
					<a
						href={activeTestimonial.videoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="video-button"
					>
						<span aria-hidden="true">🎥</span>
						<span>Tonton Video Testimonial</span>
					</a>
				{/if}
			</aside>
		</div>
	{/if}

	<div class="preview-wrapper">
		{#if hasMultipleSlides}
			<button
				class="carousel-nav prev"
				type="button"
				onclick={prevSlide}
				aria-label="Testimonial sebelumnya"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M15.75 19.5 8.25 12l7.5-7.5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}

		<div class="preview-track-container">
			<div
				class="carousel-track"
				class:dragging={isDragging}
				style={`--slides-per-view: ${slidesPerView}; transform: translateX(calc(-${baseTranslatePercent}% + ${dragOffset}px));`}
			>
				{#each testimonials as testimonial, index (testimonial.id)}
					<div class="carousel-slide">
						<button
							id={`carousel-slide-${testimonial.id}`}
							type="button"
							class="carousel-preview"
							class:active={index === currentIndex}
							role="option"
							aria-selected={index === currentIndex}
							aria-setsize={totalSlides}
							aria-posinset={index + 1}
							onclick={() => goToIndex(index)}
						>
							{#if testimonial.image}
								<OptimizedImage
									src={testimonial.image}
									alt={testimonial.name}
									width={56}
									height={56}
									loading="lazy"
									decoding="async"
									objectFit="cover"
									class="preview-avatar"
								/>
							{:else}
								<span class="preview-avatar placeholder" aria-hidden="true">
									{getInitials(testimonial.name)}
								</span>
							{/if}
							<div class="preview-info">
								<span class="preview-name">{testimonial.name}</span>
								{#if testimonial.role}
									<span class="preview-role">{testimonial.role}</span>
								{:else}
									<span class="preview-role">{testimonial.domain}</span>
								{/if}
							</div>
						</button>
					</div>
				{/each}
			</div>
		</div>

		{#if hasMultipleSlides}
			<button
				class="carousel-nav next"
				type="button"
				onclick={nextSlide}
				aria-label="Testimonial berikutnya"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="m8.25 4.5 7.5 7.5-7.5 7.5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	.testimonials-carousel {
		@apply relative flex w-full flex-col gap-8 overflow-hidden rounded-[32px] border border-white/15 bg-white/70 p-6 shadow-[0_18px_45px_-25px_rgba(15,34,65,0.35)] transition-all duration-300;
		backdrop-filter: blur(18px);
	}

	.testimonials-carousel.dragging {
		cursor: grabbing;
	}

	.carousel-status {
		@apply flex items-center justify-between;
	}

	.status-pill {
		@apply inline-flex items-center gap-2 rounded-full bg-(--color-primary-soft-blue,#667eea)/12 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.carousel-content {
		@apply grid gap-6;
	}

	@media (min-width: 1024px) {
		.testimonials-carousel {
			@apply gap-10 p-9;
		}

		.carousel-content {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
			gap: 40px;
		}
	}

	.main-card {
		@apply relative flex h-full flex-col gap-6 rounded-[28px] border border-white/30 px-8 py-9;
		background: radial-gradient(
				circle at top left,
				rgba(255, 255, 255, 0.65),
				rgba(255, 255, 255, 0.9)
			)
			linear-gradient(135deg, rgba(102, 126, 234, 0.14), rgba(118, 75, 162, 0.08));
		box-shadow: 0 22px 50px -30px rgba(15, 34, 65, 0.35);
	}

	.main-rating {
		@apply flex items-center gap-2;
	}

	.rating-star {
		@apply text-lg text-(--color-primary-medium,#cbd5f5) transition-colors duration-200;
	}

	.rating-star.filled {
		color: #ffd166;
	}

	.rating-score {
		@apply ml-3 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-(--color-primary-dark,#28314d) uppercase;
	}

	.main-quote p {
		@apply m-0 text-xl leading-relaxed text-(--color-primary-dark,#1f2937);
	}

	@media (min-width: 1024px) {
		.main-quote p {
			@apply text-2xl leading-[1.7];
		}
	}

	.author {
		@apply flex items-center gap-5;
	}

	.author-avatar {
		@apply h-18 w-18 rounded-full border border-white/60 shadow-lg;
	}

	.author-avatar.placeholder {
		@apply flex items-center justify-center bg-(--color-primary-soft-blue,#667eea)/20 text-xl font-semibold text-(--color-primary-soft-blue,#667eea);
	}

	.author-info {
		@apply flex-1;
	}

	.author-name {
		@apply text-lg font-semibold text-(--color-primary-dark,#1f2937);
	}

	.author-role {
		@apply mt-1 text-sm text-(--color-primary-medium,#5a6b88);
	}

	.author-company {
		@apply text-(--color-primary-soft-blue,#667eea);
	}

	.author-tags {
		@apply mt-3 flex flex-wrap gap-2;
	}

	.domain-pill {
		@apply inline-flex items-center gap-1 rounded-full bg-(--color-primary-soft-blue,#667eea)/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.detail-panel {
		@apply flex h-full flex-col gap-6 rounded-[28px] border border-white/30 bg-white/80 px-7 py-8 shadow-[0_20px_45px_-30px_rgba(15,34,65,0.25)];
	}

	.detail-title {
		@apply text-sm font-semibold tracking-[0.3em] text-(--color-primary-medium,#5a6b88) uppercase;
	}

	.detail-grid {
		@apply grid gap-4;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	}

	.detail-item {
		@apply flex flex-col rounded-2xl border border-white/40 bg-white/70 px-4 py-4 shadow-sm;
	}

	.detail-label {
		@apply text-xs font-semibold tracking-[0.2em] text-(--color-primary-medium,#4a5b72) uppercase;
	}

	.detail-value {
		@apply mt-1 text-sm font-semibold text-(--color-primary-dark,#1f2937);
	}

	.detail-value.highlight {
		color: #f59e0b;
	}

	.before-after-block {
		@apply grid gap-4 rounded-[24px] border border-white/40 bg-white/80 px-6 py-5;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		align-items: stretch;
	}

	.before-card,
	.after-card {
		@apply flex flex-col gap-2 rounded-2xl bg-white/90 px-4 py-4 shadow-inner;
	}

	.before-label,
	.after-label {
		@apply text-xs font-semibold tracking-[0.2em] text-(--color-primary-medium,#4a5b72) uppercase;
	}

	.before-card p,
	.after-card p {
		@apply m-0 text-sm font-semibold text-(--color-primary-dark,#1f2937);
	}

	.progress-arrow {
		@apply hidden items-center justify-center text-2xl text-(--color-primary-soft-blue,#667eea);
	}

	@media (min-width: 640px) {
		.progress-arrow {
			@apply flex;
		}

		.before-after-block {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.video-button {
		@apply inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--color-primary-soft-blue,#667eea) px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-(--color-primary-dark,#4c63d2);
	}

	.preview-wrapper {
		@apply mt-6 flex items-center gap-3;
	}

	.preview-track-container {
		@apply relative flex-1 overflow-hidden;
	}

	.carousel-track {
		@apply flex transition-transform duration-500 ease-in-out;
		will-change: transform;
	}

	.carousel-track.dragging {
		@apply cursor-grabbing;
	}

	.carousel-slide {
		@apply min-w-0 px-1.5;
		flex: 0 0 calc(100% / var(--slides-per-view, 1));
	}

	.carousel-preview {
		@apply flex w-full items-center gap-3 rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-left shadow-sm transition-all duration-200 hover:border-(--color-primary-soft-blue,#667eea)/40 hover:shadow-lg;
	}

	.carousel-preview.active {
		@apply border-(--color-primary-soft-blue,#667eea)/60 bg-(--color-primary-soft-blue,#667eea)/10 shadow-lg;
	}

	.preview-avatar {
		@apply h-12 w-12 shrink-0 rounded-full border border-white/50 shadow;
	}

	.preview-avatar.placeholder {
		@apply flex items-center justify-center bg-(--color-primary-soft-blue,#667eea)/15 text-sm font-semibold text-(--color-primary-soft-blue,#667eea);
	}

	.preview-info {
		@apply min-w-0;
	}

	.preview-name {
		@apply block truncate text-sm font-semibold text-(--color-primary-dark,#1f2937);
	}

	.preview-role {
		@apply block truncate text-xs text-(--color-primary-medium,#5a6b88);
	}

	.carousel-nav {
		@apply flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-md transition-all duration-200 hover:border-(--color-primary-soft-blue,#667eea)/50 hover:text-(--color-primary-soft-blue,#667eea);
	}

	.carousel-nav svg {
		@apply h-5 w-5;
	}

	.carousel-nav.prev {
		@apply order-first;
	}

	.carousel-nav.next {
		@apply order-last;
	}

	@media (max-width: 768px) {
		.testimonials-carousel {
			@apply gap-6 p-5;
		}

		.main-card {
			@apply px-6 py-7;
		}

		.detail-panel {
			@apply px-6 py-7;
		}

		.preview-wrapper {
			@apply mt-5 gap-2;
		}
	}
</style>
