# OKLCH Color System - Migration Guide

**Last Updated**: 2025-10-26

---

## 🎨 Overview

Learning.konxc.space menggunakan **OKLCH** color format untuk color system yang lebih modern dan perceptually uniform.

---

## 📊 Why OKLCH?

### Advantages over HEX:

1. **Perceptual Uniformity** - Gradients lebih smooth dan natural
2. **Predictable** - Perubahan lightness lebih konsisten
3. **Future-Proof** - OKLCH adalah standard modern CSS
4. **Better Gradients** - Hasil gradient yang lebih baik

### Browser Support:

- ✅ Chrome 111+
- ✅ Firefox 113+
- ✅ Safari 16.4+
- ✅ Edge 111+
- ⚠️ Fallback ke HEX untuk browser lama

---

## 🏗️ Color System Structure

### OKLCH Format

```css
oklch(lightness% chroma hue)

/* Example */
--color-primary-soft-blue: oklch(56% 0.08 210);
/* L=56%, C=0.08, H=210° */
```

### Color Conversions

| Color Name        | OKLCH                 | HEX Equivalent | Usage          |
| ----------------- | --------------------- | -------------- | -------------- |
| Primary Soft Blue | `oklch(56% 0.08 210)` | `#5a7d9a`      | Logos, accents |
| Primary Dark      | `oklch(30% 0.05 220)` | `#2c3e50`      | Headings, text |
| Primary Medium    | `oklch(50% 0.07 220)` | `#6b7c93`      | Secondary text |
| Text Secondary    | `oklch(48% 0.05 220)` | `#5a6c7d`      | Body text      |
| Text Tertiary     | `oklch(70% 0.02 220)` | `#a0aec0`      | Subtle text    |

---

## 🔄 Migration Status

### ✅ Completed

- Design system colors di `src/app.css`
- Fallback untuk browser lama
- Support reduced motion

### 📋 In Progress

- Testing di berbagai browsers
- Verifikasi visual consistency

### 🔮 Future

- Migrate component-level colors
- Document color use cases
- Create color utility functions

---

## 🛠️ Usage Examples

### In CSS Variables

```css
/* OKLCH (Modern browsers) */
.element {
	color: oklch(56% 0.08 210);
}

/* With fallback */
.element {
	color: oklch(56% 0.08 210);
	color: #5a7d9a; /* Fallback */
}
```

### In Components

```svelte
<!-- Component usage -->
<div style="background: var(--color-primary-soft-blue)">
	<!-- Uses OKLCH in modern browsers, HEX in older -->
</div>
```

---

## 📈 Benefits

### Before (HEX)

```css
/* Gradients bisa patah di tengah */
background: linear-gradient(to right, #5a7d9a, #2c3e50);
/* Visual inconsistency */
```

### After (OKLCH)

```css
/* Gradients lebih smooth */
background: linear-gradient(to right, oklch(56% 0.08 210), oklch(30% 0.05 220));
/* Perceptual uniformity */
```

---

## 🧪 Testing

### Browser Compatibility

```bash
# Test in different browsers
# Chrome: OKLCH supported
# Safari: OKLCH supported
# Firefox: OKLCH supported
# Legacy: Falls back to HEX
```

### Visual Regression

- Compare before/after screenshots
- Verify color consistency
- Test gradients quality

---

## 📚 Resources

- [OKLCH on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [OKLCH Color Picker](https://oklch.com/)
- [W3C OKLCH Spec](https://www.w3.org/TR/css-color-4/#ok-lab)

---

## 🔧 Conversion Tools

### Convert HEX → OKLCH

```javascript
// Online converter: https://colorjs.io/apps/convert/
// Or use CSS:
color: oklch(from #5a7d9a l c h);
```

### Manual Conversion

| Hex     | L%  | C    | H°   |
| ------- | --- | ---- | ---- |
| #5a7d9a | 56% | 0.08 | 210° |

---

**Last Updated**: 2025-10-26
