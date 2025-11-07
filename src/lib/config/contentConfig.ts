/**
 * Domain-Aware Content Configuration
 * 
 * Centralized content configuration untuk semua domain pembelajaran.
 * Mendukung visi platform multi-domain yang terbuka dan heterogen.
 */

import type { CareerOption } from '$lib/stores/career';
import type { CardItem } from './sectionContent';

/**
 * Hero Section Content per Domain
 */
export interface HeroContent {
    headline: string;
    headlinePart2: string;
    description: string;
    badge?: string;
}

/**
 * CTA Section Content per Domain
 */
export interface CTAContent {
    badge: string;
    title: string;
    description: string;
    primaryButton: {
        text: string;
        href: string;
    };
    note: {
        text: string;
        linkText: string;
        href: string;
    };
}

/**
 * Benefits Section Content per Domain
 */
export interface BenefitsContent {
    title: string;
    subtitle: string;
    items: CardItem[];
}

/**
 * About Section Content per Domain
 */
export interface AboutContent {
    title: string;
    subtitle: string;
    items: CardItem[];
}

export interface DomainNarrative {
    title: string;
    tagline: string;
    futureVision: string;
    tokenizationFocus: string;
    initiatives: string[];
}

/**
 * Testimonials Section Content per Domain
 */
export interface TestimonialsContent {
    title: string;
    subtitle: string;
}

/**
 * Complete Domain Content Structure
 */
export interface DomainContent {
    hero: HeroContent;
    cta: CTAContent;
    benefits: BenefitsContent;
    about: AboutContent;
    testimonials: TestimonialsContent;
}

export const DOMAIN_NARRATIVES: Record<CareerOption, DomainNarrative> = {
    Developer: {
        title: 'Developer',
        tagline: 'Bangun solusi digital yang terbuka dan bertanggung jawab.',
        futureVision:
            'Mempersiapkan developer yang siap membangun produk komunitas dengan governance transparan serta siklus inovasi cepat layaknya startup tech.',
        tokenizationFocus:
            'Tokenisasi konten dan kontribusi kode sebagai reputasi on-chain agar setiap modul, pull request, dan mentoring memiliki jejak kepemilikan yang sah.',
        initiatives: [
            'Hackathon Web3 bertema layanan publik dan civic-tech',
            'DAO mini project untuk mengelola backlog dan pendanaan komunitas',
            'Secure coding lab untuk memastikan tokenisasi tidak disalahgunakan'
        ]
    },
    Akademik: {
        title: 'Akademik',
        tagline: 'Kurikulum adaptif dengan kepemilikan belajar oleh siswa.',
        futureVision:
            'Menumbuhkan talenta akademik yang melek digital, kritis, dan mampu menggunakan teknologi untuk kolaborasi lintas sekolah serta perguruan tinggi.',
        tokenizationFocus:
            'Portofolio belajar ditokenisasi sebagai credential terverifikasi sehingga siswa mengendalikan distribusi prestasi dan tidak mudah dimanipulasi.',
        initiatives: [
            'Learning badge on-chain sebagai prasyarat beasiswa dan kompetisi',
            'Community research circle untuk riset ilmiah berbasis data terbuka',
            'Parent-teacher dashboard dengan transparansi progres yang terenkripsi'
        ]
    },
    'Bisnis & UMKM': {
        title: 'Bisnis & UMKM',
        tagline: 'Digitalkan bisnis lokal dengan model kolaboratif.',
        futureVision:
            'Mendampingi entrepreneur membuat produk, distribusi, hingga loyalty program yang dikelola komunitas pelanggan.',
        tokenizationFocus:
            'Tokenisasi konten marketing dan aset digital brand untuk menghindari eksploitasi data oleh platform terpusat.',
        initiatives: [
            'Marketplace komunitas dengan smart loyalty points',
            'Workshop legal & compliance untuk economic token',
            'Playbook growth berbasis komunitas dan affiliate transparan'
        ]
    },
    'UI/UX Design': {
        title: 'UI/UX Design',
        tagline: 'Rancang pengalaman yang humanis dan terverifikasi.',
        futureVision:
            'Mengembangkan desainer yang dapat menggabungkan design system modern dengan prinsip Web3 untuk menjaga hak cipta visual dan UX asset.',
        tokenizationFocus:
            'Tokenisasi design asset dan riset pengguna sebagai sarana proteksi karya serta akses granular ke stakeholder.',
        initiatives: [
            'Design ops sprint untuk membangun living design system bersama komunitas',
            'UX research repository dengan akses berbasis token',
            'Kolaborasi lintas domain untuk product discovery terpadu'
        ]
    },
    'Outdoor Adventure': {
        title: 'Outdoor Adventure',
        tagline: 'Leadership dan ketahanan mental berbasis pengalaman.',
        futureVision:
            'Mencetak pemimpin lapangan yang peka terhadap lingkungan, solidaritas komunitas, dan manajemen risiko.',
        tokenizationFocus:
            'Tokenisasi log ekspedisi dan sertifikasi keselamatan agar setiap pengalaman terverifikasi dan dapat dipercaya oleh mitra wisata.',
        initiatives: [
            'Adventure lab yang menggabungkan IoT dan data keselamatan on-chain',
            'Community impact program untuk konservasi berbasis token rewards',
            'Leadership retreat lintas domain untuk membangun budaya kolaboratif'
        ]
    }
};

