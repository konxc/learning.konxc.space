<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Kemitraan Sekolah', href: '/kemitraan' }
	];

	const heroHighlights = [
		{
			value: '15+',
			label: 'Sekolah & komunitas',
			description: 'sudah bergabung dalam pilot program Naik Kelas'
		},
		{
			value: '4–6 minggu',
			label: 'Waktu onboarding',
			description: 'dari kick-off hingga kelas perdana berjalan'
		},
		{
			value: '95%',
			label: 'Tingkat kepuasan',
			description: 'guru & orang tua dari program bimbel dan ekstra'
		}
	];

	const partnershipBenefits = [
		{
			icon: '🤝',
			title: 'Tim pengajar profesional',
			description:
				'Mentor berasal dari Klub Fisika dan praktisi pendidikan dengan kurikulum terstruktur serta dukungan training guru pendamping.'
		},
		{
			icon: '🎯',
			title: 'Outcome yang terukur',
			description:
				'Pre/post test, laporan bulanan, dan portofolio siswa memastikan pihak sekolah dapat memantau perkembangan.'
		},
		{
			icon: '⚙️',
			title: 'Operasional kami kelola',
			description:
				'Disediakan silabus, materi, jadwal mentor, hingga modul marketing sehingga sekolah tinggal fokus pada komunikasi ke orang tua.'
		},
		{
			icon: '💡',
			title: 'Program fleksibel',
			description:
				'Opsi bimbel akademik, ekstra kreatif, hingga program STEM—bisa on-site, online, atau hybrid sesuai kebutuhan.'
		}
	];

	const programOfferings = [
		{
			title: 'Bimbel Matematika & Bahasa Inggris',
			duration: '4x per bulan • 60–90 menit',
			description:
				'Penguatan konsep inti dan latihan soal adaptif untuk siswa SD & SMP dengan modul tematik dan report bulanan.'
		},
		{
			title: 'Ekstrakurikuler Robotik',
			duration: '4x per bulan • 90 menit',
			description:
				'Pembelajaran konsep dasar robotik & engineering menggunakan kit edukasi (tersedia sewa) lengkap dengan showcase akhir semester.'
		},
		{
			title: 'Ekstrakurikuler Pemrograman',
			duration: '4x per bulan • 60–90 menit',
			description:
				'Block-based coding untuk siswa SD dan pengantar Python/JavaScript untuk SMP. Menyertakan proyek mini tiap modul.'
		},
		{
			title: 'Studio Desain & Kreatif',
			duration: '4x per bulan • 60–90 menit',
			description:
				'Kelas desain grafis, storytelling visual, hingga konten digital yang menumbuhkan kreativitas dan kepercayaan diri siswa.'
		}
	];

	const businessModels = [
		{
			title: 'Revenue Sharing',
			details: [
				'Bagi hasil 60:40 atau 70:30 tergantung jumlah kelas dan frekuensi.',
				'Sekolah fokus pada pendaftaran siswa; operasional kelas ditangani tim Naik Kelas.',
				'Ideal untuk uji coba (pilot) dan komunitas sekolah.'
			]
		},
		{
			title: 'White-label Academy',
			details: [
				'Branding menggunakan nama sekolah (kurikulum, portal, sertifikat).',
				'Biaya setup & subscription bulanan + pilihan seat license.',
				'Cocok untuk sekolah yang ingin membangun identitas akademi digitalnya.'
			]
		},
		{
			title: 'Contracted Cohort',
			details: [
				'Harga per batch (30–50 siswa) untuk program khusus/bootcamp.',
				'Mentor intensif, project akhir, dan demo day bersama orang tua.',
				'Pas untuk persiapan lomba, program unggulan, atau kelas talent khusus.'
			]
		}
	];

	const onboardingSteps = [
		{
			step: '01',
			title: 'Discovery Call',
			description: 'Membahas kebutuhan sekolah, jumlah siswa, format kelas, dan target capaian.'
		},
		{
			step: '02',
			title: 'Desain Program',
			description:
				'Kami menyusun silabus, jadwal, dan paket harga. Sekolah dapat review & menyesuaikan.'
		},
		{
			step: '03',
			title: 'Kick-off & Sosialisasi',
			description:
				'Sesi pengenalan untuk siswa & orang tua, onboarding guru pendamping, serta finalisasi kontrak.'
		},
		{
			step: '04',
			title: 'Mulai Kelas & Laporan',
			description:
				'Program berjalan dengan mentor Naik Kelas, report bulanan, evaluasi triwulan, dan showcase akhir.'
		}
	];

	const faqs = [
		{
			question: 'Berapa minimal jumlah siswa untuk memulai program? ',
			answer:
				'Minimal satu kelas (20–25 siswa) per program. Untuk pilot, kami bisa membantu membuat kelas gabungan lintas jenjang.'
		},
		{
			question: 'Bagaimana jika sekolah belum memiliki perangkat/kit robotik?',
			answer:
				'Kami menyediakan opsi sewa kit robotik & laptop sesuai jumlah siswa. Logistics diatur bersama tim sekolah.'
		},
		{
			question: 'Apakah ada pelatihan untuk guru internal?',
			answer:
				'Ya, setiap kemitraan termasuk Training of Trainers (ToT) dasar dan akses materi digital untuk guru pendamping.'
		},
		{
			question: 'Seberapa cepat program bisa berjalan?',
			answer:
				'Rata-rata 4–6 minggu dari penandatanganan MoU sampai kelas perdana dimulai, termasuk rekrut mentor dan sosialisasi.'
		}
	];

	const contactWhatsApp =
		'https://wa.me/6281212345678?text=Halo%20Naik%20Kelas,%20kami%20ingin%20diskusi%20kemitraan%20sekolah.';
