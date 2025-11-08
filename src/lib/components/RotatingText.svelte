<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import HeroSpacer from './HeroSpacer.svelte';
	import type { CareerOption } from '$lib/stores/career';
	import { DOMAIN_CONTENT } from '$lib/config/contentConfig';

	interface HeadlineVariant {
		headline: string;
		headlinePart2: string;
		description: string;
	}

	interface Props {
		variants: HeadlineVariant[];
		rotationDuration?: number;
		defaultVariant?: HeadlineVariant;
	}

	let { variants, rotationDuration = 5000, defaultVariant }: Props = $props();

	let currentIndex = $state(0);
	let rotationInterval: ReturnType<typeof setInterval> | null = null;

	// Gunakan defaultVariant jika diberikan, atau variants[currentIndex]
	const currentVariant = $derived(defaultVariant || variants[currentIndex] || variants[0]);

	// Map current variant ke domain berdasarkan headline matching
	const currentDomain = $derived.by(() => {
		if (defaultVariant) {
			// Jika defaultVariant, cari domain yang cocok
			for (const [domain, content] of Object.entries(DOMAIN_CONTENT)) {
				if (
					content.hero.headline === defaultVariant.headline &&
					content.hero.headlinePart2 === defaultVariant.headlinePart2
				) {
					return domain as CareerOption;
				}
			}
		}
		// Jika tidak ada defaultVariant, gunakan index untuk mapping
		const domainKeys = Object.keys(DOMAIN_CONTENT) as CareerOption[];
		return domainKeys[currentIndex] || domainKeys[0];
	});

	onMount(() => {
		// Skip rotation jika default variant diberikan
		if (defaultVariant) {
			return;
		}
		// rotationInterval = null;
		rotationInterval = setInterval(() => {
			currentIndex = (currentIndex + 1) % variants.length;
		}, rotationDuration);
	});

	onDestroy(() => {
		if (rotationInterval) {
			clearInterval(rotationInterval);
		}
	});
</script>

<!-- Rotating Headlines -->
<div
	class="relative z-10 flex max-w-[720px] flex-col items-center px-4 text-center min-[640px]:px-6 md:px-0"
>
	{#key currentIndex}
		<h1
			id="hero-heading"
			class="hero-heading slide-in-right lg:text-5.8xl pb-1 text-3xl leading-[1.3] font-semibold text-transparent min-[640px]:text-4xl min-[640px]:leading-[1.25] md:text-5xl md:leading-[1.2] lg:leading-[1.15]"
		>
			{currentVariant.headline}<br />{currentVariant.headlinePart2}
		</h1>
	{/key}
</div>
<HeroSpacer variant="icon" size="lg" spacing={1.5} {currentDomain} />
<!-- Rotating Description -->
<div class="relative z-10 flex max-w-[700px] justify-center px-6 text-center md:px-0">
	<p
		class="text-base leading-relaxed text-text-secondary min-[640px]:text-lg min-[640px]:leading-relaxed md:text-xl"
	>
		{currentVariant.description}
	</p>
</div>

<style>
	/* Custom CSS hanya untuk efek yang tidak tersedia di Tailwind CSS 4 */

	/* Heading dengan gradient text menggunakan CSS variables */
	.hero-heading {
		background: linear-gradient(
			135deg,
			var(--color-primary-dark) 0%,
			var(--color-primary-soft-blue) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	/* Animasi slide ke kanan untuk headline */
	@keyframes slideInRight {
		0% {
			transform: translateX(-100%);
			opacity: 0;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.slide-in-right {
		animation: slideInRight 0.6s ease-out;
	}
</style>
