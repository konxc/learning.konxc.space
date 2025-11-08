# Strategi Lazy Loading untuk SEO

Dokumentasi strategi lazy loading yang optimal untuk SEO dan performance landing page.

**Last Updated**: 2025-01-30

---

## 🎯 Prinsip Dasar

### SEO-Safe Lazy Loading Rules

1. **Konten penting HARUS ada di HTML source** - Crawler harus bisa membaca konten tanpa JavaScript
2. **Above-the-fold langsung load** - Hero, CTA, dan konten kunci harus langsung terlihat
3. **Images di bawah fold bisa lazy** - Gunakan native `loading="lazy"`
4. **Heavy components bisa lazy** - Tapi pastikan konten text tetap di HTML
5. **Structured data selalu di HTML** - Schema.org markup harus di source

---

## 📊 Prioritas Lazy Loading

### Tier 1: CRITICAL - JANGAN LAZY LOAD ❌

**Sections yang harus langsung load:**

| Section                 | Alasan                                           | Status        |
| ----------------------- | ------------------------------------------------ | ------------- |
| HeroSection             | Above-the-fold, critical untuk SEO, LCP element  | ✅ Eager Load |
| CTASection              | Above-the-fold, conversion critical, CTA buttons | ✅ Eager Load |
| ProgramSection (Header) | Title dan konten penting untuk SEO               | ✅ Eager Load |

**Content yang harus langsung load:**

- Semua text content (headlines, descriptions, benefits)
- CTA buttons
- Navigation elements
- Structured data (Schema.org)
- Meta tags

---

### Tier 2: IMPORTANT - Partial Lazy Loading ⚠️

**Sections yang bisa dioptimasi dengan partial lazy loading:**

| Section         | Strategy                              | Implementation                                         |
| --------------- | ------------------------------------- | ------------------------------------------------------ |
| ProgramSection  | Content eager, animations lazy        | ✅ Text di HTML, IntersectionObserver untuk animations |
| BenefitsSection | Content eager, decorative images lazy | ✅ Text di HTML, images dengan `loading="lazy"`        |

**Strategy:**

- Text content tetap di HTML source (SEO-safe)
- Heavy components (animations, decorative elements) bisa lazy
- Images menggunakan `loading="lazy"` native

---

### Tier 3: NON-CRITICAL - Full Lazy Loading ✅

**Sections yang bisa di-lazy-load sepenuhnya:**

| Section             | Reason                                                | Priority  |
| ------------------- | ----------------------------------------------------- | --------- |
| TestimonialsSection | Below fold, bisa load setelah user scroll             | 🔵 High   |
| FAQSection          | Below fold, konten tetap di HTML                      | 🔵 High   |
| SocialProofSection  | Below fold, decorative                                | 🟡 Medium |
| AboutSection        | Below fold, bisa lazy (tapi saat ini eager untuk SEO) | 🟡 Medium |
| FooterSection       | Bottom page, non-critical                             | 🟢 Low    |

**Strategy:**

- Component lazy loading dengan `import()`
- Konten text tetap ada di HTML source
- Progressive enhancement untuk interactivity

---

## 🛠️ Implementation Strategy

### 1. Image Lazy Loading (Native Browser)

**Priority: HIGH** - Implement sekarang

```html
<!-- ✅ GOOD: Below fold images -->
<img
	src="testimonial.jpg"
	loading="lazy"
	alt="Testimonial dari John Doe"
	decoding="async"
	width="400"
	height="300"
/>

<!-- ✅ GOOD: Hero image (above fold) -->
<img src="hero.jpg" loading="eager" alt="Program Naik Kelas" fetchpriority="high" />
```

**Best Practices:**

- Always include `width` dan `height` untuk prevent CLS
- Use `decoding="async"` untuk better performance
- Hero images: `loading="eager"` + `fetchpriority="high"`
- Below fold: `loading="lazy"`

---

### 2. Component Lazy Loading

**Priority: MEDIUM** - Implement untuk non-critical sections

```svelte
<!-- ✅ GOOD: Lazy load non-critical component -->
{#await import('$lib/sections/TestimonialsSection.svelte')}
	<div class="skeleton-loader" aria-label="Loading testimonials">
		<div class="skeleton-item"></div>
		<div class="skeleton-item"></div>
		<div class="skeleton-item"></div>
	</div>
{:then TestimonialsSection}
	<TestimonialsSection />
{:catch error}
	<div role="alert">Failed to load testimonials</div>
{/await}
```

**Best Practices:**

- Show skeleton loader untuk better UX
- Konten text tetap di HTML (jika ada)
- Error handling untuk fallback
- Use IntersectionObserver untuk trigger load saat scroll

---

### 3. Progressive Enhancement

**Priority: MEDIUM** - Enhance existing sections

```svelte
<!-- ✅ GOOD: Content di HTML, enhancement lazy -->
<section id="faq">
	<h2>FAQ</h2>
	<div id="faq-list">
		<!-- FAQ items langsung di HTML untuk SEO -->
		{#each faqItems as faq}
			<details>
				<summary>{faq.question}</summary>
				<p>{faq.answer}</p>
			</details>
		{/each}
	</div>

	<!-- Lazy load search functionality -->
	<script>
		if ('IntersectionObserver' in window) {
			import('./faq-search.js').then((module) => {
				module.initSearch();
			});
		}
	</script>
</section>
```

