<script lang="ts">
	const contactWhatsApp =
		'https://wa.me/6281212345678?text=Halo%20Naik%20Kelas,%20saya%20datang%20dari%20halaman%20Paket%20Les%20dan%20ingin%20membahas%20program%20yang%20tersedia.';

	type PackageCategoryId = 'les-bimbel' | 'ekstrakurikuler';

	interface PackageCategory {
		id: PackageCategoryId;
		title: string;
		description: string;
		tagline?: string;
	}

	interface ProgramPackage {
		id: string;
		categoryId: PackageCategoryId;
		name: string;
		level: string;
		duration: string;
		format: string;
		priceRange: string;
		perStudent?: string;
		bestFor: string;
		includes: string[];
		additionalNotes?: string[];
	}

	const heroHighlights = [
		{
			label: 'Biaya per kelas',
			value: 'Mulai Rp 1,2 jt',
			description: 'Untuk kelas ≤25 siswa dengan modul & laporan'
		},
		{
			label: 'Durasi fleksibel',
			value: '2 – 4 bulan',
			description: '4 sesi per bulan, 60–90 menit tiap pertemuan'
		},
		{
			label: 'Format hybrid',
			value: 'On-site / Online',
			description: 'Disesuaikan dengan fasilitas & preferensi sekolah'
		}
	] as const;

	const packageCategories: readonly PackageCategory[] = [
		{
			id: 'les-bimbel',
			title: 'Les & Bimbel Terstruktur',
			description:
				'Program penguatan akademik inti dengan fokus pada Matematika dan Bahasa Inggris. Cocok untuk remedial, pengayaan, maupun persiapan lomba.',
			tagline: 'Rasio mentor 1:20–25 siswa • Materi adaptif & laporan rutin'
		},
		{
			id: 'ekstrakurikuler',
			title: 'Ekstrakurikuler STEM & Kreatif',
			description:
				'Program berbasis proyek yang menggabungkan kreativitas dan teknologi. Menguatkan soft skills dan kesiapan karier sejak dini.',
			tagline: 'Project-based learning • Showcase akhir periode • Sertifikat opsional'
		}
	];

	const programPackages: readonly ProgramPackage[] = [
		{
			id: 'math-sd',
			categoryId: 'les-bimbel',
			name: 'Les Matematika SD',
			level: 'SD (kelas 4–6)',
			duration: '4 sesi/bulan • 60–75 menit',
			format: 'On-site / Online live',
			priceRange: 'Rp 1,2 – 1,8 jt per kelas per bulan',
			perStudent: '≈ Rp 50 – 90 rb / siswa / sesi',
			bestFor: 'Remedial terarah, penguatan konsep dasar, persiapan AKM',
			includes: [
				'Silabus tematik & modul latihan mingguan',
				'Pre-test & post-test per periode',
				'Progress report bulanan untuk guru & orang tua',
				'Sesi konsultasi orang tua (opsional)'
			]
		},
		{
			id: 'math-smp',
			categoryId: 'les-bimbel',
			name: 'Les Matematika SMP',
			level: 'SMP (kelas 7–9)',
			duration: '4 sesi/bulan • 75–90 menit',
			format: 'On-site / Online live',
			priceRange: 'Rp 1,5 – 2,2 jt per kelas per bulan',
			perStudent: '≈ Rp 60 – 100 rb / siswa / sesi',
			bestFor: 'Persiapan ujian sekolah, kompetisi, dan penguatan logika',
			includes: [
				'Modul soal HOTS & pembahasan rekaman',
				'Sesi clinic tambahan per bulan (opsional)',
				'Monitoring presensi real-time',
				'Analitik capaian per topik'
			],
			additionalNotes: ['Dapat digabung dengan paket persiapan olimpiade matematika']
		},
		{
			id: 'english',
			categoryId: 'les-bimbel',
			name: 'Les Bahasa Inggris Aktif',
			level: 'SD / SMP',
			duration: '4 sesi/bulan • 60–75 menit',
			format: 'On-site / Online live',
			priceRange: 'Rp 1,4 – 2,0 jt per kelas per bulan',
			perStudent: '≈ Rp 55 – 80 rb / siswa / sesi',
			bestFor: 'Speaking club, persiapan lomba storytelling, literasi digital',
			includes: [
				'Materi interaktif & worksheet digital',
				'Kegiatan role-play dan games edukatif',
				'Penilaian CEFR sederhana tiap periode',
				'Mini showcase / storytelling day'
			]
		},
		{
			id: 'design',
			categoryId: 'ekstrakurikuler',
			name: 'Ekstra Desain & Creative Media',
			level: 'SD kelas tinggi / SMP',
			duration: '4 sesi/bulan • 75 menit',
			format: 'On-site / Online live (dengan perangkat siswa)',
			priceRange: 'Rp 1,8 – 2,8 jt per kelas per bulan',
			perStudent: '≈ Rp 75 – 110 rb / siswa / sesi',
			bestFor: 'Kelas kreatif, klub desain, penguatan visual storytelling',
			includes: [
				'Project-based learning dengan tools gratis/open-source',
				'Template tugas & portofolio digital',
				'Review karya individual tiap bulan',
				'Evaluasi dan e-sertifikat opsional'
			]
		},
		{
			id: 'coding',
			categoryId: 'ekstrakurikuler',
			name: 'Ekstra Pemrograman & Coding',
			level: 'SD kelas tinggi / SMP',
			duration: '4 sesi/bulan • 75 – 90 menit',
			format: 'On-site (lab komputer) / Online live',
			priceRange: 'Rp 2,2 – 3,0 jt per kelas per bulan',
			perStudent: '≈ Rp 90 – 120 rb / siswa / sesi',
			bestFor: 'Pengantar coding, klub teknologi, persiapan kompetisi',
			includes: [
				'Silabus bertahap: Scratch → Python dasar',
				'Project showcase & evaluasi triwulan',
				'Akses platform latihan mandiri',
				'Pendampingan mentor industri'
			],
			additionalNotes: ['Opsional: integrasi modul AI dasar & computational thinking']
		},
		{
			id: 'robotics',
			categoryId: 'ekstrakurikuler',
			name: 'Ekstra Robotik Dasar',
			level: 'SD kelas tinggi / SMP',
			duration: '4 sesi/bulan • 90 menit',
			format: 'On-site (lab / ruang praktik)',
			priceRange: 'Rp 3,5 – 6,0 jt per kelas per bulan',
			perStudent: 'Tambahan sewa kit Rp 50 – 150 rb / siswa / bulan',
			bestFor: 'Sekolah dengan fokus STEM & persiapan lomba robotik',
			includes: [
				'Modul hardware & software terstruktur',
				'Toolkit robotik (sewa / beli) & maintenance dasar',
				'Pendampingan mentor tersertifikasi',
				'Showcase / kompetisi internal di akhir periode'
			],
			additionalNotes: ['Biaya transport & akomodasi mentor menyesuaikan lokasi sekolah']
		}
	];

	const packageSections = packageCategories.map((category) => ({
		...category,
		items: programPackages.filter((item) => item.categoryId === category.id)
	}));

	const addOns = [
		{
			title: 'Persiapan Lomba & Olimpiade',
			description:
				'Sesi intensif tambahan dan simulasi lomba untuk Matematika, Sains, Robotik, atau Coding.'
		},
		{
			title: 'Training of Trainers (ToT)',
			description:
				'Pelatihan singkat untuk guru pendamping agar program berkelanjutan dan selaras dengan kurikulum sekolah.'
		},
		{
			title: 'Parent Engagement',
			description:
				'Sesi sosialisasi & laporan perkembangan berkala untuk orang tua, termasuk webinar parenting tematik.'
		},
		{
			title: 'Dokumentasi Showcase',
			description: 'Paket dokumentasi foto/video untuk portofolio sekolah dan publikasi kegiatan.'
		}
	] as const;

	const crossLinks = [
		{
			title: 'Kemitraan Sekolah',
			description:
				'Lihat gambaran besar kolaborasi dan benefit yang akan diterima sekolah sebelum memilih paket biaya.',
			cta: 'Buka ringkasan kemitraan',
			href: '/school-partnership'
		},
		{
			title: 'Detail Alur Kemitraan',
			description:
				'Pelajari model kerjasama, timeline, dan langkah onboarding lengkap yang mendampingi program paket ini.',
			cta: 'Pelajari alur kemitraan',
			href: '/kemitraan'
		}
	];
