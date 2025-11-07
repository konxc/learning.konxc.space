// Daftar role yang didukung aplikasi dashboard
export const ROLES = ['learner', 'mentor', 'business', 'admin'] as const;
export type UserRole = typeof ROLES[number];

// Role default ketika belum terdeteksi/ditentukan
export const DEFAULT_ROLE: UserRole = 'learner';


