<script lang="ts">
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { trackEvent } from '$lib/utils/analytics';

	interface Props {
		items: Array<{ icon: string; title: string; description: string }>;
		/** Durasi animasi rotasi (ms) */
		duration?: number;
		children: (props: { item: (typeof items)[0] }) => any;
	}

	let { items, duration = 400, children }: Props = $props();

	let currentIndex = $state(0);
	let isDragging = $state(false);
	let isAnimating = $state(true);
	let swipingCardIndex = $state<number | null>(null); // Track index card yang sedang di-swipe keluar
	let containerElement = $state<HTMLElement | null>(null);
	let announcementText = $state(''); // Untuk screen reader announcements
	let showKeyboardHint = $state(true); // State untuk keyboard hint visibility
	let keyboardHintTimer: ReturnType<typeof setTimeout> | null = null;
	let lastTrackedCardTitle = '';

	// Computed values untuk edge cases
	const totalCards = $derived(items.length);
	const canSwipe = $derived(totalCards > 1);
	const currentCardNumber = $derived(currentIndex + 1);
	const progressText = $derived(`Card ${currentCardNumber} of ${totalCards}`);
	const activeCardId = $derived(canSwipe ? `card-stack-card-${currentIndex}` : undefined);

	// Drag position
	let dragPosition = $state({ x: 0, y: 0 });
	let startPosition = $state({ x: 0, y: 0 });

	// Reset state saat items berubah (misalnya saat domain berubah)
	// Track items reference secara manual untuk avoid reactive loop
	let previousItemsRef: typeof items | undefined = undefined;

	// Function untuk reset state (dipanggil saat items berubah)
	function resetStackState() {
		if (!isDragging && swipingCardIndex === null) {
			currentIndex = 0;
			isAnimating = true;
			dragPosition = { x: 0, y: 0 };
			startPosition = { x: 0, y: 0 };

			// Remove semua event listeners yang mungkin masih aktif
			if (browser) {
				window.removeEventListener('mousemove', handleDragMove);
				window.removeEventListener('mouseup', handleDragEnd);
				window.removeEventListener('touchmove', handleDragMove);
				window.removeEventListener('touchend', handleDragEnd);
			}
		}
	}

	// Track items dengan $effect, tapi hanya reset saat reference benar-benar berubah
	$effect(() => {
		// Initialize pada mount pertama
		if (previousItemsRef === undefined) {
			previousItemsRef = items;
			// Show hint saat pertama kali mount dan auto-hide setelah 4 detik
			if (browser && canSwipe) {
				showKeyboardHint = true;
				hideKeyboardHint();
			}
			return;
		}

		// Hanya reset jika items reference benar-benar berubah
		if (items !== previousItemsRef) {
			resetStackState();
			previousItemsRef = items;
			// Reset hint visibility saat items berubah
			showKeyboardHint = true;
			if (browser && canSwipe) {
				hideKeyboardHint();
			}
		}

		// Cleanup function untuk timer
		return () => {
			if (keyboardHintTimer) {
				clearTimeout(keyboardHintTimer);
				keyboardHintTimer = null;
			}
		};
	});

	// Threshold untuk detect swipe direction
	const SWIPE_THRESHOLD_X = 100; // Minimum distance untuk swipe horizontal
	const SWIPE_THRESHOLD_Y = 150; // Minimum distance untuk swipe vertical
	const OUT_OF_SIGHT_X = 500; // Koordinat X untuk card yang di-swipe
	const OUT_OF_SIGHT_Y = 800; // Koordinat Y untuk card yang di-swipe

	// Get card position
	function getCardPosition(index: number): string {
		// Edge case: pastikan index valid
		if (!items || items.length === 0 || index < 0 || index >= items.length) {
			return 'hidden';
		}

		const total = items.length;

		// Edge case: jika hanya 1 card, hanya render front
		if (total === 1) {
			return index === 0 ? 'front' : 'hidden';
		}

		// Pastikan currentIndex valid
		const safeCurrentIndex = currentIndex >= total ? 0 : currentIndex;

		// Untuk stack card yang swipeable:
		// - Front = card yang sedang di depan (currentIndex)
		// - Back = card berikutnya yang akan naik setelah swipe (currentIndex + 1)
		// - Behind = card setelah back yang akan naik setelah 2 swipe (currentIndex + 2)
		const front = safeCurrentIndex;
		const back = (safeCurrentIndex + 1) % total;

		// Edge case: jika hanya 2 cards, tidak perlu behind position
		const behind = total >= 3 ? (safeCurrentIndex + 2) % total : -1;

		// Jika card sedang di-swipe, tetap render sebagai 'front' selama animasi
		// Setelah animasi selesai dan currentIndex berubah, card akan menjadi hidden
		if (swipingCardIndex !== null && index === swipingCardIndex) {
			// Jika currentIndex sudah berubah, card sudah di-belakang, jadi hide
			if (index !== front) {
				return 'hidden';
			}
			// Jika masih front (belum update index), render sebagai front untuk animasi
			return 'front';
		}

		if (index === front) return 'front';
		if (index === back) return 'back';
		if (behind !== -1 && index === behind) return 'behind';
		return 'hidden';
	}

	// Get transform string untuk card yang sedang di-drag atau di-swipe
	function getCardTransform(position: string, index: number): string {
		// Apply transform jika:
		// 1. Card sedang di-drag (isDragging dan index === currentIndex)
		// 2. Card sedang di-swipe (swipingCardIndex === index)
		if (position === 'front') {
			if (isDragging && index === currentIndex) {
				// Saat dragging - ikuti cursor dengan rotasi
				return `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) rotate(${dragPosition.x * 0.1}deg)`;
			} else if (swipingCardIndex === index) {
				// Saat swiping - gunakan posisi final untuk animasi keluar
				return `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) rotate(${dragPosition.x * 0.1}deg)`;
			}
		}
		return '';
	}

	// Handle drag start
	function handleDragStart(event: MouseEvent | TouchEvent) {
		if (!browser || !canSwipe) return; // Edge case: disable jika hanya 1 card
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

		const frontCardIndex = currentIndex;
		const position = getCardPosition(frontCardIndex);
		if (position !== 'front') return;

		isDragging = true;
		isAnimating = false;
		startPosition = { x: clientX, y: clientY };
		dragPosition = { x: 0, y: 0 };

		// Prevent default untuk touch events
		if ('touches' in event) {
			event.preventDefault();
		}

		// Pasang event listeners langsung untuk memastikan responsive
		if ('touches' in event) {
			// Touch events
			window.addEventListener('touchmove', handleDragMove, { passive: false });
			window.addEventListener('touchend', handleDragEnd);
		} else {
			// Mouse events
			window.addEventListener('mousemove', handleDragMove);
			window.addEventListener('mouseup', handleDragEnd);
		}
	}

	// Handle drag move
	function handleDragMove(event: MouseEvent | TouchEvent) {
		if (!isDragging || !browser) return;

		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

		dragPosition = {
			x: clientX - startPosition.x,
			y: clientY - startPosition.y
		};

		if ('touches' in event) {
			event.preventDefault();
		}
	}

	// Handle drag end
	function handleDragEnd(event?: MouseEvent | TouchEvent) {
		if (!isDragging || !browser) return;

		// Remove event listeners
		window.removeEventListener('mousemove', handleDragMove);
		window.removeEventListener('mouseup', handleDragEnd);
		window.removeEventListener('touchmove', handleDragMove);
		window.removeEventListener('touchend', handleDragEnd);

		const { x, y } = dragPosition;
		isDragging = false;

		// Check swipe direction dan threshold
		if (Math.abs(x) > SWIPE_THRESHOLD_X) {
			// Swipe horizontal (left or right)
			if (x > 0) {
				swipeCard('right'); // Accept
			} else {
				swipeCard('left'); // Reject
			}
		} else if (y > SWIPE_THRESHOLD_Y) {
			// Swipe down
			swipeCard('down'); // Skip
		} else {
			// Reset position jika tidak mencapai threshold
			isAnimating = true;
			resetCardPosition();
		}
	}

	// Swipe card berdasarkan direction
	function swipeCard(direction: 'left' | 'right' | 'down') {
		// Track card yang sedang di-swipe SEBELUM update position
		const cardIndexToSwipe = currentIndex;
		swipingCardIndex = cardIndexToSwipe;

		// Set final position untuk animasi keluar
		switch (direction) {
			case 'right':
				// Accept - swipe ke kanan
				dragPosition = { x: OUT_OF_SIGHT_X, y: 0 };
				break;
			case 'left':
				// Reject - swipe ke kiri
				dragPosition = { x: -OUT_OF_SIGHT_X, y: 0 };
				break;
			case 'down':
				// Skip - swipe ke bawah
				dragPosition = { x: 0, y: OUT_OF_SIGHT_Y };
				break;
		}

		// Rotate stack setelah animasi keluar selesai
		// Timing: tunggu animasi selesai sebelum update index
		setTimeout(() => {
			// Update index untuk menampilkan card berikutnya
			currentIndex = (currentIndex + 1) % items.length;

			// Screen reader announcement
			announcementText = progressText;

			// Reset states setelah card baru muncul
			resetCardPosition();
			// Clear swiping state setelah card benar-benar hilang dan index sudah berubah
			setTimeout(() => {
				swipingCardIndex = null;
				// Clear announcement setelah beberapa saat
				setTimeout(() => {
					announcementText = '';
				}, 1000);
			}, 200); // Delay lebih lama untuk pastikan card benar-benar hidden
		}, duration + 100); // Tambah delay untuk pastikan animasi selesai
	}

	// Reset card position
	function resetCardPosition() {
		dragPosition = { x: 0, y: 0 };
		isAnimating = true;
	}

	// Handle click - disabled, card hanya bisa di-rotate via swipe
	// Click handler dihapus karena user hanya ingin rotate via swipe
	function handleClick(event: MouseEvent) {
		// Prevent default behavior dan tidak melakukan apapun
		// Card hanya bisa di-rotate melalui swipe gesture
		event.preventDefault();
		event.stopPropagation();
	}

	// Hide keyboard hint setelah beberapa detik
	function hideKeyboardHint() {
		if (keyboardHintTimer) {
			clearTimeout(keyboardHintTimer);
		}
		keyboardHintTimer = setTimeout(() => {
			showKeyboardHint = false;
		}, 4000); // Auto-hide setelah 4 detik
	}

	// Show keyboard hint saat focus
	function showKeyboardHintOnFocus() {
		showKeyboardHint = true;
		hideKeyboardHint(); // Auto-hide setelah 4 detik
	}

	// Keyboard navigation untuk accessibility
	function handleKeydown(event: KeyboardEvent) {
		if (!canSwipe || isDragging || swipingCardIndex !== null) return;

		// Hide hint saat user mulai menggunakan keyboard
		showKeyboardHint = false;
		if (keyboardHintTimer) {
			clearTimeout(keyboardHintTimer);
		}

		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
			case ' ':
			case 'Enter':
				event.preventDefault();
				currentIndex = (currentIndex + 1) % items.length;
				announcementText = progressText;
				setTimeout(() => {
					announcementText = '';
				}, 1000);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault();
				currentIndex = (currentIndex - 1 + items.length) % items.length;
				announcementText = progressText;
				setTimeout(() => {
					announcementText = '';
				}, 1000);
				break;
			case 'Home':
				event.preventDefault();
				currentIndex = 0;
				announcementText = progressText;
				setTimeout(() => {
					announcementText = '';
				}, 1000);
				break;
			case 'End':
				event.preventDefault();
				currentIndex = items.length - 1;
				announcementText = progressText;
				setTimeout(() => {
					announcementText = '';
				}, 1000);
				break;
		}
	}

	// Event listeners sekarang dipasang langsung di handleDragStart
	// untuk memastikan responsive saat drag dimulai

	$effect(() => {
		const activeItem = items[currentIndex];
		if (!activeItem || activeItem.title === lastTrackedCardTitle) return;
		lastTrackedCardTitle = activeItem.title;
		trackEvent({
			type: 'section_view',
			category: 'engagement',
			action: 'benefit_card_view',
			label: activeItem.title,
			card_title: activeItem.title,
			domain: 'learning.konxc.space', // Assuming domain is passed as a prop or derived
			current_index: currentIndex + 1
		});
	});
