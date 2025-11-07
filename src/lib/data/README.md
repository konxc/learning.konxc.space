# Data Directory

Direktori ini berisi data statis dan konfigurasi untuk aplikasi.

## Struktur

```
data/
├── careerRoadmaps.ts    # Roadmap pembelajaran untuk setiap pilihan karir
└── README.md            # Dokumentasi (file ini)
```

## Career Roadmaps

File `careerRoadmaps.ts` berisi data timeline pembelajaran untuk semua pilihan karir:

- **Developer**: Timeline untuk pembelajaran programming & web development
- **Akademik**: Timeline untuk pembelajaran mata pelajaran sekolah
- **Bisnis & UMKM**: Timeline untuk pembelajaran bisnis & manajemen
- **UI/UX Design**: Timeline untuk pembelajaran design
- **Outdoor Adventure**: Timeline untuk pembelajaran aktivitas outdoor

### Struktur Data

Setiap roadmap terdiri dari array `TimelineItemData` yang berisi:

```typescript
interface TimelineItemData {
	title: string; // Contoh: "Minggu 1-2"
	subtitle: string; // Contoh: "Foundation Setup"
	description: string[]; // Array of bullet points
}
```

### Penggunaan

Roadmap digunakan di `ProgramSection.svelte` untuk menampilkan timeline pembelajaran berdasarkan pilihan karir user.

### Menambah/Mengubah Roadmap

1. Buka `src/lib/data/careerRoadmaps.ts`
2. Edit atau tambahkan roadmap sesuai kebutuhan
3. Pastikan key sesuai dengan `CareerOption` type di `$lib/stores/career.ts`
