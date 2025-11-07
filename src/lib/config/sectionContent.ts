/**
 * Content Data untuk Sections
 * 
 * Centralized content data untuk Benefits dan About sections
 */

export interface CardItem {
    icon: string;
    title: string;
    description: string;
    /** Value atau highlight (contoh: "100+", "Lifetime", "6 Projects") */
    value?: string;
    /** Daftar fitur tambahan */
    features?: string[];
    /** Badge untuk status atau kategori (contoh: "Premium", "Popular", "New") */
    badge?: string;
    /** Link untuk detail lebih lanjut */
    link?: {
        text: string;
        href: string;
    };
}

/**
 * Benefits Section Content
 */
export const BENEFITS_CONTENT = {
    title: 'Yang Kamu Dapatkan',
    items: [
        {
            icon: '📚',
            title: 'Materi Lengkap',
            description:
                'Akses ke learning platform, video tutorials, dan dokumentasi untuk belajar mandiri'
        },
        {
            icon: '🏆',
            title: 'Sertifikat',
            description: 'Certificate of completion yang bisa kamu pakai untuk portfolio dan CV'
        },
        {
            icon: '🌐',
            title: 'Portfolio Project',
            description: 'Project nyata yang hosted dan bisa kamu showcase ke recruiter'
        },
        {
            icon: '👥',
            title: 'Komunitas',
            description: 'Network dengan sesama learners dan akses ke developer community'
        },
        {
            icon: '💰',
            title: 'Peluang Kerja',
            description: 'Top graduates berkesempatan magang berbayar atau join tim Koneksi'
        },
        {
            icon: '🎓',
            title: 'Lifetime Access',
            description: 'Akses materi dan updates selamanya, termasuk alumni network'
        }
    ] satisfies CardItem[]
} as const;

/**
 * About Section Content
 */
export const ABOUT_CONTENT = {
    title: 'Kenapa Naik Kelas?',
    subtitle:
        'Kami percaya setiap orang punya potensi jadi developer hebat. Yang kamu butuhkan hanya bimbingan yang tepat dan kesempatan untuk berkembang.',
    items: [
        {
            icon: '🎯',
            title: 'Mulai dari Nol',
            description:
                'Tidak ada syarat pengalaman coding. Kami akan memandu kamu step by step dari fundamental hingga mahir.'
        },
        {
            icon: '💼',
            title: 'Langsung ke Industri',
            description:
                'Belajar skills yang langsung applicable. Top graduates berkesempatan magang atau join tim developer Koneksi.'
        },
        {
            icon: '🤝',
            title: 'Mentoring Personal',
            description:
                'Belajar langsung dari developer berpengalaman. Weekly office hours dan code review untuk perkembangan maksimal.'
        },
        {
            icon: '🚀',
            title: 'Project-Based',
            description:
                'Tidak hanya teori! Bangun portfolio project nyata yang bisa kamu tunjukkan ke calon employer.'
        }
    ] satisfies CardItem[]
} as const;

