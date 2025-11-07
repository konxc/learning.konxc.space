<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import TimelineItem from '$lib/components/TimelineItem.svelte';
	import TimelineItemWrapper from '$lib/components/TimelineItemWrapper.svelte';
	import TimelineLine from '$lib/components/TimelineLine.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import FloatingProfileMenu from '$lib/components/FloatingProfileMenu.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore, type CareerOption } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { careerRoadmaps } from '$lib/data/careerRoadmaps';
	import { TIMELINE_CONSTANTS } from '$lib/types/timeline';
	import { PROGRAM_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';
	import { PROGRAM_BACKGROUND_GRADIENT } from '$lib/config/programSection';
	import { DOMAIN_NARRATIVES } from '$lib/config/contentConfig';
	import type { DomainNarrative } from '$lib/config/contentConfig';
	import '$lib/styles/timeline-hover.css';

	// ============================================================================
	// STATE MANAGEMENT
	// ============================================================================
	const getInitialCareer = (): CareerOption => {
		if (typeof window === 'undefined') {
			return 'Developer';
		}
		try {
			return get(careerStore) || 'Developer';
		} catch {
			return 'Developer';
		}
	};

	let currentCareer = $state<CareerOption>(getInitialCareer());

	$effect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const unsubscribe = careerStore.subscribe((value) => {
			if (value && value !== currentCareer) {
				currentCareer = value;
				visibleItems = new Set();
			}
		});

		const currentValue = get(careerStore);
		if (currentValue && currentValue !== currentCareer) {
			currentCareer = currentValue;
		}

		return unsubscribe;
	});

	// ============================================================================
	// COMPUTED VALUES
	// ============================================================================
	const timelineItems = $derived.by(() => {
		if (!currentCareer) {
			return [];
		}

		const roadmap = careerRoadmaps[currentCareer];

		if (!roadmap || !Array.isArray(roadmap) || roadmap.length === 0) {
			return [];
		}

		return roadmap;
	});

	const currentNarrative = $derived(DOMAIN_NARRATIVES[currentCareer] as DomainNarrative);

	// Helper function untuk menentukan apakah menggunakan TimelineCard
	const shouldUseTimelineCard = (index: number): boolean =>
		index < TIMELINE_CONSTANTS.TIMELINE_CARD_MAX_INDEX;

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? PROGRAM_OVERLAY_CONFIG.glowOrbs.hardcore
			: PROGRAM_OVERLAY_CONFIG.glowOrbs.chill
	);

	// ============================================================================
	// SCROLL ANIMATION SETUP
	// ============================================================================
	let timelineContainer: HTMLDivElement | null = $state(null);
	let visibleItems = $state<Set<number>>(new Set());
	let observerInstance: IntersectionObserver | null = $state(null);

	$effect(() => {
		if (!browser || !timelineContainer || timelineItems.length === 0) {
			if (observerInstance) {
				observerInstance.disconnect();
				observerInstance = null;
			}
			return;
		}

		const timeoutId = setTimeout(() => {
			if (observerInstance) {
				observerInstance.disconnect();
			}

			observerInstance = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const index = parseInt(entry.target.getAttribute('data-timeline-index') || '0');
						if (entry.isIntersecting) {
							visibleItems = new Set([...visibleItems, index]);
						}
					});
				},
				{
					threshold: TIMELINE_CONSTANTS.OBSERVER_THRESHOLD,
					rootMargin: TIMELINE_CONSTANTS.OBSERVER_ROOT_MARGIN
				}
			);

			const items = timelineContainer.querySelectorAll('[data-timeline-index]');
			items.forEach((item) => observerInstance?.observe(item));
		}, TIMELINE_CONSTANTS.OBSERVER_SETUP_TIMEOUT);

		return () => {
			clearTimeout(timeoutId);
			if (observerInstance) {
				observerInstance.disconnect();
				observerInstance = null;
			}
		};
	});
</script>

<section
	id="program"
	class="program-section relative overflow-hidden section-padding transition-all duration-300"
	aria-labelledby="program-title"
