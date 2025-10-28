<script lang="ts">
	let menuOpen = $state(false);
	let scrolled = $state(false);
	let isInHero = $state(true);

	// Navigation items
	const navItems = [
		{ href: '#about', label: 'Tentang', ariaLabel: 'Tentang Naik Kelas' },
		{ href: '#program', label: 'Program', ariaLabel: 'Program Pelatihan' },
		{ href: '#benefits', label: 'Benefits', ariaLabel: 'Manfaat Program' },
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

	// Handle scroll for sticky header and detect hero section
	function handleScroll() {
		const heroSection = document.querySelector('#hero');
		if (heroSection) {
			const heroBottom = heroSection.getBoundingClientRect().bottom;
			// Show header when scrolled past hero section
			isInHero = heroBottom > 150; // Show when hero is mostly visible
		}
		scrolled = window.scrollY > 50;
	}

	// Listen to scroll events
	$effect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="header"
	class:scrolled
	class:visible={!isInHero || scrolled}
	class:hidden={isInHero && !scrolled}
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

		<!-- Mobile Hamburger Button -->
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
	</div>

	<!-- Mobile Menu Overlay -->
	{#if menuOpen}
		<div class="menu-overlay" onclick={closeMenu} role="button" aria-label="Close menu">
			<nav class="mobile-nav" aria-label="Main navigation">
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
		</div>
	{/if}
</header>

<style>
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
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.3s ease,
			background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform: translateY(0);
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

	.header.hidden {
		transform: translateY(calc(-100% - 20px));
	}

	.header.visible {
		transform: translateY(0);
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
		max-width: 1200px;
		margin: 0 auto;
		padding: 12px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo a {
		font-size: 1.4em;
		font-weight: 700;
		color: var(--color-primary-dark);
		text-decoration: none;
		transition: all 0.3s ease;
		letter-spacing: -0.5px;
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
		gap: 30px;
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
		padding: 8px 12px;
		border-radius: 10px;
		font-size: 0.95em;
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

	/* Mobile Menu Overlay */
	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(8px);
		z-index: 999;
		animation: fadeIn 0.3s ease;
	}

	.mobile-nav {
		position: fixed;
		top: 10px;
		right: 10px;
		width: 320px;
		max-width: 85vw;
		height: calc(100vh - 20px);
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(40px) saturate(200%);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 24px;
		padding: 100px 24px 24px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow-y: auto;
	}

	.mobile-nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.mobile-nav li {
		margin-bottom: 10px;
	}

	.mobile-nav a {
		display: block;
		padding: 16px 24px;
		color: var(--color-primary-dark);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1em;
		border-radius: 14px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.mobile-nav a::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
		transition: left 0.5s ease;
	}

	.mobile-nav a:hover::before,
	.mobile-nav a:focus::before {
		left: 100%;
	}

	.mobile-nav a:hover,
	.mobile-nav a:focus {
		background: rgba(102, 126, 234, 0.08);
		color: var(--color-gradient-purple-start);
		transform: translateX(8px);
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
	}

	/* Animations */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
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

		.menu-overlay {
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
