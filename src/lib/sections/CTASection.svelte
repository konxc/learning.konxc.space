<script lang="ts">
	import TerminalDemo from '$lib/components/TerminalDemo.svelte';
	import AboutWindow from '$lib/components/AboutWindow.svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import type { CTAPatternType } from '$lib/types/ctaPatterns';
	import type { TerminalTheme } from '$lib/utils/terminalTheme';
	import { CTA_OVERLAY_CONFIG } from '$lib/config/ctaSection';
	import { getCTAContent } from '$lib/config/contentConfig';
	import {
		getPatternBackgroundStyle,
		getPatternOverlayClass,
		isSpecialPattern
	} from '$lib/utils/patternStyling';
	import { createPromptGetter, createRightArrowGetter } from '$lib/utils/aboutWindowHelpers';
	import { trackCTAClick } from '$lib/utils/analytics';
	import '$lib/styles/cta-section.css';

	interface Props {
		/** Background pattern type untuk CTA section */
		pattern?: CTAPatternType;
		/** Intensity/opacity pattern (0-1, default: 0.03) */
		patternIntensity?: number;
	}

	let { pattern = 'diagonal-stripes', patternIntensity = 0.03 }: Props = $props();

	// Get current domain from store
	let currentDomain = $state(get(careerStore));

	$effect(() => {
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
		});
		return unsubscribe;
	});

	// Get dynamic CTA content based on domain
	const ctaContent = $derived(getCTAContent(currentDomain));

	// Pattern styling
	const patternBackgroundStyle = $derived(getPatternBackgroundStyle(pattern, patternIntensity));
	const patternOverlayClass = $derived(getPatternOverlayClass(pattern));
	const shouldUseInlineStyle = $derived(!isSpecialPattern(pattern));

	// Terminal state (untuk AboutWindow)
	let isAboutOpen = $state(false);
	let sectionEl = $state<HTMLElement | null>(null);
	let theme = $state<TerminalTheme>('p10k');

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? CTA_OVERLAY_CONFIG.glowOrbs.hardcore
			: CTA_OVERLAY_CONFIG.glowOrbs.chill
	);

	// AboutWindow helpers
	const getPromptForAbout = createPromptGetter();
	const getRightArrowForAbout = createRightArrowGetter();
</script>

<section id="register" class="cta-section" bind:this={sectionEl} aria-labelledby="cta-title">
	<!-- Pattern overlay -->
	<div class={patternOverlayClass} style={shouldUseInlineStyle ? patternBackgroundStyle : ''}></div>
	<div class="cta-container">
		<div class="cta-badge" role="status" aria-live="polite">{ctaContent.badge}</div>

		<h2 id="cta-title">{ctaContent.title}</h2>
		<p>{ctaContent.description}</p>

		<TerminalDemo
			containerEl={sectionEl}
			aboutOpen={isAboutOpen}
			on:aboutOpen={() => (isAboutOpen = true)}
		/>

		<div class="cta-buttons">
			<a
				href={ctaContent.primaryButton.href}
				class="cta-primary"
				aria-label="Daftar sekarang - {ctaContent.primaryButton.text}"
				onclick={() =>
					trackCTAClick(
						'cta_section',
						ctaContent.primaryButton.text,
						ctaContent.primaryButton.href
					)}
			>
				{ctaContent.primaryButton.text}
			</a>
		</div>

		<p class="cta-note">
			{ctaContent.note.text} <a href={ctaContent.note.href}>{ctaContent.note.linkText}</a>
		</p>
	</div>

	<!-- Decorative overlays -->
	<AuroraOverlay {...CTA_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={CTA_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />

	{#if isAboutOpen}
		<AboutWindow
			open={isAboutOpen}
			title="About"
			containerEl={sectionEl}
			{theme}
			getPrompt={getPromptForAbout}
			getRightArrow={getRightArrowForAbout}
			on:close={() => (isAboutOpen = false)}
		/>
	{/if}
</section>
