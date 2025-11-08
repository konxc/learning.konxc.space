# Component Usage Guide

Dokumentasi penggunaan komponen-komponen reusable di platform Naik Kelas.

**Last Updated**: 2025-01-30

---

## 📦 Reusable Components

### OptimizedImage

Component untuk optimized image loading dengan lazy loading dan error handling.

#### Props

```typescript
interface OptimizedImageProps {
  src: string;                    // Required: Image URL
  alt: string;                    // Required: Alt text
  width: number;                  // Required: Image width
  height: number;                 // Required: Image height
  loading?: 'lazy' | 'eager';     // Default: 'lazy'
  fetchpriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';  // Default: 'async'
  class?: string;
  style?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  srcset?: string;                // For responsive images
  sizes?: string;                  // For responsive images
  sources?: Array<{               // For picture element (art direction)
    srcset: string;
    media?: string;
    type?: string;
  }>;
}
```

#### Usage Examples

**Basic Usage:**
```svelte
<OptimizedImage
  src="/images/avatar.jpg"
  alt="User avatar"
  width={60}
  height={60}
  loading="lazy"
/>
```

**Hero Image (Eager Load):**
```svelte
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  loading="eager"
  fetchpriority="high"
/>
```

**Responsive Image:**
```svelte
<OptimizedImage
  src="/images/product.jpg"
  alt="Product image"
  width={800}
  height={600}
  srcset="/images/product-400.jpg 400w, /images/product-800.jpg 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Picture Element (Art Direction):**
```svelte
<OptimizedImage
  src="/images/hero-desktop.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  sources={[
    {
      srcset: "/images/hero-mobile.jpg",
      media: "(max-width: 768px)"
    },
    {
      srcset: "/images/hero-tablet.jpg",
      media: "(max-width: 1024px)"
    }
  ]}
/>
```

#### Features

- ✅ Automatic lazy loading (default)
- ✅ CLS prevention dengan aspect ratio placeholder
- ✅ Error handling dengan fallback UI
- ✅ Fade-in animation saat image loaded
- ✅ Support untuk responsive images (srcset)
- ✅ Support untuk picture element (art direction)
- ✅ Accessibility (ARIA labels)

---

### LazySection

Component wrapper untuk lazy loading sections dengan IntersectionObserver.

#### Props

```typescript
interface LazySectionProps {
  component: () => Promise<any>;
  showSkeleton?: boolean;        // Default: true
  rootMargin?: string;           // Default: "50px"
  fallback?: Snippet;
}
```

#### Usage

```svelte
<LazySection
  component={() => import('$lib/sections/TestimonialsSection.svelte')}
  showSkeleton={true}
  rootMargin="100px"
/>
```

---

### FloatingCTA

Sticky floating CTA button yang muncul setelah scroll threshold.

#### Props

```typescript
interface FloatingCTAProps {
  scrollThreshold?: number;      // Default: 300
  hideOnBottom?: boolean;        // Default: true
}
```

#### Usage

```svelte
<FloatingCTA scrollThreshold={300} hideOnBottom={true} />
```

---

### SectionNavigation

Navigation bar dengan progress indicator dan active section highlighting.

#### Props

```typescript
interface SectionNavigationProps {
  sections?: Section[];           // Default: predefined sections
  showProgress?: boolean;         // Default: true
  showBackToTop?: boolean;       // Default: true
  scrollOffset?: number;         // Default: 70
}
```

#### Usage

```svelte
<SectionNavigation
  showProgress={true}
  showBackToTop={true}
  scrollOffset={70}
/>
```

---

## 🎨 Best Practices

### Image Optimization

1. **Always specify width and height** untuk prevent CLS
2. **Use lazy loading** untuk below-fold images
3. **Use eager loading** untuk above-fold images (hero)
4. **Use fetchpriority="high"** untuk LCP images
5. **Provide srcset** untuk responsive images
6. **Always include alt text** untuk accessibility

### Component Lazy Loading

1. **Lazy load below-fold sections** (Testimonials, FAQ, Social Proof)
2. **Eager load critical sections** (Hero, CTA, Program header)
3. **Use skeleton loaders** untuk better UX
4. **Keep content in HTML** untuk SEO

### Performance

1. **Use OptimizedImage** untuk semua images
2. **Implement lazy loading** untuk heavy components
3. **Track performance** dengan analytics
4. **Monitor Core Web Vitals**

---

## 📚 Related Documentation

- [Lazy Loading Strategy](./LAZY_LOADING_STRATEGY.md)
- [Accessibility Improvements](./ACCESSIBILITY_IMPROVEMENTS.md)
- [Roadmap](./ROADMAP.md)