>
	<div class="program-container mx-auto max-w-[1200px]">
		<!-- Section Header -->
		<h2
			id="program-title"
			class="program-title relative lg-mb-15 mb-8 inline-block text-center text-4xl text-(--color-primary-dark) transition-all duration-700 md:mb-10 md:text-5xl lg:text-6xl"
		>
			Apa yang Akan Kamu Pelajari?
		</h2>

		<div class="program-narrative" aria-live="polite">
			<span class="narrative-tag">{currentNarrative.title}</span>
			<p class="narrative-text">{currentNarrative.futureVision}</p>
			<ul class="narrative-list" role="list">
				{#each currentNarrative.initiatives.slice(0, 2) as item}
					<li role="listitem">{item}</li>
				{/each}
			</ul>
		</div>

		<!-- Timeline Container -->
		<div class="timeline-wrapper relative mx-auto max-w-[800px]" bind:this={timelineContainer}>
			<TimelineLine class="timeline" />
			{#if timelineItems.length === 0}
				<div
					class="flex min-h-[200px] items-center justify-center text-center"
					role="status"
					aria-live="polite"
				>
					<p class="text-(--color-primary-medium)">
						Memuat timeline untuk karir <strong>{currentCareer}</strong>...
					</p>
				</div>
			{:else}
				{#key currentCareer}
					{#each timelineItems as item, index (item.title)}
						<div
							class="timeline-item-wrapper transition-all duration-500"
							data-timeline-index={index}
							class:is-even={index % 2 === 0}
							class:is-odd={index % 2 === 1}
							in:fly={{
								y: TIMELINE_CONSTANTS.ANIMATION_Y_OFFSET,
								duration: TIMELINE_CONSTANTS.ANIMATION_DURATION,
								delay: visibleItems.has(index)
									? 0
									: index * TIMELINE_CONSTANTS.ANIMATION_DELAY_PER_ITEM
							}}
							class:visible={visibleItems.has(index)}
						>
							{#if shouldUseTimelineCard(index)}
								<TimelineItemWrapper
									title={item.title}
									subtitle={item.subtitle}
									description={item.description}
									{index}
									useCard={true}
									cardId="timeline-card-{index}"
								/>
							{:else}
								<TimelineItem {index} {...item} />
							{/if}
						</div>
					{/each}
				{/key}
			{/if}
		</div>
	</div>

	<AuroraOverlay {...PROGRAM_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={PROGRAM_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />

	<FloatingProfileMenu {currentCareer} />
</section>

<style lang="postcss">
	@reference "../../app.css";

	/* Custom CSS hanya untuk efek yang tidak tersedia di Tailwind CSS 4 */

	.program-section {
		/* Background base color */
		background-color: var(--color-bg-lighter);
		/* Background gradient overlay */
		background-image:
			linear-gradient(
				to bottom,
				rgba(255, 255, 255, 0.05) 0%,
				rgba(255, 255, 255, 0.1) 5%,
				rgba(255, 255, 255, 0.3) 15%,
				rgba(255, 255, 255, 0.5) 30%,
				rgba(255, 255, 255, 0.7) 50%,
				rgba(102, 126, 234, 0.1) 75%,
				rgba(102, 126, 234, 0.4) 90%,
				var(--color-gradient-purple-start) 100%
			),
			linear-gradient(to bottom, #ffffff 0%, var(--color-bg-lighter) 100%);
		/* Ensure section is visible */
		z-index: 1;
	}

	.program-container {
		position: relative;
		z-index: 2; /* Above overlay */
	}

	.program-title {
		left: 50%;
		transform: translateX(-50%);
	}

	.program-title::after {
		content: '';
		display: block;
		margin: 12px auto 0;
		width: 110px;
		height: 5px;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--color-primary-soft-blue), transparent);
		opacity: 0.6;
	}

	.program-narrative {
		@apply mx-auto mb-10 max-w-[720px] rounded-3xl border border-white/40 bg-white/70 p-6 text-center shadow-[0_20px_45px_-32px_rgba(15,34,65,0.3)];
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.narrative-tag {
		@apply inline-flex w-fit self-center rounded-full bg-(--color-primary-soft-blue,#667eea)/12 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.narrative-text {
		@apply text-sm text-(--color-primary-medium,#4a5568) md:text-base;
	}

	.narrative-list {
		@apply mx-auto mt-1 flex flex-col gap-2 text-left text-sm text-(--color-primary-medium,#4a5568);
		list-style: disc;
		max-width: 520px;
		padding-left: 1.5rem;
	}

	.timeline-wrapper {
		position: relative;
		box-sizing: border-box;
	}

	.timeline-item-wrapper {
		transition: opacity 0.3s ease;
	}

	.program-title {
		animation: fadeInDown 0.8s ease-out;
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@media (max-width: 768px) {
		.timeline-item-wrapper {
			padding: 0 10px;
		}
	}

	@media (max-width: 480px) {
		.timeline-item-wrapper {
			padding: 0 5px;
		}

		.program-title {
			@apply mb-10 text-3xl;
		}
	}

	section#program {
		scroll-behavior: smooth;
	}
</style>
