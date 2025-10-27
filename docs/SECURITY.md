# Security Guidelines

## HTML Sanitization

**Status**: ✅ **Currently Using Declarative Markup**

Kami menggunakan pendekatan **declarative Svelte markup** sebagai solusi utama untuk menampilkan HTML. Ini lebih aman, eksplisit, dan mudah dikelola.

### Current Approach: Declarative Markup

Sebagai gantinya, kami menggunakan struktur data eksplisit dengan markup Svelte:

```typescript
// ProgramSection.svelte
const timelineItems = [
	{
		title: 'Minggu 1-2',
		subtitle: 'Foundation Setup', // ✅ Eksplisit
		description: 'Kenalan dengan...' // ✅ Eksplisit
	}
];
```

```svelte
<!-- TimelineItem.svelte -->
<h3>{title}</h3>
<p>
	{#if subtitle}
		<strong>{subtitle}</strong>
		<br />
	{/if}
	{description}
</p>
```

**Keuntungan:**

- ✅ 100% aman (tidak ada HTML string yang perlu di-parse)
- ✅ Eksplisit dan deklaratif (mudah dibaca dan dirawat)
- ✅ Type-safe dengan TypeScript
- ✅ Mudah diubah tanpa risiko XSS
- ✅ UI tetap konsisten

---

## HTML Sanitization (For Reference)

**Note**: Utility sanitasi sudah tersedia tapi saat ini **TIDAK DIGUNAKAN**.

Kami juga menyediakan **DOMPurify** untuk sanitasi HTML jika diperlukan di masa depan.

### Cara Kerja

1. **Instalasi**: DOMPurify sudah terinstall sebagai dependency
2. **Utility Function**: `src/lib/utils/sanitize.ts`
3. **Penggunaan**: Import dan gunakan di komponen yang menggunakan `{@html}`

### Contoh Penggunaan

```typescript
import { sanitizeHtml } from '$lib/utils/sanitize';

const safeContent = sanitizeHtml(content);
```

```svelte
<p>{@html safeContent}</p>
```

### Konfigurasi Keamanan

DOMPurify dikonfigurasi untuk:

- ✅ **ALLOWED_TAGS**: Hanya tag yang aman (`strong`, `em`, `br`, `p`, dll)
- ✅ **ALLOWED_ATTR**: Hanya atribut yang aman (`class`, `id`)
- ❌ **BLOCKED**: Script tags, event handlers, JavaScript URLs
- ❌ **BLOCKED**: Data attributes yang bisa digunakan untuk XSS

### Kapan Menggunakan Sanitasi?

✅ **Gunakan sanitasi jika:**

- Data dari user input
- Data dari database
- Data dari API eksternal
- Data dari CMS/content management system

✅ **Sudah aman tanpa sanitasi jika:**

- Data hard-coded di kode (seperti timelineItems di ProgramSection)
- Data statis yang dikontrol developer

### Best Practices

1. **Selalu sanitize** konten yang berasal dari user atau sumber eksternal
2. **Jangan trust data** dari sumber eksternal
3. **Gunakan Content Security Policy (CSP)** untuk layer keamanan tambahan
4. **Review regular** dependencies untuk update keamanan

### Komponen yang Menggunakan Sanitasi

- `src/lib/components/TimelineItem.svelte` ✅
- `src/lib/sections/HeroSection.svelte` ✅

### Testing Keamanan

Untuk memastikan sanitasi bekerja dengan baik:

```typescript
// Test malicious input
const maliciousInput = '<script>alert("XSS")</script><p>Safe content</p>';
const safe = sanitizeHtml(maliciousInput);
// Result: '<p>Safe content</p>' (script tag removed)
```

### Referensi

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Svelte Security](https://svelte.dev/docs#svelte-%40html)
