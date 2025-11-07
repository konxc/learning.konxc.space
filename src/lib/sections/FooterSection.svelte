<script lang="ts">
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { brandMode } from '$lib/stores/brandMode';
	import { FOOTER_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';
	import { trackCTAClick, trackSocialShare } from '$lib/utils/analytics';

	const socialLinks = [
		{ name: 'Instagram', href: 'https://instagram.com/koneksi.belajar' },
		{ name: 'Facebook', href: 'https://www.facebook.com/koneksi.belajar' },
		{ name: 'WhatsApp', href: 'https://wa.me/62895390540034' }
	];

	const footerLinks = [
		{ label: 'Tentang', href: '/tentang' },
		{ label: 'Program', href: '/#program' },
		{ label: 'Benefits', href: '/#benefits' },
		{ label: 'Marketplace', href: '/marketplace' }
	];

	// Glow orbs configuration
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? FOOTER_OVERLAY_CONFIG.glowOrbs.hardcore
			: FOOTER_OVERLAY_CONFIG.glowOrbs.chill
	);
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<h3 class="footer-title">Naik Kelas</h3>
			<p class="footer-tagline">Kolaborasi PT Koneksi Jaringan Indonesia × Yayasan Klub Fisika</p>
			<p class="footer-mission">Building Indonesia's tech talent, one developer at a time.</p>
		</div>

		<div class="footer-grid">
			<nav class="footer-nav" aria-label="Navigasi utama footer">
				{#each footerLinks as link}
					<a
						href={link.href}
						class="footer-nav-link"
						data-scroll={link.href.startsWith('/#') ? 'smooth' : undefined}
						onclick={() => trackCTAClick('footer_navigation', link.label, link.href)}
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<div class="footer-contact">
				<a href="mailto:support@naikkel.as" class="footer-contact-link">support@naikkel.as</a>
				<span class="footer-contact-separator" aria-hidden="true">•</span>
				<span class="footer-contact-text">Remote • Indonesia</span>
			</div>

			<div class="footer-social" aria-label="Social media links">
				{#each socialLinks as link}
					<a
						href={link.href}
						class="footer-social-link"
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => trackSocialShare(link.name, link.href)}
					>
						{link.name}
					</a>
				{/each}
			</div>
			<p class="footer-copy">© 2025 Naik Kelas. All rights reserved.</p>
		</div>
	</div>
	<AuroraOverlay {...FOOTER_OVERLAY_CONFIG.aurora} mode={$brandMode} />
	<GlowOrbs zIndex={FOOTER_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
</footer>

<style lang="postcss">
	@reference "../../app.css";

	.footer {
		background-color: var(--color-primary-dark);
		@apply relative z-1 overflow-hidden px-4 py-4 text-white min-[640px]:px-6;
	}

	.footer-inner {
		@apply relative z-2 mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center min-[900px]:max-w-[960px] min-[900px]:flex-row min-[900px]:items-start min-[900px]:justify-center min-[900px]:gap-12 min-[900px]:text-left;
	}

	.footer-brand {
		@apply flex flex-col gap-2 min-[900px]:max-w-[360px];
	}

	.footer-title {
		@apply text-lg font-semibold tracking-tight text-white/95 min-[640px]:text-xl;
	}

	.footer-tagline {
		@apply text-[0.7rem] font-medium tracking-[0.28em] text-white/50 uppercase min-[640px]:text-xs;
	}

	.footer-mission {
		@apply text-sm font-light text-white/60;
	}

	.footer-grid {
		@apply flex flex-col gap-4 min-[900px]:items-end;
	}

	.footer-nav {
		@apply flex flex-wrap items-center justify-center gap-3 text-sm text-white/65 min-[900px]:justify-end;
	}

	.footer-nav-link {
		@apply text-sm text-white/65 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30;
	}

	.footer-contact {
		@apply flex flex-wrap items-center justify-center gap-2 text-sm text-white/55 min-[900px]:justify-end;
	}

	.footer-contact-link {
		@apply text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white;
	}

	.footer-contact-separator {
		opacity: 0.35;
	}

	.footer-contact-text {
		@apply text-sm text-white/55;
	}

	.footer-social {
		@apply flex flex-wrap items-center justify-center gap-2 text-sm min-[900px]:justify-end;
	}

	.footer-social-link {
		@apply rounded-full border border-white/10 px-3 py-1 text-sm text-white/65 transition-colors duration-200 hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30;
	}

	.footer-copy {
		@apply text-xs text-white/45 min-[640px]:text-sm;
	}

	:global(.footer .aurora-overlay) {
		opacity: 0.4;
	}

	:global(.footer .glow-orbs) {
		opacity: 0.45;
	}

	.footer::after {
		content: '';
		@apply pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,transparent_0,transparent_45%,rgba(255,255,255,0.1)_70%,transparent_100%)];
	}
</style>
