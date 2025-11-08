<script lang="ts">
	const contactEmail = 'mailto:partnership@konxc.id';
	const aboutLink = '/tentang';

	const heroHighlights = [
		{
			label: 'Kemitraan Aktif',
			value: '15+ sekolah',
			description: 'Telah menjalankan pilot bersama Naik Kelas & Klub Fisika'
		},
		{
			label: 'Durasi Fleksibel',
			value: '2 – 4 bulan',
			description: 'Bisa dimulai dari pilot setengah semester hingga kontrak penuh'
		},
		{
			label: 'Mode Belajar',
			value: 'On-site & Online',
			description: 'Disesuaikan dengan fasilitas sekolah & preferensi siswa'
		}
	] as const;

	const exploreLinks = [
		{
			title: 'Detail Alur Kemitraan',
			description:
				'Pelajari langkah implementasi, model bisnis, dan kebutuhan operasional pihak sekolah secara menyeluruh.',
			href: '/kemitraan',
			cta: 'Baca alur lengkap'
		},
		{
			title: 'Paket Les & Ekstrakurikuler',
			description:
				'Lihat opsi bimbel dan ekstra, fasilitas yang didapatkan, serta estimasi biaya per kelas atau per siswa.',
			href: '/paket-les',
			cta: 'Lihat paket & biaya'
		}
	] as const;

	const benefits = [
		{
			title: 'Mentor Terlatih',
			description:
				'Tim pengajar direkrut dan dilatih bersama Yayasan Klub Fisika, memahami kurikulum nasional dan budaya sekolah.'
		},
		{
			title: 'Selaras Kurikulum Merdeka',
			description:
				'Modul mengacu pada capaian pembelajaran Kurikulum Merdeka dengan diferensiasi tugas dan asesmen formatif.'
		},
		{
			title: 'Laporan Berkala',
			description:
				'Setiap periode disertai presensi, progres kompetensi, dan rekomendasi tindak lanjut untuk siswa maupun orang tua.'
		},
		{
			title: 'Operasional Mudah',
			description:
				'Tim kami membantu sosialisasi, administrasi pendaftaran, hingga dokumentasi showcase agar sekolah dapat fokus pada hasil.'
		}
	] as const;

	const programPackages = [
		{
			name: 'Les/Bimbel Matematika & Bahasa Inggris',
			target: 'SD – SMP',
			format: 'On-site atau Online, 4 sesi per bulan',
			price: 'Mulai Rp 1,2 – 2,2 juta / kelas / bulan',
			notes: ['≤25 siswa per kelas', 'Termasuk modul & evaluasi bulanan'],
			includes: [
				'Silabus tematik & worksheet mingguan',
				'Pre- & post-test sederhana',
				'Clinic tambahan opsional',
				'Sesi konsultasi orang tua'
			]
		},
		{
			name: 'Ekstrakurikuler Desain Digital',
			target: 'SD kelas tinggi – SMP',
			format: 'Project-based, 4 sesi per bulan',
			price: 'Rp 1,8 – 2,8 juta / kelas / bulan',
			notes: ['Tools gratis/open-source', 'Portfolio digital siswa'],
			includes: [
				'Workshop desain & storytelling visual',
				'Review karya individual',
				'Mini-exhibition akhir periode',
				'Sertifikat opsional'
			]
		},
		{
			name: 'Ekstrakurikuler Robotik & Pemrograman Dasar',
			target: 'SD kelas tinggi – SMP',
			format: 'On-site lab / blended, 4 sesi per bulan',
			price: 'Rp 2,2 – 6,0 juta / kelas / bulan',
			notes: ['Opsional sewa kit robotik', 'Mentor industri & fasilitator lokal'],
			includes: [
				'Modul Scratch → Python dasar',
				'Toolkit robotik & maintenance ringan',
				'Showcase / kompetisi internal',
				'Laporan capaian kompetensi STEM'
			]
		}
	] as const;

	const partnershipModels = [
		{
			title: 'Fee per Siswa / Seat',
			description:
				'Biaya dihitung per siswa per periode (2–4 bulan). Cocok untuk sekolah yang ingin menjaga margin internal.',
			details: [
				'Seat minimum 20 siswa',
				'Diskon enrolmen massal',
				'Cocok untuk pilot & kelas reguler'
			]
		},
		{
			title: 'Revenue Sharing',
			description:
				'Pendapatan kelas dibagi sesuai kesepakatan (mis. 60:40 atau 70:30). Ideal untuk kolaborasi pemasaran bersama.',
			details: [
				'Persentase fleksibel',
				'Tim gabungan untuk promosi',
				'Transparansi laporan keuangan'
			]
		},
		{
			title: 'Hybrid Custom',
			description:
				'Kombinasi fee dasar + sharing berdasarkan performa. Cocok untuk program flagship dan ekspansi lintas cabang.',
			details: ['Penyesuaian SLA', 'Opsional white-label', 'Dukungan co-branding']
		}
	] as const;

	const steps = [
		{
			step: '01',
			title: 'Kontak Awal',
			description: 'Sekolah menghubungi tim kemitraan untuk sharing kebutuhan program & timeline.'
		},
		{
			step: '02',
			title: 'Proposal & MoU',
			description:
				'Kami susun desain program, model bisnis, dan proyeksi biaya. Setelah disepakati, lanjut ke MoU.'
		},
		{
			step: '03',
			title: 'Pilot Program',
			description:
				'Periode uji coba 4–8 sesi dengan evaluasi awal. Cocok untuk validasi format kelas dan feedback komunitas.'
		},
		{
			step: '04',
			title: 'Implementasi Penuh',
			description:
				'Program berjalan sesuai jadwal, lengkap dengan mentor, modul, dan laporan berkala ke sekolah & orang tua.'
		},
		{
			step: '05',
			title: 'Evaluasi & Scale-up',
			description:
				'Review hasil, guardrail KPI, dan diskusi pengembangan batch berikutnya maupun perluasan topik.'
		}
	] as const;

	const deliverables = [
		'Modul pembelajaran & RPP singkat per topik',
		'Presensi siswa & dashboard progres',
		'Laporan evaluasi bulanan (kualitatif & kuantitatif)',
		'Showcase / demo day akhir periode',
		'Sertifikat partisipasi atau kompetensi (opsional)',
		'Materi komunikasi orang tua & dokumentasi publikasi'
	] as const;

	const postContactFlow = [
		'Diskusi kebutuhan selama 30–45 menit via WhatsApp atau Google Meet untuk memetakan tujuan program.',
		'Pengiriman proposal & MoU awal (≤3 hari kerja) lengkap dengan opsi biaya dan timeline.',
		'Sesi pilot / showcase mini untuk validasi pengalaman belajar bersama siswa & orang tua.',
		'Implementasi penuh dengan akses dashboard monitoring untuk tim sekolah.',
		'Evaluasi triwulan dan rekomendasi scale-up / ekspansi topik.'
	] as const;

	const faqs = [
		{
			question: 'Berapa minimal jumlah siswa untuk memulai program?',
			answer:
				'Minimal satu kelas (20–25 siswa). Untuk pilot bisa digabung lintas jenjang atau dibuat kelas kecil dengan penyesuaian biaya.'
		},
		{
			question: 'Apakah sekolah perlu menyiapkan perangkat khusus?',
			answer:
				'Untuk robotik & coding, kami menyediakan opsi sewa kit dan laptop. Sekolah cukup menyiapkan ruang praktik dan koneksi internet.'
		},
		{
			question: 'Bagaimana skema pembayaran program?',
			answer:
				'Bisa per bulan atau per periode (setengah / satu semester) dengan termin 50% - 25% - 25%. Revenue sharing dicairkan sesuai laporan bulanan.'
		},
		{
			question: 'Apakah kurikulumnya dapat disesuaikan?',
			answer:
				'Ya, kami menyesuaikan dengan kebutuhan sekolah, target capaian, dan agenda internal seperti pameran atau lomba.'
		}
	] as const;
