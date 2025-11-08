<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const breadcrumbs = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Kemitraan Sekolah', href: '/school-partnership' },
		{ label: 'Detail Kemitraan', href: '/kemitraan' }
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

	const implementationSupport = [
		{
			icon: '🗂️',
			title: 'Perencanaan & Proposal',
			description:
				'Kami siapkan deck overview, proyeksi finansial, serta MoU yang bisa langsung dipresentasikan ke pimpinan sekolah dan komite orang tua.'
		},
		{
			icon: '📣',
			title: 'Marketing & Sosialisasi',
			description:
				'Template poster, e-flyer, pesan broadcast WhatsApp, hingga materi presentasi orang tua kami personalisasi sesuai citra sekolah.'
		},
		{
			icon: '🧑‍🏫',
			title: 'Operasional & Mentor',
			description:
				'Rekrutmen mentor, training mingguan, penjadwalan kelas, dan koordinasi guru pendamping kami tangani bersama school PIC.'
		},
		{
			icon: '📊',
			title: 'Monitoring & Evaluasi',
			description:
				'Laporan bulanan, evaluasi triwulan, dashboard aktivitas siswa, dan rekomendasi pengembangan batch berikutnya tersedia sepanjang kemitraan.'
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
		'https://wa.me/6281212345678?text=Halo%20Naik%20Kelas,%20saya%20datang%20dari%20halaman%20Detail%20Kemitraan%20dan%20ingin%20diskusi%20lebih%20lanjut.';

	const crossLinks = [
		{
			title: 'Ringkasan Kemitraan',
			description:
				'Mulai dari gambaran besar kolaborasi, model alur, dan highlight benefit sekolah.',
			cta: 'Kembali ke halaman ringkasan',
			href: '/school-partnership'
		},
		{
			title: 'Paket Les & Ekstrakurikuler',
			description:
				'Telusuri pilihan kelas, fasilitas, dan estimasi biaya untuk tiap program bimbel & ekstra.',
			cta: 'Lihat paket & biaya',
			href: '/paket-les'
		}
	];
</script>

<svelte:head>
	<title>Kemitraan Sekolah & Komunitas — Naik Kelas by Koneksi</title>
	<meta
		name="description"
		content="Informasi lengkap program kemitraan Naik Kelas untuk sekolah dan komunitas: manfaat, pilihan program, skema bisnis, dan alur onboarding."
	/>
	<link rel="canonical" href="https://konxc.space/kemitraan" />
</svelte:head>

<main class="kemitraan-page" aria-labelledby="partnership-title">
	<section class="hero" aria-labelledby="partnership-title">
		<div class="hero-overlay"></div>
		<div class="hero-container">
			<div class="hero-content">
				<div class="hero-breadcrumb">
					<Breadcrumb {breadcrumbs} />
				</div>
				<h1 id="partnership-title">Kemitraan Sekolah &amp; Komunitas Naik Kelas</h1>
				<p>
					Bangun program bimbel dan ekstrakurikuler yang relevan dengan sumber daya pengajar dari
					Klub Fisika. Fokus kami: pembelajaran menyenangkan, outcome terukur, dan operasional yang
					mudah bagi sekolah. Halaman ini melanjutkan ringkasan di <a href="/school-partnership"
						>/school-partnership</a
					>
					dan mengarahkan Anda ke paket terperinci di halaman <a href="/paket-les">/paket-les</a>.
				</p>
				<div class="hero-actions">
					<a class="hero-primary" href={contactWhatsApp} target="_blank" rel="noopener noreferrer">
						Hubungi Admin Naik Kelas
					</a>
					<a class="hero-secondary" href="/paket-les">Lihat Paket &amp; Pricing →</a>
					<a class="hero-tertiary" href="/school-partnership">Kembali ke Ringkasan</a>
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

	<section class="cross-links partnership-section" aria-labelledby="cross-links-title">
		<header class="partnership-header items-center text-center">
			<h2 id="cross-links-title">Sambungkan Langkah Anda</h2>
			<p>
				Lanjutkan perjalanan kemitraan dengan meninjau ringkasan awal atau langsung mengecek paket
				program yang tersedia untuk sekolah Anda.
			</p>
		</header>
		<div class="cross-links-grid" role="list">
			{#each crossLinks as item}
				<article class="cross-card" role="listitem">
					<h3>{item.title}</h3>
					<p>{item.description}</p>
					<a class="cross-card-link" href={item.href}>
						{item.cta}
					</a>
				</article>
			{/each}
		</div>
	</section>

	<section class="benefits partnership-section" aria-labelledby="benefits-title">
		<div class="section-container">
			<div class="align-left partnership-header">
				<h2 id="benefits-title">
					Mengapa sekolah bermitra dengan <span class="section-title-highlight">Naik Kelas</span>?
				</h2>
				<p class="section-intro">
					Kami membantu sekolah menghadirkan pengalaman belajar yang modern tanpa menambah beban tim
					internal. Semua modul dikembangkan bersama praktisi industri dan pendidik berpengalaman.
				</p>
			</div>
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

	<section class="programs partnership-section" aria-labelledby="programs-title">
		<div class="section-container">
			<div class="align-left partnership-header">
				<h2 id="programs-title">
					Pilihan <span class="section-title-highlight">Program</span> yang Bisa Dimulai
				</h2>
				<p class="section-intro">
					Semua program berjalan 4x per bulan (60–90 menit/sesi) dengan rasio mentor 1:20–25 siswa.
					Kami memberikan modul belajar, lembar evaluasi, dan showcase akhir periode. Untuk detail
					fasilitas dan estimasi biaya per program, kunjungi halaman <a
						href="/paket-les#programs-title">/paket-les</a
					>.
				</p>
			</div>
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

	<section class="business-model partnership-section" aria-labelledby="business-title">
		<div class="section-container">
			<div class="align-left partnership-header">
				<h2 id="business-title">
					Skema <span class="section-title-highlight">Kemitraan</span> yang Fleksibel
				</h2>
				<p class="section-intro">
					Pilih struktur bisnis yang paling sesuai dengan kebutuhan dan kapasitas sekolah. Kami siap
					membantu menyiapkan proyeksi keuangan dan kontrak MoU.
				</p>
			</div>
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

	<section class="support partnership-section" aria-labelledby="support-title">
		<div class="section-container">
			<div class="align-left partnership-header">
				<h2 id="support-title">
					Dukungan Implementasi dari <span class="section-title-highlight">Tim Naik Kelas</span>
				</h2>
				<p class="section-intro">
					Setiap kolaborasi mencakup paket pendampingan menyeluruh agar sekolah tidak perlu
					membangun semua dari nol. Tim kami bekerja sebagai perpanjangan tangan operasional Anda.
				</p>
			</div>
			<div class="support-grid" role="list">
				{#each implementationSupport as item}
					<article class="support-card" role="listitem">
						<span class="support-icon" aria-hidden="true">{item.icon}</span>
						<div class="support-copy">
							<h3>{item.title}</h3>
							<p>{item.description}</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="onboarding partnership-section" aria-labelledby="onboarding-title">
		<div class="section-container">
			<div class="align-left partnership-header">
				<h2 id="onboarding-title">
					Alur <span class="section-title-highlight">Onboarding</span> Kemitraan
				</h2>
				<p class="section-intro">
					Dalam 4 langkah, sekolah sudah siap menjalankan kelas bimbel atau ekstrakurikuler bersama
					tim Naik Kelas.
				</p>
			</div>
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

	<section class="faq partnership-section" aria-labelledby="faq-title">
		<div class="section-container">
			<div class="align-left partnership-header">
				<h2 id="faq-title">
					<span class="section-title-highlight">Pertanyaan</span> yang sering diajukan
				</h2>
			</div>
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

	<section class="cta partnership-section" aria-labelledby="cta-title">
		<div class="section-container">
			<div class="cta-card">
				<div class="cta-content">
					<h2 id="cta-title">Siap kolaborasi dengan Naik Kelas?</h2>
					<p>
						Sampaikan kebutuhan sekolah dan kami akan menyiapkan proposal serta akses dashboard
						monitoring setelah sesi konsultasi awal. Kami siap mendampingi dari perencanaan, pilot,
						hingga evaluasi.
					</p>
					<ul class="cta-list">
						<li>Proposal dan estimasi biaya dikirim maksimal 3 hari kerja.</li>
						<li>Akses dashboard monitoring untuk tim sekolah & laporan berkala.</li>
						<li>Pendampingan MoU, pilot program, hingga scale-up batch berikutnya.</li>
					</ul>
				</div>
				<div class="cta-actions">
					<a class="cta-primary" href={contactWhatsApp} target="_blank" rel="noopener noreferrer">
						Kontak Admin via WhatsApp
					</a>
					<a class="cta-secondary" href="tel:+6281212345678">Hubungi via Telepon</a>
				</div>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	@reference "../../../app.css";

	.kemitraan-page {
		@apply flex flex-col gap-28 bg-(--color-bg-light,#f4f6fb) pb-32 text-(--color-primary-dark,#0f172a);
	}

	.partnership-header {
		@apply mb-12 text-balance;
	}

	.partnership-header h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.partnership-header p {
		@apply text-base leading-relaxed text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.section-title-highlight {
		@apply text-(--color-primary-soft-blue,#2563eb);
	}

	.section-container {
		@apply flex flex-col gap-12;
	}

	.section-intro {
		@apply max-w-[760px] text-base leading-relaxed text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.section-intro a {
		@apply text-(--color-primary-soft-blue,#2563eb) underline underline-offset-4 transition-colors duration-200 hover:text-(--color-gradient-purple-mid,#764ba2);
	}

	.hero {
		@apply relative overflow-hidden pt-32;
	}

	.hero-overlay {
		@apply absolute inset-0 bg-linear-to-br from-(--color-primary-soft-blue,#667eea)/20 via-white to-(--color-gradient-purple-end,#f093fb)/30;
	}

	.hero-container {
		@apply relative mx-auto flex w-full max-w-[1100px] flex-col gap-12 px-6 pb-20 lg:flex-row lg:items-start lg:justify-between lg:px-10;
	}

	.hero-content {
		@apply flex-1 space-y-6;
	}

	.hero-breadcrumb {
		@apply mb-6 inline-flex items-center text-xs font-semibold tracking-[0.25em] text-(--color-primary-medium,#4a5568) uppercase;
	}

	.hero-content h1 {
		@apply text-4xl font-semibold md:text-5xl;
	}

	.hero-content p {
		@apply text-base leading-relaxed text-(--color-primary-medium,#4a5568) md:text-lg;
	}

	.hero-actions {
		@apply flex flex-wrap gap-5;
	}

	.hero-primary {
		@apply inline-flex items-center justify-center rounded-full bg-linear-to-r from-(--color-primary-soft-blue,#2563eb) to-(--color-gradient-purple-mid,#6366f1) px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-15px_rgba(37,99,235,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(79,70,229,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary-soft-blue,#2563eb);
	}

	.hero-secondary {
		@apply inline-flex items-center justify-center rounded-full border border-transparent bg-white px-6 py-3 text-sm font-semibold text-(--color-primary-soft-blue,#1d4ed8) shadow-[0_16px_32px_-18px_rgba(15,23,42,0.25)] transition-all duration-200 hover:-translate-y-1 hover:bg-(--color-primary-soft-blue,#2563eb) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white;
	}

	.hero-tertiary {
		@apply inline-flex items-center justify-center rounded-full border border-white/70 bg-white/30 px-6 py-3 text-sm font-semibold text-(--color-primary-dark,#0f172a) backdrop-blur hover:bg-white/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white;
	}

	.hero-content p a {
		@apply text-(--color-primary-soft-blue,#2563eb) underline-offset-4 transition-colors duration-200 hover:text-(--color-gradient-purple-mid,#764ba2);
	}

	.hero-stats {
		@apply grid flex-1 gap-6 sm:grid-cols-2;
	}

	.cross-links {
		@apply mx-auto w-full max-w-[1100px] px-6;
	}

	.cross-links-grid {
		@apply mt-12 grid gap-8 md:grid-cols-2;
	}

	.cross-card {
		@apply flex h-full flex-col gap-4 rounded-3xl border border-white/60 bg-white/95 p-7 shadow-[0_24px_60px_-40px_rgba(37,99,235,0.22)] backdrop-blur-[18px];
	}

	.cross-card h3 {
		@apply text-xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.cross-card p {
		@apply flex-1 text-sm leading-relaxed text-(--color-primary-medium,#4a5568);
	}

	.cross-card-link {
		@apply inline-flex items-center gap-2 rounded-full bg-(--color-primary-soft-blue,#2563eb)/12 px-5 py-2.5 text-sm font-semibold text-(--color-primary-soft-blue,#1d4ed8) no-underline shadow-[0_14px_28px_-18px_rgba(37,99,235,0.4)] transition-all duration-200 hover:-translate-y-1 hover:bg-(--color-primary-soft-blue,#2563eb) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary-soft-blue,#2563eb);
	}

	.cross-card-link::after {
		content: '→';
		@apply text-base transition-transform duration-200;
	}

	.cross-card-link:hover::after {
		@apply translate-x-0.5;
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
		@apply grid gap-8 md:grid-cols-2;
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
		@apply grid gap-8 md:grid-cols-2;
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

	.support-grid {
		@apply grid gap-8 md:grid-cols-2;
	}

	.support-card {
		@apply flex h-full items-start gap-5 rounded-3xl border border-(--color-primary-soft-blue,#2563eb)/15 bg-white/95 p-7 shadow-[0_24px_60px_-44px_rgba(37,99,235,0.28)] transition-transform duration-200 hover:-translate-y-1;
	}

	.support-icon {
		@apply flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-primary-soft-blue,#2563eb)/10 text-2xl;
	}

	.support-copy h3 {
		@apply text-lg font-semibold;
	}

	.support-copy p {
		@apply text-sm leading-relaxed text-(--color-primary-medium,#4a5568);
	}

	.model-grid {
		@apply grid gap-8 md:grid-cols-3;
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
		@apply mt-8 flex flex-wrap gap-4;
	}

	.faq-grid {
		@apply grid gap-8 md:grid-cols-2;
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
		@apply grid gap-6 rounded-[36px] border border-white/40 bg-linear-to-br from-(--color-gradient-purple-start,#667eea) via-(--color-gradient-purple-mid,#764ba2) to-(--color-gradient-purple-end,#a855f7) p-12 text-white shadow-[0_25px_70px_rgba(76,29,149,0.35)] lg:grid-cols-[1.25fr,0.75fr] lg:items-center;
	}

	.cta-card h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.cta-card p {
		@apply mt-4 text-base leading-relaxed text-white/90 md:text-lg;
	}

	.cta-content {
		@apply flex flex-col gap-5;
	}

	.cta-list {
		@apply mt-2 flex flex-col gap-2 text-sm text-white/85 md:text-base;
	}

	.cta-list li {
		@apply relative pl-6;
	}

	.cta-list li::before {
		content: '•';
		@apply absolute left-0 text-lg text-white/80;
	}

	.cta-actions {
		@apply flex flex-col gap-3 rounded-[28px] bg-white/10 p-6 backdrop-blur-md md:flex-row md:items-center md:justify-end md:bg-transparent md:p-0;
	}

	.cta-actions .cta-primary,
	.cta-actions .cta-secondary {
		@apply px-6 py-4;
	}

	.cta-primary {
		@apply inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-(--color-gradient-purple-end,#7c3aed) shadow-[0_20px_45px_-20px_rgba(255,255,255,0.65)] transition-all duration-200 hover:-translate-y-1 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white;
	}

	.cta-secondary {
		@apply inline-flex items-center justify-center rounded-full border border-white/75 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white;
	}

	.partnership-header.align-left {
		@apply mr-auto ml-0 items-start text-left;
	}

	@media (max-width: 768px) {
		.kemitraan-page {
			@apply gap-22 pb-28;
		}

		.partnership-header {
			@apply mb-10 gap-3;
		}

		.hero {
			@apply pt-24;
		}

		.hero-container {
			@apply gap-8 px-5;
		}

		.hero-content {
			@apply space-y-5;
		}

		.hero-content h1 {
			@apply text-3xl;
		}

		.hero-actions {
			@apply gap-4;
		}

		.hero-breadcrumb {
			@apply mb-6;
		}

		.hero-stats {
			@apply grid-cols-1;
		}

		.cross-links-grid,
		.benefits-grid,
		.program-grid,
		.model-grid,
		.support-grid,
		.faq-grid {
			@apply grid-cols-1 gap-6;
		}

		.timeline {
			@apply gap-6;
		}

		.timeline-cta {
			@apply gap-3;
		}

		.cta-card {
			@apply p-9;
		}
	}

	@media (max-width: 640px) {
		.kemitraan-page {
			@apply gap-16 pb-20;
		}

		.partnership-header {
			@apply mb-9 gap-3;
		}

		.hero-content {
			@apply space-y-5;
		}

		.hero-content h1 {
			@apply text-[1.875rem] leading-snug;
		}

		.hero-content p,
		.section-intro,
		.hero-actions {
			@apply flex-col gap-3;
		}

		.hero-actions a {
			@apply w-full justify-center;
		}

		.stat-card,
		.cross-card,
		.program-card,
		.model-card,
		.support-card,
		.faq-card {
			@apply p-6;
		}

		.timeline-item {
			@apply flex-col gap-3 p-6;
		}

		.timeline-cta {
			@apply flex-col gap-3;
		}

		.timeline-cta a {
			@apply w-full justify-center;
		}

		.cta-card {
			@apply p-7;
		}

		.cta-card .cta-actions {
			@apply flex-col gap-3;
		}

		.cta-card .cta-actions a {
			@apply w-full justify-center;
		}
	}
</style>