</script>

<svelte:head>
	<title>Paket Les & Ekstrakurikuler Naik Kelas</title>
	<meta
		name="description"
		content="Lihat paket les dan ekstrakurikuler Naik Kelas untuk sekolah & komunitas: fasilitas lengkap, estimasi biaya, dan opsi add-on."
	/>
</svelte:head>

<main class="packages-page">
	<section class="hero-section mt-10">
		<div class="hero-content">
			<div class="hero-text">
				<h1 id="packages-title">Paket Les & Ekstrakurikuler Naik Kelas</h1>
				<p>
					Pilih paket belajar yang paling sesuai untuk sekolah atau komunitas Anda. Semua program
					mencakup modul siap pakai, mentor tersertifikasi, laporan perkembangan, dan showcase akhir
					periode. Gunakan halaman ini setelah membaca <a href="/school-partnership"
						>ringkasan kemitraan</a
					>
					dan sebelum menutup MoU di <a href="/kemitraan">halaman detail kemitraan</a>.
				</p>
				<div class="hero-actions">
					<a
						class="hero-primary"
						href={contactWhatsApp}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Hubungi tim Naik Kelas via WhatsApp"
					>
						Konsultasi Program via WhatsApp
					</a>
					<a
						class="hero-secondary"
						href="/kemitraan"
						aria-label="Pelajari kemitraan sekolah Naik Kelas"
					>
						Lihat Skema Kemitraan Sekolah
					</a>
					<a
						class="hero-ghost"
						href="/school-partnership"
						aria-label="Kembali ke ringkasan kemitraan sekolah"
					>
						Kembali ke Ringkasan Kemitraan
					</a>
				</div>
			</div>
			<div class="hero-highlights" role="list">
				{#each heroHighlights as item}
					<div class="highlight-card" role="listitem">
						<span class="highlight-label">{item.label}</span>
						<strong class="highlight-value">{item.value}</strong>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="funnel-links section-block" aria-labelledby="funnel-links-title">
		<header class="section-header items-center text-center">
			<h2 id="funnel-links-title">Hubungkan dengan Kemitraan</h2>
			<p>
				Sebelum memilih paket dan estimasi biaya, pastikan tim sekolah memahami gambaran kemitraan
				dan alur implementasi yang tersedia.
			</p>
		</header>
		<div class="funnel-grid" role="list">
			{#each crossLinks as link}
				<article class="funnel-card" role="listitem">
					<h3>{link.title}</h3>
					<p>{link.description}</p>
					<a class="funnel-link" href={link.href}>
						{link.cta}
					</a>
				</article>
			{/each}
		</div>
	</section>

	<section class="packages-intro section-block" aria-labelledby="programs-title">
		<header class="section-header items-center text-center">
			<h2 id="programs-title">Pilihan Paket Program</h2>
			<p>
				Telusuri paket les dan ekstrakurikuler dalam dua kategori utama. Setiap paket mencakup
				detail fasilitas, estimasi biaya, serta catatan tambahan yang dapat disesuaikan dengan
				kebutuhan sekolah atau komunitas Anda.
			</p>
		</header>
	</section>

	{#each packageSections as section}
		<section class="package-section section-block" id={section.id}>
			<header class="section-header items-center text-center">
				<h2>{section.title}</h2>
				<p>{section.description}</p>
				{#if section.tagline}
					<span class="section-tagline">{section.tagline}</span>
				{/if}
			</header>
			<div class="package-grid" role="list">
				{#each section.items as item}
					<article class="package-card" role="listitem">
						<header class="card-header">
							<div class="card-meta">
								<span class="badge">{item.level}</span>
								<span class="badge badge-alt">{item.format}</span>
							</div>
							<h3>{item.name}</h3>
							<p class="card-intro">{item.bestFor}</p>
						</header>
						<div class="card-pricing">
							<p class="price-range">{item.priceRange}</p>
							{#if item.perStudent}
								<p class="price-note">{item.perStudent}</p>
							{/if}
						</div>
						<div class="card-body">
							<div class="body-section">
								<h4>Fasilitas Utama</h4>
								<ul>
									{#each item.includes as feature}
										<li>{feature}</li>
									{/each}
								</ul>
							</div>
							<div class="body-section">
								<h4>Durasi & Format</h4>
								<ul>
									<li>{item.duration}</li>
									<li>{item.format}</li>
								</ul>
							</div>
							{#if item.additionalNotes}
								<div class="body-section notes">
									<h4>Catatan Tambahan</h4>
									<ul>
										{#each item.additionalNotes as note}
											<li>{note}</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/each}

	<section class="add-ons-section section-block" id="add-ons">
		<header class="section-header items-center text-center">
			<h2>Add-on & Layanan Tambahan</h2>
			<p>
				Paket dapat dikombinasikan dengan layanan pendukung untuk meningkatkan pengalaman belajar
				dan engagement komunitas sekolah.
			</p>
		</header>
		<div class="add-on-grid" role="list">
			{#each addOns as addOn}
				<div class="add-on-card" role="listitem">
					<h3>{addOn.title}</h3>
					<p>{addOn.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="cta-section section-block">
		<div class="cta-card">
			<h2>Siap memilih paket yang tepat?</h2>
			<p>
				Setelah menentukan paket yang cocok, tim kami akan mengirim proposal biaya, contoh MoU, dan
				akses dashboard monitoring untuk sekolah. Kami juga menyiapkan SOP operasional serta materi
				komunikasi untuk orang tua.
			</p>
			<div class="cta-actions">
				<a
					class="cta-primary"
					href={contactWhatsApp}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Hubungi tim Naik Kelas untuk konsultasi program"
				>
					Halaman Konsultasi Program
				</a>
				<a
					class="cta-secondary"
					href="/waiting-list"
					aria-label="Daftar ke waiting list demo Naik Kelas"
				>
					Gabung Waiting List Demo
				</a>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	@reference "../../../app.css";

	.packages-page {
		@apply relative flex flex-col gap-28 bg-(--color-bg-light,#f4f6fb) pt-28 pb-32 text-(--color-primary-dark,#0f172a);
		min-height: 100vh;
	}

	.section-block {
		@apply mx-auto w-full max-w-[1120px] px-6;
	}

	.section-header {
		@apply mx-auto mb-12 flex max-w-[820px] flex-col gap-4 text-center text-balance;
	}

	.section-header h2 {
		@apply text-3xl font-semibold text-(--color-primary-dark,#0f172a) md:text-4xl;
	}

	.section-header p {
		@apply text-base leading-relaxed text-(--color-primary-medium,#334155) md:text-lg;
	}

	.section-tagline {
		@apply inline-flex items-center gap-2 rounded-full bg-(--color-gradient-purple-start,#667eea)/10 px-4 py-2 text-sm font-medium text-(--color-gradient-purple-mid,#764ba2);
	}

	.hero-section {
		@apply relative mx-auto w-full max-w-[1120px] px-6;
	}

	.hero-content {
		@apply relative grid gap-10 overflow-hidden rounded-[36px] border border-white/40 bg-linear-to-br from-white/85 via-white/70 to-white/85 p-10 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur-[28px] md:grid-cols-[1.1fr,0.9fr];
	}

	.hero-content::after {
		content: '';
		position: absolute;
		inset: -20%;
		background:
			radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.4), transparent 60%),
			radial-gradient(circle at 82% 30%, rgba(45, 212, 191, 0.2), transparent 60%);
		opacity: 0.4;
		z-index: 0;
	}

	.hero-text,
	.hero-highlights {
		@apply relative z-10;
	}

	.hero-text h1 {
		@apply text-4xl leading-tight font-semibold text-balance text-(--color-primary-dark,#0f172a) md:text-5xl;
	}

	.hero-text p {
		@apply mt-5 text-lg leading-relaxed text-(--color-primary-medium,#334155) md:text-xl;
	}

	.hero-text p a {
		@apply text-(--color-gradient-purple-mid,#764ba2) underline-offset-4 transition-colors duration-200 hover:text-(--color-gradient-purple-start,#667eea);
	}

	.hero-actions {
		@apply mt-8 flex flex-wrap items-center gap-5;
	}

	.hero-primary {
		@apply inline-flex items-center justify-center rounded-2xl bg-linear-to-br from-(--color-gradient-purple-start,#667eea) via-(--color-gradient-purple-mid,#764ba2) to-(--color-gradient-purple-end,#a855f7) px-6 py-4 text-base font-semibold text-white shadow-(--color-gradient-purple-start,#667eea)/30 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:-translate-y-0.5 focus:shadow-xl;
	}

	.hero-secondary {
		@apply inline-flex items-center justify-center rounded-2xl border border-(--color-gradient-purple-start,#667eea)/40 bg-white/70 px-6 py-4 text-base font-semibold text-(--color-gradient-purple-mid,#764ba2) shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-(--color-gradient-purple-start,#667eea)/60 hover:bg-white focus:-translate-y-0.5;
	}

	.hero-ghost {
		@apply inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/30 px-6 py-4 text-base font-semibold text-(--color-primary-dark,#0f172a) transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 focus:-translate-y-0.5;
	}

	.hero-highlights {
		@apply grid gap-5 sm:grid-cols-2;
	}

	.highlight-card {
		@apply rounded-3xl border border-white/50 bg-white/85 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-[18px];
	}

	.highlight-label {
		@apply text-sm font-medium tracking-[0.12em] text-(--color-primary-medium,#334155) uppercase;
	}

	.highlight-value {
		@apply mt-2 block text-2xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.highlight-card p {
		@apply mt-2 text-sm text-(--color-primary-medium,#334155);
	}

	.funnel-grid {
		@apply mt-12 grid gap-8 md:grid-cols-2;
	}

	.funnel-card {
		@apply flex h-full flex-col gap-4 rounded-[26px] border border-white/60 bg-white/92 p-7 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-[22px];
	}

	.funnel-card h3 {
		@apply text-xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.funnel-card p {
		@apply flex-1 text-sm leading-relaxed text-(--color-primary-medium,#334155);
	}

	.funnel-link {
		@apply inline-flex items-center gap-2 text-sm font-semibold text-(--color-gradient-purple-mid,#764ba2) no-underline transition-transform duration-200 hover:translate-x-1 hover:text-(--color-gradient-purple-start,#667eea);
	}

	.package-grid {
		@apply grid gap-8 md:grid-cols-2;
	}

	.package-card {
		@apply flex h-full flex-col justify-between gap-6 rounded-[28px] border border-white/40 bg-white/92 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-[25px] transition-transform duration-300 hover:-translate-y-1;
	}

	.card-header {
		@apply flex flex-col gap-3;
	}

	.card-meta {
		@apply flex flex-wrap items-center gap-2;
	}

	.badge {
		@apply inline-flex items-center rounded-full bg-(--color-gradient-purple-start,#667eea)/15 px-4 py-1 text-xs font-semibold tracking-wide text-(--color-gradient-purple-mid,#764ba2) uppercase;
	}

	.badge-alt {
		@apply bg-(--color-primary-soft-blue,#60a5fa)/15 text-(--color-primary-soft-blue,#60a5fa);
	}

	.package-card h3 {
		@apply text-2xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.card-intro {
		@apply text-sm text-(--color-primary-medium,#334155);
	}

	.card-pricing {
		@apply rounded-2xl bg-(--color-primary-soft-blue,#60a5fa)/10 p-4 text-(--color-primary-dark,#0f172a);
	}

	.price-range {
		@apply text-lg font-semibold text-(--color-primary-dark,#0f172a);
	}

	.price-note {
		@apply mt-1 text-sm text-(--color-primary-medium,#334155);
	}

	.card-body {
		@apply flex flex-col gap-5 text-sm leading-relaxed text-(--color-primary-medium,#334155);
	}

	.body-section h4 {
		@apply mb-2 text-sm font-semibold tracking-wide text-(--color-primary-dark,#0f172a) uppercase;
	}

	.body-section ul {
		@apply flex flex-col gap-3;
	}

	.notes {
		@apply rounded-2xl bg-(--color-gradient-purple-start,#667eea)/5 p-4;
	}

	.add-on-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.add-on-card {
		@apply rounded-[24px] border border-white/30 bg-white/92 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-[20px];
	}

	.add-on-card h3 {
		@apply text-xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.add-on-card p {
		@apply mt-2 text-sm leading-relaxed text-(--color-primary-medium,#334155);
	}

	.cta-card {
		@apply overflow-hidden rounded-[36px] border border-white/40 bg-linear-to-br from-(--color-gradient-purple-start,#667eea) via-(--color-gradient-purple-mid,#764ba2) to-(--color-gradient-purple-end,#a855f7) p-12 text-white shadow-[0_25px_70px_rgba(76,29,149,0.35)];
	}

	.cta-card h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.cta-card p {
		@apply mt-4 max-w-[720px] text-base leading-relaxed md:text-lg;
	}

	.cta-actions {
		@apply mt-10 flex flex-wrap items-center gap-5;
	}

	.cta-primary {
		@apply inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-(--color-gradient-purple-mid,#764ba2) shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:-translate-y-0.5 focus:shadow-xl;
	}

	.cta-secondary {
		@apply inline-flex items-center justify-center rounded-2xl border border-white/70 px-6 py-4 text-base font-semibold text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus:-translate-y-0.5;
	}

	@media (max-width: 768px) {
		.packages-page {
			@apply gap-22 pt-20 pb-28;
		}

		.section-block {
			@apply px-5;
		}

		.section-header {
			@apply mb-10 gap-3;
		}

		.hero-content {
			@apply grid-cols-1 gap-8 p-8;
		}

		.hero-text h1 {
			@apply text-3xl;
		}

		.hero-actions {
			@apply gap-4;
		}

		.hero-highlights {
			@apply gap-4;
		}

		.funnel-grid,
		.package-grid,
		.add-on-grid {
			@apply gap-6;
		}

		.package-card {
			@apply p-7;
		}

		.cta-card {
			@apply p-9;
		}
	}

	@media (max-width: 640px) {
		.packages-page {
			@apply gap-16 pt-12 pb-20;
		}

		.section-block {
			@apply px-4;
		}

		.section-header {
			@apply mb-9 gap-3;
		}

		.hero-content {
			@apply gap-7 p-6;
		}

		.hero-text h1 {
			@apply text-[1.875rem] leading-snug;
		}

		.hero-text p {
			@apply text-base;
		}

		.hero-actions {
			@apply flex-col gap-3;
		}

		.hero-actions a {
			@apply w-full justify-center;
		}

		.hero-highlights {
			@apply gap-3;
		}

		.funnel-grid,
		.package-grid,
		.add-on-grid {
			@apply gap-5;
		}

		.funnel-card,
		.package-card,
		.add-on-card {
			@apply p-6;
		}

		.card-body {
			@apply gap-4;
		}

		.cta-card {
			@apply p-8;
		}

		.cta-actions {
			@apply flex-col gap-3;
		}

		.cta-actions a {
			@apply w-full justify-center;
		}
	}
</style>