</script>

<svelte:head>
	<title>Kemitraan Sekolah Naik Kelas</title>
	<meta
		name="description"
		content="Program kemitraan sekolah Naik Kelas by Koneksi bersama Yayasan Klub Fisika: bimbel, ekstrakurikuler STEM, model bisnis fleksibel, dan laporan perkembangan lengkap."
	/>
</svelte:head>

<main class="partnership-page">
	<section class="hero">
		<div class="hero-content">
			<div class="hero-text">
				<nav class="breadcrumb" aria-label="Breadcrumb">
					<a href="/">Beranda</a>
					<span aria-hidden="true">/</span>
					<span aria-current="page">Kemitraan Sekolah</span>
				</nav>
				<h1>Kemitraan Sekolah Naik Kelas</h1>
				<p>
					Naik Kelas by Koneksi bersama Yayasan Klub Fisika membantu sekolah menghadirkan bimbingan
					belajar dan ekstrakurikuler STEM yang relevan, terukur, serta terintegrasi dengan
					Kurikulum Merdeka. Halaman ini adalah pintu masuk sebelum mengeksplor detail alur di
					halaman kemitraan dan paket pembelajaran kami.
				</p>
				<div class="hero-actions">
					<a class="btn-primary" href={contactEmail} aria-label="Hubungi admin kemitraan via email">
						Hubungi Admin
					</a>
					<a
						class="btn-secondary"
						href="/kemitraan"
						aria-label="Pelajari alur kemitraan secara lengkap"
					>
						Pelajari Detail Program
					</a>
					<a class="btn-ghost" href={aboutLink} aria-label="Pelajari tentang Naik Kelas">
						Tentang Naik Kelas
					</a>
				</div>
			</div>
			<div class="hero-highlight-grid" role="list">
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

	<section class="explore section-block" aria-labelledby="explore-title">
		<header class="section-header items-center text-center">
			<h2 id="explore-title">Eksplor Lebih Lanjut</h2>
			<p>
				Setelah memahami gambaran besar ini, telusuri detail alur kemitraan dan paket belajar untuk
				menemukan cocoknya program dengan sumber daya sekolah Anda.
			</p>
		</header>
		<div class="explore-grid" role="list">
			{#each exploreLinks as link}
				<article class="explore-card" role="listitem">
					<h3>{link.title}</h3>
					<p>{link.description}</p>
					<a class="explore-link" href={link.href}>
						{link.cta}
					</a>
				</article>
			{/each}
		</div>
	</section>

	<section class="benefits section-block" aria-labelledby="benefits-title">
		<header class="section-header items-center text-center">
			<h2 id="benefits-title">Mengapa Sekolah Bermitra dengan Naik Kelas?</h2>
			<p>
				Kami menyediakan dukungan ujung ke ujung, mulai dari perencanaan program, rekrutmen mentor,
				hingga laporan hasil belajar yang siap dibagikan ke pemangku kepentingan sekolah.
			</p>
		</header>
		<div class="card-grid" role="list">
			{#each benefits as benefit}
				<article class="info-card" role="listitem">
					<h3>{benefit.title}</h3>
					<p>{benefit.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="programs section-block" aria-labelledby="programs-title">
		<header class="section-header items-center text-center">
			<h2 id="programs-title">Pilihan Program & Estimasi Harga</h2>
			<p>
				Setiap paket mencakup modul siap pakai, mentor tersertifikasi, dan laporan perkembangan.
				Besaran biaya bisa disesuaikan dengan jumlah kelas dan layanan tambahan.
			</p>
		</header>
		<div class="program-grid" role="list">
			{#each programPackages as program}
				<article class="program-card" role="listitem">
					<header>
						<h3>{program.name}</h3>
						<p class="program-target">{program.target}</p>
					</header>
					<div class="program-meta">
						<span>{program.format}</span>
						<strong>{program.price}</strong>
					</div>
					<ul class="program-notes">
						{#each program.notes as note}
							<li>{note}</li>
						{/each}
					</ul>
					<div class="program-includes">
						<h4>Termasuk:</h4>
						<ul>
							{#each program.includes as include}
								<li>{include}</li>
							{/each}
						</ul>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="models section-block" aria-labelledby="models-title">
		<header class="section-header items-center text-center">
			<h2 id="models-title">Model Kerjasama yang Fleksibel</h2>
			<p>
				Pilih struktur biaya sesuai kebutuhan sekolah. Kami terbiasa bekerja dengan sistem fee per
				siswa, revenue sharing, maupun format hybrid untuk program flagship.
			</p>
		</header>
		<div class="card-grid" role="list">
			{#each partnershipModels as model}
				<article class="info-card" role="listitem">
					<h3>{model.title}</h3>
					<p>{model.description}</p>
					<ul>
						{#each model.details as detail}
							<li>{detail}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section class="timeline section-block" aria-labelledby="timeline-title">
		<header class="section-header items-center text-center">
			<h2 id="timeline-title">Alur Kemitraan</h2>
			<p>
				Kami mendampingi sekolah di setiap tahap, memastikan transisi dari pilot ke implementasi
				penuh berjalan mulus dengan KPI yang disepakati bersama.
			</p>
		</header>
		<div class="timeline-grid" role="list">
			{#each steps as step}
				<div class="timeline-card" role="listitem">
					<span class="timeline-step">{step.step}</span>
					<h3>{step.title}</h3>
					<p>{step.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="deliverables section-block" aria-labelledby="deliverables-title">
		<header class="section-header items-center text-center">
			<h2 id="deliverables-title">Deliverables yang Diterima Sekolah</h2>
			<p>
				Setiap program didesain agar sekolah dapat langsung memanfaatkan hasilnya untuk pelaporan
				internal, akreditasi, maupun publikasi ke orang tua.
			</p>
		</header>
		<ul class="deliverables-list">
			{#each deliverables as item}
				<li>{item}</li>
			{/each}
		</ul>
	</section>

	<section class="next-steps section-block" aria-labelledby="next-steps-title">
		<header class="section-header items-center text-center">
			<h2 id="next-steps-title">Apa yang Terjadi Setelah Hubungi Kami?</h2>
			<p>
				Kami memastikan prosesnya ringan dan transparan. Berikut gambaran singkat perjalanan dari
				sesi konsultasi hingga pemberian akses dashboard pengawasan sekolah.
			</p>
		</header>
		<ul class="next-steps-list">
			{#each postContactFlow as item}
				<li>{item}</li>
			{/each}
		</ul>
	</section>

	<section class="faq section-block" aria-labelledby="faq-title">
		<header class="section-header items-center text-center">
			<h2 id="faq-title">Pertanyaan yang Sering Diajukan</h2>
			<p>
				Jika ada pertanyaan tambahan terkait kebutuhan khusus sekolah atau skema pembiayaan, tim
				kami siap membantu.
			</p>
		</header>
		<div class="faq-grid" role="list">
			{#each faqs as faqItem}
				<article class="faq-card" role="listitem">
					<h3>{faqItem.question}</h3>
					<p>{faqItem.answer}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="contact-cta section-block">
		<div class="cta-card">
			<h2>Mulai Kolaborasi dengan Naik Kelas</h2>
			<p>
				Kirimkan kebutuhan sekolah Anda dan tim kami akan menyiapkan proposal dalam 3 hari kerja.
				Setelah konsultasi, kami bantu finalisasi MoU, menjalankan pilot, serta menyiapkan akses
				dashboard monitoring untuk tim sekolah.
			</p>
			<div class="cta-actions">
				<a class="btn-primary" href={contactEmail} aria-label="Kirim email ke admin kemitraan">
					Hubungi Admin
				</a>
				<a class="btn-secondary" href={aboutLink} aria-label="Pelajari tentang Naik Kelas">
					Tentang Naik Kelas
				</a>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	@reference "../../app.css";

	.partnership-page {
		@apply flex flex-col gap-28 bg-(--color-bg-light,#f1f5ff) pt-12 pb-36 text-(--color-primary-dark,#0f172a);
		min-height: 100vh;
	}

	.section-block {
		@apply mx-auto w-full max-w-[1120px] px-6;
	}

	.section-header {
		@apply mx-auto mb-12 flex max-w-[840px] flex-col gap-4 text-center text-balance;
	}

	.section-header h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.section-header p {
		@apply text-base leading-relaxed text-(--color-primary-medium,#334155) md:text-lg;
	}

	.hero {
		@apply mx-auto w-full max-w-[1120px] px-6;
	}

	.hero-content {
		@apply relative grid overflow-hidden rounded-[36px] border border-white/40 bg-linear-to-br from-white/90 via-white/80 to-white/90 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-[30px] md:grid-cols-[1.1fr,0.9fr] md:gap-12;
	}

	.hero-content::after {
		content: '';
		position: absolute;
		inset: -20%;
		background:
			radial-gradient(circle at 15% 20%, rgba(96, 165, 250, 0.4), transparent 60%),
			radial-gradient(circle at 80% 30%, rgba(236, 72, 153, 0.25), transparent 60%);
		opacity: 0.5;
		z-index: 0;
	}

	.hero-text,
	.hero-highlight-grid {
		@apply relative z-10;
	}

	.hero-text h1 {
		@apply text-4xl leading-tight font-semibold text-balance text-(--color-primary-dark,#0f172a) md:text-5xl;
	}

	.hero-text p {
		@apply mt-5 text-lg leading-relaxed text-(--color-primary-medium,#334155) md:text-xl;
	}

	.hero-actions {
		@apply mt-8 flex flex-wrap gap-5;
	}

	.btn-primary {
		@apply inline-flex items-center justify-center rounded-2xl bg-linear-to-br from-(--color-gradient-purple-start,#667eea) via-(--color-gradient-purple-mid,#764ba2) to-(--color-gradient-purple-end,#a855f7) px-6 py-4 text-base font-semibold text-white shadow-(--color-gradient-purple-start,#667eea)/25 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:-translate-y-0.5 focus:shadow-xl;
	}

	.btn-secondary {
		@apply inline-flex items-center justify-center rounded-2xl border border-(--color-gradient-purple-start,#667eea)/40 bg-white/70 px-6 py-4 text-base font-semibold text-(--color-gradient-purple-mid,#764ba2) shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-(--color-gradient-purple-start,#667eea)/60 hover:bg-white focus:-translate-y-0.5;
	}

	.btn-ghost {
		@apply inline-flex items-center justify-center rounded-2xl border border-white/50 bg-white/30 px-6 py-4 text-base font-semibold text-(--color-primary-dark,#0f172a) transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60 focus:-translate-y-0.5;
	}

	.hero-highlight-grid {
		@apply grid gap-5 sm:grid-cols-2;
	}

	.highlight-card {
		@apply rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)] backdrop-blur-[20px];
	}

	.highlight-label {
		@apply text-sm font-medium tracking-[0.2em] text-(--color-primary-medium,#334155) uppercase;
	}

	.highlight-value {
		@apply mt-3 block text-2xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.highlight-card p {
		@apply mt-2 text-sm text-(--color-primary-medium,#334155);
	}

	.breadcrumb {
		@apply mb-6 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-(--color-primary-medium,#334155)/80 uppercase;
	}

	.breadcrumb a {
		@apply text-(--color-gradient-purple-mid,#764ba2) no-underline transition-colors duration-200 hover:text-(--color-gradient-purple-start,#667eea);
	}

	.card-grid {
		@apply mt-12 grid gap-8 md:grid-cols-2;
	}

	.explore-grid {
		@apply mt-12 grid gap-8 md:grid-cols-2;
	}

	.explore-card {
		@apply flex h-full flex-col gap-4 rounded-[26px] border border-white/60 bg-white/90 p-7 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-[22px];
	}

	.explore-card h3 {
		@apply text-xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.explore-card p {
		@apply flex-1 text-sm leading-relaxed text-(--color-primary-medium,#334155);
	}

	.explore-link {
		@apply inline-flex items-center gap-2 text-sm font-semibold text-(--color-gradient-purple-mid,#764ba2) no-underline transition-transform duration-200 hover:translate-x-1 hover:text-(--color-gradient-purple-start,#667eea);
	}

	.info-card {
		@apply rounded-[28px] border border-white/60 bg-white/90 p-8 text-left shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[25px];
	}

	.info-card h3 {
		@apply text-xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.info-card p {
		@apply mt-3 text-sm leading-relaxed text-(--color-primary-medium,#334155);
	}

	.info-card ul {
		@apply mt-4 flex flex-col gap-2 text-sm text-(--color-primary-medium,#334155);
	}

	.program-grid {
		@apply mt-12 grid gap-8 md:grid-cols-3;
	}

	.program-card {
		@apply flex h-full flex-col gap-6 rounded-[30px] border border-white/60 bg-white/90 p-8 shadow-[0_22px_55px_rgba(15,23,42,0.1)] backdrop-blur-[25px];
	}

	.program-card h3 {
		@apply text-xl font-semibold text-(--color-primary-dark,#0f172a);
	}

	.program-target {
		@apply mt-1 text-sm font-medium tracking-[0.18em] text-(--color-primary-medium,#334155) uppercase;
	}

	.program-meta {
		@apply flex flex-col gap-2 rounded-2xl bg-(--color-primary-soft-blue,#60a5fa)/10 p-4 text-sm text-(--color-primary-dark,#0f172a);
	}

	.program-meta strong {
		@apply text-base font-semibold;
	}

	.program-notes {
		@apply flex flex-col gap-3 text-sm leading-relaxed text-(--color-primary-medium,#334155);
	}

	.program-includes h4 {
		@apply text-sm font-semibold tracking-wide text-(--color-primary-dark,#0f172a) uppercase;
	}

	.program-includes ul {
		@apply mt-2 flex flex-col gap-3 text-sm text-(--color-primary-medium,#334155);
	}

	.timeline-grid {
		@apply mt-12 grid gap-6 md:grid-cols-5;
	}

	.timeline-card {
		@apply relative flex flex-col gap-4 rounded-[26px] border border-white/50 bg-white/90 p-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-[20px];
	}

	.timeline-step {
		@apply inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--color-gradient-purple-start,#667eea)/15 text-sm font-semibold text-(--color-gradient-purple-mid,#764ba2);
	}

	.timeline-card h3 {
		@apply text-lg font-semibold text-(--color-primary-dark,#0f172a);
	}

	.timeline-card p {
		@apply text-sm text-(--color-primary-medium,#334155);
	}

	.deliverables-list {
		@apply mt-12 grid gap-4 rounded-[28px] border border-white/60 bg-white/90 p-8 text-(--color-primary-medium,#334155) shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-[22px];
	}

	.deliverables-list li {
		@apply relative pl-6 text-sm leading-relaxed;
	}

	.deliverables-list li::before {
		content: '•';
		@apply absolute left-0 text-lg text-(--color-gradient-purple-mid,#764ba2);
	}

	.next-steps-list {
		@apply mt-12 grid gap-4 rounded-[28px] border border-white/60 bg-white/90 p-8 text-(--color-primary-medium,#334155) shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-[22px];
	}

	.next-steps-list li {
		@apply relative pl-7 text-sm leading-relaxed;
	}

	.next-steps-list li::before {
		content: '↗';
		@apply absolute top-1 left-0 text-base text-(--color-gradient-purple-start,#667eea);
	}

	.faq-grid {
		@apply mt-12 grid gap-8 md:grid-cols-2;
	}

	.faq-card {
		@apply rounded-[26px] border border-white/60 bg-white/90 p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[20px];
	}

	.faq-card h3 {
		@apply text-lg font-semibold text-(--color-primary-dark,#0f172a);
	}

	.faq-card p {
		@apply mt-3 text-sm text-(--color-primary-medium,#334155);
	}

	.cta-card {
		@apply mx-auto max-w-[960px] rounded-[36px] border border-white/60 bg-linear-to-br from-(--color-gradient-purple-start,#667eea) via-(--color-gradient-purple-mid,#764ba2) to-(--color-gradient-purple-end,#a855f7) p-12 text-white shadow-[0_35px_90px_rgba(76,29,149,0.32)];
	}

	.cta-card h2 {
		@apply text-3xl font-semibold md:text-4xl;
	}

	.cta-card p {
		@apply mt-4 text-base leading-relaxed md:text-lg md:leading-relaxed;
	}

	.cta-actions {
		@apply mt-10 flex flex-wrap gap-5;
	}

	@media (max-width: 960px) {
		.program-grid {
			@apply md:grid-cols-2;
		}

		.timeline-grid {
			@apply grid-cols-1 md:grid-cols-3;
		}
	}

	@media (max-width: 768px) {
		.partnership-page {
			@apply gap-20 pt-20 pb-28;
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

		.explore-grid,
		.card-grid,
		.program-grid,
		.timeline-grid,
		.faq-grid {
			@apply gap-6;
		}

		.cta-card {
			@apply p-9;
		}
	}

	@media (max-width: 640px) {
		.partnership-page {
			@apply gap-14 pt-8 pb-20;
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
			@apply flex-col;
		}

		.hero-actions a {
			@apply w-full justify-center;
		}

		.highlight-card {
			@apply p-5;
		}

		.explore-grid,
		.card-grid,
		.program-grid,
		.timeline-grid,
		.faq-grid {
			@apply gap-5;
		}

		.program-card,
		.explore-card,
		.info-card,
		.timeline-card,
		.faq-card {
			@apply p-6;
		}

		.program-meta {
			@apply gap-2 p-3;
		}

		.deliverables-list,
		.next-steps-list {
			@apply gap-3 p-6;
		}

		.cta-card {
			@apply p-7;
		}

		.cta-actions {
			@apply flex-col gap-3;
		}

		.cta-actions a {
			@apply w-full justify-center;
		}
	}
</style>
