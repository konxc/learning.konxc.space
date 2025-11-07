<script lang="ts">
	import { onMount } from 'svelte';
	import AuroraOverlay from '$lib/components/decor/AuroraOverlay.svelte';
	import GlowOrbs from '$lib/components/decor/GlowOrbs.svelte';
	import { ABOUT_OVERLAY_CONFIG } from '$lib/config/overlayConfigs';
	import { DOMAIN_NARRATIVES, getAboutContent } from '$lib/config/contentConfig';
	import type { DomainNarrative } from '$lib/config/contentConfig';
	import { brandMode } from '$lib/stores/brandMode';
	import { careerStore } from '$lib/stores/career';
	import type { CareerOption } from '$lib/stores/career';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { communitySpotlight } from '$lib/data/communitySpotlight';
	import type { CommunitySpotlightEntry } from '$lib/data/communitySpotlight';

	declare global {
		interface Window {
			gtag?: (...args: any[]) => void;
		}
	}

	const heroHighlights = [
		{
			title: 'Cohort Berbasis Komunitas',
			description:
				'Setiap batch dijalankan sebagai squad kecil dengan accountability partner, live session mingguan, dan check-in progres.'
		},
		{
			title: 'Pembelajaran Dipandu Praktisi',
			description:
				'Mentor dan fasilitator aktif di industri membantu review project, career coaching, serta memandu study group tematik.'
		},
		{
			title: 'Didesain seperti Startup Tech',
			description:
				'Kita bangun kultur kolaboratif: open roadmap, feedback loop cepat, dan eksperimen produk bareng komunitas.'
		}
	];

	const communityStats = [
		{
			value: '1.200+',
			label: 'Learners aktif',
			description: 'Bergabung dalam komunitas lintas domain, dari developer hingga bisnis & UMKM.'
		},
		{
			value: '87%',
			label: 'Kelar sprint',
			description:
				'Peserta yang menuntaskan sprint inti berkat struktur belajar dan dukungan komunitas.'
		},
		{
			value: '50+',
			label: 'Mentor & fasilitator',
			description:
				'Profesional industri yang aktif mengajar, review project, dan office hour mingguan.'
		},
		{
			value: '40+',
			label: 'Kegiatan komunitas / bln',
			description:
				'AMA, study group, build weekend, hingga career lab yang bisa diikuti seluruh member.'
		}
	];

	const journeyMilestones = [
		{
			period: '2025',
			title: 'Batch perintis dimulai',
			description:
				'Naik Kelas resmi dibuka sebagai program cohort komunitas untuk membantu talenta bertumbuh melalui proyek nyata dan mentoring praktisi.'
		},
		{
			period: '2026-2028',
			title: 'Membangun ekosistem lintas domain',
			description:
				'Kami menambah jalur belajar UI/UX, bisnis & UMKM, akademik, serta outdoor leadership dengan tetap menjaga kultur peer-learning dan accountability.'
		},
		{
			period: 'Roadmap 2030',
			title: 'Komunitas pembelajaran terbesar di kawasan',
			description:
				'Visi kami adalah menghadirkan jaringan 10 ribu learner aktif, studio produk komunitas, dan pusat karier terpadu yang membuka peluang kerja lintas industri.'
		}
	];

	const communityPrograms = [
		{
			icon: '🤝',
			title: 'Peer Learning Squad',
			description:
				'Squad 6-8 orang dengan fasilitator, daily stand-up, dan retro mingguan untuk menjaga motivasi belajar.'
		},
		{
			icon: '🧪',
			title: 'Community Lab Projects',
			description:
				'Kolaborasi lintas domain membangun produk nyata—mulai dari aplikasi web, riset UX, hingga eksperimen bisnis.'
		},
		{
			icon: '🎯',
			title: 'Career Support Hub',
			description:
				'Koleksi resources, mock interview, resume review, dan alumni network yang siap bantu kamu naik level karier.'
		},
		{
			icon: '📅',
			title: 'Weekly Rituals',
			description:
				'Setiap minggu ada AMA mentor, live demo project, dan community town hall untuk update roadmap bersama.'
		}
	];

	const supportChannels = [
		{
			icon: '💬',
			title: 'Diskusi 24/7',
			description:
				'Forum Discord & Slack untuk tanya jawab, pairing session, dan kanal accountability harian.'
		},
		{
			icon: '🎥',
			title: 'Live Session & Replay',
			description:
				'Semua kelas live direkam dengan catatan lengkap, sehingga kamu bisa catch-up kapan pun.'
		},
		{
			icon: '🧭',
			title: 'Office Hour Mentor',
			description: 'Sesi konsultasi privat untuk bahas project, portofolio, atau strategi karier.'
		}
	];

	const callToAction = {
		headline: 'Siap bertumbuh bareng komunitas tech paling suportif?',
		description:
			'Gabung waiting list untuk mendapatkan prioritas kursi cohort berikutnya, akses early community events, dan kurasi materi pemanasan.',
		primary: {
			text: '🎯 Gabung Waiting List',
			href: '/waiting-list'
		},
		secondary: {
			text: 'Jelajahi Kurikulum',
			href: '/#program'
		}
	};

	let currentDomain = $state(get(careerStore));

	$effect(() => {
		const unsubscribe = careerStore.subscribe((value) => {
			currentDomain = value;
		});
		return unsubscribe;
	});

	const aboutContent = $derived(getAboutContent(currentDomain));
	const glowOrbsConfig = $derived(
		$brandMode === 'hardcore'
			? ABOUT_OVERLAY_CONFIG.glowOrbs.hardcore
			: ABOUT_OVERLAY_CONFIG.glowOrbs.chill
	);
	const domainNarrativeEntries = Object.entries(DOMAIN_NARRATIVES) as Array<
		[CareerOption, DomainNarrative]
	>;
	const siteUrl = 'https://konxc.space';
	const pageUrl = `${siteUrl}/tentang`;
	const spotlightPublished = $derived(
		communitySpotlight.filter((entry) => entry.status === 'published') as CommunitySpotlightEntry[]
	);
	const spotlightUpcoming = $derived(
		communitySpotlight.filter(
			(entry) => entry.status === 'coming-soon'
		) as CommunitySpotlightEntry[]
	);
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'EducationalOrganization',
		name: 'Naik Kelas by Koneksi',
		description:
			'Platform pembelajaran berbasis komunitas yang menggabungkan mentoring praktisi, project nyata, dan pengembangan karier.',
		url: siteUrl,
		logo: `${siteUrl}/favicon.png`,
		sameAs: [
			'https://instagram.com/koneksi.belajar',
			'https://www.facebook.com/koneksi.belajar',
			'https://www.youtube.com/@koneksi',
			'https://www.linkedin.com/company/koneksi-id/'
		]
	};

	const breadcrumbSchema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Beranda',
				item: siteUrl
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Tentang Naik Kelas',
				item: pageUrl
			}
		]
	};

	function trackCta(eventName: string, label: string) {
		if (!browser || typeof window.gtag !== 'function') return;
		window.gtag('event', eventName, {
			event_category: 'engagement',
			event_label: label,
			page_location: pageUrl
		});
	}

	let heroSection: HTMLElement | null = null;
	let heroOverlaysVisible = $state(false);

	onMount(() => {
		if (!browser) return;
		if (!heroSection || typeof IntersectionObserver === 'undefined') {
			heroOverlaysVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						heroOverlaysVisible = true;
						observer.disconnect();
					}
				});
			},
			{ rootMargin: '0px 0px 200px 0px', threshold: 0.2 }
		);

		observer.observe(heroSection);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Tentang Naik Kelas — Belajar Terarah Berbasis Komunitas</title>
	<meta
		name="description"
		content="Kenali Naik Kelas lebih dekat: visi, kultur komunitas, program pembelajaran, dan dukungan mentor untuk membantu kamu naik level karier."
	/>
	<link rel="canonical" href="https://konxc.space/tentang" />
	{@html `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
</svelte:head>

<main class="about-page" aria-labelledby="about-page-title">
	<section class="hero" aria-labelledby="about-page-title" bind:this={heroSection}>
		<div class="hero-container">
			<div class="hero-copy">
				<span class="hero-badge">About Naik Kelas</span>
				<h1 id="about-page-title" class="hero-title">
					Sebuah ekosistem belajar kolaboratif yang dibangun seperti startup tech company
				</h1>
				<p class="hero-description">
					Kami percaya progress terbaik terjadi ketika belajar terasa dekat dengan komunitas. Di
					Naik Kelas, seluruh cohort bergerak bersama: belajar dari praktisi, membangun produk
					nyata, dan saling mengangkat satu sama lain.
				</p>

				<div class="hero-actions">
					<a
						class="hero-primary"
						href={callToAction.primary.href}
						onclick={() => trackCta('cta_click', 'join_waiting_list_hero')}
					>
						{callToAction.primary.text}
					</a>
					<a
						class="hero-secondary"
						href={callToAction.secondary.href}
						onclick={() => trackCta('cta_click', 'lihat_program_from_about')}
					>
						{callToAction.secondary.text}
					</a>
				</div>

				<ul class="hero-highlights" role="list">
					{#each heroHighlights as highlight}
						<li role="listitem" class="hero-highlight">
							<h2>{highlight.title}</h2>
							<p>{highlight.description}</p>
						</li>
					{/each}
				</ul>
			</div>

			<div class="hero-stats" aria-label="Statistik komunitas">
				{#each communityStats as stat}
					<div class="hero-stat-card">
						<span class="hero-stat-value">{stat.value}</span>
						<span class="hero-stat-label">{stat.label}</span>
						<p>{stat.description}</p>
					</div>
				{/each}
			</div>
		</div>

		{#if heroOverlaysVisible}
			<AuroraOverlay {...ABOUT_OVERLAY_CONFIG.aurora} mode={$brandMode} />
			<GlowOrbs zIndex={ABOUT_OVERLAY_CONFIG.aurora.zIndex} orbs={glowOrbsConfig} />
		{/if}
	</section>

	<section class="mission" aria-labelledby="mission-title">
		<div class="mission-container">
			<div class="mission-header">
				<h2 id="mission-title">Misi kami: menciptakan ruang belajar yang manusiawi</h2>
				<p>
					{aboutContent.subtitle}
				</p>
			</div>
			<div class="mission-grid" role="list">
				{#each aboutContent.items as item}
					<div role="listitem" class="mission-card">
						<span class="mission-icon" aria-hidden="true">{item.icon}</span>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="journey" aria-labelledby="journey-title">
		<div class="journey-container">
			<h2 id="journey-title">Perjalanan kami bersama komunitas</h2>
			<ol class="journey-timeline">
				{#each journeyMilestones as milestone}
					<li class="journey-item">
						<span class="journey-period">{milestone.period}</span>
						<div class="journey-content">
							<h3>{milestone.title}</h3>
							<p>{milestone.description}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="programs" aria-labelledby="programs-title">
		<div class="programs-container">
			<div class="programs-header">
				<h2 id="programs-title">Cara kami menjaga energi komunitas</h2>
				<p>
					Kegiatan komunitas dirancang untuk menjaga ritme belajar: dari peer learning squad sampai
					career lab yang bisa diikuti kapan pun kamu siap.
				</p>
			</div>
			<div class="programs-grid" role="list">
				{#each communityPrograms as program}
					<div role="listitem" class="program-card">
						<span class="program-icon" aria-hidden="true">{program.icon}</span>
						<h3>{program.title}</h3>
						<p>{program.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="domains" aria-labelledby="domains-title">
		<div class="domains-container">
			<div class="domains-header">
				<h2 id="domains-title">Arah pengembangan tiap domain</h2>
				<p>
					Setiap domain kami kembangkan dengan prinsip tokenisasi konten agar ekosistem belajar
					tetap adil, transparan, dan menumbuhkan kemandirian peserta sebagai bagian dari jaringan
					bisnis Koneksi.
				</p>
			</div>
			<div class="domains-grid" role="list">
				{#each domainNarrativeEntries as [domainKey, narrative]}
					<div role="listitem" class="domain-card">
						<div class="domain-card-header">
							<span class="domain-tag">{domainKey}</span>
							<h3>{narrative.tagline}</h3>
						</div>
						<p class="domain-future">{narrative.futureVision}</p>
						<div class="domain-token">
							<strong>Fokus tokenisasi konten</strong>
							<p>{narrative.tokenizationFocus}</p>
						</div>
						<ul class="domain-initiatives">
							{#each narrative.initiatives as initiative}
								<li>{initiative}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="spotlight" aria-labelledby="spotlight-title">
		<div class="spotlight-container">
			<h2 id="spotlight-title">Community Spotlight</h2>
			<p>
				Kami mengumpulkan cerita alumni, project komunitas, dan kontribusi terbaik dari ekosistem
				Naik Kelas. Data lengkap akan ditampilkan secara berkala seiring proses sertifikasi dan
				promosi komunitas.
			</p>
			{#if spotlightPublished.length > 0}
				<div class="spotlight-grid" role="list">
					{#each spotlightPublished as spotlight}
						<article class="spotlight-card" role="listitem">
							<span class="spotlight-badge">{spotlight.domain}</span>
							<h3>{spotlight.name}</h3>
							<p class="spotlight-role">{spotlight.role}</p>
							<p class="spotlight-copy">{spotlight.story}</p>
							<p class="spotlight-highlight">{spotlight.highlight}</p>
							{#if spotlight.socialLinks.length > 0}
								<div class="spotlight-links">
									{#each spotlight.socialLinks as link}
										<a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
									{/each}
								</div>
							{/if}
						</article>
					{/each}
				</div>
			{:else}
				<div class="spotlight-placeholder-grid">
					{#if spotlightUpcoming.length > 0}
						{#each spotlightUpcoming.slice(0, 2) as upcoming}
							<div class="spotlight-card" aria-live="polite">
								<span class="spotlight-badge">{upcoming.domain}</span>
								<h3>{upcoming.name}</h3>
								<p>{upcoming.story}</p>
							</div>
						{/each}
					{:else}
						<div class="spotlight-card" aria-live="polite">
							<span class="spotlight-badge">Coming Soon</span>
							<p>Profil alumni dan project komunitas sedang disiapkan.</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<section class="support" aria-labelledby="support-title">
		<div class="support-container">
			<div class="support-header">
				<h2 id="support-title">Dukungan menyeluruh selama perjalanan belajar</h2>
				<p>
					Komunitas Naik Kelas dirancang agar kamu tidak belajar sendirian. Ada ruang diskusi 24/7,
					jadwal live session yang tertata, serta mentor yang selalu standby.
				</p>
			</div>
			<div class="support-grid" role="list">
				{#each supportChannels as channel}
					<div role="listitem" class="support-card">
						<span class="support-icon" aria-hidden="true">{channel.icon}</span>
						<h3>{channel.title}</h3>
						<p>{channel.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="cta" aria-labelledby="cta-title">
		<div class="cta-container">
			<div class="cta-content">
				<h2 id="cta-title">{callToAction.headline}</h2>
				<p>{callToAction.description}</p>
				<div class="cta-actions">
					<a
						class="cta-primary"
						href={callToAction.primary.href}
						onclick={() => trackCta('cta_click', 'join_waiting_list_bottom')}
					>
						{callToAction.primary.text}
					</a>
					<a
						class="cta-secondary"
						href={callToAction.secondary.href}
						onclick={() => trackCta('cta_click', 'lihat_program_bottom')}
					>
						{callToAction.secondary.text}
					</a>
				</div>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	@reference "../../../app.css";

	.about-page {
		@apply flex flex-col gap-24 bg-(--color-bg-light,#f5f7fb) text-(--color-primary-dark,#1a202c);
	}

	.hero {
		position: relative;
		@apply overflow-hidden;
	}

	.hero-container {
		@apply relative mx-auto flex max-w-[1200px] flex-col gap-16 px-6 py-24 md:flex-row md:items-start md:py-28 lg:px-10;
	}

	.hero-copy {
		@apply flex-1 space-y-8;
	}

	.hero-badge {
		@apply inline-flex w-fit items-center gap-2 rounded-full bg-(--color-primary-soft-blue,#667eea)/15 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.hero-title {
		@apply text-4xl leading-tight font-semibold md:text-5xl lg:text-6xl;
	}

	.hero-description {
		@apply text-lg text-(--color-primary-medium,#4a5568) md:text-xl;
	}

	.hero-actions {
		@apply flex flex-wrap gap-4;
	}

	.hero-primary {
		@apply inline-flex items-center justify-center rounded-full bg-(--color-primary-soft-blue,#667eea) px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-1;
	}

	.hero-secondary {
		@apply inline-flex items-center justify-center rounded-full border border-(--color-primary-soft-blue,#667eea) px-6 py-3 text-sm font-semibold text-(--color-primary-soft-blue,#667eea) transition-colors duration-200 hover:bg-(--color-primary-soft-blue,#667eea) hover:text-white;
	}

	.hero-highlights {
		@apply grid gap-6 md:grid-cols-3;
	}

	.hero-highlight {
		@apply rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_45px_-28px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(12px);
	}

	.hero-highlight h2 {
		@apply mb-3 text-lg font-semibold;
	}

	.hero-highlight p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.hero-stats {
		@apply grid flex-1 gap-6 self-stretch md:grid-cols-2;
	}

	.hero-stat-card {
		@apply rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_22px_55px_-30px_rgba(15,34,65,0.45)];
		backdrop-filter: blur(16px);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.hero-stat-value {
		@apply text-4xl font-semibold;
	}

	.hero-stat-label {
		@apply text-xs font-semibold tracking-[0.25em] text-(--color-primary-medium,#4a5b72) uppercase;
	}

	.hero-stat-card p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.mission-container,
	.journey-container,
	.programs-container,
	.support-container,
	.cta-container,
	.domains-container {
		@apply mx-auto max-w-[1100px] px-6 lg:px-10;
	}

	.domains {
		@apply bg-white/60 py-20;
	}

	.domains-container {
		@apply mx-auto flex max-w-[1100px] flex-col gap-12 px-6 lg:px-10;
	}

	.domains-header h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.domains-header p {
		@apply mt-4 max-w-[680px] text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.domains-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.domain-card {
		@apply rounded-3xl border border-white/60 bg-white/85 p-7 shadow-[0_24px_50px_-30px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(14px);
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.domain-card-header {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.domain-tag {
		@apply inline-flex w-fit items-center rounded-full bg-(--color-primary-soft-blue,#667eea)/12 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.domain-card-header h3 {
		@apply text-xl font-semibold;
	}

	.domain-future {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.domain-token {
		@apply rounded-2xl border border-(--color-primary-soft-blue,#667eea)/25 bg-(--color-primary-soft-blue,#667eea)/8 px-4 py-3;
	}

	.domain-token strong {
		@apply text-xs font-semibold tracking-[0.2em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.domain-token p {
		@apply mt-1 text-sm text-(--color-primary-medium,#4a5568);
	}

	.domain-initiatives {
		@apply space-y-2 pl-5 text-sm text-(--color-primary-medium,#4a5568);
		list-style: disc;
	}

	.domain-initiatives li {
		@apply leading-relaxed;
	}

	.spotlight {
		@apply bg-white/70 py-20;
	}

	.spotlight-container {
		@apply mx-auto flex max-w-[960px] flex-col gap-8 px-6 text-center lg:px-8;
	}

	.spotlight-container p {
		@apply text-sm text-(--color-primary-medium,#4a5568) md:text-base;
	}

	.spotlight-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.spotlight-card {
		@apply rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_22px_50px_-28px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.spotlight-card h3 {
		@apply text-lg font-semibold text-(--color-primary-dark,#1a202c);
	}

	.spotlight-card p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-role {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-copy {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-highlight {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.spotlight-links {
		@apply flex flex-wrap gap-2;
	}

	.spotlight-links a {
		@apply text-sm text-(--color-primary-soft-blue,#667eea) hover:underline;
	}

	.spotlight-badge {
		@apply inline-flex w-fit items-center rounded-full border border-(--color-primary-soft-blue,#667eea)/30 bg-(--color-primary-soft-blue,#667eea)/12 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-(--color-primary-soft-blue,#667eea) uppercase;
	}

	.mission-header {
		@apply mb-12 max-w-[720px];
	}

	.mission-header h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.mission-header p {
		@apply mt-4 text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.mission-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.mission-card {
		@apply rounded-3xl border border-white/50 bg-white/80 p-7 shadow-[0_18px_45px_-30px_rgba(15,34,65,0.4)];
		backdrop-filter: blur(14px);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.mission-icon {
		@apply text-2xl;
	}

	.mission-card h3 {
		@apply text-xl font-semibold;
	}

	.mission-card p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.journey-container {
		@apply flex flex-col gap-10;
	}

	.journey-container h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.journey-timeline {
		@apply relative flex flex-col gap-10 border-l border-(--color-primary-soft-blue,#667eea)/40 pl-10;
	}

	.journey-item {
		@apply relative;
	}

	.journey-item::before {
		content: '';
		@apply absolute top-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-(--color-primary-soft-blue,#667eea) shadow-[0_0_0_6px_rgba(102,126,234,0.15)];
		left: calc(-2.5rem);
		transform: translateX(-50%);
	}

	.journey-period {
		@apply text-xs font-semibold tracking-[0.3em] text-(--color-primary-medium,#4a5b72) uppercase;
	}

	.journey-content {
		@apply mt-1 space-y-2;
	}

	.journey-content h3 {
		@apply text-xl font-semibold;
	}

	.journey-content p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.programs-container {
		@apply flex flex-col gap-12;
	}

	.programs-header h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.programs-header p {
		@apply mt-4 max-w-[640px] text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.programs-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.program-card {
		@apply rounded-3xl border border-white/60 bg-white/80 p-7 shadow-[0_24px_55px_-32px_rgba(15,34,65,0.4)];
		backdrop-filter: blur(14px);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.program-icon {
		@apply text-3xl;
	}

	.support-container {
		@apply flex flex-col gap-12;
	}

	.support-header h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.support-header p {
		@apply mt-4 max-w-[650px] text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.support-grid {
		@apply grid gap-6 md:grid-cols-3;
	}

	.support-card {
		@apply rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_20px_48px_-30px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.support-icon {
		@apply text-2xl;
	}

	.cta {
		@apply relative overflow-hidden;
	}

	.cta-container {
		@apply relative mx-auto max-w-[980px] px-6 pt-20 pb-24 text-center lg:px-10;
	}

	.cta-content {
		@apply rounded-[38px] border border-white/50 bg-white/85 px-8 py-14 shadow-[0_28px_60px_-30px_rgba(15,34,65,0.4)];
		backdrop-filter: blur(14px);
		display: flex;
		flex-direction: column;
		gap: 18px;
		align-items: center;
	}

	.cta-content h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.cta-content p {
		@apply max-w-[560px] text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.cta-actions {
		@apply flex flex-wrap items-center justify-center gap-4;
	}

	.cta-primary {
		@apply inline-flex items-center justify-center rounded-full bg-(--color-primary-soft-blue,#667eea) px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-1;
	}

	.cta-secondary {
		@apply inline-flex items-center justify-center rounded-full border border-(--color-primary-soft-blue,#667eea) px-6 py-3 text-sm font-semibold text-(--color-primary-soft-blue,#667eea) transition-colors duration-200 hover:bg-(--color-primary-soft-blue,#667eea) hover:text-white;
	}

	@media (max-width: 1024px) {
		.hero-container {
			@apply gap-12;
		}

		.hero-highlights {
			@apply grid-cols-1;
		}

		.hero-stats {
			@apply grid-cols-2;
		}

		.mission-grid,
		.programs-grid,
		.support-grid {
			@apply grid-cols-1;
		}
	}

	@media (max-width: 768px) {
		.about-page {
			@apply gap-20;
		}

		.hero-title {
			@apply text-3xl;
		}

		.hero-description {
			@apply text-base;
		}

		.hero-stat-value {
			@apply text-3xl;
		}

		.journey-timeline {
			@apply pl-8;
		}

		.journey-item::before {
			@apply -left-[18px];
		}
	}
</style>
