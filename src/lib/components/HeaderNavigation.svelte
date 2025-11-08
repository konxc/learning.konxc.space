<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';

	// State menggunakan Svelte 5 Runes
	let menuOpen = $state(false);
	let scrolled = $state(false);
	let isInHero = $state(true);
	let isInProgram = $state(false);
	let showHeader = $state(true);
	let isDragging = $state(false);
	let dragStartY = 0;
	let currentDragY = 0;
	let menuElement = $state<HTMLDivElement | null>(null);

	// Navigation items
	const navItems = [
		{ href: '/#about', label: 'Tentang', ariaLabel: 'Tentang Naik Kelas' },
		{ href: '/#program', label: 'Program', ariaLabel: 'Program Pelatihan' },
		{ href: '/#benefits', label: 'Benefits', ariaLabel: 'Manfaat Program' },
		{
			href: '/school-partnership',
			label: 'Kemitraan Sekolah',
			ariaLabel: 'Ringkasan kemitraan sekolah Naik Kelas'
		},
		{
			href: '/paket-les',
			label: 'Paket Les',
			ariaLabel: 'Paket les dan ekstrakurikuler Naik Kelas'
		},
		{ href: '/marketplace', label: 'Marketplace', ariaLabel: 'Browse Courses' },
		{ href: '/waiting-list', label: 'Daftar', ariaLabel: 'Daftar Sekarang' }
	];

	// Computed values untuk brand mode
	const navHoverBg = $derived(
		$brandMode === 'hardcore' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.95)'
	);
	const navHoverTint = $derived(
		$brandMode === 'hardcore' ? 'rgba(251, 146, 60, 0.08)' : 'rgba(20, 184, 166, 0.06)'
	);
	const navHoverGlow = $derived(
		$brandMode === 'hardcore'
			? '0 0 20px rgba(251, 146, 60, 0.3)'
			: '0 0 20px rgba(20, 184, 166, 0.25)'
	);

	// Functions
	function toggleMenu() {
		menuOpen = !menuOpen;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	}

	function closeMenu() {
		menuOpen = false;
		document.body.style.overflow = '';
	}

	function handleDragStart(e: TouchEvent | MouseEvent) {
		if (!menuOpen) return;
		isDragging = true;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		dragStartY = clientY;
		document.body.style.overflow = 'hidden';
	}

	function handleDragMove(e: TouchEvent | MouseEvent) {
		if (!isDragging || !menuOpen) return;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		const deltaY = clientY - dragStartY;
		if (deltaY > 0) {
			currentDragY = deltaY;
			if (menuElement) {
				menuElement.style.transform = `translateY(${deltaY}px)`;
			}
		}
	}

	function handleDragEnd() {
		if (!isDragging) return;
		if (currentDragY > 100) {
			closeMenu();
		} else if (menuElement) {
			menuElement.style.transform = '';
		}
		isDragging = false;
		dragStartY = 0;
		currentDragY = 0;
	}

	function handleScroll() {
		// Hero section detection
		const heroSection = document.querySelector('#hero');
		if (heroSection) {
			const { bottom: heroBottom, height: heroHeight } = heroSection.getBoundingClientRect();
			isInHero = heroBottom > heroHeight * 0.4;
		} else {
			isInHero = false;
		}

		// Program section detection - hide header 100px sebelum masuk, show 100px sebelum keluar
		const programSection = document.querySelector('#program');
		if (programSection) {
			const { top: programTop, bottom: programBottom } = programSection.getBoundingClientRect();
			const threshold = 100;
			// Header tersembunyi jika sudah masuk (top <= 100px) dan belum keluar (bottom > 100px)
			isInProgram = programTop <= threshold && programBottom > threshold;
		} else {
			isInProgram = false;
		}

		showHeader = !isInProgram;
		scrolled = window.scrollY > 50;
	}

	// Effects menggunakan Svelte 5 Runes
	$effect(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

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

	// Smooth scroll handler untuk data-scroll="smooth"
	function handleSmoothScroll(e: Event) {
		const target = e.target as HTMLAnchorElement;
		if (!target || target.getAttribute('data-scroll') !== 'smooth') return;

		const href = target.getAttribute('href');
		if (!href || !href.startsWith('#')) return;

		e.preventDefault();
		const targetElement = document.querySelector(href);
		if (targetElement) {
			const headerHeight = 70; // Approximate header height
			const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
			const finalPosition = targetPosition - headerHeight;

			window.scrollTo({
				top: finalPosition,
				behavior: 'smooth'
			});
		}
	}

	// Attach smooth scroll handler
	$effect(() => {
		document.addEventListener('click', handleSmoothScroll);
		return () => {
			document.removeEventListener('click', handleSmoothScroll);
		};
	});
</script>

{#if !isInHero && showHeader}
	<header
		class="fixed top-[10px] right-[10px] left-[10px] z-1100 overflow-hidden rounded-3xl border border-white/25 bg-linear-to-br from-white/50 to-white/40 backdrop-blur-[60px] transition-all duration-600 ease-out {scrolled
			? 'scrolled'
			: ''}"
		style="
			--nav-hover-bg: {navHoverBg};
			--nav-hover-tint: {navHoverTint};
			--nav-hover-glow: {navHoverGlow};
			backdrop-filter: blur(60px) saturate(180%);
			-webkit-backdrop-filter: blur(60px) saturate(180%);
			box-shadow: 
				0 8px 32px rgba(31, 38, 135, 0.12),
				0 2px 8px rgba(0, 0, 0, 0.06),
				inset 0 1px 1px rgba(255, 255, 255, 0.6),
				inset 0 -1px 1px rgba(255, 255, 255, 0.4);
		"
		in:fly={{ y: -100, duration: 400, easing: cubicOut }}
		out:fly={{ y: -100, duration: 300, easing: cubicOut }}
	>
		<div
			class="header-container relative z-2 mx-auto flex items-center justify-between gap-5 px-5 py-2 md:px-10"
		>
			<!-- Logo -->
			<div class="logo">
				<a
					href="/"
					aria-label="Home"
					class="logo-link text-xl leading-none font-bold tracking-tight transition-all duration-300 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-gradient-purple-start) md:text-2xl"
				>
					Naik Kelas
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="desktop-nav hidden md:block" aria-label="Main navigation">
				<ul class="desktop-nav-list relative z-10 m-0 flex list-none gap-0.5 p-0">
					{#each navItems as item}
						<li class="desktop-nav-item relative isolate z-10 overflow-hidden rounded-xl">
							<a
								href={item.href}
								aria-label={item.ariaLabel}
								data-scroll="smooth"
								class="desktop-nav-link relative z-11 block rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap text-primary-medium no-underline transition-[background,color,box-shadow,outline] duration-200 ease-out focus-visible:z-12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gradient-purple-start)"
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
					class="hamburger flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-[rgba(102,126,234,0.15)] bg-[rgba(102,126,234,0.08)] p-2 transition-all duration-300 hover:scale-105 hover:border-[rgba(102,126,234,0.25)] hover:bg-[rgba(102,126,234,0.12)] focus:outline-2 focus:outline-offset-2 focus:outline-(--color-gradient-purple-start) active:scale-95 md:hidden"
					aria-label="Toggle menu"
					aria-expanded={menuOpen}
					onclick={toggleMenu}
					type="button"
				>
					<span
						class="hamburger-line h-0.5 w-[22px] rounded-sm bg-(--color-primary-dark) transition-all duration-300 group-hover:bg-(--color-gradient-purple-start)"
					></span>
					<span
						class="hamburger-line h-0.5 w-[22px] rounded-sm bg-(--color-primary-dark) transition-all duration-300 group-hover:bg-(--color-gradient-purple-start)"
					></span>
					<span
						class="hamburger-line h-0.5 w-[22px] rounded-sm bg-(--color-primary-dark) transition-all duration-300 group-hover:bg-(--color-gradient-purple-start)"
					></span>
				</button>
			{:else}
				<button
					class="hamburger hamburger--close flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[rgba(102,126,234,0.15)] bg-[rgba(102,126,234,0.08)] p-2 transition-all duration-300 hover:scale-105 hover:border-[rgba(102,126,234,0.25)] hover:bg-[rgba(102,126,234,0.12)] focus:outline-2 focus:outline-offset-2 focus:outline-(--color-gradient-purple-start) active:scale-95 md:hidden"
					aria-label="Close menu"
					aria-expanded={menuOpen}
					onclick={closeMenu}
					type="button"
				>
					<svg
						class="text-(--color-primary-dark) transition-all duration-300 hover:rotate-90 hover:text-(--color-gradient-purple-start)"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
					>
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

		<!-- Decorative overlays -->
		<AuroraOverlay
			intensity={0.02}
			blurPx={30}
			speedSec={30}
			insetPercent={10}
			zIndex={0}
			mode={$brandMode}
		/>
		<GlowOrbs
			zIndex={0}
			orbs={[
				$brandMode === 'hardcore'
					? {
							size: 120,
							x: '-30px',
							y: '60%',
							color: 'rgba(251, 146, 60, 0.16)',
							hideOnMobile: true
						}
					: {
							size: 120,
							x: '-30px',
							y: '60%',
							color: 'rgba(20, 184, 166, 0.16)',
							hideOnMobile: true
						},
				$brandMode === 'hardcore'
					? {
							size: 90,
							x: 'calc(100% - 20px)',
							y: '-20px',
							color: 'rgba(59, 130, 246, 0.16)',
							delaySec: 2,
							hideOnMobile: true
						}
					: {
							size: 90,
							x: 'calc(100% - 20px)',
							y: '-20px',
							color: 'rgba(45, 212, 191, 0.16)',
							delaySec: 2,
							hideOnMobile: true
						}
			]}
		/>
	</header>
{/if}

<!-- Mobile Menu Overlay -->
{#if menuOpen}
	<!-- Backdrop -->
	<div
		class="menu-backdrop fixed inset-0 z-1099 bg-black/50 backdrop-blur-sm"
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
		class="mobile-menu fixed bottom-0 z-1100 flex max-h-[80vh] w-full flex-col rounded-t-[28px] border border-white/30 bg-linear-to-br from-(--color-bg-hero) to-(--color-bg-hero-end) opacity-95 backdrop-blur-[40px] [backdrop-filter:saturate(180%)] transition-transform duration-200 ease-out {isDragging
			? 'dragging'
			: ''}"
		style="
			box-shadow: 
				0 8px 32px rgba(0, 0, 0, 0.12),
				inset 0 1px 0 rgba(255, 255, 255, 0.8);
		"
		bind:this={menuElement}
		in:fly={{ y: 100, duration: 300, easing: cubicOut }}
		out:fly={{ y: 100, duration: 250, easing: cubicOut }}
	>
		<!-- Drag Handle Bar -->
		<div
			class="drag-handle mx-auto my-4 h-1.5 w-12 cursor-grab rounded-sm bg-[rgba(102,126,234,0.3)] transition-all duration-200 select-none hover:scale-110 hover:bg-[rgba(102,126,234,0.4)] active:cursor-grabbing"
			onmousedown={handleDragStart}
			ontouchstart={handleDragStart}
			role="button"
			tabindex="0"
			aria-label="Swipe down to close menu"
		></div>

		<!-- Scrollable Content -->
		<div
			class="menu-content min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-10 {isDragging
				? 'pointer-events-none overflow-y-hidden'
				: ''}"
		>
			<!-- CTA Button (Daftar) -->
			{#each navItems.filter((item) => item.label === 'Daftar') as item}
				<a
					href={item.href}
					aria-label={item.ariaLabel}
					onclick={() => closeMenu()}
					data-scroll="smooth"
					class="menu-cta-btn mb-4 flex items-center justify-center rounded-2xl bg-linear-to-br from-(--color-gradient-purple-start) to-(--color-gradient-purple-mid) px-6 py-5 text-xl font-bold text-white no-underline transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:opacity-90 focus:-translate-y-0.5 focus:opacity-90 active:translate-y-0 active:scale-[0.98]"
				>
					{item.label}
				</a>
			{/each}

			<!-- Navigation Links -->
			<nav class="mobile-nav mt-3" aria-label="Mobile navigation">
				<ul class="m-0 flex list-none flex-col gap-2 p-0">
					{#each navItems.filter((item) => item.label !== 'Daftar') as item}
						<li class="m-0">
							<a
								href={item.href}
								aria-label={item.ariaLabel}
								onclick={() => closeMenu()}
								data-scroll="smooth"
								class="mobile-nav-link relative flex min-h-[60px] items-center overflow-visible rounded-2xl border border-[rgba(102,126,234,0.1)] bg-white/50 px-6 py-5 text-lg font-semibold text-(--color-primary-dark) no-underline transition-[background,color,padding-left,border-color,box-shadow] duration-300 ease-out hover:z-1 hover:border-[rgba(102,126,234,0.3)] hover:bg-[rgba(102,126,234,0.1)] hover:pl-14 hover:text-(--color-gradient-purple-start) hover:shadow-[0_4px_12px_rgba(102,126,234,0.15)] focus:z-1 focus:border-[rgba(102,126,234,0.3)] focus:bg-[rgba(102,126,234,0.1)] focus:pl-14 focus:text-(--color-gradient-purple-start) focus:shadow-[0_4px_12px_rgba(102,126,234,0.15)] active:scale-[0.98] active:pl-[52px]"
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
	/* Custom CSS hanya untuk efek yang tidak bisa dicapai dengan Tailwind */

	/* Logo */
	.logo-link {
		background: linear-gradient(
			135deg,
			var(--color-primary-dark, #1e293b) 0%,
			var(--color-primary-soft-blue, #3b82f6) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		display: inline-block;
	}

	.logo-link:hover,
	.logo-link:focus-visible {
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start, #667eea) 0%,
			var(--color-gradient-purple-mid, #764ba2) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
	}

	@keyframes subtle-glow {
		0% {
			box-shadow:
				0 8px 32px rgba(31, 38, 135, 0.12),
				0 2px 8px rgba(0, 0, 0, 0.06),
				inset 0 1px 1px rgba(255, 255, 255, 0.6),
				inset 0 -1px 1px rgba(255, 255, 255, 0.4);
			border-color: rgba(255, 255, 255, 0.25);
		}
		100% {
			box-shadow:
				0 8px 32px rgba(102, 126, 234, 0.18),
				0 2px 8px rgba(0, 0, 0, 0.08),
				inset 0 1px 1px rgba(255, 255, 255, 0.7),
				inset 0 -1px 1px rgba(255, 255, 255, 0.5);
			border-color: rgba(102, 126, 234, 0.3);
		}
	}

	/* Desktop Navigation Effects - Pseudo-elements */
	.desktop-nav-item::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50px;
		height: 50px;
		background: radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 65%);
		border-radius: 50%;
		opacity: 0;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		z-index: 0;
		pointer-events: none;
		filter: blur(6px);
	}

	.desktop-nav-item:hover::before {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1.2);
		will-change: opacity, transform;
	}

	.desktop-nav-item::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
		border-radius: 12px;
		transition: left 0.6s ease;
		z-index: 1;
		pointer-events: none;
		opacity: 0;
	}

	.desktop-nav-item:hover::after {
		left: 100%;
		opacity: 1;
		will-change: left, opacity;
	}

	.desktop-nav-link::before {
		content: '';
		position: absolute;
		bottom: 4px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--color-gradient-purple-start),
			var(--color-gradient-purple-mid),
			transparent
		);
		border-radius: 2px;
		transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 1;
		pointer-events: none;
		box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
	}

	.desktop-nav-link:hover::before,
	.desktop-nav-link:focus-visible::before {
		width: 80%;
	}

	.desktop-nav-link::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			var(--nav-hover-bg) 0%,
			var(--nav-hover-tint) 50%,
			var(--nav-hover-bg) 100%
		);
		background-size: 200% 100%;
		background-position: -100% 0;
		border-radius: 12px;
		opacity: 0;
		transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: -1;
		pointer-events: none;
	}

	.desktop-nav-link:hover::after,
	.desktop-nav-link:focus-visible::after {
		opacity: 1;
		animation: gradient-shift 2s ease-in-out infinite;
	}

	@keyframes gradient-shift {
		0%,
		100% {
			background-position: -100% 0;
		}
		50% {
			background-position: 100% 0;
		}
	}

	.desktop-nav-link:hover,
	.desktop-nav-link:focus-visible {
		color: var(--color-primary-dark);
		box-shadow: var(--nav-hover-glow);
		background: var(--nav-hover-bg);
	}

	.desktop-nav-link:active {
		transform: scale(0.96);
	}

	/* Mobile Navigation Effects - Pseudo-elements */
	.mobile-nav-link::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		border-radius: 16px 0 0 16px;
		transition: width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 0;
		box-shadow: 2px 0 8px rgba(102, 126, 234, 0.3);
	}

	.mobile-nav-link::after {
		content: '→';
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0;
		color: white;
		font-size: 1.2em;
		font-weight: bold;
		transition:
			opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 1;
		pointer-events: none;
	}

	.mobile-nav-link:hover::before,
	.mobile-nav-link:focus::before {
		width: 48px;
	}

	.mobile-nav-link:hover::after,
	.mobile-nav-link:focus::after {
		opacity: 1;
		left: 24px;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
