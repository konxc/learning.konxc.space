# Design Reference - Prototype Naik Kelas

Landing page prototype untuk program "Naik Kelas by Koneksi".

## 🎨 Design System

### Color Palette

**Primary Colors:**
- `#5a7d9a` - Logo & Accent (Soft Blue)
- `#2c3e50` - Heading Text (Dark Blue-Gray)
- `#6b7c93` - Body Text (Medium Gray)

**Gradient Colors:**
- Hero Background: `linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)`
- CTA Section: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`
- Benefits Section: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

**Background Colors:**
- White: `#ffffff`
- Light Gray: `#fafbfc`, `#f8f9fc`
- Footer: `#2c3e50`

### Typography

**Font Family:**
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

**Font Sizes:**
- Hero Title: `2.8em`
- Section Headings: `2.5em`
- Body Text: `1em` - `1.2em`
- Small Text: `0.9em` - `1.1em`

**Font Weights:**
- Headings: `600`, `700`
- Body: `300`, `400`

### Spacing & Layout

**Container:**
- Max Width: `1200px`
- Padding: `20px`

**Section Padding:**
- Large: `100px - 120px`
- Medium: `50px - 80px`

**Card Padding:**
- Feature Cards: `40px 30px`
- Benefit Items: `30px`
- Form: `50px` (desktop), `30px` (mobile)

---

## 📐 Layout Sections

### 1. Hero Section
```html
<section class="hero">
  - Logo & Tagline
  - Main Headline
  - Description Text
  - Scroll Hint (animated)
</section>
```

**Features:**
- Gradient background (soft blue-gray)
- Centered content
- Full viewport height (`min-height: 90vh`)
- Animated scroll hint (bounce effect)

### 2. About Section
```html
<section class="about">
  - Section Heading
  - Subtitle
  - Feature Cards (4 cards in grid)
</section>
```

**Feature Cards:**
- 🎯 Mulai dari Nol
- 💼 Langsung ke Industri
- 🤝 Mentoring Personal
- 🚀 Project-Based

### 3. Program Timeline
```html
<section class="program">
  - Section Heading
  - Timeline Component
    - Vertical line
    - 4 Timeline Items (odd/even layout)
</section>
```

**Timeline Items:**
1. Minggu 1-2: Foundation Setup
2. Minggu 3-4: Python Programming
3. Minggu 5-6: Web Development
4. Minggu 7-8: Final Project

**Design:**
- Central vertical line (gradient)
- Alternating left/right content
- Dots on timeline
- Responsive: mobile stacks to right side

### 4. Benefits Section
```html
<section class="benefits">
  - Gradient Purple Background
  - Section Heading (white)
  - Benefit Grid (6 items)
</section>
```

**Benefits:**
- 📚 Materi Lengkap
- 🏆 Sertifikat
- 🌐 Portfolio Project
- 👥 Komunitas
- 💰 Peluang Kerja
- 🎓 Lifetime Access

**Design:**
- Glassmorphism effect (backdrop-filter blur)
- Hover scale effect
- Grid: auto-fit, minmax(250px)

### 5. CTA Section
```html
<section class="cta-section">
  - Badge (pulsing animation)
  - Heading
  - Description
  - Code Snippet (decorative)
  - Registration Form
</section>
```

**Form Fields:**
- Nama Lengkap *
- Email *
- WhatsApp *
- Status Pendidikan * (dropdown)
- Pengalaman Coding (textarea)
- Kenapa Tertarik? * (textarea)

**Design:**
- Gradient background with pattern overlay
- Glass-morphism badge
- Animated code snippet
- Form with modern styling
- Submit button with gradient

### 6. Footer
```html
<footer class="footer">
  - Logo/Title
  - Description
  - Social Links
  - Copyright
</footer>
```

---

## 🎭 Animations

### 1. Bounce (Scroll Hint)
```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
```

### 2. Pulse (CTA Badge)
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 3. Slide Up (Form)
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 🖱️ Interactive Elements

### Hover Effects

**Feature Cards:**
```css
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
```

**Benefit Items:**
```css
.benefit-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}
```

**Submit Button:**
```css
.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
}
```

### Form Interactions

- Input focus: border color change + shadow
- Smooth transitions: `0.3s ease`
- Form validation: HTML5 required attributes
- Form submission: preventDefault, alert, reset

---

## 📱 Responsive Design

### Breakpoint: 768px

**Changes:**
- Hero title: `2.8em` → `2em`
- Timeline: Left-align all items (mobile)
- Timeline line: move to left (30px)
- Timeline content: Full width minus 80px
- CTA heading: `3em` → `2em`
- Form padding: `50px` → `30px`

---

## 💡 Implementation Notes

### Current State
- Static HTML prototype
- Inline CSS (798 lines)
- Client-side only form handling
- No backend integration

### Improvements Needed for Production

1. **Component-based Architecture**
   - Convert to SvelteKit components
   - Extract reusable card components
   - Modular section layouts

2. **Form Handling**
   - Connect to backend API
   - Add proper validation
   - Implement loading states
   - Success/error handling

3. **Typography System**
   - Define consistent type scale
   - Responsive font sizes
   - Better line heights

4. **Color System**
   - Extract to CSS variables
   - Theme switching capability
   - Dark mode support (future)

5. **Performance**
   - Image optimization
   - Code splitting
   - Lazy loading sections
   - Reduce initial bundle size

6. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Focus indicators
   - Screen reader support

---

## 🎯 Design Philosophy

### Core Principles

1. **Clean & Modern**
   - Minimalist aesthetics
   - Soft color palette
   - Generous white space
   - Focus on content

2. **Gradient Energy**
   - Playful gradients (especially CTA)
   - Modern purple/blue gradient
   - Energy without overwhelming

3. **Trust & Professionalism**
   - Clean typography
   - Consistent spacing
   - Clear hierarchy
   - Professional yet friendly

4. **Engagement**
   - Interactive hover effects
   - Smooth animations
   - Visual feedback
   - Code snippet as "in-joke"

### Brand Identity

**Tone:**
- Edukatif namun ringan
- Modern & AI-friendly
- Inspiring & collaborative
- Clean aesthetic

**Voice:**
- Friendly & encouraging
- Direct & clear
- Tech-savvy but accessible
- Youth-oriented

---

## 🚀 Next Steps for Development

1. **Wireframe SvelteKit Layout**
   - Create component structure
   - Map sections to components
   - Plan state management

2. **Style Migration**
   - Convert to Tailwind CSS
   - Create design tokens
   - Setup CSS architecture

3. **Form Integration**
   - Setup form API endpoint
   - Connect to database
   - Add email notifications

4. **Content Management**
   - Make content editable
   - Add CMS or markdown
   - Admin panel

5. **Test & Refine**
   - User testing
   - A/B testing CTA
   - Performance optimization
   - Accessibility audit

---

**Last Updated**: 2025-01-23  
**Designer**: Koneksi Team  
**Status**: Prototype v1 Complete
