import { hashPassword } from '../../src/lib/server/password.js';
import * as schema from '../../src/lib/server/db/schema.js';
import { logSection, logSuccess } from './utils.js';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

const PASSWORD = 'naikkelas2024';

export async function seedUsers(db: LibSQLDatabase<typeof schema>) {
	logSection('Seeding core users (admin, bd, mentors, facilitators)');

	const users = [
		// Admin
		{
			id: 'admin-001',
			username: 'admin',
			passwordHash: await hashPassword(PASSWORD),
			role: 'admin',
			fullName: 'Aditya Pratama',
			email: 'admin@naikkelas.id',
			phone: '081234567890',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-01')
		},
		// Business Development
		{
			id: 'bd-001',
			username: 'bd_salsabila',
			passwordHash: await hashPassword(PASSWORD),
			role: 'bd',
			fullName: 'Salsabila Rahman',
			email: 'salsabila@naikkelas.id',
			phone: '081234567891',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-02')
		},
		// Mentors
		{
			id: 'mentor-001',
			username: 'mentor_budi',
			passwordHash: await hashPassword(PASSWORD),
			role: 'mentor',
			fullName: 'Budi Santoso',
			email: 'budi@naikkelas.id',
			phone: '081234567892',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-03')
		},
		{
			id: 'mentor-002',
			username: 'mentor_dewi',
			passwordHash: await hashPassword(PASSWORD),
			role: 'mentor',
			fullName: 'Dewi Anggraini',
			email: 'dewi@naikkelas.id',
			phone: '081234567893',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-05')
		},
		{
			id: 'mentor-003',
			username: 'mentor_hendra',
			passwordHash: await hashPassword(PASSWORD),
			role: 'mentor',
			fullName: 'Hendra Wijaya',
			email: 'hendra@naikkelas.id',
			phone: '081234567894',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-07')
		},
		{
			id: 'mentor-004',
			username: 'mentor_rina',
			passwordHash: await hashPassword(PASSWORD),
			role: 'mentor',
			fullName: 'Rina Kusuma',
			email: 'rina@naikkelas.id',
			phone: '081234567895',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-10')
		},
		{
			id: 'mentor-005',
			username: 'mentor_ahmad',
			passwordHash: await hashPassword(PASSWORD),
			role: 'mentor',
			fullName: 'Ahmad Fauzi',
			email: 'fauzi@naikkelas.id',
			phone: '081234567896',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-12')
		},
		{
			id: 'mentor-006',
			username: 'mentor_maya',
			passwordHash: await hashPassword(PASSWORD),
			role: 'mentor',
			fullName: 'Maya Sari',
			email: 'maya@naikkelas.id',
			phone: '081234567897',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-15')
		},
		// Facilitators
		{
			id: 'facil-001',
			username: 'facil_irwan',
			passwordHash: await hashPassword(PASSWORD),
			role: 'facilitator',
			fullName: 'Irwan Setiawan',
			email: 'irwan@naikkelas.id',
			phone: '081234567898',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-16')
		},
		{
			id: 'facil-002',
			username: 'facil_siti',
			passwordHash: await hashPassword(PASSWORD),
			role: 'facilitator',
			fullName: 'Siti Nurhaliza',
			email: 'siti@naikkelas.id',
			phone: '081234567899',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-18')
		},
		{
			id: 'facil-003',
			username: 'facil_joko',
			passwordHash: await hashPassword(PASSWORD),
			role: 'facilitator',
			fullName: 'Joko Purnomo',
			email: 'joko.f@naikkelas.id',
			phone: '081234567800',
			onboardingCompleted: true,
			createdAt: new Date('2024-01-20')
		}
	];

	for (const user of users) {
		await db.insert(schema.user).values(user).onConflictDoNothing();
	}

	logSuccess(`Seeded ${users.length} core users`);
	return users;
}

