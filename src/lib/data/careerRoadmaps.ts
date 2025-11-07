/**
 * Career Roadmaps Data
 * 
 * Roadmap pembelajaran untuk setiap pilihan karir di Program Section.
 * Setiap roadmap berisi timeline pembelajaran 8 minggu.
 */

export interface TimelineItemData {
    title: string;
    subtitle?: string;
    description: string[];
}

type CareerOption = 'Developer' | 'Akademik' | 'Bisnis & UMKM' | 'UI/UX Design' | 'Outdoor Adventure';

export const careerRoadmaps: Record<CareerOption, TimelineItemData[]> = {
    Developer: [
        {
            title: 'Minggu 1-2',
            subtitle: 'Foundation Setup',
            description: [
                'Kenalan dengan environment development (VS Code, Terminal)',
                'Setup Git & GitHub untuk version control',
                'Memahami dasar-dasar Terminal dan command line',
                'Persiapan tech stack modern (Node.js, npm, package management)',
                'Mental preparation dan mindset untuk jadi developer'
            ]
        },
        {
            title: 'Minggu 3-4',
            subtitle: 'Python Programming',
            description: [
                'Dasar-dasar Python: variables, data types, operators',
                'Control flow: conditionals dan loops',
                'Functions dan modules',
                'Working with lists, dictionaries, dan data structures',
                'File handling dan error handling'
            ]
        },
        {
            title: 'Minggu 5-6',
            subtitle: 'Web Development Basics',
            description: [
                'HTML5 dan CSS3 fundamentals',
                'Responsive design dengan CSS Grid dan Flexbox',
                'JavaScript dasar: DOM manipulation, events',
                'Introduction to modern frameworks (React/Vue basics)',
                'Project: Build simple landing page'
            ]
        },
        {
            title: 'Minggu 7-8',
            subtitle: 'Backend & Deployment',
            description: [
                'REST API dengan Python (Flask/FastAPI)',
                'Database fundamentals (SQL basics)',
                'Authentication dan security basics',
                'Deployment ke cloud platform',
                'Final project: Full-stack application'
            ]
        }
    ],
    Akademik: [
        {
            title: 'Minggu 1-2',
            subtitle: 'Foundation Learning',
            description: [
                'Assessment awal untuk identifikasi level pemahaman',
                'Strategi belajar efektif dan time management',
                'Setup lingkungan belajar yang kondusif',
                'Membangun kebiasaan belajar harian',
                'Goal setting dan planning untuk target akademik'
            ]
        },
        {
            title: 'Minggu 3-4',
            subtitle: 'Core Subjects Intensive',
            description: [
                'Matematika: Aljabar dan geometri dasar',
                'IPA: Fisika dan Kimia fundamentals',
                'IPS: Sejarah dan Geografi',
                'Bahasa Indonesia: Grammar dan sastra',
                'Bahasa Inggris: Vocabulary dan conversation'
            ]
        },
        {
            title: 'Minggu 5-6',
            subtitle: 'Practice & Application',
            description: [
                'Latihan soal intensif untuk setiap mata pelajaran',
                'Review dan analisis kesalahan',
                'Study group dan peer learning',
                'Mock exam untuk evaluasi progress',
                'Personalized learning path berdasarkan weakness'
            ]
        },
        {
            title: 'Minggu 7-8',
            subtitle: 'Mastery & Exam Prep',
            description: [
                'Advanced topics dan challenging problems',
                'Exam strategies dan time management techniques',
                'Practice dengan soal-soal ujian tahun sebelumnya',
                'Final review dan consolidation',
                'Confidence building dan mental preparation'
            ]
        }
    ],
    'Bisnis & UMKM': [
        {
            title: 'Minggu 1-2',
            subtitle: 'Business Foundation',
            description: [
                'Konsep dasar bisnis dan entrepreneurship',
                'Business model canvas dan value proposition',
                'Market research dan competitor analysis',
                'Legal aspects: Perizinan dan struktur bisnis',
                'Financial literacy dasar: cash flow, profit & loss'
            ]
        },
        {
            title: 'Minggu 3-4',
            subtitle: 'Operations & Marketing',
            description: [
                'Operational management untuk UMKM',
                'Digital marketing: Social media dan content strategy',
                'Customer relationship management (CRM)',
                'Product/service development dan pricing strategy',
                'Supply chain dan vendor management'
            ]
        },
        {
            title: 'Minggu 5-6',
            subtitle: 'Financial Management',
            description: [
                'Bookkeeping dan financial reporting',
                'Budget planning dan cost control',
                'Tax planning dan compliance',
                'Funding options: Modal sendiri, pinjaman, investor',
                'Financial forecasting dan break-even analysis'
            ]
        },
        {
            title: 'Minggu 7-8',
            subtitle: 'Growth & Scaling',
            description: [
                'Strategi growth dan scaling bisnis',
                'Digital transformation untuk UMKM',
                'Partnership dan networking strategies',
                'Building brand dan customer loyalty',
                'Business plan finalization dan presentation'
            ]
        }
    ],
    'UI/UX Design': [
        {
            title: 'Minggu 1-2',
            subtitle: 'Design Fundamentals',
            description: [
                'Design principles: Balance, contrast, hierarchy',
                'Color theory dan typography basics',
                'Introduction to design tools (Figma, Adobe XD)',
                'User research methods dan persona creation',
                'Design thinking process dan empathy mapping'
            ]
        },
        {
            title: 'Minggu 3-4',
            subtitle: 'UI Design & Prototyping',
            description: [
                'Wireframing dan information architecture',
                'Visual design: Icons, illustrations, imagery',
                'Component design dan design systems',
                'Interactive prototyping dengan Figma',
                'Design handoff dan developer collaboration'
            ]
        },
        {
            title: 'Minggu 5-6',
            subtitle: 'UX Research & Testing',
            description: [
                'Usability testing methods',
                'User interviews dan survey design',
                'Analytics dan data-driven design decisions',
                'Accessibility design (WCAG guidelines)',
                'Iterative design process dan feedback loops'
            ]
        },
        {
            title: 'Minggu 7-8',
            subtitle: 'Portfolio & Career',
            description: [
                'Building design portfolio yang impressive',
                'Case study presentation dan storytelling',
                'Networking dalam design community',
                'Freelance vs full-time career paths',
                'Final project: Complete design system untuk real client'
            ]
        }
    ],
    'Outdoor Adventure': [
        {
            title: 'Minggu 1-2',
            subtitle: 'Safety & Basics',
            description: [
                'Safety protocols dan risk management',
                'Essential gear dan equipment knowledge',
                'Basic navigation: Compass, map reading, GPS',
                'First aid dan emergency response',
                'Physical conditioning dan fitness preparation'
            ]
        },
        {
            title: 'Minggu 3-4',
            subtitle: 'Core Activities',
            description: [
                'Rafting: Techniques dan river reading',
                'Rock climbing: Belay, rappelling, lead climbing',
                'Hiking dan backpacking essentials',
                'Camping skills: Shelter, fire, cooking',
                'Wilderness survival basics'
            ]
        },
        {
            title: 'Minggu 5-6',
            subtitle: 'Advanced Skills',
            description: [
                'Multi-day expeditions planning',
                'Advanced navigation dan route finding',
                'Weather reading dan decision making',
                'Group leadership dan teamwork',
                'Environmental ethics dan Leave No Trace principles'
            ]
        },
        {
            title: 'Minggu 7-8',
            subtitle: 'Certification & Leadership',
            description: [
                'Guide certification preparation',
                'Leading groups dalam outdoor activities',
                'Business of adventure tourism',
                'Building outdoor activity portfolio',
                'Final expedition: Complete multi-day adventure'
            ]
        }
    ]
};
