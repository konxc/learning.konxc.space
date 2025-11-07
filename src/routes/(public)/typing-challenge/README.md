# Typing Challenge Game

Mini game typing challenge mirip MonkeyType untuk membantu meningkatkan kecepatan mengetik dan membiasakan syntax pemrograman.

## Filosofi

- **Typing adalah skill dasar di era digital** - Setiap profesi membutuhkan kemampuan mengetik yang baik
- **Mode Biasa**: Tingkatkan kecepatan mengetik dengan teks natural
- **Mode Pemrograman**: Biasakan syntax pemrograman menjadi natural melalui latihan berulang

## Fitur

### Core Features

1. **Dua Mode**: Classic (teks biasa) dan Programming (kode)
2. **Multi-language**: JavaScript, Python, TypeScript, Go, Rust, Java
3. **Color Schemes**: Monokai, Dracula, Nord, VS Code Dark, One Dark, GitHub Light, Solarized Light
4. **Line Numbers**: Toggle untuk menampilkan/sembunyikan nomor baris
5. **Real-time Stats**: WPM, Accuracy, Time, Errors
6. **Post-test Modal**: Hasil tes dengan statistik lengkap
7. **Internationalization**: Support EN, ID, JP

### Controls

- Ketik untuk memulai test
- Backspace untuk koreksi
- Escape untuk reset
- Settings untuk mengganti tema, bahasa, dan difficulty

## Struktur Komponen

```
typing-challenge/
├── +page.svelte                      # Main landing page
├── components/
│   ├── TypingGame.svelte             # Container utama
│   ├── ModeSelector.svelte           # Pemilih mode
│   ├── ClassicTyping.svelte          # Mode teks biasa
│   ├── ProgrammingTyping.svelte      # Mode kode dengan syntax highlighting
│   ├── StatsPanel.svelte             # Statistik real-time
│   ├── ResultsModal.svelte           # Hasil tes
│   ├── GameSettings.svelte           # Pengaturan game
│   └── utils/
│       ├── code-snippets.ts          # Library code snippets
│       ├── text-snippets.ts          # Library teks untuk mode klasik
│       ├── themes.ts                 # Konfigurasi tema
│       └── stats.ts                  # Kalkulasi statistik
└── README.md
```

## Usage

Access di: `/typing-challenge`

## Teknologi

- SvelteKit 5 dengan Svelte 5 Runes
- TypeScript
- Paraglide untuk i18n
- Tailwind CSS untuk styling

## Future Enhancements

- Leaderboard dengan database
- Custom theme editor
- Practice mode untuk karakter spesifik
- Achievements/badges
- Sound effects
- Export results sebagai gambar
- Sharing hasil ke sosial media
