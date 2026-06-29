# PWA XML Generator - Rahaza Digital (Standalone)

Tools ini awalnya jalan di Google Apps Script (perlu `doGet()` + deploy web app).
Versi ini **standalone** — tidak butuh GAS sama sekali, tinggal upload 5 file
ini ke hosting statis apa pun (Blogger, Vercel, Netlify, GitHub Pages, atau
bahkan dibuka langsung dari file lokal untuk testing).

## Isi folder

```
pwa-generator/
├── index.html        # Tools utama (UI + logic generator XML)
├── manifest.json      # Manifest PWA untuk tools ini sendiri
├── sw.js               # Service worker (cache shell, support offline)
└── icons/
    ├── icon.svg        # Favicon
    ├── icon-192.png    # Ikon PWA 192x192
    └── icon-512.png    # Ikon PWA 512x512
```

## Apa fungsinya

Generator ini membuat **template XML tema Blogger** yang isinya:
- 1 `<iframe>` fullscreen mengarah ke URL web app GAS (`.../exec`) milikmu
- Manifest PWA (di-embed sebagai data URI base64) supaya saat di-host di
  Blogger, web app GAS tersebut bisa **diinstall sebagai PWA** di HP/desktop

Jadi alur kerjanya:
1. Punya web app GAS yang sudah di-deploy (`.../exec`)
2. Buka tools ini, isi URL exec GAS-mu + konfigurasi nama/warna/ikon
3. Tools generate file XML tema Blogger
4. Upload XML tersebut ke Blogger (Theme > Edit HTML)
5. Blog tersebut jadi PWA installable yang membungkus app GAS-mu via iframe

## Cara deploy tools ini sendiri

**Opsi A — Blogger (konsisten dengan stack kamu):**
1. Upload `index.html` sebagai halaman statis, atau host di Blogspot biasa
2. File `manifest.json`, `sw.js`, dan folder `icons/` bisa di-host di GitHub
   (raw.githubusercontent.com) atau storage statis lain, lalu sesuaikan path
   `href`/`src` di `index.html` jika tidak satu domain

**Opsi B — Vercel/Netlify/GitHub Pages (lebih simpel, 1 domain):**
1. Push folder ini ke repo, hubungkan ke Vercel/Netlify
2. Selesai — semua path relatif sudah benar karena 1 domain yang sama

## Catatan perubahan dari versi GAS

- `Code.gs` tidak lagi diperlukan (sudah dihapus dari deployment, lihat
  `_archive/Code.gs.txt` untuk referensi)
- Placeholder ikon dari `via.placeholder.com` (layanan eksternal yang sudah
  lama tidak reliable) diganti ke data URI SVG mandiri — tidak ada lagi
  dependency ke layanan luar untuk default state
- Ditambahkan manifest + service worker supaya **tools generator ini sendiri**
  bisa diinstall sebagai PWA dan dipakai offline