---

### 4. Intersection Observer untuk Animations

**Priority: LOW** - Optimize animations

```javascript
// ✅ GOOD: Lazy load animations, content tetap di HTML
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Load animation library
				import('./animations.js').then((module) => {
					module.animate(entry.target);
				});
				observer.unobserve(entry.target);
			}
		});
	},
	{ rootMargin: '50px' }
);
```

---

## 📋 Implementation Checklist

### Phase 1: Image Optimization (Immediate)

- [ ] Add `loading="lazy"` to all below-fold images
- [ ] Add `loading="eager"` + `fetchpriority="high"` to hero images
- [ ] Add `width` dan `height` attributes untuk prevent CLS
- [ ] Add `decoding="async"` untuk better performance
- [ ] Convert images to WebP/AVIF format
- [ ] Add responsive images dengan `srcset`

**Files to update:**

- TestimonialsSection (future)
- SocialProofSection (future)
- Partner logos (future)
- Footer images (future)

---

### Phase 2: Component Lazy Loading (High Priority)

- [ ] Lazy load TestimonialsSection component
- [ ] Lazy load FAQSection component
- [ ] Lazy load SocialProofSection component
- [ ] Add skeleton loaders untuk better UX
- [ ] Implement IntersectionObserver untuk trigger load

**Files to create/update:**

- `src/lib/utils/lazyLoading.ts` - Utility functions
- `src/lib/components/LazySection.svelte` - Wrapper component
- TestimonialsSection, FAQSection, SocialProofSection

---

### Phase 3: Progressive Enhancement (Medium Priority)

- [ ] Lazy load heavy animations
- [ ] Lazy load search functionality (FAQ)
- [ ] Lazy load interactive features
- [ ] Keep content in HTML source

---

### Phase 4: Advanced Optimization (Low Priority)

- [ ] Route-based code splitting
- [ ] Prefetch critical resources
- [ ] Resource hints (preload, prefetch, preconnect)
- [ ] Service worker untuk caching

---

## 🔍 SEO Verification Checklist

Setelah implementasi, verifikasi:

- [ ] Google Search Console: All content indexed
- [ ] Rich Results Test: Structured data valid
- [ ] Lighthouse SEO Audit: Score > 90
- [ ] Mobile-Friendly Test: Pass
- [ ] PageSpeed Insights: Good scores
- [ ] View Page Source: Text content visible
- [ ] JavaScript Disabled: Content still accessible

---

## 📊 Performance Targets

### Core Web Vitals

| Metric | Target  | Current | Status     |
| ------ | ------- | ------- | ---------- |
| LCP    | < 2.5s  | -       | ⏳ Pending |
| FID    | < 100ms | -       | ⏳ Pending |
| CLS    | < 0.1   | -       | ⏳ Pending |
| FCP    | < 1.8s  | -       | ⏳ Pending |
| TTI    | < 3.8s  | -       | ⏳ Pending |

### Bundle Size

| Bundle     | Target         | Current | Status     |
| ---------- | -------------- | ------- | ---------- |
| Initial JS | < 100 KB       | -       | ⏳ Pending |
| Total JS   | < 300 KB       | -       | ⏳ Pending |
| Images     | < 500 KB total | -       | ⏳ Pending |

---

## 🚨 Common Pitfalls to Avoid

### ❌ DON'T:

1. **Lazy load critical content**

   ```svelte
   <!-- ❌ BAD: Hero content lazy loaded -->
   {#await import('$lib/sections/HeroSection.svelte')}
   	<div>Loading...</div>
   {:then HeroSection}
   	<HeroSection />
   {/await}
   ```

2. **Hide content from crawlers**

   ```svelte
   <!-- ❌ BAD: Content only in JavaScript -->
   {#await fetchData()}
   	<p>Loading...</p>
   {:then data}
   	<p>{data.description}</p>
   {/await}
   ```

3. **Lazy load structured data**
   ```html
   <!-- ❌ BAD: Structured data lazy loaded -->
   <script>
   	fetch('/api/structured-data').then((data) => {
   		// Inject structured data
   	});
   </script>
   ```

### ✅ DO:

1. **Content in HTML, enhancement lazy**

   ```svelte
   <!-- ✅ GOOD: Content di HTML -->
   <section>
   	<h2>FAQ</h2>
   	<p>Frequently asked questions...</p>
   	<!-- Lazy load search -->
   	<script>
   		import('./faq-search.js');
   	</script>
   </section>
   ```

2. **Progressive enhancement**
   ```svelte
   <!-- ✅ GOOD: Works without JS, enhanced with JS -->
   <details>
   	<summary>Question</summary>
   	<p>Answer</p>
   </details>
   ```

---

## 📚 References

- [Google: Lazy Loading Images](https://web.dev/lazy-loading-images/)
- [Google: Lazy Loading JavaScript](https://web.dev/lazy-loading-javascript/)
- [MDN: Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Next Steps:**

1. Implement Phase 1 (Image Optimization)
2. Create lazy loading utilities
3. Implement Phase 2 (Component Lazy Loading)
4. Test dan verify SEO impact
5. Monitor performance metrics
