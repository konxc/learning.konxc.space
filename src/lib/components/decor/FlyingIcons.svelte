<script lang="ts">
	import { onMount } from 'svelte';
	import { brandMode } from '$lib/stores/brandMode';

	interface IconConfig {
		emoji: string;
		x: string; // percentage or fixed position
		y: string;
		size: number; // base size in em unit
		sizeVariation: number; // scale variation (0.8-1.2 means 80%-120% of base size)
		delay: number; // animation delay in seconds
		category: string; // untuk tooltip
		rotation: number; // initial rotation in degrees
		opacity: number; // 0-1, opacity level
		depth: number; // 0-1, untuk z-index dan blur (0 = belakang, 1 = depan)
		speed: number; // animation speed multiplier (0.5-1.5)
	}

	interface Props {
		zIndex?: number;
		intensity?: number; // 0-1, controls movement amplitude
		interactionMode?:
			| 'none'
			| 'subtle'
			| 'glow'
			| 'pulse'
			| 'ripple'
			| 'spin'
			| 'bounce'
			| 'zoom'
			| 'float'
			| 'shake'
			| 'magnetic'
			| 'glowPulse'; // Mode interaktifitas playful
		flyingMode?: 'smooth' | 'bouncy' | 'drift' | 'orbit' | 'wave' | 'swing' | 'twirl' | 'gentle'; // Mode flying animation
	}

	const {
		zIndex = 1,
		intensity = 1,
		interactionMode = 'subtle',
		flyingMode = 'smooth'
	}: Props = $props();

	// Icon configurations - kembali ke distribusi dinamis dengan Z-pattern:
	// 1. Rule of Thirds: Focal points di golden ratio (38.2%, 61.8%)
	// 2. Visual Hierarchy: Icon besar di corners untuk framing, kecil di edges untuk balance
	// 3. Safe Zone: Teks berada di 30-70% horizontal, 25-70% vertical → icon di luar zona ini
	// 4. Depth Clustering: Icon jauh (low depth) di background edge, dekat (high depth) di foreground corners
	// 5. Asymmetrical Balance: Density tinggi di top-right & bottom-left (diagonal emphasis)
	// 6. Eye Flow: Z-pattern dari top-left → center → bottom-right
	// Depth: 0-0.3 = belakang teks (background layer), 0.3-0.6 = level tengah, 0.6-1.0 = depan teks (foreground)
	const icons: IconConfig[] = [
		// === TOP-LEFT QUADRANT (Background Layer - Large Icons untuk Framing) ===
		// Corner emphasis dengan icon besar, depth rendah untuk background framing
		{
			emoji: '💻',
			x: '8%',
			y: '12%',
			size: 2.4,
			sizeVariation: 0.88,
			delay: 0,
			category: 'Coding',
			rotation: -8,
			opacity: 0.55,
			depth: 0.1,
			speed: 0.85
		},
		{
			emoji: '🏔️',
			x: '22%',
			y: '8%',
			size: 2.2,
			sizeVariation: 0.92,
			delay: 1.2,
			category: 'Outdoor',
			rotation: 12,
			opacity: 0.58,
			depth: 0.12,
			speed: 0.75
		},
		{
			emoji: '📚',
			x: '5%',
			y: '28%',
			size: 1.9,
			sizeVariation: 0.9,
			delay: 2.1,
			category: 'Akademik',
			rotation: -6,
			opacity: 0.52,
			depth: 0.08,
			speed: 0.95
		},

		// === TOP-RIGHT QUADRANT (Foreground Layer - Cluster Density Tinggi) ===
		// Z-pattern destination: High density cluster dengan icon dekat (foreground)
		{
			emoji: '🐍',
			x: '88%',
			y: '18%',
			size: 2.0,
			sizeVariation: 1.12,
			delay: 0.6,
			category: 'Python',
			rotation: 10,
			opacity: 0.88,
			depth: 0.82,
			speed: 0.9
		},
		{
			emoji: '🎨',
			x: '92%',
			y: '35%',
			size: 1.8,
			sizeVariation: 1.08,
			delay: 1.5,
			category: 'UI/UX Design',
			rotation: 5,
			opacity: 0.85,
			depth: 0.75,
			speed: 0.95
		},
		{
			emoji: '💰',
			x: '78%',
			y: '22%',
			size: 1.7,
			sizeVariation: 1.15,
			delay: 2.4,
			category: 'Keuangan',
			rotation: -5,
			opacity: 0.9,
			depth: 0.85,
			speed: 1.05
		},
		{
			emoji: '📊',
			x: '85%',
			y: '8%',
			size: 1.6,
			sizeVariation: 1.05,
			delay: 0.3,
			category: 'Analisis Data',
			rotation: 7,
			opacity: 0.78,
			depth: 0.68,
			speed: 1.1
		},

		// === LEFT EDGE (Mid-ground Layer - Vertical Flow) ===
		// Edge clustering untuk framing tanpa mengganggu konten tengah
		{
			emoji: '📐',
			x: '12%',
			y: '52%',
			size: 1.6,
			sizeVariation: 0.95,
			delay: 1.8,
			category: 'Matematika',
			rotation: -7,
			opacity: 0.68,
			depth: 0.35,
			speed: 1.0
		},
		{
			emoji: '✏️',
			x: '6%',
			y: '72%',
			size: 1.5,
			sizeVariation: 1.0,
			delay: 2.7,
			category: 'Design Tools',
			rotation: -4,
			opacity: 0.62,
			depth: 0.22,
			speed: 1.05
		},
		{
			emoji: '⚡',
			x: '8%',
			y: '77%',
			size: 1.7,
			sizeVariation: 1.18,
			delay: 0.9,
			category: 'JavaScript',
			rotation: -12,
			opacity: 0.92,
			depth: 0.88,
			speed: 1.2
		},

		// === RIGHT EDGE (Mid-ground Layer) ===
		{
			emoji: '💼',
			x: '94%',
			y: '58%',
			size: 1.9,
			sizeVariation: 0.93,
			delay: 1.1,
			category: 'Bisnis',
			rotation: 6,
			opacity: 0.65,
			depth: 0.28,
			speed: 0.88
		},
		{
			emoji: '🌊',
			x: '92%',
			y: '82%',
			size: 1.8,
			sizeVariation: 0.96,
			delay: 2.5,
			category: 'Water Sports',
			rotation: 8,
			opacity: 0.64,
			depth: 0.32,
			speed: 0.82
		},

		// === BOTTOM-LEFT QUADRANT (Foreground Emphasis) ===
		// Z-pattern end point: Eye-catching icons untuk call-to-action area
		{
			emoji: '🧗',
			x: '15%',
			y: '92%',
			size: 1.8,
			sizeVariation: 1.1,
			delay: 1.6,
			category: 'Adventure',
			rotation: -10,
			opacity: 0.82,
			depth: 0.72,
			speed: 1.0
		},
		{
			emoji: '📱',
			x: '28%',
			y: '85%',
			size: 1.7,
			sizeVariation: 1.05,
			delay: 2.2,
			category: 'Digital Marketing',
			rotation: -6,
			opacity: 0.75,
			depth: 0.58,
			speed: 0.98
		},

		// === BOTTOM-RIGHT QUADRANT (Background Balance) ===
		// Counter-balance untuk asymmetrical harmony
		{
			emoji: '🧪',
			x: '82%',
			y: '88%',
			size: 1.7,
			sizeVariation: 0.94,
			delay: 0.7,
			category: 'Sains',
			rotation: 9,
			opacity: 0.58,
			depth: 0.18,
			speed: 0.8
		},
		{
			emoji: '📝',
			x: '72%',
			y: '92%',
			size: 1.4,
			sizeVariation: 1.08,
			delay: 1.9,
			category: 'Bahasa',
			rotation: -3,
			opacity: 0.6,
			depth: 0.25,
			speed: 1.02
		},

		// === NEAR-TEXT ZONE (Foreground Accents - Very Close but Safe) ===
		// Icon di area dekat teks untuk engagement, opacity tinggi & depth tinggi
		// Positioned di golden ratio points dekat safe zone boundary
		{
			emoji: '🔬',
			x: '28%',
			y: '32%',
			size: 1.5,
			sizeVariation: 1.12,
			delay: 1.3,
			category: 'Riset & Analisis',
			rotation: 8,
			opacity: 0.86,
			depth: 0.78,
			speed: 0.92
		},
		{
			emoji: '🎯',
			x: '68%',
			y: '48%',
			size: 1.4,
			sizeVariation: 1.08,
			delay: 2.6,
			category: 'Target & Goal',
			rotation: -6,
			opacity: 0.84,
			depth: 0.8,
			speed: 1.03
		},
		{
			emoji: '🚀',
			x: '32%',
			y: '62%',
			size: 1.6,
			sizeVariation: 1.15,
			delay: 0.4,
			category: 'Growth & Progress',
			rotation: 7,
			opacity: 0.9,
			depth: 0.88,
			speed: 1.08
		},
		{
			emoji: '🌟',
			x: '66%',
			y: '65%',
			size: 1.3,
			sizeVariation: 1.2,
			delay: 1.7,
			category: 'Excellence',
			rotation: -5,
			opacity: 0.87,
			depth: 0.75,
			speed: 0.96
		},

		// === TOP CENTER (Near Logo/Headline - Background Layer) ===
		// Subtle framing di atas headline untuk visual interest tanpa mengganggu
		{
			emoji: '🎓',
			x: '50%',
			y: '5%',
			size: 1.8,
			sizeVariation: 0.9,
			delay: 0.8,
			category: 'Pendidikan',
			rotation: 5,
			opacity: 0.48,
			depth: 0.05,
			speed: 0.7
		},
		{
			emoji: '💡',
			x: '38%',
			y: '18%',
			size: 1.4,
			sizeVariation: 1.05,
			delay: 2.3,
			category: 'Ide & Inovasi',
			rotation: -8,
			opacity: 0.7,
			depth: 0.42,
			speed: 1.05
		},
		{
			emoji: '🔧',
			x: '62%',
			y: '18%',
			size: 1.5,
			sizeVariation: 0.98,
			delay: 1.4,
			category: 'Tools & Skills',
			rotation: 9,
			opacity: 0.68,
			depth: 0.38,
			speed: 0.93
		}
	];

	// Derived untuk color berdasarkan brandMode
	const iconGlow = $derived(
		$brandMode === 'hardcore'
			? '0 0 20px rgba(251, 146, 60, 0.4), 0 0 40px rgba(251, 146, 60, 0.2)'
			: '0 0 20px rgba(20, 184, 166, 0.4), 0 0 40px rgba(20, 184, 166, 0.2)'
	);

	// Hover state untuk setiap icon
	let hoveredIcon = $state<number | null>(null);

	// CSS variable untuk intensity
	const intensityValue = $derived(intensity);

	function handleMouseEnter(index: number) {
		hoveredIcon = index;
	}

	function handleMouseLeave() {
		hoveredIcon = null;
	}

	// Deteksi performa GPU dan aktifkan hardware acceleration
	let isMounted = $state(false);
	let gpuAcceleration = $state(true);

	onMount(() => {
		isMounted = true;

		// Cek apakah hardware acceleration didukung
		// Test dengan membuat element dan cek transform
		const testEl = document.createElement('div');
		testEl.style.transform = 'translateZ(0)';
		testEl.style.willChange = 'transform';
		document.body.appendChild(testEl);

		// Force reflow untuk memastikan hardware acceleration aktif
		void testEl.offsetHeight;

		const computedStyle = window.getComputedStyle(testEl);
		const transform = computedStyle.transform;

		// Jika transform berisi matrix atau matrix3d, GPU acceleration aktif
		gpuAcceleration = transform.includes('matrix');

		document.body.removeChild(testEl);

		// Tambahkan class ke container untuk styling conditional
		if (!gpuAcceleration) {
			const container = document.querySelector('.flying-icons-container');
			if (container) {
				container.classList.add('gpu-fallback');
			}
		}
	});
