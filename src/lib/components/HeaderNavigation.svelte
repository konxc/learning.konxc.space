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

<header class="header" class:scrolled class:visible={!isInHero || scrolled} class:hidden={isInHero && !scrolled}>
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
		top: 0;
		left: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		z-index: 1000;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		transform: translateY(0);
	}

	.header.hidden {
		transform: translateY(-100%);
	}

	.header.visible {
		transform: translateY(0);
	}

	.header.scrolled {
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
	}

	.header-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 15px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo a {
		font-size: 1.5em;
		font-weight: 700;
		color: var(--color-primary-dark);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.logo a:hover {
		color: var(--color-primary-soft-blue);
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
		transition: color 0.3s ease;
		position: relative;
	}

	.desktop-nav a::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--color-gradient-purple-start);
		transition: width 0.3s ease;
	}

	.desktop-nav a:hover {
		color: var(--color-primary-dark);
	}

	.desktop-nav a:hover::after {
		width: 100%;
	}

	/* Hamburger Button */
	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		width: 44px;
		height: 44px;
		justify-content: center;
		align-items: center;
	}

	.hamburger:focus {
		outline: 2px solid var(--color-gradient-purple-start);
		outline-offset: 2px;
	}

	.hamburger-line {
		width: 25px;
		height: 3px;
		background: var(--color-primary-dark);
		border-radius: 3px;
		transition: all 0.3s ease;
	}

	.hamburger:hover .hamburger-line {
		background: var(--color-primary-soft-blue);
	}

	/* Mobile Menu Overlay */
	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		z-index: 999;
		animation: fadeIn 0.3s ease;
	}

	.mobile-nav {
		position: fixed;
		top: 0;
		right: 0;
		width: 280px;
		max-width: 80vw;
		height: 100vh;
		background: white;
		padding: 80px 20px 20px;
		box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
		animation: slideIn 0.3s ease;
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
		padding: 15px 20px;
		color: var(--color-primary-dark);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1em;
		border-radius: 10px;
		transition: all 0.3s ease;
	}

	.mobile-nav a:hover,
	.mobile-nav a:focus {
		background: var(--color-bg-hero);
		color: var(--color-gradient-purple-start);
		transform: translateX(5px);
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
