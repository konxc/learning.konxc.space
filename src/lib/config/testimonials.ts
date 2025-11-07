/**
 * Testimonials Data per Domain
 * 
 * Testimonials untuk setiap domain pembelajaran.
 * Support untuk video testimonials, star ratings, dan before/after stories.
 */

import type { CareerOption } from '$lib/stores/career';

export interface Testimonial {
    id: string;
    name: string;
    role?: string;
    company?: string;
    image?: string;
    rating: number; // 1-5
    text: string;
    videoUrl?: string;
    beforeAfter?: {
        before: string;
        after: string;
    };
    domain: CareerOption;
}

/**
 * Testimonials untuk semua domains
 */
export const TESTIMONIALS: Record<CareerOption, Testimonial[]> = {
    Developer: [
        {
            id: 'dev-1',
            name: 'Ahmad Rizki',
            role: 'Full Stack Developer',
            company: 'Tech Startup',
            rating: 5,
            text: 'Program Naik Kelas benar-benar mengubah hidup saya. Dari zero knowledge sampai bisa jadi developer dalam 2 bulan. Mentornya sangat supportive dan materinya sangat praktis!',
            domain: 'Developer',
            beforeAfter: {
                before: 'Fresh graduate tanpa skill coding',
                after: 'Full Stack Developer di startup'
            }
        },
        {
            id: 'dev-2',
            name: 'Siti Nurhaliza',
            role: 'Frontend Developer',
            company: 'E-commerce Company',
            rating: 5,
            text: 'Belajar Python dan Web Development di Naik Kelas sangat terstruktur. Project-based learning membuat saya langsung paham implementasi di dunia kerja. Highly recommended!',
            domain: 'Developer'
        },
        {
            id: 'dev-3',
            name: 'Budi Santoso',
            role: 'Backend Developer',
            company: 'Fintech',
            rating: 5,
            text: 'Saya tidak percaya bisa dapat pekerjaan sebagai developer hanya dalam 3 bulan setelah lulus. Portfolio project yang dibangun selama program sangat membantu saat interview.',
            domain: 'Developer'
        }
    ],
    Akademik: [
        {
            id: 'akademik-1',
            name: 'Putri Ayu',
            role: 'Siswa SMA',
            rating: 5,
            text: 'Nilai saya naik drastis setelah ikut program Naik Kelas. Metode pembelajarannya sangat mudah dipahami dan pengajarnya sangat sabar. Dari nilai 60 jadi 85+!',
            domain: 'Akademik',
            beforeAfter: {
                before: 'Nilai rata-rata 60',
                after: 'Nilai rata-rata 85+'
            }
        },
        {
            id: 'akademik-2',
            name: 'Dedi Kurniawan',
            role: 'Siswa SMK',
            rating: 5,
            text: 'Les Matematika dan IPA di Naik Kelas sangat membantu. Materinya lengkap dan latihan soalnya banyak. Saya jadi lebih percaya diri untuk ujian.',
            domain: 'Akademik'
        },
        {
            id: 'akademik-3',
            name: 'Rina Kartika',
            role: 'Siswa SMA',
            rating: 5,
            text: 'Program ini benar-benar membantu saya memahami konsep yang sulit. Pengajarnya menjelaskan dengan cara yang sangat mudah dipahami. Terima kasih Naik Kelas!',
            domain: 'Akademik'
        }
    ],
    'Bisnis & UMKM': [
        {
            id: 'bisnis-1',
            name: 'Ibu Siti',
            role: 'Pemilik UMKM',
            rating: 5,
            text: 'Setelah ikut program Bisnis & UMKM di Naik Kelas, omzet toko saya naik 3x lipat! Belajar manajemen keuangan dan digital marketing sangat membantu bisnis saya.',
            domain: 'Bisnis & UMKM',
            beforeAfter: {
                before: 'Omzet bulanan 5 juta',
                after: 'Omzet bulanan 15 juta'
            }
        },
        {
            id: 'bisnis-2',
            name: 'Pak Joko',
            role: 'Entrepreneur',
            rating: 5,
            text: 'Business plan template dan mentorship dari Naik Kelas sangat membantu saya membuat startup. Sekarang bisnis saya sudah berjalan dan dapat funding!',
            domain: 'Bisnis & UMKM'
        },
        {
            id: 'bisnis-3',
            name: 'Maya Indira',
            role: 'Pemilik Online Store',
            rating: 5,
            text: 'Belajar digital marketing dan strategi bisnis di Naik Kelas mengubah cara saya menjalankan bisnis. Sekarang saya punya sistem yang lebih terstruktur.',
            domain: 'Bisnis & UMKM'
        }
    ],
    'UI/UX Design': [
        {
            id: 'design-1',
            name: 'Lina Dewi',
            role: 'UI/UX Designer',
            company: 'Design Agency',
            rating: 5,
            text: 'Portfolio design yang saya buat selama program Naik Kelas sangat membantu saya dapat klien pertama. Belajar design thinking dan tools modern sangat praktis!',
            domain: 'UI/UX Design',
            beforeAfter: {
                before: 'Tidak punya portfolio',
                after: 'Punya 5+ portfolio projects'
            }
        },
        {
            id: 'design-2',
            name: 'Rizki Pratama',
            role: 'Product Designer',
            company: 'Tech Company',
            rating: 5,
            text: 'Program ini benar-benar mengajarkan dasar-dasar design yang solid. Mentor memberikan feedback yang sangat detail dan membantu improvement portfolio saya.',
            domain: 'UI/UX Design'
        },
        {
            id: 'design-3',
            name: 'Sari Wulandari',
            role: 'Freelance Designer',
            rating: 5,
            text: 'Dari tidak tahu apa-apa tentang design sampai bisa jadi freelance designer, semua berkat program Naik Kelas. Community-nya juga sangat supportive!',
            domain: 'UI/UX Design'
        }
    ],
    'Outdoor Adventure': [
        {
            id: 'outdoor-1',
            name: 'Ahmad Fauzi',
            role: 'Adventure Guide',
            rating: 5,
            text: 'Program Outdoor Adventure di Naik Kelas sangat lengkap. Dari rafting sampai climbing, semua diajarkan dengan safety yang ketat. Sekarang saya jadi certified guide!',
            domain: 'Outdoor Adventure',
            beforeAfter: {
                before: 'Tidak punya pengalaman outdoor',
                after: 'Certified Adventure Guide'
            }
        },
        {
            id: 'outdoor-2',
            name: 'Putra Ramadhan',
            role: 'Climbing Instructor',
            rating: 5,
            text: 'Praktik langsung di lapangan dengan instruktur berpengalaman sangat membantu. Safety guidelines yang diajarkan sangat penting dan saya terapkan sampai sekarang.',
            domain: 'Outdoor Adventure'
        },
        {
            id: 'outdoor-3',
            name: 'Indah Permata',
            role: 'Adventure Enthusiast',
            rating: 5,
            text: 'Saya jadi lebih percaya diri untuk ikut aktivitas outdoor setelah ikut program ini. Survival skills yang diajarkan sangat praktis dan berguna.',
            domain: 'Outdoor Adventure'
        }
    ]
} as const;

/**
 * Get testimonials untuk domain tertentu
 */
export function getTestimonials(domain: CareerOption): Testimonial[] {
    return TESTIMONIALS[domain] || [];
}

/**
 * Get featured testimonials (top 3 dengan rating tertinggi)
 */
export function getFeaturedTestimonials(domain: CareerOption, limit: number = 3): Testimonial[] {
    const testimonials = getTestimonials(domain);
    return testimonials
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

