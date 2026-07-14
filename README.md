# Dr. App

A neo-brutalist web app for browsing open-source Android apps from the [F-Droid](https://f-droid.org) repository.

## Features

- Browse 4000+ F-Droid apps — 20 per page
- Search by name and filter by category
- App detail page with description, version info, and download links
- Dark mode toggle
- Neo-brutalist UI (thick black borders, hard shadows, monospace, no rounded corners)
- All data cached in localStorage for offline-like speed after first visit

## Tech

Built with Vite + React. Data is fetched from the F-Droid index and split into per-page JSON files for fast loading on slow devices.

## Usage

```bash
npm install
npm run dev
```

The first run downloads the F-Droid index and generates page files. Subsequent runs use cached data.

## Build

```bash
npm run build
npm run preview
```
