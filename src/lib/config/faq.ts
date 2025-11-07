/**
 * FAQ Data per Domain
 * 
 * Frequently Asked Questions untuk setiap domain pembelajaran.
 * Support untuk search dan structured data (FAQPage schema).
 */

import type { CareerOption } from '$lib/stores/career';

export interface FAQItem {
	id: string;
	question: string;
	answer: string;
	category?: string;
	domain: CareerOption;
}

/**
 * FAQ untuk semua domains
 */
export const FAQ_DATA: Record<CareerOption, FAQItem[]> = {
	Developer: [
		{
			id: 'dev-faq-1',
			question: 'Apakah saya perlu punya pengalaman coding sebelumnya?',
			answer: 'Tidak! Program Naik Kelas dirancang untuk pemula total. Kami akan memandu kamu dari dasar-dasar programming hingga siap kerja. Yang penting adalah niat dan komitmen untuk belajar.',
			domain: 'Developer',
			category: 'Pendaftaran'
		},
		{
			id: 'dev-faq-2',
			question: 'Berapa lama durasi program?',
			answer: 'Program berlangsung selama 2 bulan (8 minggu) dengan intensitas belajar yang cukup tinggi. Setiap minggu kamu akan belajar materi baru dan mengerjakan project praktis.',
			domain: 'Developer',
			category: 'Program'
		},
		{
			id: 'dev-faq-3',
			question: 'Apa saja yang akan saya pelajari?',
			answer: 'Kamu akan belajar Python programming, Web Development (HTML, CSS, JavaScript), Git & GitHub, Terminal, VS Code, dan tools modern lainnya. Semua materi dirancang untuk langsung applicable di dunia kerja.',
			domain: 'Developer',
			category: 'Program'
		},
		{
			id: 'dev-faq-4',
			question: 'Apakah ada sertifikat setelah lulus?',
			answer: 'Ya! Setelah menyelesaikan program dan project final, kamu akan mendapatkan Certificate of Completion yang bisa digunakan untuk portfolio dan CV.',
			domain: 'Developer',
			category: 'Sertifikat'
		},
		{
			id: 'dev-faq-5',
			question: 'Apakah ada jaminan kerja setelah lulus?',
			answer: 'Kami tidak memberikan jaminan kerja langsung, tapi top graduates berkesempatan untuk magang berbayar atau join tim developer Koneksi. Kami juga akan membantu dengan job placement support.',
			domain: 'Developer',
			category: 'Karir'
		},
		{
			id: 'dev-faq-6',
			question: 'Berapa biaya program ini?',
			answer: 'Program ini saat ini gratis untuk batch pertama. Kami fokus pada kualitas pembelajaran dan membantu kamu mencapai tujuan karir sebagai developer.',
			domain: 'Developer',
			category: 'Biaya'
		}
	],
	Akademik: [
		{
			id: 'akademik-faq-1',
			question: 'Mata pelajaran apa saja yang tersedia?',
			answer: 'Kami menyediakan les untuk IPA, Matematika, IPS, Bahasa Indonesia, dan Bahasa Inggris. Setiap mata pelajaran memiliki kurikulum yang terstruktur dan disesuaikan dengan kebutuhan akademik.',
			domain: 'Akademik',
			category: 'Mata Pelajaran'
		},
		{
			id: 'akademik-faq-2',
			question: 'Apakah cocok untuk siswa SMA/SMK?',
			answer: 'Ya! Program ini dirancang khusus untuk siswa SMA/SMK dan mahasiswa yang ingin meningkatkan prestasi akademik. Metode pembelajaran disesuaikan dengan level pendidikan.',
			domain: 'Akademik',
			category: 'Pendaftaran'
		},
		{
			id: 'akademik-faq-3',
			question: 'Bagaimana sistem pembelajarannya?',
			answer: 'Kami menggunakan metode pembelajaran yang efektif dengan video pembelajaran, materi lengkap, latihan soal, dan evaluasi berkala. Ada juga weekly sessions dengan pengajar untuk konsultasi.',
			domain: 'Akademik',
			category: 'Program'
		},
		{
			id: 'akademik-faq-4',
			question: 'Apakah ada progress tracking?',
			answer: 'Ya! Kamu bisa memantau perkembangan belajar dengan sistem tracking yang detail. Setiap progress akan tercatat dan kamu bisa melihat improvement dari waktu ke waktu.',
			domain: 'Akademik',
			category: 'Program'
		},
		{
			id: 'akademik-faq-5',
			question: 'Berapa lama durasi program?',
			answer: 'Program berlangsung selama 2 bulan dengan intensitas belajar yang cukup. Setiap minggu ada materi baru dan evaluasi untuk memastikan pemahaman.',
			domain: 'Akademik',
			category: 'Program'
		},
		{
			id: 'akademik-faq-6',
			question: 'Apakah ada sertifikat?',
			answer: 'Ya! Setelah menyelesaikan program, kamu akan mendapatkan Certificate of Completion yang bisa digunakan untuk portfolio akademik.',
			domain: 'Akademik',
			category: 'Sertifikat'
		}
	],
	'Bisnis & UMKM': [
		{
			id: 'bisnis-faq-1',
			question: 'Apakah cocok untuk pemula yang belum punya bisnis?',
			answer: 'Ya! Program ini cocok untuk siapa saja yang ingin memulai bisnis atau mengembangkan UMKM yang sudah ada. Kami akan memandu dari ide hingga eksekusi.',
			domain: 'Bisnis & UMKM',
			category: 'Pendaftaran'
		},
		{
			id: 'bisnis-faq-2',
			question: 'Apa saja yang akan saya pelajari?',
			answer: 'Kamu akan belajar manajemen keuangan, strategi pemasaran digital, business planning, dan skills yang dibutuhkan untuk menjalankan bisnis yang sukses. Semua materi sangat praktis dan applicable.',
			domain: 'Bisnis & UMKM',
			category: 'Program'
		},
		{
			id: 'bisnis-faq-3',
			question: 'Apakah ada business plan template?',
			answer: 'Ya! Kamu akan mendapatkan template dan tools untuk membuat business plan yang profesional. Template ini bisa langsung kamu gunakan untuk bisnis kamu.',
			domain: 'Bisnis & UMKM',
			category: 'Program'
		},
		{
			id: 'bisnis-faq-4',
			question: 'Apakah ada kesempatan funding?',
			answer: 'Top graduates berkesempatan untuk mendapatkan funding atau mentorship lanjutan. Kami akan membantu menghubungkan dengan investor dan mentor bisnis.',
			domain: 'Bisnis & UMKM',
			category: 'Karir'
		},
		{
			id: 'bisnis-faq-5',
			question: 'Berapa lama durasi program?',
			answer: 'Program berlangsung selama 2 bulan dengan fokus pada praktik langsung. Setiap minggu ada materi baru dan project untuk mengembangkan bisnis kamu.',
			domain: 'Bisnis & UMKM',
			category: 'Program'
		},
		{
			id: 'bisnis-faq-6',
			question: 'Apakah ada network bisnis?',
			answer: 'Ya! Kamu akan bergabung dengan komunitas entrepreneur dan mendapatkan akses ke network bisnis yang luas. Ini sangat membantu untuk perkembangan bisnis kamu.',
			domain: 'Bisnis & UMKM',
			category: 'Komunitas'
		}
	],
	'UI/UX Design': [
		{
			id: 'design-faq-1',
			question: 'Apakah perlu punya skill design sebelumnya?',
			answer: 'Tidak! Program ini dirancang untuk pemula. Kami akan memandu kamu dari dasar-dasar design thinking hingga mahir menggunakan tools modern seperti Figma dan Adobe XD.',
			domain: 'UI/UX Design',
			category: 'Pendaftaran'
		},
		{
			id: 'design-faq-2',
			question: 'Tools apa saja yang akan digunakan?',
			answer: 'Kamu akan belajar menggunakan Figma, Adobe XD, dan tools design modern lainnya. Kami juga akan mengajarkan design thinking dan proses kreatif untuk menghasilkan design yang baik.',
			domain: 'UI/UX Design',
			category: 'Program'
		},
		{
			id: 'design-faq-3',
			question: 'Apakah akan ada portfolio project?',
			answer: 'Ya! Selama program kamu akan membuat portfolio design yang bisa digunakan untuk showcase ke calon employer atau klien. Portfolio ini sangat penting untuk karir design.',
			domain: 'UI/UX Design',
			category: 'Program'
		},
		{
			id: 'design-faq-4',
			question: 'Apakah ada kesempatan kerja?',
			answer: 'Top graduates berkesempatan magang atau join tim creative Koneksi. Kami juga akan membantu dengan job placement support untuk industri kreatif.',
			domain: 'UI/UX Design',
			category: 'Karir'
		},
		{
			id: 'design-faq-5',
			question: 'Berapa lama durasi program?',
			answer: 'Program berlangsung selama 2 bulan dengan fokus pada project-based learning. Setiap minggu ada materi baru dan design project untuk mengembangkan portfolio.',
			domain: 'UI/UX Design',
			category: 'Program'
		},
		{
			id: 'design-faq-6',
			question: 'Apakah ada design community?',
			answer: 'Ya! Kamu akan bergabung dengan komunitas designer dan mendapatkan akses ke design resources, tools, dan network kreatif yang luas.',
			domain: 'UI/UX Design',
			category: 'Komunitas'
		}
	],
	'Outdoor Adventure': [
		{
			id: 'outdoor-faq-1',
			question: 'Apakah perlu punya pengalaman outdoor sebelumnya?',
			answer: 'Tidak! Program ini dirancang untuk pemula. Kami akan memandu kamu dari dasar-dasar aktivitas outdoor hingga mahir. Yang penting adalah niat dan kesiapan fisik.',
			domain: 'Outdoor Adventure',
			category: 'Pendaftaran'
		},
		{
			id: 'outdoor-faq-2',
			question: 'Aktivitas apa saja yang akan dipelajari?',
			answer: 'Kamu akan belajar rafting, climbing, hiking, survival skills, dan aktivitas outdoor lainnya. Semua aktivitas dilakukan dengan safety guidelines yang ketat.',
			domain: 'Outdoor Adventure',
			category: 'Program'
		},
		{
			id: 'outdoor-faq-3',
			question: 'Bagaimana dengan safety?',
			answer: 'Safety adalah prioritas utama kami. Semua aktivitas dilakukan dengan peralatan lengkap dan instruktur berpengalaman. Kami juga mengajarkan safety guidelines yang ketat.',
			domain: 'Outdoor Adventure',
			category: 'Safety'
		},
		{
			id: 'outdoor-faq-4',
			question: 'Apakah ada praktik langsung?',
			answer: 'Ya! Program ini sangat hands-on dengan praktik langsung di lapangan. Kamu akan menggunakan peralatan lengkap dan belajar dari instruktur berpengalaman.',
			domain: 'Outdoor Adventure',
			category: 'Program'
		},
		{
			id: 'outdoor-faq-5',
			question: 'Apakah bisa jadi instruktur setelah lulus?',
			answer: 'Top graduates berkesempatan menjadi instruktur atau guide adventure. Kami akan membantu dengan sertifikasi dan peluang karir di industri outdoor.',
			domain: 'Outdoor Adventure',
			category: 'Karir'
		},
		{
			id: 'outdoor-faq-6',
			question: 'Berapa lama durasi program?',
			answer: 'Program berlangsung selama 2 bulan dengan kombinasi teori dan praktik lapangan. Setiap minggu ada materi baru dan praktik di lapangan.',
			domain: 'Outdoor Adventure',
			category: 'Program'
		}
	]
} as const;

/**
 * Get FAQ untuk domain tertentu
 */
export function getFAQ(domain: CareerOption): FAQItem[] {
	return FAQ_DATA[domain] || [];
}

/**
 * Get FAQ categories untuk domain tertentu
 */
export function getFAQCategories(domain: CareerOption): string[] {
	const faqs = getFAQ(domain);
	const categories = new Set<string>();
	faqs.forEach((faq) => {
		if (faq.category) {
			categories.add(faq.category);
		}
	});
	return Array.from(categories).sort();
}

/**
 * Search FAQ items
 */
export function searchFAQ(domain: CareerOption, query: string): FAQItem[] {
	const faqs = getFAQ(domain);
	const lowerQuery = query.toLowerCase().trim();

	if (!lowerQuery) {
		return faqs;
	}

	return faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(lowerQuery) ||
			faq.answer.toLowerCase().includes(lowerQuery) ||
			(faq.category && faq.category.toLowerCase().includes(lowerQuery))
	);
}