</script>

<div
	class="flying-icons-container {gpuAcceleration ? '' : 'gpu-fallback'}"
	data-interaction-mode={interactionMode}
	style="z-index: {zIndex}; --intensity: {intensityValue};"
>
	{#each icons as icon, index (index)}
		{@const actualSize = icon.size * icon.sizeVariation}
		{@const zIndexValue = icon.depth < 0.3 ? 1 : icon.depth > 0.7 ? 8 : 4}
		{@const blurAmount = (1 - icon.depth) * 6}
		{@const animationDuration = 6 / icon.speed}
		<button
			type="button"
			class="flying-icon flying-{flyingMode} pointer-events-auto absolute cursor-pointer border-none bg-transparent transition-all duration-300 ease-out"
			style="
				left: {icon.x};
				top: {icon.y};
				font-size: {actualSize}em;
				--float-duration: {animationDuration}s;
				animation-delay: {icon.delay * 0.3}s, {icon.delay}s;
				--initial-rotation: {icon.rotation}deg;
				--icon-glow: {iconGlow};
				--icon-opacity: {icon.opacity};
				--icon-blur: {blurAmount}px;
				--icon-depth: {icon.depth};
				--icon-size: {actualSize}em;
				z-index: {zIndexValue};
				opacity: var(--icon-opacity);
			"
			aria-label="Icon {icon.category}"
			onmouseenter={() => {
				if (interactionMode !== 'none') {
					handleMouseEnter(index);
				}
			}}
			onmouseleave={() => {
				if (interactionMode !== 'none') {
					handleMouseLeave();
				}
			}}
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			class:pointer-events-none={interactionMode === 'none'}
		>
			<span
				class="icon-emoji block transition-all duration-300 ease-out {hoveredIcon === index
					? `icon-hovered icon-${interactionMode}`
					: ''}"
				style="filter: blur(var(--icon-blur)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15 * var(--icon-depth)));"
			>
				{icon.emoji}
			</span>
			{#if hoveredIcon === index}
				<span
					class="icon-tooltip pointer-events-none absolute top-0 left-1/2 mb-2 -translate-x-1/2 -translate-y-full rounded-lg bg-black/80 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white"
				>
					{icon.category}
				</span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.flying-icons-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.flying-icon {
		/* Animation diatur via inline style untuk durasi dinamis per icon */
		will-change: transform, opacity;
		cursor: pointer;
		transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
		/* Force hardware acceleration untuk GPU terintegrasi */
		transform: translateZ(0);
		backface-visibility: hidden;
		perspective: 1000px;
		/* Entrance animation */
		animation: fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	}

	/* Flying mode: SMOOTH - Default, halus dan floating */
	.flying-icon.flying-smooth {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatSmooth var(--float-duration, 6s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	/* Flying mode: BOUNCY - Lebih bouncy dan playful */
	.flying-icon.flying-bouncy {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatBouncy var(--float-duration, 6s) cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
	}

	/* Flying mode: DRIFT - Drift perlahan, sangat gentle */
	.flying-icon.flying-drift {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatDrift var(--float-duration, 8s) ease-in-out infinite;
	}

	/* Flying mode: ORBIT - Orbit melingkar */
	.flying-icon.flying-orbit {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatOrbit var(--float-duration, 7s) ease-in-out infinite;
	}

	/* Flying mode: WAVE - Bergerak seperti gelombang */
	.flying-icon.flying-wave {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatWave var(--float-duration, 6.5s) ease-in-out infinite;
	}

	/* Flying mode: SWING - Seperti ayunan, maju mundur */
	.flying-icon.flying-swing {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatSwing var(--float-duration, 7s) ease-in-out infinite;
	}

	/* Flying mode: TWIRL - Berputar sambil bergerak */
	.flying-icon.flying-twirl {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatTwirl var(--float-duration, 6s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	/* Flying mode: GENTLE - Sangat halus, minimal movement */
	.flying-icon.flying-gentle {
		animation:
			fadeInPlayful 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
			floatGentle var(--float-duration, 10s) ease-in-out infinite;
	}

	.flying-icon:active {
		transform: scale(0.85) rotate(5deg) !important;
		transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
		filter: brightness(1.3) !important;
	}

	/* Responsive: Progressive icon reduction berdasarkan breakpoint */

	/* Tablet (768px - 1024px): Reduce 40% icons + smaller size */
	@media (max-width: 1024px) and (min-width: 769px) {
		.flying-icon {
			font-size: calc(var(--icon-size, 1em) * 0.85) !important;
		}

		/* Hide setiap icon ke-3 dan ke-4 (hide 33%) */
		.flying-icon:nth-child(4n + 3),
		.flying-icon:nth-child(4n + 4) {
			display: none;
		}

		/* Hide background icons (depth < 0.2) pada tablet */
		.flying-icon[style*='--icon-depth: 0.0'],
		.flying-icon[style*='--icon-depth: 0.1'] {
			display: none;
		}
	}

	/* Mobile (480px - 768px): Reduce 60% icons + smaller size + lower opacity */
	@media (max-width: 768px) and (min-width: 481px) {
		.flying-icon {
			font-size: calc(var(--icon-size, 1em) * 0.75) !important;
			opacity: calc(var(--icon-opacity, 1) * 0.75) !important;
		}

		/* Hide lebih banyak - keep hanya icon penting */
		.flying-icon:nth-child(n + 11) {
			display: none;
		}

		/* Hide semua background layer icons (depth < 0.3) */
		.flying-icon[style*='--icon-depth: 0.0'],
		.flying-icon[style*='--icon-depth: 0.1'],
		.flying-icon[style*='--icon-depth: 0.2'] {
			display: none;
		}

		/* Hide mid-ground icons dengan depth rendah */
		.flying-icon[style*='--icon-depth: 0.28'],
		.flying-icon[style*='--icon-depth: 0.32'],
		.flying-icon[style*='--icon-depth: 0.35'] {
			display: none;
		}
	}

	/* Small Mobile (< 480px): Reduce 75% icons - hanya keep yang paling penting */
	@media (max-width: 480px) {
		.flying-icon {
			font-size: calc(var(--icon-size, 1em) * 0.65) !important;
			opacity: calc(var(--icon-opacity, 1) * 0.6) !important;
		}

		/* Hide semua kecuali 6-7 icon pertama yang penting */
		/* Exception: keep icon dengan depth tinggi (>= 0.75) meskipun di posisi > 7 */
		.flying-icon:nth-child(n + 8) {
			display: none;
		}

		/* Show kembali icon dengan depth tinggi (foreground) meskipun di posisi > 7 */
		.flying-icon[style*='--icon-depth: 0.75'],
		.flying-icon[style*='--icon-depth: 0.76'],
		.flying-icon[style*='--icon-depth: 0.77'],
		.flying-icon[style*='--icon-depth: 0.78'],
		.flying-icon[style*='--icon-depth: 0.79'],
		.flying-icon[style*='--icon-depth: 0.8'],
		.flying-icon[style*='--icon-depth: 0.81'],
		.flying-icon[style*='--icon-depth: 0.82'],
		.flying-icon[style*='--icon-depth: 0.83'],
		.flying-icon[style*='--icon-depth: 0.84'],
		.flying-icon[style*='--icon-depth: 0.85'],
		.flying-icon[style*='--icon-depth: 0.86'],
		.flying-icon[style*='--icon-depth: 0.87'],
		.flying-icon[style*='--icon-depth: 0.88'],
		.flying-icon[style*='--icon-depth: 0.89'],
		.flying-icon[style*='--icon-depth: 0.9'],
		.flying-icon[style*='--icon-depth: 0.91'],
		.flying-icon[style*='--icon-depth: 0.92'],
		.flying-icon[style*='--icon-depth: 0.93'],
		.flying-icon[style*='--icon-depth: 0.94'],
		.flying-icon[style*='--icon-depth: 0.95'],
		.flying-icon[style*='--icon-depth: 0.96'],
		.flying-icon[style*='--icon-depth: 0.97'],
		.flying-icon[style*='--icon-depth: 0.98'],
		.flying-icon[style*='--icon-depth: 0.99'] {
			display: block !important;
		}

		/* Hanya show foreground icons (depth > 0.6) */
		.flying-icon[style*='--icon-depth: 0.0'],
		.flying-icon[style*='--icon-depth: 0.1'],
		.flying-icon[style*='--icon-depth: 0.2'],
		.flying-icon[style*='--icon-depth: 0.3'],
		.flying-icon[style*='--icon-depth: 0.4'],
		.flying-icon[style*='--icon-depth: 0.5'],
		.flying-icon[style*='--icon-depth: 0.58'] {
			display: none;
		}

		/* Reduce animation intensity untuk performa - durasi diatur via inline style */
	}

	/* Base hover state - pause flying animation */
	.flying-icon:hover {
		z-index: 20 !important;
	}

	/* Disable interactions jika mode = 'none' */
	.flying-icons-container[data-interaction-mode='none'] .flying-icon {
		pointer-events: none !important;
		cursor: default !important;
	}

	.flying-icons-container[data-interaction-mode='none'] .flying-icon:hover {
		animation-play-state: running !important;
		z-index: initial !important;
	}

	.icon-emoji {
		display: block;
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			filter 0.4s ease-out,
			opacity 0.4s ease-out;
		will-change: transform, opacity;
		backface-visibility: hidden;
		/* Force hardware acceleration */
		transform: translateZ(0);
		/* Simplifikasi untuk GPU lemah - hilangkan preserve-3d */
	}

	/* ============================================
	   INTERAKTIFITAS MODES - Tidak berbenturan dengan flying animation
	   ============================================ */

	/* Mode: SUBTLE - Scale kecil + glow, tanpa ubah posisi */
	.icon-emoji.icon-hovered.icon-subtle {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		transform: scale(1.25) translateZ(0) !important;
		opacity: 1 !important;
		/* Tetap dalam transform context dari flying animation */
	}

	.flying-icon:hover .icon-emoji.icon-subtle {
		animation-play-state: paused !important;
	}

	/* Mode: GLOW - Hanya glow effect, tanpa transform */
	.icon-emoji.icon-hovered.icon-glow {
		filter: blur(0px) drop-shadow(var(--icon-glow)) drop-shadow(0 0 20px rgba(20, 184, 166, 0.6)) !important;
		opacity: 1 !important;
		transform: translateZ(0) !important;
		/* Tidak ubah scale/posisi, hanya filter */
	}

	.flying-icon:hover .icon-emoji.icon-glow {
		animation-play-state: running !important;
		/* Flying animation tetap jalan, hanya glow diperkuat */
	}

	/* Mode: PULSE - Pulse scale tanpa ubah posisi */
	.icon-emoji.icon-hovered.icon-pulse {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		animation: subtlePulse 1.2s ease-in-out infinite !important;
		transform-origin: center center !important;
	}

	@keyframes subtlePulse {
		0%,
		100% {
			transform: scale(1.15) translateZ(0);
		}
		50% {
			transform: scale(1.3) translateZ(0);
		}
	}

	.flying-icon:hover .icon-emoji.icon-pulse {
		animation-play-state: paused !important;
	}

	.flying-icon:hover .icon-emoji.icon-pulse {
		animation: subtlePulse 1.2s ease-in-out infinite !important;
	}

	/* Mode: RIPPLE - Ripple effect tanpa ubah posisi icon */
	.icon-emoji.icon-hovered.icon-ripple {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		transform: scale(1.2) translateZ(0) !important;
		position: relative;
	}

	.icon-emoji.icon-hovered.icon-ripple::after {
		content: '';
		position: absolute;
		inset: -20px;
		border-radius: 50%;
		border: 2px solid rgba(20, 184, 166, 0.4);
		animation: rippleExpand 1s ease-out infinite;
		pointer-events: none;
	}

	@keyframes rippleExpand {
		0% {
			transform: scale(0.5);
			opacity: 1;
		}
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.flying-icon:hover .icon-emoji.icon-ripple {
		animation-play-state: paused !important;
	}

	/* Mode: NONE - Tidak ada interaktifitas, hanya tooltip */
	.icon-emoji.icon-hovered.icon-none {
		opacity: 1 !important;
		/* Tidak ubah apapun, hanya show tooltip */
	}

	.flying-icon:hover .icon-emoji.icon-none {
		animation-play-state: running !important;
		/* Flying animation tetap jalan */
	}

	/* Mode: SPIN - Rotate dengan scale, sangat playful */
	.icon-emoji.icon-hovered.icon-spin {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		animation: playfulSpin 0.8s ease-in-out infinite !important;
		transform-origin: center center !important;
	}

	@keyframes playfulSpin {
		0%,
		100% {
			transform: scale(1.2) rotate(0deg) translateZ(0);
		}
		25% {
			transform: scale(1.35) rotate(90deg) translateZ(0);
		}
		50% {
			transform: scale(1.4) rotate(180deg) translateZ(0);
		}
		75% {
			transform: scale(1.35) rotate(270deg) translateZ(0);
		}
	}

	.flying-icon:hover .icon-emoji.icon-spin {
		animation-play-state: running !important;
		animation: playfulSpin 0.8s ease-in-out infinite !important;
	}

	/* Mode: BOUNCE - Bounce smooth tanpa ubah posisi */
	.icon-emoji.icon-hovered.icon-bounce {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		animation: smoothBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite !important;
		transform-origin: center bottom !important;
	}

	@keyframes smoothBounce {
		0%,
		100% {
			transform: scale(1.2) translateY(0) translateZ(0);
		}
		50% {
			transform: scale(1.4) translateY(-15px) translateZ(0);
		}
	}

	.flying-icon:hover .icon-emoji.icon-bounce {
		animation-play-state: running !important;
		animation: smoothBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite !important;
	}

	/* Mode: ZOOM - Zoom in dengan shadow yang membesar */
	.icon-emoji.icon-hovered.icon-zoom {
		filter: blur(0px) drop-shadow(var(--icon-glow)) drop-shadow(0 8px 24px rgba(20, 184, 166, 0.5)) !important;
		opacity: 1 !important;
		transform: scale(1.5) translateZ(0) !important;
		transition:
			transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
			filter 0.3s ease-out !important;
	}

	.flying-icon:hover .icon-emoji.icon-zoom {
		animation-play-state: paused !important;
		filter: blur(0px) drop-shadow(var(--icon-glow)) drop-shadow(0 12px 32px rgba(20, 184, 166, 0.7)) !important;
	}

	/* Mode: FLOAT - Float up smooth tanpa ubah posisi utama */
	.icon-emoji.icon-hovered.icon-float {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		animation: gentleFloat 1.5s ease-in-out infinite !important;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: scale(1.25) translateY(0) translateZ(0);
		}
		50% {
			transform: scale(1.3) translateY(-12px) translateZ(0);
		}
	}

	.flying-icon:hover .icon-emoji.icon-float {
		animation-play-state: running !important;
		animation: gentleFloat 1.5s ease-in-out infinite !important;
	}

	/* Mode: SHAKE - Shake/wobble playful */
	.icon-emoji.icon-hovered.icon-shake {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		animation: playfulShake 0.5s ease-in-out infinite !important;
		transform-origin: center center !important;
	}

	@keyframes playfulShake {
		0%,
		100% {
			transform: scale(1.3) rotate(0deg) translateZ(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: scale(1.35) rotate(-5deg) translateZ(0);
		}
		20%,
		40%,
		60%,
		80% {
			transform: scale(1.35) rotate(5deg) translateZ(0);
		}
	}

	.flying-icon:hover .icon-emoji.icon-shake {
		animation-play-state: running !important;
		animation: playfulShake 0.5s ease-in-out infinite !important;
	}

	/* Mode: MAGNETIC - Attract ke cursor dengan scale */
	.icon-emoji.icon-hovered.icon-magnetic {
		filter: blur(0px) drop-shadow(var(--icon-glow)) !important;
		opacity: 1 !important;
		transform: scale(1.4) translateZ(0) !important;
		transition:
			transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			filter 0.3s ease-out !important;
	}

	.flying-icon:hover .icon-emoji.icon-magnetic {
		animation-play-state: paused !important;
		transform: scale(1.5) translateZ(0) !important;
		filter: blur(0px) drop-shadow(var(--icon-glow)) drop-shadow(0 0 25px rgba(20, 184, 166, 0.8)) !important;
	}

	/* Mode: GLOWPULSE - Pulse glow effect tanpa transform */
	.icon-emoji.icon-hovered.icon-glowPulse {
		opacity: 1 !important;
		transform: translateZ(0) !important;
		animation: glowPulseEffect 1.5s ease-in-out infinite !important;
	}

	@keyframes glowPulseEffect {
		0%,
		100% {
			filter: blur(0px) drop-shadow(var(--icon-glow)) drop-shadow(0 0 15px rgba(20, 184, 166, 0.5));
		}
		50% {
			filter: blur(0px) drop-shadow(var(--icon-glow)) drop-shadow(0 0 30px rgba(20, 184, 166, 0.9))
				drop-shadow(0 0 45px rgba(20, 184, 166, 0.6));
		}
	}

	.flying-icon:hover .icon-emoji.icon-glowPulse {
		animation-play-state: running !important;
		animation: glowPulseEffect 1.5s ease-in-out infinite !important;
		/* Flying animation tetap jalan, hanya glow yang pulse */
	}

	/* ============================================
	   FLYING ANIMATION MODES - Berbagai gaya gerakan
	   ============================================ */

	/* Mode: SMOOTH - Default, halus dan floating */
	@keyframes floatSmooth {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		25% {
			transform: translate3d(
					calc(8px * var(--intensity, 1)),
					calc(-24px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 8deg))
				scale(calc(1.04 + var(--icon-depth) * 0.04));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
		50% {
			transform: translate3d(
					calc(-12px * var(--intensity, 1)),
					calc(-36px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.4)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) - 10deg))
				scale(calc(1.08 + var(--icon-depth) * 0.06));
			opacity: calc(var(--icon-opacity) + 0.1);
		}
		75% {
			transform: translate3d(
					calc(10px * var(--intensity, 1)),
					calc(-18px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 6deg))
				scale(calc(1.02 + var(--icon-depth) * 0.03));
			opacity: calc(var(--icon-opacity) + 0.05);
		}
	}

	/* Mode: BOUNCY - Lebih bouncy dengan spring effect */
	@keyframes floatBouncy {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		20% {
			transform: translate3d(
					calc(12px * var(--intensity, 1)),
					calc(-30px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.3)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 12deg))
				scale(calc(1.12 + var(--icon-depth) * 0.08));
			opacity: calc(var(--icon-opacity) + 0.1);
		}
		40% {
			transform: translate3d(
					calc(-15px * var(--intensity, 1)),
					calc(-45px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.5)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) - 15deg))
				scale(calc(1.15 + var(--icon-depth) * 0.1));
			opacity: calc(var(--icon-opacity) + 0.12);
		}
		60% {
			transform: translate3d(
					calc(10px * var(--intensity, 1)),
					calc(-20px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 8deg))
				scale(calc(1.08 + var(--icon-depth) * 0.06));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
		80% {
			transform: translate3d(
					calc(-8px * var(--intensity, 1)),
					calc(-10px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.1)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) - 5deg))
				scale(calc(1.04 + var(--icon-depth) * 0.04));
			opacity: calc(var(--icon-opacity) + 0.05);
		}
	}

	/* Mode: DRIFT - Drift perlahan seperti awan */
	@keyframes floatDrift {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		33% {
			transform: translate3d(
					calc(15px * var(--intensity, 1)),
					calc(-15px * var(--intensity, 1) * (1 + var(--icon-depth) * 0.8)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 5deg))
				scale(calc(1.02 + var(--icon-depth) * 0.02));
			opacity: calc(var(--icon-opacity) + 0.05);
		}
		66% {
			transform: translate3d(
					calc(-18px * var(--intensity, 1)),
					calc(-20px * var(--intensity, 1) * (1 + var(--icon-depth) * 0.9)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) - 6deg))
				scale(calc(1.03 + var(--icon-depth) * 0.03));
			opacity: calc(var(--icon-opacity) + 0.06);
		}
	}

	/* Mode: ORBIT - Orbit melingkar */
	@keyframes floatOrbit {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		25% {
			transform: translate3d(
					calc(20px * var(--intensity, 1)),
					calc(-15px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 90deg))
				scale(calc(1.06 + var(--icon-depth) * 0.06));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
		50% {
			transform: translate3d(
					calc(10px * var(--intensity, 1)),
					calc(-35px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.4)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 180deg))
				scale(calc(1.1 + var(--icon-depth) * 0.08));
			opacity: calc(var(--icon-opacity) + 0.1);
		}
		75% {
			transform: translate3d(
					calc(-15px * var(--intensity, 1)),
					calc(-20px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 270deg))
				scale(calc(1.06 + var(--icon-depth) * 0.06));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
	}

	/* Mode: WAVE - Bergerak seperti gelombang */
	@keyframes floatWave {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		25% {
			transform: translate3d(
					calc(25px * var(--intensity, 1)),
					calc(-20px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 10deg))
				scale(calc(1.05 + var(--icon-depth) * 0.05));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
		50% {
			transform: translate3d(
					calc(0px * var(--intensity, 1)),
					calc(-40px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.4)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) - 5deg))
				scale(calc(1.1 + var(--icon-depth) * 0.08));
			opacity: calc(var(--icon-opacity) + 0.1);
		}
		75% {
			transform: translate3d(
					calc(-25px * var(--intensity, 1)),
					calc(-20px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) - 10deg))
				scale(calc(1.05 + var(--icon-depth) * 0.05));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
	}

	/* Mode: SWING - Seperti ayunan, maju mundur */
	@keyframes floatSwing {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		50% {
			transform: translate3d(
					calc(30px * var(--intensity, 1)),
					calc(-35px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.3)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 15deg))
				scale(calc(1.08 + var(--icon-depth) * 0.08));
			opacity: calc(var(--icon-opacity) + 0.1);
		}
	}

	/* Mode: TWIRL - Berputar sambil bergerak */
	@keyframes floatTwirl {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		16% {
			transform: translate3d(
					calc(10px * var(--intensity, 1)),
					calc(-20px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 60deg))
				scale(calc(1.05 + var(--icon-depth) * 0.05));
			opacity: calc(var(--icon-opacity) + 0.07);
		}
		33% {
			transform: translate3d(
					calc(-8px * var(--intensity, 1)),
					calc(-35px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.4)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 120deg))
				scale(calc(1.1 + var(--icon-depth) * 0.08));
			opacity: calc(var(--icon-opacity) + 0.1);
		}
		50% {
			transform: translate3d(
					calc(-12px * var(--intensity, 1)),
					calc(-30px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.3)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 180deg))
				scale(calc(1.08 + var(--icon-depth) * 0.06));
			opacity: calc(var(--icon-opacity) + 0.09);
		}
		66% {
			transform: translate3d(
					calc(8px * var(--intensity, 1)),
					calc(-25px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.2)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 240deg))
				scale(calc(1.06 + var(--icon-depth) * 0.05));
			opacity: calc(var(--icon-opacity) + 0.08);
		}
		83% {
			transform: translate3d(
					calc(5px * var(--intensity, 1)),
					calc(-15px * var(--intensity, 1) * (1 + var(--icon-depth) * 1.1)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 300deg))
				scale(calc(1.03 + var(--icon-depth) * 0.03));
			opacity: calc(var(--icon-opacity) + 0.06);
		}
	}

	/* Mode: GENTLE - Sangat halus, minimal movement */
	@keyframes floatGentle {
		0%,
		100% {
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			opacity: var(--icon-opacity);
		}
		50% {
			transform: translate3d(
					calc(8px * var(--intensity, 1)),
					calc(-12px * var(--intensity, 1) * (1 + var(--icon-depth) * 0.8)),
					0
				)
				rotate(calc(var(--initial-rotation, 0deg) + 3deg))
				scale(calc(1.01 + var(--icon-depth) * 0.01));
			opacity: calc(var(--icon-opacity) + 0.03);
		}
	}

	/* Entrance animation - muncul dengan playful bounce (dioptimalkan) */
	@keyframes fadeInPlayful {
		0% {
			opacity: 0;
			transform: translate3d(-10px, 20px, 0) rotate(-15deg) scale(0.3);
			filter: blur(8px);
		}
		50% {
			opacity: 0.7;
			transform: translate3d(5px, -5px, 0) rotate(5deg) scale(1.1);
			filter: blur(2px);
		}
		100% {
			opacity: var(--icon-opacity);
			transform: translate3d(0, 0, 0) rotate(var(--initial-rotation, 0deg)) scale(1);
			filter: blur(var(--icon-blur));
		}
	}

	/* Playful bounce animation untuk hover state */
	@keyframes bouncePlayful {
		0%,
		100% {
			transform: translateY(0) rotate(0deg) scale(1);
		}
		25% {
			transform: translateY(-10px) rotate(8deg) scale(1.08);
		}
		50% {
			transform: translateY(-15px) rotate(-8deg) scale(1.15);
		}
		75% {
			transform: translateY(-8px) rotate(4deg) scale(1.08);
		}
	}

	.icon-tooltip {
		font-size: 0.75em;
		animation: fadeInTooltip 0.3s ease-out forwards;
	}

	@keyframes fadeInTooltip {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(0);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(-4px);
		}
	}

	/* Enhanced hover states untuk near-text icons */
	.flying-icon[style*='--icon-depth: 0.7'],
	.flying-icon[style*='--icon-depth: 0.8'],
	.flying-icon[style*='--icon-depth: 0.9'] {
		cursor: pointer;
	}

	.flying-icon[style*='--icon-depth: 0.7']:hover,
	.flying-icon[style*='--icon-depth: 0.8']:hover,
	.flying-icon[style*='--icon-depth: 0.9']:hover {
		filter: brightness(1.1);
	}

	/* Reduce animation on reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.flying-icon {
			animation: none !important;
		}

		.icon-emoji.icon-hovered {
			transform: scale(1.2) rotate(5deg);
		}
	}

	/* Optimasi untuk GPU lemah - deteksi via media query atau fallback */
	/* Fallback: Simplifikasi blur untuk performa lebih baik */
	@supports not (backdrop-filter: blur(1px)) {
		.icon-emoji {
			filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15 * var(--icon-depth))) !important;
		}
	}

	/* Chrome Windows dengan GPU terintegrasi - force hardware acceleration */
	@media screen and (-webkit-min-device-pixel-ratio: 1) {
		.flying-icon {
			/* Pastikan hardware acceleration aktif - dengan fallback standard */
			transform: translateZ(0);
			-webkit-transform: translateZ(0);
			backface-visibility: hidden;
			-webkit-backface-visibility: hidden;
			perspective: 1000px;
			-webkit-perspective: 1000px;
		}

		.icon-emoji {
			transform: translateZ(0);
			-webkit-transform: translateZ(0);
			backface-visibility: hidden;
			-webkit-backface-visibility: hidden;
		}
	}

	/* Fallback untuk GPU lemah - reduce blur dan simplify animations */
	.flying-icons-container.gpu-fallback .icon-emoji {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1 * var(--icon-depth))) !important;
		/* Hapus blur yang mahal untuk GPU */
	}

	/* Pastikan transform menggunakan GPU layer */
	.flying-icons-container.gpu-fallback .flying-icon,
	.flying-icons-container.gpu-fallback .icon-emoji {
		transform: translateZ(0) !important;
		-webkit-transform: translateZ(0) !important;
	}
</style>
