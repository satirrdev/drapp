# Dr. App

A neo-brutalist web app for browsing open-source Android apps from the [F-Droid](https://f-droid.org) repository.

## Features

- **Browse 4000+ F-Droid apps** — paginated, 20 per page
- **Search by name** and **filter by category**
- **App detail page** with description (markdown), version info, developer, license, last updated, download links
- **Dark mode toggle** (persisted to localStorage)
- **Neo-brutalist UI** — thick black borders, hard shadows, uppercase labels, no rounded corners
- **Offline-like speed** — all data cached in localStorage after first visit
- **QR code** on detail page to open on phone
- **One-click GitHub issue links** for submitting apps, requesting updates, reporting bugs, feature requests

## Tech Stack

| Layer | Tech |
|-------|------|
| Build | Vite 8 |
| UI | React 19 + React Router 7 |
| Styling | Vanilla CSS with OKLCH custom properties |
| Markdown | `marked` (GFM) |
| Data | Pre-built | `node scripts/prepare-data.js` fetches F-Droid index, splits into static JSON |

## Quick Start

```bash
npm install
npm run dev
```

First run downloads the F-Droid index (~2 MB) and generates ~200 page files + per-app JSON. Subsequent runs use the local cache.

Open `http://localhost:5173` (or the port Vite prints).

## Build for Production

```bash
npm run build
npm run preview
```

Outputs to `dist/`. Deploy anywhere that serves static files (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.).

## Project Structure

```
drapp/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── App.jsx            # Router, theme provider
│   ├── App.css            # Complete design system (tokens, base, components)
│   ├── main.jsx           # Entry point
│   ├── pages/
│   │   ├── Page.jsx       # List page: search, filter, grid, pagination
│   │   └── AppDetail.jsx  # Detail page: markdown, info grid, downloads, QR, actions
│   ├── components/
│   │   ├── Header.jsx     # Title + theme toggle
│   │   ├── ActionBar.jsx  # GitHub issue quick-links
│   │   ├── AppCard.jsx    # Card with lazy-loaded icon
│   │   ├── SearchBar.jsx  # Text search + category select
│   │   └── Pagination.jsx # Prev / page / Next
│   └── services/
│       └── fdroidApi.js   # Fetches pre-built JSON, caches to localStorage
├── scripts/
│   └── prepare-data.js    # Downloads F-Droid index → generates page_N.json, search_index.json, data/*.json
├── dist/                  # Build output (gitignored)
├── index.html
├── vite.config.js
├── package.json
└── vercel.json
```

## Data Pipeline

1. **`npm run dev` / `npm run build`** runs `scripts/prepare-data.js`
2. Script fetches `https://f-droid.org/repo/index-v2.json`
3. Splits apps into pages of 20 → `public/page_1.json` … `page_N.json`
4. Creates `public/search_index.json` (minimal fields for search/filter)
5. Creates `public/data/<packageId>.json` (full app metadata)
6. Vite serves these as static files; `fdroidApi.js` fetches and caches to localStorage
7. Cache versioning (`CACHE_VERSION = 2`) auto-invalidates on schema changes

## Theming

All colors are OKLCH custom properties in `App.css :root` (light) and `[data-theme='dark']`.

| Token | Light | Dark |
|-------|-------|------|
| `--color-paper` | `oklch(92% 0.045 50)` | `oklch(20% 0.040 45)` |
| `--color-ink` | `oklch(18% 0.080 20)` | `oklch(88% 0.050 50)` |
| `--color-accent` | `oklch(86% 0.18 95)` | `oklch(78% 0.16 90)` |
| `--color-card` | `oklch(90% 0.048 48)` | `oklch(22% 0.042 44)` |
| `--shadow` | `4px 4px 0 var(--color-ink)` | same |
| `--border` | `2px solid var(--color-ink)` | same |

Fonts: `--font-display: 'Big Shoulders Display'` (variable, `wdth` 110), `--font-body: 'Inter'`.

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<nav>`)
- Focus-visible outlines on all interactive elements
- `prefers-reduced-motion` respected (transitions disabled)
- Alt text on icons; decorative SVGs use `alt=""`
- Color contrast ≥ 4.5:1 in both themes

## License

ISC — do whatever you want.

---

**Made with ⚡ by [satirrdev](https://github.com/satirrdev)**