export function getDomainNarrative(domain: CareerOption): DomainNarrative {
    return DOMAIN_NARRATIVES[domain];
}

/**
 * Domain Content Mapping
 * 
 * Content untuk setiap domain pembelajaran:
 * - Developer: Programming, Web Development, Tools
 * - Akademik: IPA, Matematika, IPS, Bahasa Indonesia, Bahasa Inggris
 * - Bisnis & UMKM: Manajemen Keuangan, Digital Marketing, Strategi Bisnis
 * - UI/UX Design: Design Thinking, Tools, Portfolio
 * - Outdoor Adventure: Rafting, Climbing, Hiking, Survival Skills
 */
export const DOMAIN_CONTENT: Record<CareerOption, DomainContent> = {
    Developer: {
        hero: {
            headline: 'Mulai Perjalanan Coding-mu',
            headlinePart2: 'Dari Nol Hingga Siap Kerja',
            description:
                'Program pelatihan intensif 2 bulan untuk menjadi developer. Belajar Python, Web Development, dan skills yang dibutuhkan industri tech.',
            badge: '🚀 Batch Pertama - Segera Dibuka!'
        },
        cta: {
            badge: '🚀 Batch Pertama - Segera Dibuka!',
            title: 'Ready to Level Up?',
            description:
                'Jangan lewatkan kesempatan belajar langsung dari industry practitioners. Daftar sekarang dan mulai journey kamu jadi developer profesional!',
            primaryButton: {
                text: '🎯 Join Waiting List - Gratis!',
                href: '/waiting-list'
            },
            note: {
                text: 'Sudah punya akun?',
                linkText: 'Masuk di sini',
                href: '/auth/signin'
            }
        },
        benefits: {
            title: 'Yang Kamu Dapatkan',
            subtitle: 'Program pelatihan developer yang dirancang untuk membawa kamu dari pemula hingga siap kerja dengan portfolio dan skills yang dibutuhkan industri.',
            items: [
                {
                    icon: '📚',
                    title: 'Materi Lengkap',
                    description:
                        'Akses ke learning platform, video tutorials, dan dokumentasi untuk belajar mandiri',
                    value: '100+ Video',
                    features: ['Video Tutorials', 'Live Coding Sessions', 'Code Reviews', 'Dokumentasi Lengkap'],
                    badge: 'Popular'
                },
                {
                    icon: '🏆',
                    title: 'Sertifikat',
                    description: 'Certificate of completion yang bisa kamu pakai untuk portfolio dan CV',
                    value: 'Verified',
                    features: ['Digital Certificate', 'Shareable Badge', 'LinkedIn Integration'],
                    link: {
                        text: 'Lihat Contoh',
                        href: '#certificate'
                    }
                },
                {
                    icon: '🌐',
                    title: 'Portfolio Project',
                    description: 'Project nyata yang hosted dan bisa kamu showcase ke recruiter',
                    value: '6 Projects',
                    features: ['Real-world Projects', 'Hosted Portfolio', 'GitHub Integration', 'Code Reviews'],
                    badge: 'Essential'
                },
                {
                    icon: '👥',
                    title: 'Komunitas',
                    description: 'Network dengan sesama learners dan akses ke developer community',
                    value: '500+ Members',
                    features: ['Discord Community', 'Weekly Meetups', 'Peer Learning', 'Mentor Access'],
                    link: {
                        text: 'Join Community',
                        href: '#community'
                    }
                },
                {
                    icon: '💰',
                    title: 'Peluang Kerja',
                    description: 'Top graduates berkesempatan magang berbayar atau join tim Koneksi',
                    value: 'Top 20%',
                    features: ['Magang Berbayar', 'Job Placement', 'Career Coaching', 'Portfolio Review'],
                    badge: 'Premium'
                },
                {
                    icon: '🎓',
                    title: 'Lifetime Access',
                    description: 'Akses materi dan updates selamanya, termasuk alumni network',
                    value: 'Forever',
                    features: ['Lifetime Access', 'Alumni Network', 'Updates Included', 'Exclusive Content'],
                    badge: 'Best Value'
                }
            ]
        },
        about: {
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
            ]
        },
        testimonials: {
            title: 'Apa Kata Alumni Kami?',
            subtitle: 'Lihat bagaimana program Naik Kelas membantu mereka mencapai tujuan mereka sebagai developer profesional'
        }
    },
    Akademik: {
        hero: {
            headline: 'Tingkatkan Prestasi Akademik-mu',
            headlinePart2: 'Dari Dasar Hingga Mahir',
            description:
                'Program pembelajaran intensif 2 bulan untuk menguasai mata pelajaran. Les IPA, Matematika, IPS, Bahasa Indonesia, dan Bahasa Inggris dengan metode terbaik.',
            badge: '📚 Batch Pertama - Segera Dibuka!'
        },
        cta: {
            badge: '📚 Batch Pertama - Segera Dibuka!',
            title: 'Siap Naik Kelas?',
            description:
                'Jangan lewatkan kesempatan belajar dengan metode terbaik dari pengajar berpengalaman. Daftar sekarang dan tingkatkan prestasi akademikmu!',
            primaryButton: {
                text: '🎯 Join Waiting List - Gratis!',
                href: '/waiting-list'
            },
            note: {
                text: 'Sudah punya akun?',
                linkText: 'Masuk di sini',
                href: '/auth/signin'
            }
        },
        benefits: {
            title: 'Yang Kamu Dapatkan',
            subtitle: 'Program pembelajaran akademik yang dirancang untuk meningkatkan prestasi kamu dengan metode pembelajaran terstruktur dan bimbingan dari pengajar berpengalaman.',
            items: [
                {
                    icon: '📖',
                    title: 'Materi Lengkap',
                    description:
                        'Akses ke learning platform, video pembelajaran, dan materi berkualitas untuk semua mata pelajaran',
                    value: '5 Mata Pelajaran',
                    features: ['IPA', 'Matematika', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris'],
                    badge: 'Comprehensive'
                },
                {
                    icon: '🏆',
                    title: 'Sertifikat',
                    description: 'Certificate of completion yang bisa kamu pakai untuk portfolio akademik dan CV',
                    value: 'Verified',
                    features: ['Digital Certificate', 'Per Semester', 'Progress Report'],
                    link: {
                        text: 'Lihat Contoh',
                        href: '#certificate'
                    }
                },
                {
                    icon: '📊',
                    title: 'Progress Tracking',
                    description: 'Pantau perkembangan belajar dengan sistem tracking yang detail dan terstruktur',
                    value: 'Real-time',
                    features: ['Progress Dashboard', 'Quiz Scores', 'Assignment Tracking', 'Performance Analytics']
                },
                {
                    icon: '👨‍🏫',
                    title: 'Pengajar Berpengalaman',
                    description: 'Belajar langsung dari pengajar berpengalaman dengan metode pembelajaran yang efektif',
                    value: '10+ Years',
                    features: ['Certified Teachers', 'Personal Mentoring', 'Weekly Sessions', 'Q&A Support']
                },
                {
                    icon: '💡',
                    title: 'Metode Terbaik',
                    description: 'Metode pembelajaran yang sudah terbukti efektif untuk meningkatkan pemahaman',
                    value: 'Proven',
                    features: ['Interactive Learning', 'Practice-Based', 'Adaptive Curriculum'],
                    badge: 'Effective'
                },
                {
                    icon: '🎓',
                    title: 'Lifetime Access',
                    description: 'Akses materi dan updates selamanya, termasuk komunitas belajar',
                    value: 'Forever',
                    features: ['Lifetime Access', 'Study Community', 'Updates Included'],
                    badge: 'Best Value'
                }
            ]
        },
        about: {
            title: 'Kenapa Naik Kelas?',
            subtitle:
                'Kami percaya setiap siswa punya potensi untuk berprestasi. Yang kamu butuhkan hanya bimbingan yang tepat dan metode pembelajaran yang efektif.',
            items: [
                {
                    icon: '🎯',
                    title: 'Mulai dari Dasar',
                    description:
                        'Tidak peduli level kamu saat ini. Kami akan memandu kamu step by step dari fundamental hingga mahir.'
                },
                {
                    icon: '📚',
                    title: 'Materi Terstruktur',
                    description:
                        'Belajar dengan kurikulum yang terstruktur dan disesuaikan dengan kebutuhan akademik kamu.'
                },
                {
                    icon: '🤝',
                    title: 'Bimbingan Personal',
                    description:
                        'Belajar langsung dari pengajar berpengalaman. Weekly sessions dan konsultasi untuk perkembangan maksimal.'
                },
                {
                    icon: '📈',
                    title: 'Practice-Based',
                    description:
                        'Tidak hanya teori! Latihan soal dan evaluasi berkala untuk memastikan pemahaman yang solid.'
                }
            ]
        },
        testimonials: {
            title: 'Apa Kata Alumni Kami?',
            subtitle: 'Lihat bagaimana program Naik Kelas membantu mereka meningkatkan prestasi akademik'
        }
    },
    'Bisnis & UMKM': {
        hero: {
            headline: 'Bangun Bisnis & UMKM-mu',
            headlinePart2: 'Dari Ide Hingga Sukses',
            description:
                'Program pelatihan intensif 2 bulan untuk mengembangkan bisnis. Belajar manajemen keuangan, strategi pemasaran digital, dan skills yang dibutuhkan untuk menjalankan bisnis yang sukses.',
            badge: '💼 Batch Pertama - Segera Dibuka!'
        },
        cta: {
            badge: '💼 Batch Pertama - Segera Dibuka!',
            title: 'Siap Memulai Bisnis?',
            description:
                'Jangan lewatkan kesempatan belajar langsung dari praktisi bisnis berpengalaman. Daftar sekarang dan mulai journey kamu jadi entrepreneur sukses!',
            primaryButton: {
                text: '🎯 Join Waiting List - Gratis!',
                href: '/waiting-list'
            },
            note: {
                text: 'Sudah punya akun?',
                linkText: 'Masuk di sini',
                href: '/auth/signin'
            }
        },
        benefits: {
            title: 'Yang Kamu Dapatkan',
            subtitle: 'Program pelatihan bisnis dan UMKM yang dirancang untuk membantu kamu mengembangkan bisnis dari ide hingga sukses dengan tools dan network yang tepat.',
            items: [
                {
                    icon: '📚',
                    title: 'Materi Bisnis Lengkap',
                    description:
                        'Akses ke learning platform, video tutorial, dan materi bisnis untuk mengembangkan UMKM',
                    value: '50+ Modules',
                    features: ['Business Strategy', 'Marketing Digital', 'Financial Management', 'Legal Guide'],
                    badge: 'Comprehensive'
                },
                {
                    icon: '🏆',
                    title: 'Sertifikat',
                    description: 'Certificate of completion yang bisa kamu pakai untuk portfolio bisnis dan CV',
                    value: 'Verified',
                    features: ['Digital Certificate', 'Business Credential', 'LinkedIn Integration'],
                    link: {
                        text: 'Lihat Contoh',
                        href: '#certificate'
                    }
                },
                {
                    icon: '📊',
                    title: 'Business Plan Template',
                    description: 'Template dan tools untuk membuat business plan yang profesional dan siap eksekusi',
                    value: '10+ Templates',
                    features: ['Business Plan', 'Financial Projections', 'Marketing Plan', 'Pitch Deck'],
                    badge: 'Essential'
                },
                {
                    icon: '👥',
                    title: 'Network Bisnis',
                    description: 'Network dengan sesama entrepreneur dan akses ke komunitas bisnis',
                    value: '200+ Entrepreneurs',
                    features: ['Business Network', 'Mentor Access', 'Partnership Opportunities', 'Events'],
                    link: {
                        text: 'Join Network',
                        href: '#network'
                    }
                },
                {
                    icon: '💰',
                    title: 'Funding Opportunities',
                    description: 'Top graduates berkesempatan untuk mendapatkan funding atau mentorship lanjutan',
                    value: 'Top 10%',
                    features: ['Funding Access', 'Investor Network', 'Pitch Sessions', 'Mentorship'],
                    badge: 'Premium'
                },
                {
                    icon: '🎓',
                    title: 'Lifetime Access',
                    description: 'Akses materi dan updates selamanya, termasuk komunitas bisnis',
                    value: 'Forever',
                    features: ['Lifetime Access', 'Business Community', 'Updates Included'],
                    badge: 'Best Value'
                }
            ]
        },
        about: {
            title: 'Kenapa Naik Kelas?',
            subtitle:
                'Kami percaya setiap orang punya potensi jadi entrepreneur sukses. Yang kamu butuhkan hanya bimbingan yang tepat dan tools yang tepat untuk mengembangkan bisnis.',
            items: [
                {
                    icon: '🎯',
                    title: 'Mulai dari Nol',
                    description:
                        'Tidak perlu pengalaman bisnis sebelumnya. Kami akan memandu kamu step by step dari ide hingga bisnis yang berjalan.'
                },
                {
                    icon: '💼',
                    title: 'Praktis & Aplikatif',
                    description:
                        'Belajar skills yang langsung applicable. Top graduates berkesempatan mendapatkan mentorship lanjutan.'
                },
                {
                    icon: '🤝',
                    title: 'Mentoring dari Praktisi',
                    description:
                        'Belajar langsung dari entrepreneur berpengalaman. Weekly sessions dan konsultasi bisnis untuk perkembangan maksimal.'
                },
                {
                    icon: '🚀',
                    title: 'Project-Based',
                    description:
                        'Tidak hanya teori! Bangun business plan nyata yang bisa kamu eksekusi setelah lulus.'
                }
            ]
        },
        testimonials: {
            title: 'Apa Kata Alumni Kami?',
            subtitle: 'Lihat bagaimana program Naik Kelas membantu mereka mengembangkan bisnis mereka'
        }
    },
    'UI/UX Design': {
        hero: {
            headline: 'Jadi Desainer & Creative-mu',
            headlinePart2: 'Dari Konsep Hingga Realisasi',
            description:
                'Program pelatihan intensif 2 bulan untuk menguasai UI/UX Design dan creative skills. Belajar design thinking, tools modern, dan portfolio yang siap untuk industri kreatif.',
            badge: '🎨 Batch Pertama - Segera Dibuka!'
        },
        cta: {
            badge: '🎨 Batch Pertama - Segera Dibuka!',
            title: 'Siap Jadi Desainer?',
            description:
                'Jangan lewatkan kesempatan belajar langsung dari designer berpengalaman. Daftar sekarang dan mulai journey kamu jadi creative professional!',
            primaryButton: {
                text: '🎯 Join Waiting List - Gratis!',
                href: '/waiting-list'
            },
            note: {
                text: 'Sudah punya akun?',
                linkText: 'Masuk di sini',
                href: '/auth/signin'
            }
        },
        benefits: {
            title: 'Yang Kamu Dapatkan',
            subtitle: 'Program pelatihan UI/UX Design yang dirancang untuk membawa kamu dari pemula hingga siap kerja dengan portfolio design profesional dan skills yang dibutuhkan industri kreatif.',
            items: [
                {
                    icon: '📚',
                    title: 'Materi Design Lengkap',
                    description:
                        'Akses ke learning platform, video tutorial, dan design resources untuk belajar UI/UX',
                    value: '80+ Tutorials',
                    features: ['Design Thinking', 'Figma Mastery', 'Prototyping', 'Design Systems'],
                    badge: 'Comprehensive'
                },
                {
                    icon: '🏆',
                    title: 'Sertifikat',
                    description: 'Certificate of completion yang bisa kamu pakai untuk portfolio design dan CV',
                    value: 'Verified',
                    features: ['Design Certificate', 'Portfolio Badge', 'LinkedIn Integration'],
                    link: {
                        text: 'Lihat Contoh',
                        href: '#certificate'
                    }
                },
                {
                    icon: '🎨',
                    title: 'Portfolio Project',
                    description: 'Project design nyata yang bisa kamu showcase ke calon employer atau klien',
                    value: '5 Projects',
                    features: ['Real Client Projects', 'Design Portfolio', 'Case Studies', 'Behance Integration'],
                    badge: 'Essential'
                },
                {
                    icon: '👥',
                    title: 'Design Community',
                    description: 'Network dengan sesama designer dan akses ke komunitas kreatif',
                    value: '300+ Designers',
                    features: ['Design Community', 'Critique Sessions', 'Collaboration', 'Design Challenges'],
                    link: {
                        text: 'Join Community',
                        href: '#community'
                    }
                },
                {
                    icon: '💰',
                    title: 'Peluang Kerja',
                    description: 'Top graduates berkesempatan magang atau join tim creative Koneksi',
                    value: 'Top 15%',
                    features: ['Creative Internship', 'Job Placement', 'Freelance Opportunities', 'Client Matching'],
                    badge: 'Premium'
                },
                {
                    icon: '🎓',
                    title: 'Lifetime Access',
                    description: 'Akses materi dan updates selamanya, termasuk design resources dan tools',
                    value: 'Forever',
                    features: ['Lifetime Access', 'Design Resources', 'Tool Access', 'Updates Included'],
                    badge: 'Best Value'
                }
            ]
        },
        about: {
            title: 'Kenapa Naik Kelas?',
            subtitle:
                'Kami percaya setiap orang punya potensi jadi designer hebat. Yang kamu butuhkan hanya bimbingan yang tepat dan kesempatan untuk mengembangkan creative skills.',
            items: [
                {
                    icon: '🎯',
                    title: 'Mulai dari Nol',
                    description:
                        'Tidak perlu pengalaman design sebelumnya. Kami akan memandu kamu step by step dari fundamental hingga mahir.'
                },
                {
                    icon: '💼',
                    title: 'Langsung ke Industri',
                    description:
                        'Belajar skills yang langsung applicable. Top graduates berkesempatan magang atau join tim creative Koneksi.'
                },
                {
                    icon: '🤝',
                    title: 'Mentoring dari Designer',
                    description:
                        'Belajar langsung dari designer berpengalaman. Weekly sessions dan design review untuk perkembangan maksimal.'
                },
                {
                    icon: '🚀',
                    title: 'Project-Based',
                    description:
                        'Tidak hanya teori! Bangun portfolio design nyata yang bisa kamu tunjukkan ke calon employer atau klien.'
                }
            ]
        },
        testimonials: {
            title: 'Apa Kata Alumni Kami?',
            subtitle: 'Lihat bagaimana program Naik Kelas membantu mereka menjadi designer profesional'
        }
    },
    'Outdoor Adventure': {
        hero: {
            headline: 'Eksplorasi Petualangan Outdoor',
            headlinePart2: 'Dari Rafting Hingga Climbing',
            description:
                'Program pelatihan intensif 2 bulan untuk menguasai aktivitas outdoor. Belajar rafting, climbing, hiking, survival skills, dan petualangan yang menantang.',
            badge: '🏔️ Batch Pertama - Segera Dibuka!'
        },
        cta: {
            badge: '🏔️ Batch Pertama - Segera Dibuka!',
            title: 'Siap Berpetualang?',
            description:
                'Jangan lewatkan kesempatan belajar langsung dari instruktur berpengalaman. Daftar sekarang dan mulai journey kamu jadi adventure enthusiast!',
            primaryButton: {
                text: '🎯 Join Waiting List - Gratis!',
                href: '/waiting-list'
            },
            note: {
                text: 'Sudah punya akun?',
                linkText: 'Masuk di sini',
                href: '/auth/signin'
            }
        },
        benefits: {
            title: 'Yang Kamu Dapatkan',
            subtitle: 'Program pelatihan outdoor adventure yang dirancang untuk membawa kamu menguasai aktivitas petualangan dengan safety guidelines ketat dan praktik langsung di lapangan.',
            items: [
                {
                    icon: '📚',
                    title: 'Materi Adventure Lengkap',
                    description:
                        'Akses ke learning platform, video tutorial, dan safety guidelines untuk aktivitas outdoor',
                    value: '4 Activities',
                    features: ['Rafting', 'Climbing', 'Hiking', 'Survival Skills'],
                    badge: 'Comprehensive'
                },
                {
                    icon: '🏆',
                    title: 'Sertifikat',
                    description: 'Certificate of completion yang membuktikan kemampuan outdoor adventure kamu',
                    value: 'Certified',
                    features: ['Safety Certification', 'Skill Badge', 'Instructor Recognition'],
                    link: {
                        text: 'Lihat Contoh',
                        href: '#certificate'
                    }
                },
                {
                    icon: '🏔️',
                    title: 'Praktik Langsung',
                    description: 'Praktik langsung di lapangan dengan instruktur berpengalaman dan peralatan lengkap',
                    value: 'Hands-on',
                    features: ['Field Practice', 'Safety Equipment', 'Expert Instructors', 'Real Conditions'],
                    badge: 'Essential'
                },
                {
                    icon: '👥',
                    title: 'Adventure Community',
                    description: 'Network dengan sesama adventure enthusiast dan akses ke komunitas outdoor',
                    value: '150+ Members',
                    features: ['Adventure Group', 'Group Expeditions', 'Safety Network', 'Experience Sharing'],
                    link: {
                        text: 'Join Community',
                        href: '#community'
                    }
                },
                {
                    icon: '💰',
                    title: 'Peluang Karir',
                    description: 'Top graduates berkesempatan menjadi instruktur atau guide adventure',
                    value: 'Top 10%',
                    features: ['Instructor Program', 'Guide Certification', 'Employment Opportunities', 'Mentorship'],
                    badge: 'Premium'
                },
                {
                    icon: '🎓',
                    title: 'Lifetime Access',
                    description: 'Akses materi dan updates selamanya, termasuk komunitas adventure',
                    value: 'Forever',
                    features: ['Lifetime Access', 'Adventure Community', 'Updates Included', 'Event Discounts'],
                    badge: 'Best Value'
                }
            ]
        },
        about: {
            title: 'Kenapa Naik Kelas?',
            subtitle:
                'Kami percaya setiap orang punya potensi jadi adventure enthusiast. Yang kamu butuhkan hanya bimbingan yang tepat dan kesempatan untuk menjelajahi alam.',
            items: [
                {
                    icon: '🎯',
                    title: 'Mulai dari Dasar',
                    description:
                        'Tidak perlu pengalaman outdoor sebelumnya. Kami akan memandu kamu step by step dari fundamental hingga mahir.'
                },
                {
                    icon: '💼',
                    title: 'Safety First',
                    description:
                        'Belajar dengan safety guidelines yang ketat. Top graduates berkesempatan menjadi instruktur atau guide.'
                },
                {
                    icon: '🤝',
                    title: 'Mentoring dari Instruktur',
                    description:
                        'Belajar langsung dari instruktur berpengalaman. Weekly sessions dan praktik lapangan untuk perkembangan maksimal.'
                },
                {
                    icon: '🚀',
                    title: 'Experience-Based',
                    description:
                        'Tidak hanya teori! Praktik langsung di lapangan dengan peralatan lengkap dan safety yang terjamin.'
                }
            ]
        },
        testimonials: {
            title: 'Apa Kata Alumni Kami?',
            subtitle: 'Lihat bagaimana program Naik Kelas membantu mereka menguasai petualangan outdoor'
        }
    }
} as const;