</script>

<svelte:head>
	<title>Kemitraan Sekolah & Komunitas — Naik Kelas by Koneksi</title>
	<meta
		name="description"
		content="Informasi lengkap program kemitraan Naik Kelas untuk sekolah dan komunitas: manfaat, pilihan program, skema bisnis, dan alur onboarding."
	/>
	<link rel="canonical" href="https://konxc.space/kemitraan" />
</svelte:head>

<main class="partnership-page" aria-labelledby="partnership-title">
	<section class="hero" aria-labelledby="partnership-title">
		<div class="hero-overlay"></div>
		<div class="hero-container">
			<Breadcrumb {breadcrumbs} />
			<div class="hero-content">
				<h1 id="partnership-title">Kemitraan Sekolah &amp; Komunitas Naik Kelas</h1>
				<p>
					Bangun program bimbel dan ekstrakurikuler yang relevan dengan sumber daya pengajar dari
					Klub Fisika. Fokus kami: pembelajaran menyenangkan, outcome terukur, dan operasional yang
					mudah bagi sekolah.
				</p>
				<div class="hero-actions">
					<a class="hero-primary" href={contactWhatsApp} target="_blank" rel="noopener noreferrer">
						Hubungi Admin Naik Kelas
					</a>
					<a class="hero-secondary" href="/docs/brief-pricing">Lihat Paket &amp; Pricing →</a>
				</div>
			</div>
			<div class="hero-stats" role="list">
				{#each heroHighlights as stat}
					<div class="stat-card" role="listitem">
						<span class="stat-value">{stat.value}</span>
						<span class="stat-label">{stat.label}</span>
						<p>{stat.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="benefits" aria-labelledby="benefits-title">
		<div class="section-container">
			<h2 id="benefits-title">Mengapa sekolah bermitra dengan Naik Kelas?</h2>
			<p class="section-intro">
				Kami membantu sekolah menghadirkan pengalaman belajar yang modern tanpa menambah beban tim
				internal. Semua modul dikembangkan bersama praktisi industri dan pendidik berpengalaman.
			</p>
			<div class="benefits-grid" role="list">
				{#each partnershipBenefits as item}
					<article class="benefit-card" role="listitem">
						<span class="benefit-icon" aria-hidden="true">{item.icon}</span>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="programs" aria-labelledby="programs-title">
		<div class="section-container">
			<h2 id="programs-title">Pilihan Program yang Bisa Dimulai</h2>
			<p class="section-intro">
				Semua program berjalan 4x per bulan (60–90 menit/sesi) dengan rasio mentor 1:20–25 siswa.
				Kami memberikan modul belajar, lembar evaluasi, dan showcase akhir periode.
			</p>
			<div class="program-grid" role="list">
				{#each programOfferings as program}
					<article class="program-card" role="listitem">
						<h3>{program.title}</h3>
						<span class="program-duration">{program.duration}</span>
						<p>{program.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="business-model" aria-labelledby="business-title">
		<div class="section-container">
			<h2 id="business-title">Skema Kemitraan yang Fleksibel</h2>
			<p class="section-intro">
				Pilih struktur bisnis yang paling sesuai dengan kebutuhan dan kapasitas sekolah. Kami siap
				membantu menyiapkan proyeksi keuangan dan kontrak MoU.
			</p>
			<div class="model-grid" role="list">
				{#each businessModels as model}
					<article class="model-card" role="listitem">
						<h3>{model.title}</h3>
						<ul>
							{#each model.details as detail}
								<li>{detail}</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="onboarding" aria-labelledby="onboarding-title">
		<div class="section-container">
			<h2 id="onboarding-title">Alur Onboarding Kemitraan</h2>
			<p class="section-intro">
				Dalam 4 langkah, sekolah sudah siap menjalankan kelas bimbel atau ekstrakurikuler bersama
				tim Naik Kelas.
			</p>
			<div class="timeline" role="list">
				{#each onboardingSteps as step}
					<div class="timeline-item" role="listitem">
						<span class="timeline-step">{step.step}</span>
						<div class="timeline-content">
							<h3>{step.title}</h3>
							<p>{step.description}</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="timeline-cta">
				<a class="hero-primary" href={contactWhatsApp} target="_blank" rel="noopener noreferrer">
					Jadwalkan Discovery Call
				</a>
				<a class="hero-secondary" href="mailto:partnership@konxc.space">Kirim Proposal via Email</a>
			</div>
		</div>
	</section>

	<section class="faq" aria-labelledby="faq-title">
		<div class="section-container">
			<h2 id="faq-title">Pertanyaan yang sering diajukan</h2>
			<div class="faq-grid" role="list">
				{#each faqs as item}
					<article class="faq-card" role="listitem">
						<h3>{item.question}</h3>
						<p>{item.answer}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="cta" aria-labelledby="cta-title">
		<div class="section-container">
			<div class="cta-card">
				<h2 id="cta-title">Siap kolaborasi dengan Naik Kelas?</h2>
				<p>
					Kami akan membantu dari tahap perencanaan hingga evaluasi program. Mari jadwalkan sesi
					konsultasi untuk membahas kebutuhan sekolah Anda.
				</p>
				<div class="hero-actions">
					<a class="hero-primary" href={contactWhatsApp} target="_blank" rel="noopener noreferrer">
						Kontak Admin via WhatsApp
					</a>
					<a class="hero-secondary" href="tel:+6281212345678">Hubungi via Telepon</a>
				</div>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	@reference "../../../app.css";

	.partnership-page {
		@apply flex flex-col gap-24 bg-(--color-bg-light,#f4f6fb) pb-24 text-(--color-primary-dark,#0f172a);
	}

	.section-container {
		@apply mx-auto flex w-full max-w-[1100px] flex-col gap-10 px-6 lg:px-10;
	}

	.section-intro {
		@apply max-w-[760px] text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.hero {
		@apply relative overflow-hidden pt-32;
	}

	.hero-overlay {
		@apply absolute inset-0 bg-linear-to-br from-(--color-primary-soft-blue,#667eea)/20 via-white to-(--color-gradient-purple-end,#f093fb)/30;
	}

	.hero-container {
		@apply relative mx-auto flex w-full max-w-[1100px] flex-col gap-12 px-6 pb-20 lg:flex-row lg:items-center lg:justify-between lg:px-10;
	}

	.hero-content {
		@apply flex-1 space-y-6;
	}

	.hero-content h1 {
		@apply text-4xl font-semibold md:text-5xl;
	}

	.hero-content p {
		@apply text-base text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.hero-actions {
		@apply flex flex-wrap gap-4;
	}

	.hero-primary {
		@apply inline-flex items-center justify-center rounded-full bg-(--color-primary-soft-blue,#2563eb) px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:bg-(--color-primary-soft-blue,#1d4ed8);
	}

	.hero-secondary {
		@apply inline-flex items-center justify-center rounded-full border border-(--color-primary-soft-blue,#2563eb) px-6 py-3 text-sm font-semibold text-(--color-primary-soft-blue,#2563eb) transition-colors duration-200 hover:bg-(--color-primary-soft-blue,#2563eb) hover:text-white;
	}

	.hero-stats {
		@apply grid flex-1 gap-6 sm:grid-cols-2;
	}

	.stat-card {
		@apply rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_24px_55px_-34px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(14px);
	}

	.stat-value {
		@apply text-3xl font-semibold text-(--color-primary-soft-blue,#2563eb);
	}

	.stat-label {
		@apply text-xs font-semibold tracking-[0.35em] text-(--color-primary-medium,#42526e) uppercase;
	}

	.stat-card p {
		@apply mt-2 text-sm text-(--color-primary-medium,#4a5568);
	}

	.benefits-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.benefit-card {
		@apply rounded-3xl border border-white/50 bg-white/90 p-7 shadow-[0_20px_50px_-32px_rgba(15,34,65,0.3)] transition-transform duration-200 hover:-translate-y-1;
		backdrop-filter: blur(12px);
	}

	.benefit-icon {
		@apply text-3xl;
	}

	.benefit-card h3 {
		@apply text-xl font-semibold;
	}

	.benefit-card p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.program-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.program-card {
		@apply flex h-full flex-col gap-4 rounded-3xl border border-(--color-primary-soft-blue,#2563eb)/15 bg-white/95 p-7 shadow-[0_26px_60px_-40px_rgba(37,99,235,0.25)];
	}

	.program-card h3 {
		@apply text-xl font-semibold;
	}

	.program-duration {
		@apply text-xs font-semibold tracking-[0.3em] text-(--color-primary-medium,#42526e) uppercase;
	}

	.program-card p {
		@apply text-sm leading-relaxed text-(--color-primary-medium,#4a5568);
	}

	.model-grid {
		@apply grid gap-6 md:grid-cols-3;
	}

	.model-card {
		@apply flex h-full flex-col gap-4 rounded-3xl border border-(--color-primary-soft-blue,#2563eb)/20 bg-white/95 p-7 shadow-[0_26px_60px_-42px_rgba(37,99,235,0.25)];
	}

	.model-card h3 {
		@apply text-lg font-semibold;
	}

	.model-card ul {
		@apply list-disc space-y-2 pl-5 text-sm text-(--color-primary-medium,#4a5568);
	}

	.timeline {
		@apply relative grid gap-8 md:grid-cols-2;
	}

	.timeline-item {
		@apply relative flex gap-6 rounded-3xl border border-white/60 bg-white/90 p-7 shadow-[0_24px_55px_-34px_rgba(15,34,65,0.3)];
		backdrop-filter: blur(12px);
	}

	.timeline-step {
		@apply text-xl font-semibold text-(--color-primary-soft-blue,#2563eb);
	}

	.timeline-content h3 {
		@apply text-lg font-semibold;
	}

	.timeline-content p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.timeline-cta {
		@apply mt-6 flex flex-wrap gap-3;
	}

	.faq-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.faq-card {
		@apply rounded-3xl border border-(--color-primary-soft-blue,#2563eb)/20 bg-white/95 p-6 shadow-[0_24px_55px_-38px_rgba(37,99,235,0.25)];
	}

	.faq-card h3 {
		@apply text-lg font-semibold;
	}

	.faq-card p {
		@apply text-sm text-(--color-primary-medium,#4a5568);
	}

	.cta {
		@apply pt-0;
	}

	.cta-card {
		@apply rounded-[32px] border border-white/60 bg-white/90 p-10 text-center shadow-[0_32px_90px_-45px_rgba(15,34,65,0.35)];
		backdrop-filter: blur(14px);
	}

	.cta-card h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.cta-card p {
		@apply mt-4 text-base text-(--color-primary-medium,#4a5568);
	}

	@media (max-width: 768px) {
		.partnership-page {
			@apply gap-20;
		}

		.hero-content h1 {
			@apply text-3xl;
		}

		.hero-stats {
			@apply grid-cols-1;
		}

		.model-grid {
			@apply grid-cols-1;
		}
	}
</style>