export async function seedStudents(db: LibSQLDatabase<typeof schema>) {
	logSection('Seeding students (60 users)');

	const students = [
		// Batch 1 - Januari 2024
		{ id: 'std-001', username: 'ahmad_rizki', fullName: 'Ahmad Rizki Pratama', email: 'ahmad.rizki@gmail.com', phone: '081234568001', createdAt: new Date('2024-01-15') },
		{ id: 'std-002', username: 'siti_aisyah', fullName: 'Siti Aisyah', email: 'siti.aisyah@gmail.com', phone: '081234568002', createdAt: new Date('2024-01-16') },
		{ id: 'std-003', username: 'budi_santoso', fullName: 'Budi Santoso', email: 'budi.santoso@gmail.com', phone: '081234568003', createdAt: new Date('2024-01-17') },
		{ id: 'std-004', username: 'dewi_lestari', fullName: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', phone: '081234568004', createdAt: new Date('2024-01-18') },
		{ id: 'std-005', username: 'fajar_nugroho', fullName: 'Fajar Nugroho', email: 'fajar.nugroho@gmail.com', phone: '081234568005', createdAt: new Date('2024-01-19') },
		{ id: 'std-006', username: 'gita_permata', fullName: 'Gita Permata', email: 'gita.permata@gmail.com', phone: '081234568006', createdAt: new Date('2024-01-20') },
		{ id: 'std-007', username: 'hendra_kurniawan', fullName: 'Hendra Kurniawan', email: 'hendra.k@gmail.com', phone: '081234568007', createdAt: new Date('2024-01-21') },
		{ id: 'std-008', username: 'indah_sari', fullName: 'Indah Sari', email: 'indah.sari@gmail.com', phone: '081234568008', createdAt: new Date('2024-01-22') },
		{ id: 'std-009', username: 'joko_saputra', fullName: 'Joko Saputra', email: 'joko.s@gmail.com', phone: '081234568009', createdAt: new Date('2024-01-23') },
		{ id: 'std-010', username: 'kartika_dewi', fullName: 'Kartika Dewi', email: 'kartika.dewi@gmail.com', phone: '081234568010', createdAt: new Date('2024-01-24') },
		
		// Batch 2 - Februari 2024
		{ id: 'std-011', username: 'lukman_hakim', fullName: 'Lukman Hakim', email: 'lukman.h@gmail.com', phone: '081234568011', createdAt: new Date('2024-02-01') },
		{ id: 'std-012', username: 'maya_rahmawati', fullName: 'Maya Rahmawati', email: 'maya.r@gmail.com', phone: '081234568012', createdAt: new Date('2024-02-02') },
		{ id: 'std-013', username: 'nando_pratama', fullName: 'Nando Pratama', email: 'nando.p@gmail.com', phone: '081234568013', createdAt: new Date('2024-02-03') },
		{ id: 'std-014', username: 'okta_firmansyah', fullName: 'Okta Firmansyah', email: 'okta.f@gmail.com', phone: '081234568014', createdAt: new Date('2024-02-04') },
		{ id: 'std-015', username: 'putri_amalia', fullName: 'Putri Amalia', email: 'putri.a@gmail.com', phone: '081234568015', createdAt: new Date('2024-02-05') },
		{ id: 'std-016', username: 'qori_hidayat', fullName: 'Qori Hidayat', email: 'qori.h@gmail.com', phone: '081234568016', createdAt: new Date('2024-02-06') },
		{ id: 'std-017', username: 'ratna_sari', fullName: 'Ratna Sari', email: 'ratna.s@gmail.com', phone: '081234568017', createdAt: new Date('2024-02-07') },
		{ id: 'std-018', username: 'surya_darmawan', fullName: 'Surya Darmawan', email: 'surya.d@gmail.com', phone: '081234568018', createdAt: new Date('2024-02-08') },
		{ id: 'std-019', username: 'tika_marlina', fullName: 'Tika Marlina', email: 'tika.m@gmail.com', phone: '081234568019', createdAt: new Date('2024-02-09') },
		{ id: 'std-020', username: 'umar_basuki', fullName: 'Umar Basuki', email: 'umar.b@gmail.com', phone: '081234568020', createdAt: new Date('2024-02-10') },
		
		// Batch 3 - Maret 2024
		{ id: 'std-021', username: 'vina_puspita', fullName: 'Vina Puspita', email: 'vina.p@gmail.com', phone: '081234568021', createdAt: new Date('2024-03-01') },
		{ id: 'std-022', username: 'wahyu_adi', fullName: 'Wahyu Adi Prakoso', email: 'wahyu.a@gmail.com', phone: '081234568022', createdAt: new Date('2024-03-02') },
		{ id: 'std-023', username: 'xena_oktavia', fullName: 'Xena Oktavia', email: 'xena.o@gmail.com', phone: '081234568023', createdAt: new Date('2024-03-03') },
		{ id: 'std-024', username: 'yoga_permadi', fullName: 'Yoga Permadi', email: 'yoga.p@gmail.com', phone: '081234568024', createdAt: new Date('2024-03-04') },
		{ id: 'std-025', username: 'zahra_fadila', fullName: 'Zahra Fadila', email: 'zahra.f@gmail.com', phone: '081234568025', createdAt: new Date('2024-03-05') },
		{ id: 'std-026', username: 'andi_setiawan', fullName: 'Andi Setiawan', email: 'andi.s@gmail.com', phone: '081234568026', createdAt: new Date('2024-03-06') },
		{ id: 'std-027', username: 'bella_rahma', fullName: 'Bella Rahma', email: 'bella.r@gmail.com', phone: '081234568027', createdAt: new Date('2024-03-07') },
		{ id: 'std-028', username: 'candra_gunawan', fullName: 'Candra Gunawan', email: 'candra.g@gmail.com', phone: '081234568028', createdAt: new Date('2024-03-08') },
		{ id: 'std-029', username: 'dina_kartika', fullName: 'Dina Kartika', email: 'dina.k@gmail.com', phone: '081234568029', createdAt: new Date('2024-03-09') },
		{ id: 'std-030', username: 'eko_prasetyo', fullName: 'Eko Prasetyo', email: 'eko.p@gmail.com', phone: '081234568030', createdAt: new Date('2024-03-10') },
		
		// Batch 4 - April 2024
		{ id: 'std-031', username: 'fitri_handayani', fullName: 'Fitri Handayani', email: 'fitri.h@gmail.com', phone: '081234568031', createdAt: new Date('2024-04-01') },
		{ id: 'std-032', username: 'galih_prasetyo', fullName: 'Galih Prasetyo', email: 'galih.p@gmail.com', phone: '081234568032', createdAt: new Date('2024-04-02') },
		{ id: 'std-033', username: 'halimahtul', fullName: 'Halimahtul Zahra', email: 'halimahtul@gmail.com', phone: '081234568033', createdAt: new Date('2024-04-03') },
		{ id: 'std-034', username: 'indra_permadi', fullName: 'Indra Permadi', email: 'indra.p@gmail.com', phone: '081234568034', createdAt: new Date('2024-04-04') },
		{ id: 'std-035', username: 'jihan_azzahra', fullName: 'Jihan Azzahra', email: 'jihan.a@gmail.com', phone: '081234568035', createdAt: new Date('2024-04-05') },
		{ id: 'std-036', username: 'kiki_amelia', fullName: 'Kiki Amelia', email: 'kiki.a@gmail.com', phone: '081234568036', createdAt: new Date('2024-04-06') },
		{ id: 'std-037', username: 'lutfi_hamzah', fullName: 'Lutfi Hamzah', email: 'lutfi.h@gmail.com', phone: '081234568037', createdAt: new Date('2024-04-07') },
		{ id: 'std-038', username: 'mira_ophelia', fullName: 'Mira Ophelia', email: 'mira.o@gmail.com', phone: '081234568038', createdAt: new Date('2024-04-08') },
		{ id: 'std-039', username: 'naufal_aziz', fullName: 'Naufal Aziz', email: 'naufal.a@gmail.com', phone: '081234568039', createdAt: new Date('2024-04-09') },
		{ id: 'std-040', username: 'olivia_sari', fullName: 'Olivia Sari', email: 'olivia.s@gmail.com', phone: '081234568040', createdAt: new Date('2024-04-10') },
		
		// Batch 5 - Mei 2024
		{ id: 'std-041', username: 'panji_wicaksono', fullName: 'Panji Wicaksono', email: 'panji.w@gmail.com', phone: '081234568041', createdAt: new Date('2024-05-01') },
		{ id: 'std-042', username: 'qonita_zahra', fullName: 'Qonita Zahra', email: 'qonita.z@gmail.com', phone: '081234568042', createdAt: new Date('2024-05-02') },
		{ id: 'std-043', username: 'raka_budi', fullName: 'Raka Budi Santoso', email: 'raka.b@gmail.com', phone: '081234568043', createdAt: new Date('2024-05-03') },
		{ id: 'std-044', username: 'salsa_bila', fullName: 'Salsa Bila Ramadhani', email: 'salsa.b@gmail.com', phone: '081234568044', createdAt: new Date('2024-05-04') },
		{ id: 'std-045', username: 'taufik_hidayat', fullName: 'Taufik Hidayat', email: 'taufik.h@gmail.com', phone: '081234568045', createdAt: new Date('2024-05-05') },
		{ id: 'std-046', username: 'utami_dewi', fullName: 'Utami Dewi', email: 'utami.d@gmail.com', phone: '081234568046', createdAt: new Date('2024-05-06') },
		{ id: 'std-047', username: 'vito_rahman', fullName: 'Vito Rahman', email: 'vito.r@gmail.com', phone: '081234568047', createdAt: new Date('2024-05-07') },
		{ id: 'std-048', username: 'winda_ayu', fullName: 'Winda Ayu Lestari', email: 'winda.a@gmail.com', phone: '081234568048', createdAt: new Date('2024-05-08') },
		{ id: 'std-049', username: 'xaverius_dwi', fullName: 'Xaverius Dwi Putra', email: 'xaverius.d@gmail.com', phone: '081234568049', createdAt: new Date('2024-05-09') },
		{ id: 'std-050', username: 'yusuf_maulana', fullName: 'Yusuf Maulana', email: 'yusuf.m@gmail.com', phone: '081234568050', createdAt: new Date('2024-05-10') },
		
		// Batch 6 - Juni 2024
		{ id: 'std-051', username: 'zakiyah_nur', fullName: 'Zakiyah Nur Hidayah', email: 'zakiyah.n@gmail.com', phone: '081234568051', createdAt: new Date('2024-06-01') },
		{ id: 'std-052', username: 'arifin_setiadi', fullName: 'Arifin Setiadi', email: 'arifin.s@gmail.com', phone: '081234568052', createdAt: new Date('2024-06-02') },
		{ id: 'std-053', username: 'berlian_ayu', fullName: 'Berlian Ayu Sasmita', email: 'berlian.a@gmail.com', phone: '081234568053', createdAt: new Date('2024-06-03') },
		{ id: 'std-054', username: 'dedi_susanto', fullName: 'Dedi Susanto', email: 'dedi.s@gmail.com', phone: '081234568054', createdAt: new Date('2024-06-04') },
		{ id: 'std-055', username: 'elfira_lestari', fullName: 'Elfira Lestari', email: 'elfira.l@gmail.com', phone: '081234568055', createdAt: new Date('2024-06-05') },
		{ id: 'std-056', username: 'guntur_mahendra', fullName: 'Guntur Mahendra', email: 'guntur.m@gmail.com', phone: '081234568056', createdAt: new Date('2024-06-06') },
		{ id: 'std-057', username: 'hesti_wulandari', fullName: 'Hesti Wulandari', email: 'hesti.w@gmail.com', phone: '081234568057', createdAt: new Date('2024-06-07') },
		{ id: 'std-058', username: 'ivan_pratama', fullName: 'Ivan Pratama', email: 'ivan.p@gmail.com', phone: '081234568058', createdAt: new Date('2024-06-08') },
		{ id: 'std-059', username: 'julia_puspita', fullName: 'Julia Puspita Sari', email: 'julia.p@gmail.com', phone: '081234568059', createdAt: new Date('2024-06-09') },
		{ id: 'std-060', username: 'kamaluddin', fullName: 'Kamaluddin', email: 'kamal@gmail.com', phone: '081234568060', createdAt: new Date('2024-06-10') }
	];

	for (const student of students) {
		await db.insert(schema.user).values({
			...student,
			passwordHash: await hashPassword(PASSWORD),
			role: 'user',
			onboardingCompleted: true
		}).onConflictDoNothing();
	}

	logSuccess(`Seeded ${students.length} students`);
	return students;
}
