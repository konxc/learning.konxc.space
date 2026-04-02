import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess, generateId } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
type MaterialInput = {
	type: 'video' | 'text' | 'link';
	url?: string;
	content?: string;
	durationMs?: number;
};

async function insertLesson(
	db: LibSQLDatabase<typeof schema>,
	id: string,
	moduleId: string,
	title: string,
	order: number,
	weekNumber: number,
	isFree: boolean,
	materials: MaterialInput[],
	quiz?: {
		title: string;
		passingScore: number;
		questions: {
			type: string;
			question: string;
			choices?: { text: string; isCorrect: boolean }[];
		}[];
	}
) {
	await db
		.insert(schema.lesson)
		.values({
			id,
			moduleId,
			title,
			order,
			weekNumber,
			isFree,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		.onConflictDoNothing();
	for (let i = 0; i < materials.length; i++) {
		const m = materials[i];
		await db
			.insert(schema.material)
			.values({
				id: generateId(),
				lessonId: id,
				type: m.type,
				url: m.url ?? null,
				content: m.content ?? null,
				order: i + 1,
				durationMs: m.durationMs ?? null,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.onConflictDoNothing();
	}
	if (quiz) {
		const quizId = generateId();
		await db
			.insert(schema.quiz)
			.values({
				id: quizId,
				lessonId: id,
				title: quiz.title,
				passingScore: quiz.passingScore,
				createdAt: new Date()
			})
			.onConflictDoNothing();
		for (let qi = 0; qi < quiz.questions.length; qi++) {
			const q = quiz.questions[qi];
			const qId = generateId();
			await db
				.insert(schema.quizQuestion)
				.values({
					id: qId,
					quizId,
					type: q.type,
					question: q.question,
					order: qi + 1,
					maxScore: 10
				})
				.onConflictDoNothing();
			if (q.choices) {
				for (const c of q.choices) {
					await db
						.insert(schema.quizChoice)
						.values({ id: generateId(), questionId: qId, text: c.text, isCorrect: c.isCorrect })
						.onConflictDoNothing();
				}
			}
		}
	}
}

// ─────────────────────────────────────────────
// COURSE 001 — Akselerasi Bisnis Digital
// ─────────────────────────────────────────────
async function seedCourse001(db: LibSQLDatabase<typeof schema>) {
	const cid = 'course-001';
	const mods = [
		{ id: 'c1m1', title: 'Fondasi Bisnis Digital', order: 1 },
		{ id: 'c1m2', title: 'Membangun Produk & Penawaran', order: 2 },
		{ id: 'c1m3', title: 'Strategi Pemasaran Digital', order: 3 },
		{ id: 'c1m4', title: 'Monetisasi & Scaling', order: 4 }
	];
	for (const m of mods)
		await db
			.insert(schema.module)
			.values({ ...m, courseId: cid, createdAt: new Date(), updatedAt: new Date() })
			.onConflictDoNothing();

	await insertLesson(
		db,
		'c1l1',
		'c1m1',
		'Mindset Pengusaha Digital',
		1,
		1,
		true,
		[
			{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 720000 },
			{
				type: 'text',
				content:
					'## Mindset Pengusaha Digital\n\nUntuk sukses di bisnis digital, kamu perlu membangun **growth mindset** — keyakinan bahwa kemampuan bisa dikembangkan melalui dedikasi dan kerja keras.\n\n### 3 Pilar Mindset:\n1. **Orientasi pada nilai** — Fokus memberikan nilai nyata kepada pelanggan\n2. **Eksperimen cepat** — Uji ide dengan cepat, pelajari dari kegagalan\n3. **Konsistensi jangka panjang** — Bisnis digital butuh waktu untuk tumbuh'
			}
		],
		{
			title: 'Quiz: Mindset Bisnis',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Apa yang dimaksud dengan growth mindset dalam konteks bisnis digital?',
					choices: [
						{ text: 'Keyakinan bahwa kemampuan bisa dikembangkan', isCorrect: true },
						{ text: 'Fokus hanya pada keuntungan jangka pendek', isCorrect: false },
						{ text: 'Menghindari risiko sebisa mungkin', isCorrect: false },
						{ text: 'Bekerja sendiri tanpa tim', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c1l2', 'c1m1', 'Riset Pasar & Validasi Ide', 2, 1, false, [
		{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 900000 },
		{
			type: 'text',
			content:
				'## Riset Pasar\n\nSebelum membangun produk, validasi dulu apakah ada pasar yang mau membeli.\n\n### Framework Validasi:\n- **Problem-Solution Fit**: Apakah produkmu memecahkan masalah nyata?\n- **Market Size**: Seberapa besar pasarnya?\n- **Willingness to Pay**: Apakah orang mau bayar?\n\n### Tools Riset:\n- Google Trends\n- Facebook Audience Insights\n- Tokopedia/Shopee search volume'
		}
	]);

	await insertLesson(db, 'c1l3', 'c1m2', 'Membuat Produk Digital Pertama', 1, 2, false, [
		{
			type: 'text',
			content:
				'## Produk Digital\n\nProduk digital adalah produk yang bisa didistribusikan secara online tanpa biaya produksi tambahan.\n\n### Jenis Produk Digital:\n1. **E-book** — Panduan, template, checklist\n2. **Online Course** — Video tutorial, webinar\n3. **Software/App** — Tools, plugin, template\n4. **Membership** — Komunitas eksklusif, konten premium\n\n### Langkah Membuat E-book:\n1. Pilih topik yang kamu kuasai\n2. Buat outline 10-15 bab\n3. Tulis 500-1000 kata per bab\n4. Design cover dengan Canva\n5. Export ke PDF'
		},
		{
			type: 'link',
			url: 'https://canva.com',
			content: 'Tool desain gratis untuk membuat cover e-book'
		}
	]);

	await insertLesson(
		db,
		'c1l4',
		'c1m2',
		'Pricing Strategy',
		2,
		2,
		false,
		[
			{
				type: 'text',
				content:
					'## Strategi Penetapan Harga\n\n### Model Pricing:\n- **Cost-plus pricing**: Harga pokok + margin\n- **Value-based pricing**: Berdasarkan nilai yang diterima pelanggan\n- **Competitive pricing**: Mengikuti harga kompetitor\n\n### Tips Pricing Produk Digital:\n- Jangan terlalu murah (persepsi kualitas rendah)\n- Tawarkan paket (basic, standard, premium)\n- Gunakan harga psikologis (Rp 297.000 vs Rp 300.000)'
			}
		],
		{
			title: 'Quiz: Pricing Strategy',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Apa keuntungan value-based pricing dibanding cost-plus pricing?',
					choices: [
						{ text: 'Harga lebih tinggi sesuai nilai yang diterima pelanggan', isCorrect: true },
						{ text: 'Lebih mudah dihitung', isCorrect: false },
						{ text: 'Selalu lebih murah dari kompetitor', isCorrect: false },
						{ text: 'Tidak perlu riset pasar', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c1l5', 'c1m3', 'Social Media Marketing Dasar', 1, 3, false, [
		{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 1080000 },
		{
			type: 'text',
			content:
				'## Social Media Marketing\n\n### Platform Utama:\n- **Instagram**: Visual, lifestyle, B2C\n- **TikTok**: Video pendek, viral, Gen Z\n- **LinkedIn**: B2B, profesional\n- **Facebook**: Semua segmen, ads powerful\n\n### Content Pillars:\n1. Educational (40%)\n2. Entertaining (30%)\n3. Promotional (20%)\n4. Personal/Behind the scenes (10%)'
		}
	]);

	await insertLesson(db, 'c1l6', 'c1m3', 'Email Marketing & Funnel', 2, 3, false, [
		{
			type: 'text',
			content:
				'## Email Marketing Funnel\n\n### Tahapan Funnel:\n1. **Awareness** — Orang tahu kamu ada\n2. **Interest** — Orang tertarik dengan kontenmu\n3. **Desire** — Orang ingin produkmu\n4. **Action** — Orang membeli\n\n### Lead Magnet Ideas:\n- Checklist gratis\n- Mini e-book\n- Template\n- Free webinar\n- Trial produk'
		}
	]);

	await insertLesson(db, 'c1l7', 'c1m4', 'Monetisasi Multiple Stream', 1, 4, false, [
		{
			type: 'text',
			content:
				'## Multiple Income Streams\n\n### 5 Cara Monetisasi Bisnis Digital:\n1. **Produk sendiri** — E-book, course, software\n2. **Affiliate marketing** — Komisi dari produk orang lain\n3. **Jasa/Freelance** — Konsultasi, coaching\n4. **Sponsorship** — Brand deal, iklan\n5. **Membership** — Komunitas berbayar\n\n### Prioritas:\nMulai dari 1-2 stream, kuasai dulu, baru tambah yang lain.'
		}
	]);

	await insertLesson(
		db,
		'c1l8',
		'c1m4',
		'Scaling & Automation',
		2,
		4,
		false,
		[
			{
				type: 'text',
				content:
					'## Scaling Bisnis Digital\n\n### Tools Automation:\n- **Zapier/Make** — Otomasi workflow\n- **Mailchimp/ConvertKit** — Email automation\n- **Buffer/Hootsuite** — Social media scheduling\n- **Chatbot** — Customer service otomatis\n\n### Kapan Mulai Scaling?\n- Revenue konsisten 3 bulan berturut-turut\n- Proses sudah terdokumentasi\n- Ada tim atau freelancer yang bisa dihandle'
			}
		],
		{
			title: 'Quiz Final: Bisnis Digital',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Apa tanda bisnis digital siap untuk di-scale?',
					choices: [
						{ text: 'Revenue konsisten dan proses terdokumentasi', isCorrect: true },
						{ text: 'Sudah punya 1000 followers', isCorrect: false },
						{ text: 'Sudah berjalan 1 bulan', isCorrect: false },
						{ text: 'Sudah punya website', isCorrect: false }
					]
				}
			]
		}
	);
}

// ─────────────────────────────────────────────
// COURSE 002 — Content Creator Mastery
// ─────────────────────────────────────────────
async function seedCourse002(db: LibSQLDatabase<typeof schema>) {
	const cid = 'course-002';
	const mods = [
		{ id: 'c2m1', title: 'Fondasi Content Creator', order: 1 },
		{ id: 'c2m2', title: 'Produksi Konten Video', order: 2 },
		{ id: 'c2m3', title: 'Growth & Monetisasi', order: 3 }
	];
	for (const m of mods)
		await db
			.insert(schema.module)
			.values({ ...m, courseId: cid, createdAt: new Date(), updatedAt: new Date() })
			.onConflictDoNothing();

	await insertLesson(
		db,
		'c2l1',
		'c2m1',
		'Niche & Personal Branding',
		1,
		1,
		true,
		[
			{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 840000 },
			{
				type: 'text',
				content:
					'## Menemukan Niche-mu\n\n### Formula Niche:\n**Passion + Skill + Market Demand = Niche Ideal**\n\n### Contoh Niche:\n- Keuangan untuk fresh graduate\n- Memasak sehat untuk ibu muda\n- Coding untuk pemula\n- Traveling budget\n\n### Personal Branding:\n- Konsisten dalam visual (warna, font, tone)\n- Punya "signature style"\n- Authentic — jadilah dirimu sendiri'
			}
		],
		{
			title: 'Quiz: Niche Selection',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Formula niche yang ideal adalah...',
					choices: [
						{ text: 'Passion + Skill + Market Demand', isCorrect: true },
						{ text: 'Followers + Engagement + Revenue', isCorrect: false },
						{ text: 'Konten + Platform + Jadwal', isCorrect: false },
						{ text: 'Kamera + Editing + Upload', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c2l2', 'c2m1', 'Content Strategy & Planning', 2, 1, false, [
		{
			type: 'text',
			content:
				'## Content Strategy\n\n### Content Calendar:\nRencanakan konten 2-4 minggu ke depan.\n\n### Jenis Konten:\n1. **Evergreen** — Selalu relevan, traffic jangka panjang\n2. **Trending** — Viral jangka pendek, boost reach\n3. **Series** — Konten bersambung, bangun loyal audience\n\n### Frekuensi Posting:\n- YouTube: 1-2x/minggu\n- Instagram: 3-5x/minggu\n- TikTok: 1-3x/hari\n- Blog: 2-4x/bulan'
		}
	]);

	await insertLesson(db, 'c2l3', 'c2m2', 'Setup Studio Sederhana', 1, 2, false, [
		{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 960000 },
		{
			type: 'text',
			content:
				'## Setup Studio Budget\n\n### Peralatan Minimal:\n- **Kamera**: Smartphone dengan kamera bagus (iPhone/Samsung flagship)\n- **Mikrofon**: Rode VideoMicro (~Rp 800rb) atau Boya BY-M1 (~Rp 200rb)\n- **Lighting**: Ring light 10 inch (~Rp 200-500rb) atau manfaatkan cahaya alami\n- **Background**: Tembok polos atau backdrop kain\n\n### Tips Lighting:\n- Hadap ke jendela untuk cahaya alami\n- Hindari backlight (cahaya dari belakang)\n- Gunakan diffuser untuk cahaya lembut'
		}
	]);

	await insertLesson(db, 'c2l4', 'c2m2', 'Editing Video dengan CapCut', 2, 2, false, [
		{
			type: 'text',
			content:
				'## Editing dengan CapCut\n\n### Workflow Editing:\n1. Import footage\n2. Potong bagian yang tidak perlu\n3. Tambah musik background\n4. Tambah teks/subtitle\n5. Color grading\n6. Export\n\n### Tips Editing:\n- Gunakan jump cut untuk menghilangkan jeda\n- Tambah B-roll untuk visual yang lebih menarik\n- Subtitle meningkatkan watch time 40%\n- Musik harus sesuai mood konten'
		},
		{
			type: 'link',
			url: 'https://www.capcut.com',
			content: 'Download CapCut — editor video gratis terbaik'
		}
	]);

	await insertLesson(
		db,
		'c2l5',
		'c2m3',
		'YouTube SEO & Algorithm',
		1,
		3,
		false,
		[
			{
				type: 'text',
				content:
					'## YouTube SEO\n\n### Faktor Ranking YouTube:\n1. **CTR (Click-Through Rate)** — Thumbnail & judul yang menarik\n2. **Watch Time** — Berapa lama orang menonton\n3. **Engagement** — Like, comment, share\n4. **Relevance** — Keyword di judul, deskripsi, tag\n\n### Riset Keyword:\n- TubeBuddy\n- VidIQ\n- Google Trends\n- YouTube Search Suggest\n\n### Formula Judul:\n[Angka/Kata Kuat] + [Keyword Utama] + [Benefit/Curiosity]'
			}
		],
		{
			title: 'Quiz: YouTube SEO',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Faktor terpenting untuk ranking YouTube adalah...',
					choices: [
						{ text: 'Watch time dan CTR', isCorrect: true },
						{ text: 'Jumlah subscriber', isCorrect: false },
						{ text: 'Frekuensi upload', isCorrect: false },
						{ text: 'Panjang video', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c2l6', 'c2m3', 'Monetisasi: AdSense, Sponsorship & Produk', 2, 3, false, [
		{
			type: 'text',
			content:
				'## Monetisasi Content Creator\n\n### 5 Sumber Income:\n1. **YouTube AdSense** — Rp 5.000-50.000 per 1000 views\n2. **Brand Sponsorship** — Rp 500rb - 50jt per konten\n3. **Affiliate Marketing** — 5-30% komisi per penjualan\n4. **Produk Sendiri** — Course, merchandise, e-book\n5. **Super Chat/Membership** — Dari loyal fans\n\n### Syarat Monetisasi YouTube:\n- 1.000 subscriber\n- 4.000 jam watch time dalam 12 bulan\n- Akun AdSense aktif'
		}
	]);
}

// ─────────────────────────────────────────────
// COURSE 003 — E-Commerce Success Blueprint
// ─────────────────────────────────────────────
async function seedCourse003(db: LibSQLDatabase<typeof schema>) {
	const cid = 'course-003';
	const mods = [
		{ id: 'c3m1', title: 'Memulai Bisnis E-Commerce', order: 1 },
		{ id: 'c3m2', title: 'Operasional & Manajemen', order: 2 },
		{ id: 'c3m3', title: 'Optimasi & Scaling', order: 3 }
	];
	for (const m of mods)
		await db
			.insert(schema.module)
			.values({ ...m, courseId: cid, createdAt: new Date(), updatedAt: new Date() })
			.onConflictDoNothing();

	await insertLesson(
		db,
		'c3l1',
		'c3m1',
		'Memilih Produk yang Tepat',
		1,
		1,
		true,
		[
			{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 780000 },
			{
				type: 'text',
				content:
					'## Riset Produk E-Commerce\n\n### Kriteria Produk Ideal:\n- Margin minimal 30%\n- Berat < 1 kg (hemat ongkir)\n- Tidak mudah rusak\n- Ada demand yang konsisten\n- Kompetisi tidak terlalu ketat\n\n### Tools Riset:\n- **Tokopedia**: Lihat produk terlaris per kategori\n- **Shopee**: Fitur "Terlaris" dan "Trending"\n- **Google Trends**: Tren pencarian\n- **Jungle Scout**: Riset produk Amazon (untuk ekspor)'
			}
		],
		{
			title: 'Quiz: Riset Produk',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Margin minimal yang ideal untuk produk e-commerce adalah...',
					choices: [
						{ text: '30%', isCorrect: true },
						{ text: '5%', isCorrect: false },
						{ text: '10%', isCorrect: false },
						{ text: '50%', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c3l2', 'c3m1', 'Setup Toko di Tokopedia & Shopee', 2, 1, false, [
		{
			type: 'text',
			content:
				'## Setup Toko Marketplace\n\n### Checklist Setup Toko:\n- [ ] Foto profil toko profesional\n- [ ] Deskripsi toko yang menarik\n- [ ] Kebijakan pengiriman jelas\n- [ ] Jam operasional diset\n- [ ] Metode pembayaran lengkap\n\n### Optimasi Listing Produk:\n1. Judul: Keyword + Brand + Spesifikasi\n2. Foto: Minimal 5 foto, background putih\n3. Deskripsi: Detail, manfaat, spesifikasi\n4. Harga: Kompetitif tapi profitable\n5. Stok: Selalu update'
		}
	]);

	await insertLesson(db, 'c3l3', 'c3m2', 'Manajemen Stok & Supplier', 1, 2, false, [
		{
			type: 'text',
			content:
				'## Manajemen Stok\n\n### Model Bisnis:\n1. **Stok sendiri** — Kontrol penuh, butuh modal\n2. **Dropship** — Tanpa stok, margin kecil\n3. **Pre-order** — Pesan dulu baru produksi\n4. **Konsinyasi** — Titip jual ke toko lain\n\n### Mencari Supplier:\n- Alibaba/1688 (impor dari China)\n- Pasar Tanah Abang (tekstil)\n- Pasar Gembrong (mainan)\n- Supplier lokal via Google/Instagram'
		}
	]);

	await insertLesson(db, 'c3l4', 'c3m2', 'Customer Service Excellence', 2, 2, false, [
		{
			type: 'text',
			content:
				'## Customer Service\n\n### Prinsip CS yang Baik:\n- Respon dalam 1 jam\n- Gunakan bahasa yang ramah\n- Selalu tawarkan solusi\n- Follow up setelah pembelian\n\n### Template Respon:\n**Komplain produk rusak:**\n"Halo Kak [nama], mohon maaf atas ketidaknyamanannya. Kami akan segera proses penggantian/refund. Bisa kirimkan foto produk yang rusak ke chat ini? Terima kasih atas kepercayaannya 🙏"'
		}
	]);

	await insertLesson(
		db,
		'c3l5',
		'c3m3',
		'Iklan Berbayar di Marketplace',
		1,
		3,
		false,
		[
			{
				type: 'text',
				content:
					'## Iklan Marketplace\n\n### Jenis Iklan Tokopedia:\n- **TopAds** — Produk muncul di halaman pertama\n- **Headline Ads** — Banner di halaman utama\n\n### Jenis Iklan Shopee:\n- **Shopee Ads** — Produk & toko\n- **Shopee Live** — Live streaming\n\n### Tips Iklan Efektif:\n- Mulai dengan budget kecil (Rp 50rb/hari)\n- Test 3-5 produk berbeda\n- Monitor ROAS (Return on Ad Spend)\n- Matikan iklan yang ROAS < 2x'
			}
		],
		{
			title: 'Quiz: Iklan Marketplace',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'ROAS minimal yang baik untuk iklan marketplace adalah...',
					choices: [
						{ text: '2x (setiap Rp 1 iklan menghasilkan Rp 2 penjualan)', isCorrect: true },
						{ text: '0.5x', isCorrect: false },
						{ text: '1x', isCorrect: false },
						{ text: '10x selalu', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c3l6', 'c3m3', 'Scaling ke Omnichannel', 2, 3, false, [
		{
			type: 'text',
			content:
				'## Omnichannel Strategy\n\n### Channel Penjualan:\n1. **Marketplace** — Tokopedia, Shopee, Lazada\n2. **Social Commerce** — TikTok Shop, Instagram Shop\n3. **Website sendiri** — Kontrol penuh, margin lebih tinggi\n4. **WhatsApp Business** — Direct selling\n5. **Offline** — Toko fisik, reseller\n\n### Prioritas Scaling:\n1. Kuasai 1 channel dulu\n2. Replikasi ke channel kedua\n3. Integrasikan dengan sistem manajemen terpusat'
		}
	]);
}

// ─────────────────────────────────────────────
// COURSE 005 — Python untuk Data Science
// ─────────────────────────────────────────────
async function seedCourse005(db: LibSQLDatabase<typeof schema>) {
	const cid = 'course-005';
	const mods = [
		{ id: 'c5m1', title: 'Python Fundamentals', order: 1 },
		{ id: 'c5m2', title: 'Data Manipulation dengan Pandas', order: 2 },
		{ id: 'c5m3', title: 'Visualisasi Data', order: 3 },
		{ id: 'c5m4', title: 'Machine Learning Dasar', order: 4 }
	];
	for (const m of mods)
		await db
			.insert(schema.module)
			.values({ ...m, courseId: cid, createdAt: new Date(), updatedAt: new Date() })
			.onConflictDoNothing();

	await insertLesson(
		db,
		'c5l1',
		'c5m1',
		'Pengenalan Python & Setup',
		1,
		1,
		true,
		[
			{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 900000 },
			{
				type: 'text',
				content:
					'## Python untuk Data Science\n\nPython adalah bahasa pemrograman paling populer untuk data science karena:\n- Sintaks yang mudah dibaca\n- Library yang lengkap (NumPy, Pandas, Scikit-learn)\n- Komunitas yang besar\n\n## Setup Environment\n\n```bash\n# Install Anaconda (recommended)\nhttps://www.anaconda.com/download\n\n# Atau install Python + pip\npython --version\npip install numpy pandas matplotlib scikit-learn jupyter\n```\n\n## Jupyter Notebook\nJalankan dengan: `jupyter notebook`'
			}
		],
		{
			title: 'Quiz: Python Basics',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Library Python yang digunakan untuk manipulasi data tabular adalah...',
					choices: [
						{ text: 'Pandas', isCorrect: true },
						{ text: 'NumPy', isCorrect: false },
						{ text: 'Matplotlib', isCorrect: false },
						{ text: 'Scikit-learn', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c5l2', 'c5m1', 'Tipe Data & Struktur Data Python', 2, 1, false, [
		{
			type: 'text',
			content:
				'## Tipe Data Python\n\n```python\n# Integer\nangka = 42\n\n# Float\ndecimal = 3.14\n\n# String\nnama = "Budi"\n\n# Boolean\naktif = True\n\n# List\nbuah = ["apel", "mangga", "jeruk"]\n\n# Dictionary\ndata = {"nama": "Budi", "umur": 25}\n\n# Tuple (immutable)\nkoordinat = (10, 20)\n```\n\n## List Comprehension\n```python\nkuadrat = [x**2 for x in range(10)]\nprint(kuadrat)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\n```'
		}
	]);

	await insertLesson(db, 'c5l3', 'c5m2', 'Pandas: DataFrame & Series', 1, 2, false, [
		{
			type: 'text',
			content:
				'## Pandas DataFrame\n\n```python\nimport pandas as pd\n\n# Membuat DataFrame\ndata = {\n    "nama": ["Budi", "Siti", "Ahmad"],\n    "nilai": [85, 92, 78],\n    "kota": ["Jakarta", "Bandung", "Surabaya"]\n}\ndf = pd.DataFrame(data)\n\n# Operasi dasar\nprint(df.head())      # 5 baris pertama\nprint(df.info())      # Info kolom\nprint(df.describe())  # Statistik deskriptif\n\n# Filter\ndf_jakarta = df[df["kota"] == "Jakarta"]\n\n# Groupby\ndf.groupby("kota")["nilai"].mean()\n```'
		}
	]);

	await insertLesson(
		db,
		'c5l4',
		'c5m2',
		'Data Cleaning & Preprocessing',
		2,
		2,
		false,
		[
			{
				type: 'text',
				content:
					'## Data Cleaning\n\n```python\n# Cek missing values\ndf.isnull().sum()\n\n# Isi missing values\ndf["nilai"].fillna(df["nilai"].mean(), inplace=True)\n\n# Hapus duplikat\ndf.drop_duplicates(inplace=True)\n\n# Rename kolom\ndf.rename(columns={"nama": "name"}, inplace=True)\n\n# Ubah tipe data\ndf["nilai"] = df["nilai"].astype(float)\n```'
			}
		],
		{
			title: 'Quiz: Pandas',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Method Pandas untuk mengisi nilai yang hilang (missing values) adalah...',
					choices: [
						{ text: 'fillna()', isCorrect: true },
						{ text: 'dropna()', isCorrect: false },
						{ text: 'replace()', isCorrect: false },
						{ text: 'clean()', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c5l5', 'c5m3', 'Visualisasi dengan Matplotlib & Seaborn', 1, 3, false, [
		{
			type: 'text',
			content:
				'## Visualisasi Data\n\n```python\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Line chart\nplt.plot([1,2,3,4], [10,20,15,25])\nplt.title("Penjualan Bulanan")\nplt.xlabel("Bulan")\nplt.ylabel("Penjualan")\nplt.show()\n\n# Bar chart\ndf["kota"].value_counts().plot(kind="bar")\n\n# Heatmap korelasi\nsns.heatmap(df.corr(), annot=True)\n```'
		}
	]);

	await insertLesson(
		db,
		'c5l6',
		'c5m4',
		'Machine Learning: Regresi Linear',
		1,
		4,
		false,
		[
			{
				type: 'text',
				content:
					'## Regresi Linear\n\n```python\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error\n\n# Split data\nX = df[["fitur1", "fitur2"]]\ny = df["target"]\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n# Train model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Prediksi\ny_pred = model.predict(X_test)\n\n# Evaluasi\nmse = mean_squared_error(y_test, y_pred)\nprint(f"MSE: {mse:.2f}")\n```'
			}
		],
		{
			title: 'Quiz: Machine Learning',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Fungsi train_test_split digunakan untuk...',
					choices: [
						{ text: 'Membagi data menjadi training dan testing set', isCorrect: true },
						{ text: 'Melatih model machine learning', isCorrect: false },
						{ type: 'text', text: 'Mengevaluasi performa model', isCorrect: false },
						{ text: 'Membersihkan data', isCorrect: false }
					] as any
				}
			]
		}
	);
}

// ─────────────────────────────────────────────
// COURSE 006 — Full Stack Web Development
// ─────────────────────────────────────────────
async function seedCourse006(db: LibSQLDatabase<typeof schema>) {
	const cid = 'course-006';
	const mods = [
		{ id: 'c6m1', title: 'HTML & CSS Fundamentals', order: 1 },
		{ id: 'c6m2', title: 'JavaScript Modern', order: 2 },
		{ id: 'c6m3', title: 'React.js Frontend', order: 3 },
		{ id: 'c6m4', title: 'Node.js & Database', order: 4 },
		{ id: 'c6m5', title: 'Deploy & Production', order: 5 }
	];
	for (const m of mods)
		await db
			.insert(schema.module)
			.values({ ...m, courseId: cid, createdAt: new Date(), updatedAt: new Date() })
			.onConflictDoNothing();

	await insertLesson(
		db,
		'c6l1',
		'c6m1',
		'HTML5 Semantic Elements',
		1,
		1,
		true,
		[
			{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 1200000 },
			{
				type: 'text',
				content:
					'## HTML5 Semantic\n\n```html\n<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <title>Halaman Saya</title>\n</head>\n<body>\n  <header>\n    <nav>\n      <ul>\n        <li><a href="/">Home</a></li>\n        <li><a href="/about">About</a></li>\n      </ul>\n    </nav>\n  </header>\n  \n  <main>\n    <article>\n      <h1>Judul Artikel</h1>\n      <p>Konten artikel...</p>\n    </article>\n    \n    <aside>\n      <h2>Sidebar</h2>\n    </aside>\n  </main>\n  \n  <footer>\n    <p>&copy; 2024 Naik Kelas</p>\n  </footer>\n</body>\n</html>\n```'
			}
		],
		{
			title: 'Quiz: HTML Semantics',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Tag HTML yang digunakan untuk konten utama halaman adalah...',
					choices: [
						{ text: '<main>', isCorrect: true },
						{ text: '<div>', isCorrect: false },
						{ text: '<body>', isCorrect: false },
						{ text: '<section>', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c6l2', 'c6m1', 'CSS Flexbox & Grid', 2, 1, false, [
		{
			type: 'text',
			content:
				'## CSS Layout Modern\n\n### Flexbox:\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}\n```\n\n### Grid:\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}\n```'
		}
	]);

	await insertLesson(
		db,
		'c6l3',
		'c6m2',
		'JavaScript ES6+',
		1,
		2,
		false,
		[
			{
				type: 'text',
				content:
					'## JavaScript Modern\n\n```javascript\n// Arrow function\nconst tambah = (a, b) => a + b;\n\n// Destructuring\nconst { nama, umur } = user;\nconst [pertama, ...sisanya] = array;\n\n// Spread operator\nconst newArr = [...arr1, ...arr2];\n\n// Template literal\nconst pesan = `Halo ${nama}, umurmu ${umur} tahun`;\n\n// Async/Await\nconst getData = async () => {\n  try {\n    const res = await fetch("/api/data");\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n};\n```'
			}
		],
		{
			title: 'Quiz: JavaScript ES6',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Cara yang benar untuk membuat arrow function di JavaScript adalah...',
					choices: [
						{ text: 'const fn = (param) => expression', isCorrect: true },
						{ text: 'function => (param) { }', isCorrect: false },
						{ text: 'arrow function(param) { }', isCorrect: false },
						{ text: 'const fn = function => param', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c6l4', 'c6m3', 'React Components & Props', 1, 3, false, [
		{
			type: 'text',
			content:
				'## React Fundamentals\n\n```jsx\n// Functional Component\nfunction Greeting({ name, age }) {\n  return (\n    <div>\n      <h1>Halo, {name}!</h1>\n      <p>Umur: {age} tahun</p>\n    </div>\n  );\n}\n\n// useState Hook\nimport { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}\n```'
		}
	]);

	await insertLesson(
		db,
		'c6l5',
		'c6m4',
		'Node.js & Express API',
		1,
		4,
		false,
		[
			{
				type: 'text',
				content:
					'## REST API dengan Express\n\n```javascript\nconst express = require("express");\nconst app = express();\n\napp.use(express.json());\n\n// GET endpoint\napp.get("/api/users", async (req, res) => {\n  const users = await db.select().from(usersTable);\n  res.json(users);\n});\n\n// POST endpoint\napp.post("/api/users", async (req, res) => {\n  const { name, email } = req.body;\n  const user = await db.insert(usersTable).values({ name, email });\n  res.status(201).json(user);\n});\n\napp.listen(3000, () => console.log("Server running on port 3000"));\n```'
			}
		],
		{
			title: 'Quiz: REST API',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'HTTP method yang digunakan untuk membuat data baru adalah...',
					choices: [
						{ text: 'POST', isCorrect: true },
						{ text: 'GET', isCorrect: false },
						{ text: 'PUT', isCorrect: false },
						{ text: 'DELETE', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c6l6', 'c6m5', 'Deploy ke Vercel & Railway', 1, 5, false, [
		{
			type: 'text',
			content:
				'## Deploy Aplikasi\n\n### Frontend (Vercel):\n```bash\nnpm install -g vercel\nvercel login\nvercel --prod\n```\n\n### Backend (Railway):\n1. Push code ke GitHub\n2. Connect repo di railway.app\n3. Set environment variables\n4. Deploy otomatis\n\n### Environment Variables:\n```\nDATABASE_URL=postgresql://...\nJWT_SECRET=your-secret-key\nNODE_ENV=production\n```'
		}
	]);
}

// ─────────────────────────────────────────────
// COURSE 004 — Affiliate Marketing Pro
// ─────────────────────────────────────────────
async function seedCourse004(db: LibSQLDatabase<typeof schema>) {
	const cid = 'course-004';
	const mods = [
		{ id: 'c4m1', title: 'Dasar Affiliate Marketing', order: 1 },
		{ id: 'c4m2', title: 'Membangun Traffic & Audience', order: 2 },
		{ id: 'c4m3', title: 'Optimasi Konversi', order: 3 }
	];
	for (const m of mods)
		await db
			.insert(schema.module)
			.values({ ...m, courseId: cid, createdAt: new Date(), updatedAt: new Date() })
			.onConflictDoNothing();

	await insertLesson(
		db,
		'c4l1',
		'c4m1',
		'Cara Kerja Affiliate Marketing',
		1,
		1,
		true,
		[
			{ type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', durationMs: 660000 },
			{
				type: 'text',
				content:
					'## Affiliate Marketing\n\n### Cara Kerja:\n1. Kamu daftar sebagai affiliate\n2. Dapat link unik\n3. Promosikan produk\n4. Orang beli via linkmu\n5. Kamu dapat komisi\n\n### Platform Affiliate Indonesia:\n- **Tokopedia Affiliate** — 1-10% komisi\n- **Shopee Affiliate** — 3-10% komisi\n- **Lazada Affiliate** — 2-8% komisi\n- **Traveloka Affiliate** — 2-5% komisi\n- **Niagahoster Affiliate** — 30-70% komisi'
			}
		],
		{
			title: 'Quiz: Affiliate Basics',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'Apa yang membedakan affiliate marketing dari reseller?',
					choices: [
						{ text: 'Affiliate tidak perlu stok produk, hanya promosi', isCorrect: true },
						{ text: 'Affiliate harus beli produk dulu', isCorrect: false },
						{ text: 'Affiliate tidak dapat komisi', isCorrect: false },
						{ text: 'Affiliate harus punya toko', isCorrect: false }
					]
				}
			]
		}
	);

	await insertLesson(db, 'c4l2', 'c4m1', 'Memilih Niche & Program Affiliate', 2, 1, false, [
		{
			type: 'text',
			content:
				'## Memilih Niche Affiliate\n\n### Kriteria Niche Bagus:\n- Kamu punya pengetahuan/passion\n- Ada produk affiliate yang relevan\n- Komisi cukup tinggi (min 10%)\n- Audience-nya punya daya beli\n\n### Niche Populer:\n- **Finance** — Kartu kredit, investasi, asuransi\n- **Tech** — Hosting, software, gadget\n- **Health** — Suplemen, alat fitness\n- **Education** — Online course, buku\n- **Travel** — Hotel, tiket, asuransi perjalanan'
		}
	]);

	await insertLesson(db, 'c4l3', 'c4m2', 'Content Marketing untuk Affiliate', 1, 2, false, [
		{
			type: 'text',
			content:
				'## Content untuk Affiliate\n\n### Jenis Konten yang Convert:\n1. **Review produk** — "Review Jujur [Produk X]"\n2. **Comparison** — "[Produk A] vs [Produk B]"\n3. **Tutorial** — "Cara menggunakan [Produk X]"\n4. **Best of list** — "10 Hosting Terbaik 2024"\n5. **Problem-solution** — "Cara mengatasi [masalah] dengan [produk]"\n\n### SEO untuk Affiliate:\n- Target keyword "review", "terbaik", "vs"\n- Long-tail keyword lebih mudah ranking\n- Buat konten yang genuinely helpful'
		}
	]);

	await insertLesson(
		db,
		'c4l4',
		'c4m3',
		'Tracking & Optimasi Performa',
		1,
		3,
		false,
		[
			{
				type: 'text',
				content:
					'## Tracking Affiliate\n\n### Metrik Penting:\n- **Clicks** — Berapa klik link affiliate\n- **Conversion Rate** — % klik yang jadi pembelian\n- **EPC (Earnings Per Click)** — Rata-rata pendapatan per klik\n- **AOV (Average Order Value)** — Rata-rata nilai order\n\n### Tools Tracking:\n- Google Analytics\n- Pretty Links (WordPress)\n- ThirstyAffiliates\n- Dashboard affiliate masing-masing platform\n\n### Optimasi:\n- A/B test posisi link\n- Test berbagai CTA\n- Update konten lama'
			}
		],
		{
			title: 'Quiz: Affiliate Optimization',
			passingScore: 70,
			questions: [
				{
					type: 'mcq',
					question: 'EPC dalam affiliate marketing adalah...',
					choices: [
						{ text: 'Rata-rata pendapatan per klik', isCorrect: true },
						{ text: 'Total klik per bulan', isCorrect: false },
						{ text: 'Jumlah produk yang terjual', isCorrect: false },
						{ text: 'Persentase komisi', isCorrect: false }
					]
				}
			]
		}
	);
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export async function seedCourseContent(db: LibSQLDatabase<typeof schema>, courseIds: string[]) {
	logSection('Seeding comprehensive course content (modules, lessons, materials, quizzes)');

	await seedCourse001(db); // Akselerasi Bisnis Digital
	await seedCourse002(db); // Content Creator Mastery
	await seedCourse003(db); // E-Commerce Success Blueprint
	await seedCourse004(db); // Affiliate Marketing Pro
	await seedCourse005(db); // Python untuk Data Science
	await seedCourse006(db); // Full Stack Web Development

	logSuccess('Seeded full course content for 6 courses');
}
