<script lang="ts">
	import type { Testimonial } from '$lib/config/testimonials';
	import OptimizedImage from './OptimizedImage.svelte';

	interface Props {
		testimonial: Testimonial;
	}

	let { testimonial }: Props = $props();

	const stars = $derived(
		Array.from({ length: 5 }, (_, i) => ({
			filled: i < testimonial.rating,
			index: i
		}))
	);
</script>

<article class="testimonial-card" aria-labelledby="testimonial-{testimonial.id}">
	<div class="testimonial-header">
		<div class="testimonial-avatar">
			{#if testimonial.image}
				<OptimizedImage
					src={testimonial.image}
					alt="{testimonial.name} - {testimonial.role}"
					width={60}
					height={60}
					loading="lazy"
					decoding="async"
					objectFit="cover"
					class="testimonial-avatar-img"
				/>
			{:else}
				<div class="avatar-placeholder">
					{testimonial.name
						.split(' ')
						.map((n) => n[0])
						.join('')
						.toUpperCase()
						.slice(0, 2)}
				</div>
			{/if}
		</div>
		<div class="testimonial-info">
			<div class="testimonial-name-row">
				<h3 id="testimonial-{testimonial.id}" class="testimonial-name">{testimonial.name}</h3>
				{#if testimonial.domain}
					<span class="testimonial-domain">{testimonial.domain}</span>
				{/if}
			</div>
			{#if testimonial.role}
				<p class="testimonial-role">
					{testimonial.role}
					{#if testimonial.company}
						<span class="testimonial-company"> · {testimonial.company}</span>
					{/if}
				</p>
			{/if}
		</div>
	</div>

	<div class="testimonial-rating" aria-label="Rating: {testimonial.rating} out of 5 stars">
		{#each stars as star}
			<span class="star" class:filled={star.filled} aria-hidden="true">★</span>
		{/each}
		<span class="rating-text">{testimonial.rating}.0</span>
	</div>

	<blockquote class="testimonial-text">
		<p>“{testimonial.text}”</p>
	</blockquote>

	{#if testimonial.beforeAfter}
		<details class="testimonial-accordion">
			<summary>
				<span>Perubahan Peserta</span>
				<svg
					class="accordion-caret"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						d="M6 9l6 6 6-6"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</summary>
			<div class="testimonial-before-after">
				<div class="before-after-item">
					<span class="label">Sebelum</span>
					<span class="value">{testimonial.beforeAfter.before}</span>
				</div>
				<div class="before-after-separator" aria-hidden="true">
					<span class="separator-icon">→</span>
				</div>
				<div class="before-after-item">
					<span class="label">Sesudah</span>
					<span class="value success">{testimonial.beforeAfter.after}</span>
				</div>
			</div>
		</details>
	{/if}

	{#if testimonial.videoUrl}
		<div class="testimonial-video">
			<a href={testimonial.videoUrl} target="_blank" rel="noopener noreferrer" class="video-link">
				<span>🎥</span> Tonton Video Testimonial
			</a>
		</div>
	{/if}
</article>

<style lang="postcss">
	@reference "../../app.css";

	.testimonial-card {
		@apply relative overflow-hidden rounded-3xl border border-white/15 p-8 transition-all duration-500 ease-out;
		background: radial-gradient(
				circle at top left,
				rgba(255, 255, 255, 0.6),
				rgba(255, 255, 255, 0.85)
			)
			linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.06));
		box-shadow: 0 18px 45px -25px rgba(15, 34, 65, 0.45);
	}

	.testimonial-card::before {
		content: '';
		@apply absolute inset-0 rounded-[inherit];
		background:
			radial-gradient(circle at 20% 20%, rgba(118, 75, 162, 0.25), transparent 55%),
			radial-gradient(circle at 80% 0%, rgba(102, 126, 234, 0.3), transparent 60%);
		z-index: 0;
	}

	.testimonial-card::after {
		content: '';
		@apply absolute top-8 right-8 h-24 w-24 rounded-full blur-3xl;
		background: rgba(102, 126, 234, 0.28);
		transform: translateZ(0);
	}

	.testimonial-card > * {
		@apply relative z-1;
	}

	.testimonial-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 22px 60px -25px rgba(15, 34, 65, 0.55);
		border-color: rgba(102, 126, 234, 0.35);
	}

	.testimonial-header {
		@apply mb-5 flex items-center gap-4;
	}

	.testimonial-avatar {
		@apply flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/60 backdrop-blur;
	}

	:global(.testimonial-avatar-img) {
		@apply h-full w-full object-cover;
	}

	.avatar-placeholder {
		@apply flex h-full w-full items-center justify-center text-2xl font-semibold;
		color: var(--color-primary-dark, #667eea);
	}

	.testimonial-info {
		@apply min-w-0 flex-1;
	}

	.testimonial-name-row {
		@apply mb-1 flex flex-wrap items-center gap-2;
	}

	.testimonial-name {
		@apply text-2xl leading-tight font-semibold tracking-tight text-(--color-primary-dark,#1a202c);
	}

	.testimonial-domain {
		@apply inline-flex rounded-full border border-white/30 bg-white/60 px-3 py-1 text-xs font-semibold tracking-widest text-(--color-primary-soft-blue) uppercase;
		letter-spacing: 0.08em;
	}

	.testimonial-role {
		@apply m-0 text-base leading-relaxed text-(--color-primary-medium,#5a6b88);
	}

	.testimonial-company {
		color: var(--color-primary-soft-blue, #667eea);
	}

	.testimonial-rating {
		@apply mb-4 flex items-center gap-1.5;
	}

	.star {
		@apply text-xl leading-none transition-all duration-200;
		color: rgba(226, 232, 240, 0.6);
		filter: drop-shadow(0 0 4px rgba(255, 201, 71, 0.35));
	}

	.star.filled {
		color: #ffd166;
	}

	.rating-text {
		@apply ml-2 rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-(--color-primary-medium,#5a6b88) uppercase;
	}

	.testimonial-text {
		@apply mb-6;
	}

	.testimonial-text p {
		@apply m-0 text-lg leading-relaxed text-(--color-primary-dark,#1f2937);
	}

	.testimonial-text p::first-letter {
		@apply text-2xl font-semibold text-(--color-primary-soft-blue,#667eea);
	}

	.testimonial-accordion {
		@apply mt-5 overflow-hidden rounded-2xl border border-white/30 bg-white/60 backdrop-blur;
	}

	.testimonial-accordion summary {
		@apply flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-(--color-primary-dark,#1a202c) transition-colors duration-200 outline-none;
		list-style: none;
	}

	.testimonial-accordion summary::-webkit-details-marker {
		display: none;
	}

	.testimonial-accordion[open] summary {
		color: var(--color-primary-soft-blue, #667eea);
	}

	.accordion-caret {
		@apply h-4 w-4 transition-transform duration-200;
	}

	.testimonial-accordion[open] .accordion-caret {
		transform: rotate(180deg);
	}

	.testimonial-before-after {
		@apply flex flex-wrap items-center gap-4 px-4 pb-4 text-sm;
	}

	.before-after-item {
		@apply flex min-w-[140px] flex-1 flex-col gap-1.5 rounded-xl bg-white/90 px-4 py-3 shadow-sm;
	}

	.before-after-item .label {
		@apply text-xs font-semibold tracking-wider text-(--color-primary-medium,#5a6b88) uppercase;
	}

	.before-after-item .value {
		@apply text-sm font-semibold text-(--color-primary-dark,#1a202c);
	}

	.before-after-item .value.success {
		color: #16a34a;
	}

	.before-after-separator {
		@apply flex h-full items-center justify-center rounded-full bg-linear-to-br from-white/60 to-white/30 px-3 py-4;
	}

	.separator-icon {
		@apply text-2xl font-semibold text-(--color-primary-soft-blue,#667eea);
	}

	.testimonial-video {
		@apply mt-5;
	}

	.video-link {
		@apply inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-(--color-primary-soft-blue) transition-all duration-200 hover:border-(--color-primary-soft-blue) hover:bg-white;
	}

	@media (max-width: 768px) {
		.testimonial-card {
			@apply p-6;
		}

		.testimonial-avatar {
			@apply h-14 w-14;
		}

		.testimonial-text p {
			@apply text-base;
		}

		.testimonial-before-after {
			@apply flex-col;
		}

		.before-after-separator {
			@apply hidden;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.testimonial-card,
		.star,
		.accordion-caret {
			transition: none;
		}
	}
</style>
