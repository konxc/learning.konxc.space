<!-- d54ffffb-dbf1-4c4a-8190-f614aa6b67e2 f60e794f-6a89-4b25-821c-8dac856499ff -->
# Redesign Auth Signin Page

Redesign halaman signin dengan layout full-height (100vh), responsif di semua breakpoint, dan desain yang konsisten dengan auth pages lainnya.

## Requirements

- Layout 100vh yang responsif di semua breakpoint (mobile, tablet, desktop)
- Tidak menampilkan header navigation (auth layout terpisah dari public layout)
- Tombol kembali ke home di pojok kanan atas (fixed position dengan jarak dari tepi)
- Desain konsisten dengan signup/register pages
- Form login dengan username & password
- Link ke signup page
- Gradient background matching signup/register
- Error handling display

## Design Specifications

### Layout Structure

```
<div class="auth-page"> (100vh container)
  <button class="back-to-home">←</button> (fixed top-right dengan padding)
  <div class="auth-container"> (centered card)
    - Header with title & description
    - Form with username & password fields
    - Submit button
    - Error message display
    - Link to signup
  </div>
</div>
```

### Responsive Breakpoints

- Mobile (< 640px): Full width card, reduced padding
- Tablet (640px - 1024px): Max width card
- Desktop (> 1024px): Centered card with max-width

### Styling

- Background: Gradient matching signup (`var(--color-bg-hero)` to `var(--color-bg-hero-end)`)
- Card: White background, rounded corners, shadow
- Typography: Match signup design
- Colors: Use design system colors
- Buttons: Match signup button styles

## Files to Modify

- `src/routes/auth/signin/+page.svelte` - Complete redesign
- Keep `+page.server.ts` unchanged (auth logic already working)

### To-dos

- [ ] Create 100vh layout dengan centered card yang responsif
- [ ] Add tombol kembali ke home di pojok kanan atas (fixed position)
- [ ] Style form dengan desain konsisten signup/register
- [ ] Implement responsive design untuk semua breakpoints
- [ ] Add error message display yang konsisten