</script>

<!-- Edge case: Empty state -->
{#if totalCards === 0}
	<div class="card-stack-empty" role="status" aria-live="polite">
		<p>Tidak ada kartu tersedia</p>
	</div>
{:else}
	<div
		class="card-stack-container"
		class:can-swipe={canSwipe}
		role="listbox"
		aria-label="Card stack"
		aria-live="polite"
		aria-activedescendant={activeCardId}
		bind:this={containerElement}
		onkeydown={handleKeydown}
		onfocus={showKeyboardHintOnFocus}
		onclick={() => {
			// Reset countdown timer saat user klik lagi
			if (canSwipe) {
				showKeyboardHintOnFocus();
			}
		}}
		onblur={() => {
			showKeyboardHint = false;
			if (keyboardHintTimer) {
				clearTimeout(keyboardHintTimer);
			}
		}}
		tabindex="0"
	>
		<!-- Progress indicator -->
		{#if canSwipe}
			<div class="card-stack-progress" aria-label={progressText}>
				<span class="card-stack-progress-text">{progressText}</span>
			</div>
		{/if}

		<!-- Screen reader announcement -->
		{#if announcementText}
			<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
				{announcementText}
			</div>
		{/if}

		<div class="card-stack">
			{#each items as item, index (item)}
				{@const position = getCardPosition(index)}
				{@const transform = getCardTransform(position, index)}
				{@const isCurrentlySwiping = swipingCardIndex === index}
				{@const cardId = `card-stack-card-${index}`}
				{#if position !== 'hidden'}
					<div
						id={cardId}
						class="stack-card stack-card-{position}"
						class:dragging={isDragging &&
							position === 'front' &&
							index === currentIndex &&
							!isCurrentlySwiping}
						class:animating={isAnimating &&
							position === 'front' &&
							index === currentIndex &&
							!isCurrentlySwiping}
						class:swiping={isCurrentlySwiping}
						class:can-swipe={canSwipe}
						style={transform ? `transform: ${transform}` : undefined}
						role="option"
						aria-selected={index === currentIndex}
						aria-setsize={totalCards}
						aria-posinset={index + 1}
						tabindex={index === currentIndex ? 0 : -1}
						onmousedown={isCurrentlySwiping || !canSwipe ? undefined : handleDragStart}
						ontouchstart={isCurrentlySwiping || !canSwipe ? undefined : handleDragStart}
						in:fly={{
							y: position === 'front' ? 0 : position === 'back' ? 20 : 40,
							opacity: 0,
							duration: duration,
							easing: (t) => t * (2 - t)
						}}
					>
						{@render children({ item })}
					</div>
				{/if}
			{/each}
		</div>

		<!-- Keyboard hint untuk accessibility -->
		{#if canSwipe && browser}
			<div class="card-stack-keyboard-hint" class:show={showKeyboardHint} aria-hidden="true">
				Gunakan tombol panah atau swipe untuk navigasi
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	@reference "../../app.css";

	/* ============================================
	   CONTAINER
	   ============================================ */
	.card-stack-container {
		@apply relative mx-auto;
		width: 100%;
		max-width: 400px;
		height: 500px;
		cursor: grab;
		perspective: 1000px;
		touch-action: none; /* Prevent default touch behaviors */
		outline: none; /* Remove default outline, kita akan buat custom */
	}

	.card-stack-container:focus-visible {
		outline: 2px solid var(--color-primary-soft-blue, #667eea);
		outline-offset: 4px;
		border-radius: 0.5rem;
	}

	.card-stack-container:active {
		cursor: grabbing;
	}

	.card-stack-container:not(.can-swipe) {
		cursor: default;
	}

	/* ============================================
	   EMPTY STATE
	   ============================================ */
	.card-stack-empty {
		@apply flex h-full items-center justify-center text-center;
		min-height: 300px;
	}

	.card-stack-empty p {
		@apply text-lg;
		color: var(--color-primary-medium, #4a5568);
	}

	/* ============================================
	   PROGRESS INDICATOR
	   ============================================ */
	.card-stack-progress {
		@apply absolute -top-3 right-0 z-20;
		@apply rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm;
	}

	.card-stack-progress-text {
		@apply text-sm font-medium text-white;
	}

	/* ============================================
	   KEYBOARD HINT
	   ============================================ */
	.card-stack-keyboard-hint {
		@apply absolute right-0 -bottom-10 z-20;
		@apply rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm;
		@apply text-xs text-white/80;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.card-stack-keyboard-hint.show {
		opacity: 1;
	}

	.card-stack-container:focus-within .card-stack-keyboard-hint.show {
		opacity: 1;
	}

	/* ============================================
	   SCREEN READER ONLY
	   ============================================ */
	.sr-only {
		@apply absolute h-px w-px overflow-hidden whitespace-nowrap;
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
	}

	.card-stack {
		@apply relative h-full w-full;
	}

	.stack-card {
		@apply absolute inset-0 h-full w-full;
		transform-origin: center center;
		user-select: none; /* Prevent text selection saat drag */
		-webkit-user-select: none;
	}

	/* Base transform untuk cards */
	.stack-card-front {
		z-index: 10;
		transform: translateY(0) scale(1);
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		filter: drop-shadow(0 10px 28px rgba(102, 126, 234, 0.22));
	}

	.stack-card-front.dragging {
		transition: none !important; /* Disable transition saat dragging */
		cursor: grabbing;
		z-index: 11; /* Di atas saat dragging */
		will-change: transform; /* Optimize untuk smooth dragging */
		/* Visual feedback: subtle glow saat dragging */
		filter: drop-shadow(0 4px 20px rgba(102, 126, 234, 0.3));
	}

	/* Visual feedback berdasarkan drag direction */
	.stack-card-front.dragging[style*='translate3d(1'] {
		/* Drag ke kanan - green glow */
		filter: drop-shadow(0 4px 20px rgba(34, 197, 94, 0.3));
	}

	.stack-card-front.dragging[style*='translate3d(-'] {
		/* Drag ke kiri - red glow */
		filter: drop-shadow(0 4px 20px rgba(239, 68, 68, 0.3));
	}

	.stack-card-front:not(.can-swipe) {
		cursor: default;
	}

	.stack-card-front.swiping {
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.4s ease;
		opacity: 0.8; /* Sedikit fade saat swiping */
		z-index: 11; /* Di atas saat swiping */
		pointer-events: none; /* Tidak bisa di-interact saat swiping */
	}

	.stack-card-front.animating {
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	/* Smooth transition untuk cards yang bergeser posisi */
	.stack-card-back {
		z-index: 9;
		transform: translateY(20px) scale(0.95);
		pointer-events: none;
		opacity: 0.9;
		filter: drop-shadow(0 6px 24px rgba(102, 126, 234, 0.16));
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.4s ease,
			filter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.stack-card-behind {
		z-index: 8;
		transform: translateY(40px) scale(0.9);
		pointer-events: none;
		opacity: 0.6;
		filter: drop-shadow(0 4px 18px rgba(102, 126, 234, 0.12));
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.4s ease,
			filter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.stack-card {
			transition: none;
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.card-stack-container {
			height: 450px;
		}
	}
</style>