/**
 * Helper function untuk mendapatkan content berdasarkan domain
 * 
 * @param domain - Domain pembelajaran yang dipilih
 * @returns DomainContent untuk domain tersebut
 */
export function getDomainContent(domain: CareerOption): DomainContent {
    return DOMAIN_CONTENT[domain];
}

/**
 * Helper function untuk mendapatkan hero content
 */
export function getHeroContent(domain: CareerOption): HeroContent {
    return DOMAIN_CONTENT[domain].hero;
}

/**
 * Helper function untuk mendapatkan CTA content
 */
export function getCTAContent(domain: CareerOption): CTAContent {
    return DOMAIN_CONTENT[domain].cta;
}

/**
 * Helper function untuk mendapatkan benefits content
 */
export function getBenefitsContent(domain: CareerOption): BenefitsContent {
    return DOMAIN_CONTENT[domain].benefits;
}

/**
 * Helper function untuk mendapatkan about content
 */
export function getAboutContent(domain: CareerOption): AboutContent {
    return DOMAIN_CONTENT[domain].about;
}

/**
 * Helper function untuk mendapatkan testimonials content berdasarkan domain
 * 
 * @param domain - Domain pembelajaran yang dipilih
 * @returns TestimonialsContent untuk domain tersebut
 */
export function getTestimonialsContent(domain: CareerOption): TestimonialsContent {
    return DOMAIN_CONTENT[domain].testimonials;
}

