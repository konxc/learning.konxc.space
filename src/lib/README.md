# Component Structure

Struktur komponen yang modular dan mudah dikelola untuk platform Naik Kelas.

## 📁 Folder Structure

```
src/lib/
├── components/        # Reusable components
│   ├── BenefitCard.svelte
│   ├── FeatureCard.svelte
│   ├── RegistrationForm.svelte
│   └── TimelineItem.svelte
├── sections/         # Page sections
│   ├── AboutSection.svelte
│   ├── BenefitsSection.svelte
│   ├── CTASection.svelte
│   ├── FooterSection.svelte
│   ├── HeroSection.svelte
│   └── ProgramSection.svelte
└── assets/           # Static assets
    └── favicon.svg
```

## 🧩 Reusable Components

### FeatureCard.svelte
Kartu untuk menampilkan fitur/feature dalam grid layout.

**Props:**
- `icon` (string): Emoji atau icon
- `title` (string): Judul feature
- `description` (string): Deskripsi feature

**Usage:**
```svelte
<FeatureCard icon="🎯" title="Mulai dari Nol" description="..." />
```

### TimelineItem.svelte
Item untuk timeline program pembelajaran.

**Props:**
- `title` (string): Judul periode (e.g., "Minggu 1-2")
- `content` (string): Konten HTML (supports HTML tags)
- `position` (string): 'left' | 'right' - Posisi item pada timeline

**Usage:**
```svelte
<TimelineItem 
  title="Minggu 1-2" 
  content="<strong>Foundation</strong><br />..."
  position="left" 
/>
```

### BenefitCard.svelte
Kartu untuk menampilkan benefit di section dengan gradient background.

**Props:**
- `icon` (string): Emoji
- `title` (string): Judul benefit
- `description` (string): Deskripsi benefit

**Usage:**
```svelte
<BenefitCard icon="📚" title="Materi Lengkap" description="..." />
```

### RegistrationForm.svelte
Form registrasi dengan validasi dan event handling.

**Props:**
- `onSubmit` (function, optional): Callback function saat form disubmit

**Usage:**
```svelte
<RegistrationForm onSubmit={handleFormSubmit} />
```

## 📄 Section Components

### HeroSection.svelte
Hero section di bagian atas halaman.

**Props:**
- `logo` (string, default: "Naik Kelas")
- `tagline` (string, default: "by Koneksi × ...")
- `headline` (string): HTML content untuk headline
- `description` (string): Deskripsi program

### AboutSection.svelte
Section "Kenapa Naik Kelas?" dengan feature cards.

Tidak memerlukan props - menggunakan data hardcoded dalam komponen.

### ProgramSection.svelte
Timeline program pembelajaran 8 minggu.

Tidak memerlukan props - menggunakan data hardcoded dalam komponen.

### BenefitsSection.svelte
Section benefits dengan gradient background.

Tidak memerlukan props - menggunakan data hardcoded dalam komponen.

### CTASection.svelte
Call-to-action section dengan registration form.

Tidak memerlukan props - memiliki form handling internal.

### FooterSection.svelte
Footer dengan social links dan copyright.

Tidak memerlukan props - menggunakan data hardcoded dalam komponen.

## 💡 Best Practices

1. **Component Separation**: Pisahkan logic dan UI untuk reusability
2. **Props Interface**: Definisikan interface TypeScript untuk type safety
3. **Default Values**: Berikan default values untuk props opsional
4. **Data Management**: Gunakan hardcoded data untuk content yang static
5. **Event Handling**: Implementasikan proper event handling untuk interaksi

## 🔧 Modifying Components

### Menambah Fitur Baru
1. Buat component baru di `components/` atau `sections/`
2. Definisikan props dengan interface TypeScript
3. Import dan gunakan di halaman atau section yang memerlukan

### Mengubah Styling
1. Update Tailwind classes di komponen
2. Untuk responsive, tambahkan media queries di `<style>` block
3. Gunakan design tokens dari `DESIGN_REFERENCE.md`

### Adding New Data
1. Update data array di section component
2. Atau buat props untuk menginjek data dari parent

## 📱 Responsive Design

Komponen sudah responsive dengan:
- Mobile-first approach
- Breakpoint pada 768px
- Responsive grid layouts
- Mobile-optimized timeline

## 🎨 Theming

Design system menggunakan:
- Color palette dari `DESIGN_REFERENCE.md`
- Consistent spacing dengan Tailwind utilities
- Gradient backgrounds untuk sections tertentu
- Glassmorphism effects untuk benefit cards

---

**Last Updated**: 2025-01-23

