# PWA XML Generator - Rahaza Digital (React + Vite)

Aplikasi web modern berbasis **React + TypeScript + Vite + Tailwind CSS** untuk meng-generate template XML tema Blogger yang membungkus web app Google Apps Script (GAS) dengan iframe fullscreen dan manifest PWA (Progressive Web App).

## Fitur Utama

- **Konfigurasi Fleksibel**:
  - URL Web App GAS (`.../exec`)
  - Nama Aplikasi & Nama Pendek
  - Deskripsi Singkat
  - Tema Warna (*Theme Color*) & Warna Latar Belakang (*Background Color*)
- **Pilihan Sumber Ikon PWA**:
  - **URL Gambar**: Link gambar eksternal (sangat ringan, bebas lag).
  - **Inisial Teks (SVG)**: Pembuatan otomatis ikon SVG vektor dengan inisial teks.
  - **Upload Logo Lokal (WebP)**: Resize & kompresi WebP otomatis di browser melalui HTML5 Canvas (ukuran 192x192 & 512x512) agar ukuran XML tetap ringan.
- **Ekstrak & Download Ikon**: Download ikon PWA hasil kompresi ukuran 192x192 dan 512x512 secara terpisah.
- **Pratinjau & Indikator Ukuran Real-Time**:
  - Live preview ikon dan warna.
  - Estimasi ukuran file XML real-time dengan status indikator (hijau/kuning/merah).
- **Aksi Cepat**:
  - Salin (*Copy to clipboard*) dengan fallback clipboard.
  - Download template XML (`theme-{shortname}.xml`) langsung ke komputer/ponsel.
  - Panduan interaktif pemasangan tema di Blogger.
- **PWA Support**: Aplikasi ini sendiri mendukung Progressive Web App dan dapat diinstall ke perangkat.

## Struktur Project

```
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon.svg
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── App.tsx          # Komponen UI utama & logika generator
│   ├── index.css        # Tailwind CSS v4 styling & glassmorphism
│   └── main.tsx         # Entry point React & Service Worker
├── index.html           # HTML shell entry point Vite
├── package.json         # Dependensi npm & script dev/build
├── tsconfig.json        # Konfigurasi TypeScript
└── vite.config.ts       # Konfigurasi Vite & Tailwind CSS
```

## Pengembangan Lokal

```bash
# Menjalankan dev server pada port 3000
npm run dev

# Membangun versi produksi
npm run build

# Menjalankan linter / typecheck
npm run lint
```
