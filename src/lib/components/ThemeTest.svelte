<script lang="ts">
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { onMount } from 'svelte';
	import { getStoredTheme, type Theme } from '$lib/stores/theme';

	let currentTheme = $state<Theme>('system');
	let hasDarkClass = $state(false);
	let documentClasses = $state<string>('(empty)');

	onMount(() => {
		updateThemeInfo();
		// Listen for theme changes
		const observer = new MutationObserver(() => {
			updateThemeInfo();
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	});

	function updateThemeInfo() {
		if (typeof document !== 'undefined') {
			currentTheme = getStoredTheme();
			hasDarkClass = document.documentElement.classList.contains('dark');
			documentClasses = document.documentElement.className || '(empty)';
		}
	}
</script>

<div
	class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
>
	<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-4`}>🧪 Theme Test Component</h2>

	<!-- Status Info -->
	<div class={`${COLOR.neutral} ${RADIUS.small} ${SPACING.input} mb-4`}>
		<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
			<div>
				<span class={`${TEXT.button} ${COLOR.textSecondary}`}>Stored Theme:</span>
				<span class={`${TEXT.button} ${COLOR.textPrimary} ml-2 font-semibold`}>{currentTheme}</span>
			</div>
			<div>
				<span class={`${TEXT.button} ${COLOR.textSecondary}`}>Dark Class:</span>
				<span
					class={`${TEXT.button} ml-2 font-semibold ${hasDarkClass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
				>
					{hasDarkClass ? '✅ Present' : '❌ Missing'}
				</span>
			</div>
		</div>
	</div>

	<!-- Tailwind Direct Test -->
	<div class="mb-6">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>🎨 Tailwind Direct Classes Test</h3>
		<div
			class={`${COLOR.cardBorder} ${RADIUS.card} ${SPACING.cardPadding} ${ELEVATION.base} space-y-3`}
		>
			<!-- Test 1: Blue (light) / Orange (dark) -->
			<div class="rounded-lg bg-blue-500 p-4 font-semibold text-white dark:bg-orange-500">
				✅ bg-blue-500 dark:bg-orange-500 - Light biru, Dark orange
			</div>
			<!-- Test 2: Blue (light) / Orange (dark) dengan !important -->
			<div class="rounded-lg bg-blue-500! p-4 font-semibold text-white dark:bg-orange-500!">
				✅ bg-blue-500! dark:bg-orange-500! - Dengan important modifier
			</div>
			<button
				type="button"
				class="inline-block rounded-lg bg-blue-600! px-4 py-2 text-white transition-colors hover:bg-blue-700! dark:bg-orange-600! dark:hover:bg-orange-700!"
			>
				✅ Button - Blue (light) / Orange (dark) dengan hover
			</button>
			<button
				class="rounded-lg bg-blue-500! px-4 py-2 text-white transition-colors hover:bg-blue-600! dark:bg-orange-500! dark:hover:bg-orange-600!"
			>
				✅ Button - Blue (light) / Orange (dark) dengan hover
			</button>
		</div>
	</div>

	<!-- Color Swatches -->
	<div class="mb-6">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Color Swatches</h3>
		<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
			<!-- Background Colors -->
			<div class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.small} p-4`}>
				<div class={`${TEXT.small} ${COLOR.textSecondary} mb-2`}>Card Background</div>
				<div class={`${RADIUS.small} h-16 ${COLOR.card} border-2 ${COLOR.cardBorder}`}></div>
			</div>
			<div class={`${COLOR.neutral} ${COLOR.cardBorder} ${RADIUS.small} p-4`}>
				<div class={`${TEXT.small} ${COLOR.textSecondary} mb-2`}>Neutral Background</div>
				<div class={`${RADIUS.small} h-16 ${COLOR.neutral} border-2 ${COLOR.cardBorder}`}></div>
			</div>
			<div class={`${COLOR.success} ${RADIUS.small} p-4`}>
				<div class={`${TEXT.small} mb-2`}>Success</div>
				<div class={`${RADIUS.small} h-16 ${COLOR.success}`}></div>
			</div>
			<div class={`${COLOR.error} ${RADIUS.small} p-4`}>
				<div class={`${TEXT.small} mb-2`}>Error</div>
				<div class={`${RADIUS.small} h-16 ${COLOR.error}`}></div>
			</div>
		</div>
	</div>

	<!-- Text Colors -->
	<div class="mb-6">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Text Colors</h3>
		<div
			class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.small} ${SPACING.cardPadding} space-y-2`}
		>
			<div class={COLOR.textPrimary}>
				<span class="font-semibold">Primary Text:</span> The quick brown fox jumps over the lazy dog
			</div>
			<div class={COLOR.textSecondary}>
				<span class="font-semibold">Secondary Text:</span> The quick brown fox jumps over the lazy dog
			</div>
			<div class={COLOR.textMuted}>
				<span class="font-semibold">Muted Text:</span> The quick brown fox jumps over the lazy dog
			</div>
			<div class={COLOR.accent}>
				<span class="font-semibold">Accent Text:</span> The quick brown fox jumps over the lazy dog
			</div>
		</div>
	</div>

	<!-- Buttons -->
	<div class="mb-6">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Buttons</h3>
		<div class="flex flex-wrap gap-3">
			<button
				class={`${RADIUS.button} ${SPACING.button} ${COLOR.accentBg} font-medium text-white ${TRANSITION.colors} hover:opacity-90`}
			>
				Primary Button
			</button>
			<button
				class={`${RADIUS.button} ${SPACING.button} ${COLOR.cardBorder} ${COLOR.card} ${COLOR.textPrimary} font-medium ${TRANSITION.colors} ${COLOR.neutralHover}`}
			>
				Secondary Button
			</button>
			<button
				class={`${RADIUS.button} ${SPACING.button} ${COLOR.successBg} font-medium text-white ${TRANSITION.colors} hover:opacity-90`}
			>
				Success Button
			</button>
		</div>
	</div>

	<!-- Cards -->
	<div class="mb-6">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Cards</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div
				class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
			>
				<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-2`}>Card 1</h4>
				<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
					This is a card with elevation and border. It should adapt to theme changes.
				</p>
			</div>
			<div
				class={`${COLOR.card} ${COLOR.cardBorder} ${RADIUS.card} ${SPACING.cardPadding} ${ELEVATION.hover} ${TRANSITION.shadow} cursor-pointer`}
			>
				<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-2`}>Card 2</h4>
				<p class={`${TEXT.body} ${COLOR.textSecondary}`}>
					Hover over this card to see elevation change.
				</p>
			</div>
			<div class={`${COLOR.accentBg} ${RADIUS.card} ${SPACING.cardPadding} ${ELEVATION.card}`}>
				<h4 class={`${TEXT.h4} mb-2 text-white`}>Card 3</h4>
				<p class={`${TEXT.body} text-white/90`}>This card uses accent background color.</p>
			</div>
		</div>
	</div>

	<!-- Borders -->
	<div class="mb-6">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-3`}>Borders</h3>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class={`${COLOR.cardBorder} ${COLOR.card} ${RADIUS.small} ${SPACING.input} border-2`}>
				<div class={COLOR.textPrimary}>Card Border Example</div>
			</div>
			<div
				class={`border-2 border-gray-300 dark:border-neutral-600 ${COLOR.card} ${RADIUS.small} ${SPACING.input}`}
			>
				<div class={COLOR.textPrimary}>Direct Dark Mode Border</div>
			</div>
		</div>
	</div>

	<!-- Real-time HTML Class Monitor -->
	<div class={`${COLOR.neutral} ${RADIUS.small} ${SPACING.input}`}>
		<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-2`}>HTML Element Classes</h4>
		<code class={`${TEXT.small} ${COLOR.textMuted} font-mono break-all`}>
			document.documentElement.className = "{documentClasses}"
		</code>
	</div>
</div>
