<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { trackSectionView } from '$lib/utils/analytics';

	interface Section {
		id: string;
		label: string;
	}

	interface Props {
		/** Sections untuk navigation */
		sections?: Section[];
		/** Show progress indicator (default: true) */
		showProgress?: boolean;
		/** Show back to top button (default: true) */
		showBackToTop?: boolean;
		/** Scroll offset untuk header height (default: 70) */
		scrollOffset?: number;
	}

	let {
		sections = [
			{ id: 'hero', label: 'Home' },
			{ id: 'register', label: 'Daftar' },
			{ id: 'program', label: 'Program' },
			{ id: 'benefits', label: 'Benefits' },
			{ id: 'about', label: 'About' },
			{ id: 'testimonials', label: 'Testimonials' },
			{ id: 'faq', label: 'FAQ' },
			{ id: 'social-proof', label: 'Social Proof' }
		],
		showProgress = true,
		showBackToTop = true,
		scrollOffset = 70
	}: Props = $props();

	let isVisible = $state(false);
	let activeSection = $state<string>('');
	let scrollProgress = $state(0);
	let navElement: HTMLElement | undefined = $state();

	// Handle scroll untuk update active section dan progress
	function handleScroll() {
		if (!browser) return;

		const scrollY = window.scrollY || window.pageYOffset;
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;

		// Show/hide navigation
		isVisible = scrollY > 200;

		// Calculate scroll progress
		if (showProgress) {
			const scrollableHeight = documentHeight - windowHeight;
			scrollProgress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0;
		}

		// Find active section
		let currentActive = '';
		for (let i = sections.length - 1; i >= 0; i--) {
			const section = document.getElementById(sections[i].id);
			if (section) {
				const rect = section.getBoundingClientRect();
				const offset = scrollOffset;
				if (rect.top <= offset + 100) {
					currentActive = sections[i].id;
					break;
				}
			}
		}

		const previousActive = activeSection;
		activeSection = currentActive || sections[0]?.id || '';

		// Track section view saat section berubah
		if (activeSection && activeSection !== previousActive && isVisible) {
			const section = sections.find((s) => s.id === activeSection);
			if (section) {
				trackSectionView(activeSection, section.label);
			}
		}
	}

	// Smooth scroll ke section
	function scrollToSection(sectionId: string) {
		if (!browser) return;
		const section = document.getElementById(sectionId);
		if (section) {
			const targetPosition = section.getBoundingClientRect().top + window.pageYOffset;
			const finalPosition = targetPosition - scrollOffset;

			window.scrollTo({
				top: finalPosition,
				behavior: 'smooth'
			});
		}
	}

	// Back to top
	function scrollToTop() {
		if (!browser) return;
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		if (!browser) return;
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial check
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if isVisible}
	<nav
		bind:this={navElement}
		class="section-navigation"
		role="navigation"
		aria-label="Section navigation"
		class:visible={isVisible}
	>
		{#if showProgress}
			<div
				class="nav-progress"
				role="progressbar"
				aria-valuenow={scrollProgress}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				<div class="nav-progress-bar" style="width: {scrollProgress}%"></div>
			</div>
		{/if}

		<div class="nav-container">
			<ul class="nav-list" role="list">
				{#each sections as section (section.id)}
					<li role="listitem">
						<button
							class="nav-item"
							class:active={activeSection === section.id}
							onclick={() => scrollToSection(section.id)}
							aria-label="Navigate to {section.label} section"
							aria-current={activeSection === section.id ? 'page' : undefined}
						>
							<span class="nav-label">{section.label}</span>
						</button>
					</li>
				{/each}
			</ul>

			{#if showBackToTop}
				<button
					class="back-to-top"
					onclick={scrollToTop}
					aria-label="Back to top"
					title="Back to top"
				>
					↑
				</button>
			{/if}
		</div>
	</nav>
{/if}

<style>
	.section-navigation {
		position: fixed;
		top: 70px;
		left: 0;
		right: 0;
		z-index: 999;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--color-bg-hero-end, rgba(0, 0, 0, 0.1));
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		transition: transform 0.3s ease;
		transform: translateY(-100%);
	}

	.section-navigation.visible {
		transform: translateY(0);
	}

	.nav-progress {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--color-bg-hero-end, rgba(0, 0, 0, 0.05));
		overflow: hidden;
	}

	.nav-progress-bar {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--color-primary-soft-blue, #667eea),
			var(--color-primary-dark, #764ba2)
		);
		transition: width 0.1s ease;
	}

	.nav-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		height: 50px;
	}

	.nav-list {
		display: flex;
		align-items: center;
		gap: 5px;
		list-style: none;
		margin: 0;
		padding: 0;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.nav-list::-webkit-scrollbar {
		display: none;
	}

	.nav-item {
		padding: 8px 16px;
		border: none;
		background: transparent;
		color: var(--color-primary-medium, #718096);
		font-size: 0.9em;
		font-weight: 500;
		cursor: pointer;
		border-radius: 8px;
		transition: all 0.2s ease;
		white-space: nowrap;
		position: relative;
	}

	.nav-item:hover {
		background: var(--color-bg-lighter, #f8f9fa);
		color: var(--color-primary-dark, #1a202c);
	}

	.nav-item.active {
		color: var(--color-primary-soft-blue, #667eea);
		background: var(--color-primary-soft-blue, rgba(102, 126, 234, 0.1));
	}

	.nav-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 3px;
		background: var(--color-primary-soft-blue, #667eea);
		border-radius: 999px;
	}

	.back-to-top {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border: none;
		background: var(--color-primary-soft-blue, #667eea);
		color: white;
		border-radius: 50%;
		font-size: 1.2em;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 15px;
	}

	.back-to-top:hover {
		background: var(--color-primary-dark, #764ba2);
		transform: translateY(-3px);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	.back-to-top:active {
		transform: translateY(-1px);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.section-navigation {
			top: 60px;
		}

		.nav-container {
			padding: 0 15px;
			height: 45px;
		}

		.nav-item {
			padding: 6px 12px;
			font-size: 0.85em;
		}

		.back-to-top {
			width: 36px;
			height: 36px;
			font-size: 1em;
			margin-left: 10px;
		}
	}

	@media (max-width: 480px) {
		.nav-list {
			gap: 3px;
		}

		.nav-item {
			padding: 6px 10px;
			font-size: 0.8em;
		}
	}

	/* Reduce motion */
	@media (prefers-reduced-motion: reduce) {
		.section-navigation,
		.nav-item,
		.back-to-top,
		.nav-progress-bar {
			transition: none;
		}
	}
</style>
