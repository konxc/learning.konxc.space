<script lang="ts">
	import { fly, slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let menuOpen = $state(false);
	let scrolled = $state(false);
	let isInHero = $state(true);

	// Drag state for swipe to close
	let isDragging = $state(false);
	let dragStartY = 0;
	let currentDragY = 0;
	let menuElement = $state<HTMLDivElement | null>(null);

	// Navigation items
	const navItems = [
		{ href: '#about', label: 'Tentang', ariaLabel: 'Tentang Naik Kelas' },
		{ href: '#program', label: 'Program', ariaLabel: 'Program Pelatihan' },
		{ href: '#benefits', label: 'Benefits', ariaLabel: 'Manfaat Program' },
		{ href: '/marketplace', label: 'Marketplace', ariaLabel: 'Browse Courses' },
		{ href: '#register', label: 'Daftar', ariaLabel: 'Daftar Sekarang' }
	];

	// Toggle menu
	function toggleMenu() {
		menuOpen = !menuOpen;
		// Prevent body scroll when menu is open
		if (menuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	// Close menu when clicking on link
	function closeMenu() {
		if (menuOpen) {
			menuOpen = false;
			document.body.style.overflow = '';
		}
	}

	// Handle drag start
	function handleDragStart(e: TouchEvent | MouseEvent) {
		if (!menuOpen) return;
		isDragging = true;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		dragStartY = clientY;
		document.body.style.overflow = 'hidden';
	}

	// Handle drag move
	function handleDragMove(e: TouchEvent | MouseEvent) {
		if (!isDragging || !menuOpen) return;

		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		const deltaY = clientY - dragStartY;

		// Only allow downward dragging
		if (deltaY > 0) {
			currentDragY = deltaY;
			if (menuElement) {
				menuElement.style.transform = `translateY(${deltaY}px)`;
			}
		}
	}

	// Handle drag end
	function handleDragEnd() {
		if (!isDragging) return;

		// If dragged down more than 100px, close menu
		if (currentDragY > 100) {
			closeMenu();
		} else {
			// Reset transform
			if (menuElement) {
				menuElement.style.transform = '';
			}
		}

		isDragging = false;
		dragStartY = 0;
		currentDragY = 0;
	}

	// Handle scroll for sticky header and detect hero section
	function handleScroll() {
		const heroSection = document.querySelector('#hero');
		if (heroSection) {
			const heroRect = heroSection.getBoundingClientRect();
			const heroBottom = heroRect.bottom;
			const heroHeight = heroRect.height;

			// Show header when 10% of hero remains (90% scrolled)
			// Threshold: bottom of hero should be at 10% of viewport height
			const threshold = heroHeight * 0.7;

			// isInHero = true if we haven't scrolled past 90% of hero
			isInHero = heroBottom > heroHeight * 0.9;
		}
		scrolled = window.scrollY > 50;
	}

	// Listen to scroll events
	$effect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Listen to global drag events when menu is open
	$effect(() => {
		if (!menuOpen || !isDragging) return;

		const handleGlobalMouseMove = (e: MouseEvent) => handleDragMove(e);
		const handleGlobalMouseUp = () => handleDragEnd();
		const handleGlobalTouchMove = (e: TouchEvent) => handleDragMove(e);
		const handleGlobalTouchEnd = () => handleDragEnd();

		window.addEventListener('mousemove', handleGlobalMouseMove);
		window.addEventListener('mouseup', handleGlobalMouseUp);
		window.addEventListener('touchmove', handleGlobalTouchMove);
		window.addEventListener('touchend', handleGlobalTouchEnd);

		return () => {
			window.removeEventListener('mousemove', handleGlobalMouseMove);
			window.removeEventListener('mouseup', handleGlobalMouseUp);
			window.removeEventListener('touchmove', handleGlobalTouchMove);
			window.removeEventListener('touchend', handleGlobalTouchEnd);
		};
	});
</script>

{#if !isInHero || scrolled}
	<header
		class="header"
		class:scrolled
		in:fly={{ y: -100, duration: 500, easing: cubicOut }}
		out:fly={{ y: -100, duration: 400, easing: cubicOut }}
	>
		<div class="header-container">
			<!-- Logo -->
			<div class="logo">
				<a href="/" aria-label="Home">Naik Kelas</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="desktop-nav" aria-label="Main navigation">
				<ul>
					{#each navItems as item}
						<li>
							<a
								href={item.href}
								aria-label={item.ariaLabel}
								onclick={() => closeMenu()}
								data-scroll="smooth"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Mobile Hamburger Button / Close Button -->
			{#if !menuOpen}
				<button
					class="hamburger"
					aria-label="Toggle menu"
					aria-expanded={menuOpen}
					onclick={toggleMenu}
					type="button"
				>
					<span class="hamburger-line"></span>
					<span class="hamburger-line"></span>
					<span class="hamburger-line"></span>
				</button>
			{:else}
				<button
					class="hamburger hamburger--close"
					aria-label="Close menu"
					aria-expanded={menuOpen}
					onclick={closeMenu}
					type="button"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M18 6L6 18M6 6l12 12"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</header>
{/if}

<!-- Mobile Menu Overlay (Outside header, fixed to viewport) -->
{#if menuOpen}
	<!-- Backdrop -->
	<div
		class="menu-backdrop"
		onclick={closeMenu}
		onkeydown={(e) => e.key === 'Escape' && closeMenu()}
		role="button"
		tabindex="-1"
		aria-label="Close menu"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	></div>

	<!-- Bottom Sheet Menu -->
	<div
		class="mobile-menu"
		class:dragging={isDragging}
		bind:this={menuElement}
		in:fly={{ y: 100, duration: 300, easing: cubicOut }}
		out:fly={{ y: 100, duration: 250, easing: cubicOut }}
	>
		<!-- Drag Handle Bar -->
		<div
			class="drag-handle"
			onmousedown={handleDragStart}
			ontouchstart={handleDragStart}
			role="button"
			tabindex="0"
			aria-label="Swipe down to close menu"
		></div>

		<!-- Scrollable Content -->
		<div class="menu-content">
			<!-- CTA Button (Daftar) -->
			{#each navItems.filter((item) => item.label === 'Daftar') as item}
				<a
					href={item.href}
					aria-label={item.ariaLabel}
					onclick={() => closeMenu()}
					data-scroll="smooth"
					class="menu-cta-btn"
				>
					{item.label}
				</a>
			{/each}

			<!-- Navigation Links (Other items) -->
			<nav class="mobile-nav" aria-label="Mobile navigation">
				<ul>
					{#each navItems.filter((item) => item.label !== 'Daftar') as item}
						<li>
							<a
								href={item.href}
								aria-label={item.ariaLabel}
								onclick={() => closeMenu()}
								data-scroll="smooth"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
{/if}

<style>
	@reference '../../app.css';
	.header {
		position: fixed;
		top: 10px;
		left: 10px;
		right: 10px;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(40px) saturate(200%);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 24px;
		box-shadow:
			0 8px 32px rgba(31, 38, 135, 0.15),
			0 2px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 1px rgba(255, 255, 255, 0.9),
			inset 0 -1px 1px rgba(255, 255, 255, 0.6);
		z-index: 1000;
		transition:
			transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.3s ease,
			background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			visibility 0s linear;
		transform: translateY(0);
		opacity: 1;
		visibility: visible;
		animation: subtle-glow 3s ease-in-out infinite alternate;
	}

	@keyframes subtle-glow {
		0% {
			box-shadow:
				0 8px 32px rgba(31, 38, 135, 0.15),
				0 2px 8px rgba(0, 0, 0, 0.08),
				inset 0 1px 1px rgba(255, 255, 255, 0.9),
				inset 0 -1px 1px rgba(255, 255, 255, 0.6);
		}
		100% {
			box-shadow:
				0 8px 32px rgba(102, 126, 234, 0.2),
				0 2px 8px rgba(0, 0, 0, 0.08),
				inset 0 1px 1px rgba(255, 255, 255, 0.95),
				inset 0 -1px 1px rgba(255, 255, 255, 0.7);
			border-color: rgba(102, 126, 234, 0.25);
		}
	}

	.header.scrolled {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(50px) saturate(200%);
		box-shadow:
			0 20px 60px rgba(31, 38, 135, 0.2),
			0 4px 16px rgba(0, 0, 0, 0.1),
			inset 0 2px 2px rgba(255, 255, 255, 0.95),
			inset 0 -2px 2px rgba(255, 255, 255, 0.75);
		border-color: rgba(102, 126, 234, 0.3);
		animation: none; /* Stop glow animation when scrolled */
	}

	.header-container {
		margin: 0 auto;
		padding: 10px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}

	.logo a {
		font-size: 1.3em;
		font-weight: 700;
		color: var(--color-primary-dark);
		text-decoration: none;
		transition: all 0.3s ease;
		letter-spacing: -0.5px;
		white-space: nowrap;
		background: linear-gradient(
			135deg,
			var(--color-primary-dark) 0%,
			var(--color-primary-soft-blue) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.logo a:hover {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Desktop Navigation */
	.desktop-nav {
		display: none;
	}

	.desktop-nav ul {
		display: flex;
		gap: 8px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.desktop-nav a {
		color: var(--color-primary-medium);
		text-decoration: none;
		font-weight: 500;
		transition: all 0.3s ease;
		position: relative;
		padding: 8px 14px;
		border-radius: 10px;
		font-size: 0.9em;
		white-space: nowrap;
	}

	.desktop-nav a:hover {
		color: var(--color-primary-dark);
		background: rgba(102, 126, 234, 0.08);
	}

	.desktop-nav a:active {
		transform: scale(0.96);
	}

	/* Hamburger Button */
	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: rgba(102, 126, 234, 0.08);
		border: 1px solid rgba(102, 126, 234, 0.15);
		border-radius: 12px;
		cursor: pointer;
		padding: 8px;
		width: 44px;
		height: 44px;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;
	}

	.hamburger:hover {
		background: rgba(102, 126, 234, 0.12);
		border-color: rgba(102, 126, 234, 0.25);
		transform: scale(1.05);
	}

	.hamburger:active {
		transform: scale(0.95);
	}

	.hamburger:focus {
		outline: 2px solid var(--color-gradient-purple-start);
		outline-offset: 2px;
	}

	.hamburger-line {
		width: 22px;
		height: 2.5px;
		background: var(--color-primary-dark);
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	.hamburger:hover .hamburger-line {
		background: var(--color-gradient-purple-start);
	}

	/* Hamburger as Close Button */
	.hamburger--close {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hamburger--close svg {
		color: var(--color-primary-dark);
		transition: all 0.3s ease;
	}

	.hamburger--close:hover svg {
		color: var(--color-gradient-purple-start);
		transform: rotate(90deg);
	}

	/* Mobile Menu Backdrop */
	.menu-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(8px);
		z-index: 999;
	}

	/* Mobile Menu Bottom Sheet - Glass ala Meta dengan warna Hero */
	.mobile-menu {
		@apply fixed bottom-0 w-full;
		max-height: 80vh;
		background: linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-hero-end) 100%);
		opacity: 0.95;
		backdrop-filter: blur(40px) saturate(180%);
		border-radius: 28px 28px 0 0;
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.mobile-menu.dragging {
		transition: none;
	}

	/* Drag Handle Bar */
	.drag-handle {
		width: 48px;
		height: 6px;
		background: rgba(102, 126, 234, 0.3);
		border-radius: 3px;
		margin: 16px auto;
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
		transition: all 0.2s ease;
	}

	.drag-handle:hover {
		background: rgba(102, 126, 234, 0.4);
		transform: scale(1.1);
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	/* Scrollable Content */
	.menu-content {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		@apply px-4 pt-6 pb-10;
		min-height: 0;
	}

	.mobile-menu.dragging .menu-content {
		overflow-y: hidden;
		pointer-events: none;
	}

	/* CTA Button (Daftar) */
	.menu-cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px 24px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start),
			var(--color-gradient-purple-mid)
		);
		color: white !important;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.2em;
		border-radius: 16px;
		margin-bottom: 16px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.menu-cta-btn:hover,
	.menu-cta-btn:focus {
		transform: translateY(-2px);
		opacity: 0.9;
	}

	.menu-cta-btn:active {
		transform: translateY(0) scale(0.98);
	}

	/* Mobile Navigation */
	.mobile-nav {
		margin-top: 12px;
	}

	.mobile-nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.mobile-nav li {
		margin: 0;
	}

	.mobile-nav a {
		display: flex;
		align-items: center;
		padding: 20px 24px;
		color: var(--color-primary-dark);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1em;
		border-radius: 16px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(102, 126, 234, 0.1);
		min-height: 60px;
	}

	.mobile-nav a:hover,
	.mobile-nav a:focus {
		background: rgba(102, 126, 234, 0.1);
		color: var(--color-gradient-purple-start);
		transform: translateX(8px);
		border-color: rgba(102, 126, 234, 0.3);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
	}

	.mobile-nav a:active {
		transform: translateX(8px) scale(0.98);
	}

	/* Responsive: Desktop */
	@media (min-width: 768px) {
		.header-container {
			padding: 20px 40px;
		}

		.desktop-nav {
			display: block;
		}

		.hamburger {
			display: none;
		}

		.menu-backdrop {
			display: none;
		}

		.mobile-menu {
			display: none;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
